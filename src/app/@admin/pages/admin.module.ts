import { TitleComponent } from '@admin-core/components/title/title.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from '@admin-pages/admin-routing.module';
import { AdminComponent } from '@admin-pages/admin.component';
import { HeaderComponent } from '@admin-core/components/header/header.component';
import { SidebarComponent } from '@admin-core/components/sidebar/sidebar.component';


@NgModule({
  declarations: [AdminComponent, HeaderComponent, TitleComponent, SidebarComponent],
  imports: [
    CommonModule,
    AdminRoutingModule
  ]
})
export class AdminModule { }
