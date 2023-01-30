import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { PasswordService } from '@core/services/password.service';
import { basicAlert } from '@shared/alerts/toasts';
import { TYPE_ALERT } from '@shared/alerts/values.config';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  token: string;
  values = {
    password: '',
    passwordTwo: ''
  };
  constructor(
    private route: ActivatedRoute,
    private passwordService: PasswordService,
    private auth: AuthService,
    private router: Router
  ) {
    // tslint:disable-next-line: deprecation
    this.route.params.subscribe((params) => {
      this.token = params.token;
      console.log(this.token);
    });
  }

  ngOnInit(): void {
  }

  reset(){
    console.log(this.values);
    if (this.values.password !== this.values.passwordTwo) {
      basicAlert(
        TYPE_ALERT.ERROR,
        'Las contraseñas no coinciden, por favor vuelva a comprobar las contraseñas'
      );
      return;
    }
    // Todo validado, a enviar a la api de graphql.
    // Servicio => active
    // tslint:disable-next-line: deprecation
    this.passwordService
      .change(this.token, this.values.password)
      // tslint:disable-next-line: deprecation
      .subscribe((result) => {
        console.log(result);
        if (result.status) {
          basicAlert(TYPE_ALERT.SUCCESS, result.message);
          // redireccionar a login.
          this.auth.updateSession(result);
          this.router.navigate(['login']);
          return;
        }
        basicAlert(TYPE_ALERT.WARNING, result.message);
      });
  }

}
