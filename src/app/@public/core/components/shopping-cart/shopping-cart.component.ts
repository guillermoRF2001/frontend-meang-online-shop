import { Router } from '@angular/router';
import { IProduct } from '@mugan86/ng-shop-ui/lib/interfaces/product.interface';
import { ICart } from './shopping-cart.interface';
import { CartService } from './../../services/cart.service.ts.service';
import { Component, OnInit } from '@angular/core';
import { CURRENCY_SELECT } from '@core/constants/config';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.scss']
})
export class ShoppingCartComponent implements OnInit {
  cart: ICart;
  currencySelect = CURRENCY_SELECT;
  constructor(private cartService: CartService, private router: Router) {
    this.cartService.itemsVar$.subscribe((data: ICart) => {
      if (data !== undefined && data !== null) {
        this.cart = data;
      }
    });
  }

  ngOnInit(): void {
    this.cart = this.cartService.initialize();
    console.log('cart', this.cart);
  }

  clear() {
    this.cartService.clear();
    this.cart = this.cartService.initialize();
  }

  proccess(){
    this.cartService.close();
    this.router.navigate(['/checkout']);
  }

  clearItem(product: IProduct) {
    this.manageProductUnitInfo(0, product);
  }
  changeValue(qty: number, product: IProduct) {
    this.manageProductUnitInfo(qty, product);
  }

  manageProductUnitInfo(qty: number, product: IProduct) {
    product.qty = qty;
    this.cartService.manageProduct(product);
  }

  close() {
    this.cartService.close();
}
}
