import { ICart } from './../shopping-cart/shopping-cart.interface';
import { Router } from '@angular/router';
import { REDIRECTS_ROUTES } from './../../../../@core/constants/config';
import { CartService } from './../../services/cart.service.ts.service';
import { IMeData } from '@core/interfaces/session.interface';
import { AuthService } from '@core/services/auth.service';
import { Component, OnInit } from '@angular/core';
import shopMenuItems from '@data/menus/shop.json';
import { IMenuItem } from '@core/interfaces/menu-item.interface';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  cartItemsTotal: number;
  menuItems: Array<IMenuItem> = shopMenuItems;
  session: IMeData = {
    status: false,
  };
  access = false;
  role: string;
  userLabel = '';
  userLabelComplete = '';

  constructor(private authService: AuthService, private cartService: CartService, private router: Router) {
    // tslint:disable-next-line: deprecation
    this.authService.accessVar$.subscribe((result) => {
      this.session = result;
      this.access = this.session.status;
      this.role = this.session.user?.role;
      this.userLabel = `${ this.session.user?.name }`;
      this.userLabelComplete = `${ this.session.user?.name } ${ this.session.user?.lastname }`;
    });

    this.cartService.itemsVar$.subscribe((data: ICart) => {
      if (data !== undefined && data !== null) {
        this.cartItemsTotal = data.subtotal;
      }
    });
  }

  ngOnInit(): void {
    this.cartItemsTotal = this.cartService.initialize().subtotal;
  }

  open(){
    console.log('abrir');
    this.cartService.open();
  }

  logout(){
    this.authService.resetSession(this.router.url);
  }

}
