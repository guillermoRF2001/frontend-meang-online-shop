import { GAMES_PAGES_INFO, TYPE_OPERATION } from './game.constants';
import { IGamePageInfo } from './games-page-info.interface';
import { IInfoPage } from '@core/interfaces/result-data.interface';
import { ProductsService } from '@core/services/products.service';
import { Component, OnInit } from '@angular/core';
import { ACTIVE_FILTERS } from '@core/constants/filters';
import { IProduct } from '@mugan86/ng-shop-ui/lib/interfaces/product.interface';
import { ActivatedRoute } from '@angular/router';
import { closeAlert, loadData } from '@shared/alerts/alerts';

@Component({
  selector: 'app-games',
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.scss'],
})
export class GamesComponent implements OnInit {
  selectPage;
  infoPage: IInfoPage = {
    page: 1,
    pages: 8,
    total: 160,
    itemsPage: 20,
  };
  typeData: TYPE_OPERATION;
  gamesPageInfo: IGamePageInfo;
  productsList: Array<IProduct> = [];
  loading: boolean;
  constructor(
    private products: ProductsService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      this.loading = true;
      loadData('Cargando datos', 'Espere por favor');
      console.log(params);
      this.gamesPageInfo = GAMES_PAGES_INFO[`${params.type}/${params.filter}`];
      this.typeData = params.type;
      this.selectPage = 1;
      this.loadData();
    });
  }

  loadData() {
    if (this.typeData === TYPE_OPERATION.PLATFORMS) {
      this.products
        .getByPlatform(
          this.selectPage,
          this.infoPage.itemsPage,
          ACTIVE_FILTERS.ACTIVE,
          false,
          this.gamesPageInfo.platformsIds,
          true,
          true
        )
        .subscribe((data) => {
          this.asignResult(data);
        });
      return;
    }
    this.products
      .getByLastUnitsOffers(
        this.selectPage,
        this.infoPage.itemsPage,
        ACTIVE_FILTERS.ACTIVE,
        false,
        this.gamesPageInfo.topPrice,
        this.gamesPageInfo.stock,
        true,
        true
      )
      .subscribe((data) => {
        this.asignResult(data);
      });
  }
  private asignResult(data) {
    console.log(this.gamesPageInfo.title, data.result);
    this.productsList = data.result;
    this.infoPage = data.info;
    closeAlert();
    this.loading = false;
  }
}
