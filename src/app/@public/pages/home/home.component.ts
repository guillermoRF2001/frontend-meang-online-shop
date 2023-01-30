import { closeAlert } from './../../../@shared/alerts/alerts';
import { loadData } from '@shared/alerts/alerts';
import { ProductsService } from '@core/services/products.service';
import { Component, OnInit } from '@angular/core';
import { ICarouselItem } from '@mugan86/ng-shop-ui/lib/interfaces/carousel-item.interface';
import { ACTIVE_FILTERS } from '@core/constants/filters';
import { IProduct } from '@mugan86/ng-shop-ui/lib/interfaces/product.interface';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  items: ICarouselItem[] = [];
  listOne;
  listTwo;
  listThree;
  listFour;
  loading: boolean;
  constructor(private products: ProductsService) { }

  ngOnInit(): void {
    this.loading = true;
    loadData('Cargando datos', 'Espere por favor');
    this.products.getHomePage().subscribe( data => {
      console.log(data);
      this.listOne = data.ps3;
      this.listTwo = data.pc;
      this.listThree = data.topPrice;
      this.listFour = data.android;
      this.items = this.manageCarousel(data.carousel);
      closeAlert();
      this.loading = false;
    });
  }

  private manageCarousel(list) {
    const itemsValues: Array<ICarouselItem> = [];
    list.shopProducts.map((item) => {
      itemsValues.push({
        id: item.id,
        title: item.product.name,
        description: item.platform.name,
        background: item.product.img,
        url: '/games/details/'.concat(item.id),
      });
    });
    return itemsValues;
  }
}
