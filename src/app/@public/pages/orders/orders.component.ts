import { loadData, closeAlert } from '@shared/alerts/alerts';
import { take } from 'rxjs/internal/operators/take';
import { ChargeService } from '@shop/core/services/stripe/charge.service';
import { AuthService } from '@core/services/auth.service';
import { ICharge } from '@core/interfaces/stripe/charge';
import { IMeData } from '@core/interfaces/session.interface';
import { CURRENCY_SELECT } from '@core/constants/config';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
})
export class OrdersComponent implements OnInit {
  currencySymbol = CURRENCY_SELECT;
  meData: IMeData;
  startingAfter = '';
  hasMore = false;
  charges: Array<ICharge> = [];
  loading = true;
  loadMoreBtn = false;
  constructor(
    private auth: AuthService,
    private chargeServices: ChargeService
  ) {
    this.auth.accessVar$.pipe(take(1)).subscribe((meData: IMeData) => {
      this.meData = meData;
      // Si tenemos informacion cargar cliente.
      if (this.meData.user.stripeCustomer !== '') {
        console.log(this.meData);
        this.loadChargesData();
      }
    });
  }

  ngOnInit(): void {
    this.auth.start();
  }

  loadChargesData() {
    loadData('Cargando los datos', 'Espere por favor');
    console.log('Cargando datos...');
    this.chargeServices
      .listByCustomer(
        this.meData.user.stripeCustomer,
        10,
        this.startingAfter,
        ''
      )
      .pipe(take(1))
      .subscribe((data: {hasMore: boolean, charges: Array<ICharge>}) => {
        /*console.log(data);
        this.charges = data.charges;*/
        data.charges.map((item: ICharge) => this.charges.push(item));
        this.hasMore = data.hasMore;
        if (this.hasMore) {
          this.startingAfter = data.charges[data.charges.length - 1].id;
          this.loadMoreBtn = true;
        } else {
          this.loadMoreBtn = false;
          this.startingAfter = '';
        }
        closeAlert();
        this.loading = false;
      });
  }
}
