import { ICart } from '@shop/core/components/shopping-cart/shopping-cart.interface';
import { CURRENCY_CODE, CURRENCY_SELECT } from '@core/constants/config';
import { Component, OnInit } from '@angular/core';
import { CartService } from '@shop/core/services/cart.service.ts.service';

@Component({
  selector: 'app-checkout-resume',
  templateUrl: './checkout-resume.component.html',
  styleUrls: ['./checkout-resume.component.scss']
})
export class CheckoutResumeComponent implements OnInit {
  cart: ICart;
  currencySelect = CURRENCY_SELECT;
  currencyCode = CURRENCY_CODE;
  constructor(private cartService: CartService) {
    this.cartService.itemsVar$.subscribe((data: ICart) => {
      if (data !== undefined && data !== null) {
        this.cart = data;
      }
    });
  }

  ngOnInit(): void {
    this.cart = this.cartService.initialize();
  }

}
