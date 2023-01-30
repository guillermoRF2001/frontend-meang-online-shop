import { ShoppingCartModule } from '@shop/core/components/shopping-cart/shopping-cart.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PublicRoutingModule } from '@shop-pages/public-routing.module';
import { PublicComponent } from '@shop-pages/public.component';
import { HeaderComponent } from '@shop-core/components/header/header.component';
import { NavbarComponent } from '@shop-core/components/navbar/navbar.component';
import { FooterComponent } from '@shop-core/components/footer/footer.component';



@NgModule({
  declarations: [PublicComponent, HeaderComponent, NavbarComponent, FooterComponent],
  imports: [
    CommonModule,
    PublicRoutingModule,
    ShoppingCartModule
  ]
})
export class PublicModule { }
