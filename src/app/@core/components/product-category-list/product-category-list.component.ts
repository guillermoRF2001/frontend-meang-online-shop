import { CartService } from '@shop/core/services/cart.service.ts.service';
import { Router } from '@angular/router';
import { Component, Input } from '@angular/core';
import { IProduct } from '@mugan86/ng-shop-ui/lib/interfaces/product.interface';

@Component({
  selector: 'app-product-category-list',
  templateUrl: './product-category-list.component.html',
  styleUrls: ['./product-category-list.component.scss']
})
export class ProductCategoryListComponent {
  @Input() title = 'Título de la categoria';
  @Input() productsList: Array<IProduct> = [];
  @Input() description = '';
  @Input() showDesc: boolean;

  constructor(private router: Router, private cartService: CartService) {
    this.cartService.clearItems$.subscribe(() => {
      this.productsList.map((product: IProduct) => product.qty = 0);
    });
  }

  addToCart($event: IProduct){
    console.log('Add to cart', $event);
    this.cartService.manageProduct($event);
  }

  showProductDetails($event: IProduct){
    console.log('show details', $event);
    this.router.navigate(['/games/details', +$event.id]);
  }

}
