import { IProduct } from '@mugan86/ng-shop-ui/lib/interfaces/product.interface';
import { IStock } from './../../../../@core/interfaces/stock.interface';
import { MailService } from '@core/services/mail.service';
import { ICart } from '@shop/core/components/shopping-cart/shopping-cart.interface';
import { IPayment } from '@core/interfaces/stripe/payment.interface';
import { ChargeService } from '@shop/core/services/stripe/charge.service';
import { CustomerService } from '@shop/core/services/stripe/customer.service';
import { CURRENCY_CODE } from '@core/constants/config';
import { CartService } from '@shop/core/services/cart.service.ts.service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { IMeData } from '@core/interfaces/session.interface';
import { Component, OnInit } from '@angular/core';
import { StripePaymentService } from '@mugan86/stripe-payment-form';
import { take } from 'rxjs/internal/operators/take';
import { infoEventAlert, loadData } from '@shared/alerts/alerts';
import { TYPE_ALERT } from '@shared/alerts/values.config';
import { ICharge } from '@core/interfaces/stripe/charge';
import { IMail } from '@core/interfaces/mail.interface';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
})
export class CheckoutComponent implements OnInit {
  meData: IMeData;
  key = environment.stripePublicKey;
  address = '';
  available = false;
  block = false;
  constructor(
    private auth: AuthService,
    private router: Router,
    private stripePayment: StripePaymentService,
    private cartService: CartService,
    private customerSetvice: CustomerService,
    private chargeService: ChargeService,
    private mailService: MailService
  ) {
    this.auth.accessVar$.subscribe((data: IMeData) => {
      if (!data.status) {
        // Cargar pagina login
        this.router.navigate(['/login']);
        return;
      }
      this.meData = data;
    });

    this.cartService.itemsVar$.pipe(take(1)).subscribe((cart: ICart) => {
      if (this.cartService.cart.total === 0 && this.available === false) {
        this.available = false;
        this.notAvailableProducts();
      }
    });

    this.stripePayment.cardTokenVar$
      .pipe(take(1))
      .subscribe((token: string) => {
        if (
          token.indexOf('tok_') > -1 &&
          this.meData.status &&
          this.address !== ''
        ) {
          if (this.cartService.cart.total === 0) {
            this.available = false;
            this.notAvailableProducts();
          }
          // Almacenar la informacion ara enviar.
          const payment: IPayment = {
            token,
            amount: this.cartService.cart.total.toString(),
            description: this.cartService.orderDescription(),
            customer: this.meData.user.stripeCustomer,
            currency: CURRENCY_CODE,
          };
          const stockManage: Array<IStock> = [];
          this.cartService.cart.products.map((item: IProduct) => {
            stockManage.push(
              {
                id: +item.id,
                increment: item.qty * (-1)
              }
            );
          });
          this.block = true;
          loadData(
            'Realizando el pago',
            'Espere mientras se procesa el pago.'
          );
          // Enviar la informacion.
          this.chargeService
            .pay(payment, stockManage)
            .pipe(take(1))
            .subscribe(
              async (result: {
                status: boolean;
                message: string;
                charge: ICharge;
              }) => {
                console.log(result);
                if (result.status){
                  console.log('ok', result.charge);
                  await infoEventAlert(
                    'Pedido realizado correctamente',
                    'La compra se ha efecuado correctamente',
                    TYPE_ALERT.SUCCESS
                  );
                  this.sendEmail(result.charge);
                  this.cartService.clear();
                  this.router.navigate(['/orders']);
                  return;
                } else {
                  console.log(result.message);
                  await infoEventAlert(
                    'Pedido no realizado',
                    'El pedido no se ha realizado, intentelo de nuevo por favor',
                    TYPE_ALERT.SUCCESS
                  );
                }
                this.block = false;
              }
            );
        }
      });
  }

  sendEmail(charge: ICharge) {
    const mail: IMail = {
      to: charge.receiptEmail,
      subject: 'Confirmacion del pedido',
      html: `
      El pedido se ha realizado correctamente.
      puedes consultarlo en <a href="${charge.receiptUrl}" target="_blank">esta url</a>`
    };
    this.mailService.send(mail).pipe(take(1)).subscribe();
  }

  async notAvailableProducts() {
    this.cartService.close();
    this.available = false;
    await infoEventAlert(
      'Accion no disponible',
      'No se pueden realizar pagos sin productos en el carrito.'
    );
    this.router.navigate(['/']);
  }

  ngOnInit(): void {
    this.auth.start();
    if (localStorage.getItem('address')) {
      this.address = localStorage.getItem('address');
      localStorage.removeItem('address');
    }
    this.cartService.initialize();
    localStorage.removeItem('route_after_login');
    this.block = false;
    if (this.cartService.cart.total === 0) {
      this.available = false;
      this.notAvailableProducts();
    } else {
      this.available = true;
    }
  }

  async sendData() {
    if (this.meData.user.stripeCustomer === null) {
      await infoEventAlert(
        'Cliente no existe',
        'Es necesario un cliente para realizar el pago'
      );
      const stripeName = `${this.meData.user.name} ${this.meData.user.lastname}`;
      loadData('Procesando la imformacion', 'Creando el cliente...');
      this.customerSetvice
        .add(stripeName, this.meData.user.email)
        .pipe(take(1))
        .subscribe(async (result: { status: boolean; message: string }) => {
          if (result.status) {
            await infoEventAlert(
              'Cliente añadido al usuario',
              'Reiniciar la sesion',
              TYPE_ALERT.SUCCESS
            );
            localStorage.setItem('address', this.address);
            localStorage.setItem('route_after_login', this.router.url);
            this.auth.resetSession();
          } else {
            await infoEventAlert(
              'Cliente no añadido al usuario',
              result.message,
              TYPE_ALERT.WARNING
            );
          }
        });
      return;
    }
    this.stripePayment.takeCardToken(true);
  }
}
