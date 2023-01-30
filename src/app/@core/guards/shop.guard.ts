import { UsersComponent } from '@admin/pages/users/users.component';
import { adminAlert } from '@shared/alerts/toasts';
import { TYPE_ALERT } from '@shared/alerts/values.config';
import { AuthService } from '@core/services/auth.service';
import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  CanActivate,
} from '@angular/router';
import jwtDecode from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class ShopGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    // Primero comprobar que existe sesion.
    if (this.auth.getSession() !== null){
      console.log('estamos logueados');
      const dataDecode: any = this.decodeToken();
      console.log(dataDecode);
      // Segundo comprobar que no esta caducado el token.
      if (dataDecode.exp < new Date().getTime() / 1000){
        adminAlert(TYPE_ALERT.WARNING, 'sesion caducada', 'Por favor vuelva a introducir el usuario.');
        return this.redirect();
      }
      return true;
    }
    adminAlert(TYPE_ALERT.ERROR, 'Sesion no inicada', 'Por favor introduzca un usuario.');
    return this.redirect();
  }

  redirect(){
    this.router.navigate(['/login']);
    return false;
  }

  decodeToken() {
    return jwtDecode(this.auth.getSession().token);
  }
}
