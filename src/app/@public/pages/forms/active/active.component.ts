import { UsersService } from '@core/services/users.service';
import { basicAlert } from '@shared/alerts/toasts';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TYPE_ALERT } from '@shared/alerts/values.config';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-active',
  templateUrl: './active.component.html',
  styleUrls: ['./active.component.scss'],
})
export class ActiveComponent implements OnInit {
  token: string;
  values: any = {
    password: '',
    passwordTwo: '',
    birthday: '',
  };
  constructor(
    private route: ActivatedRoute,
    private userService: UsersService,
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
    const data = new Date();
    data.setFullYear(data.getFullYear() - 18);
    this.values.birthday = data.toISOString().substring(0, 10);
  }

  private formaNumbers(num: number | string) {
    return +num < 10 ? `0${num}` : num;
  }
  dataAsign($event) {
    const fecha = `${$event.year}-${this.formaNumbers(
      $event.month
    )}-${this.formaNumbers($event.day)}`;
    console.log('Fecha -', fecha);
    this.values.birthday = fecha;
  }

  add() {
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
    this.userService
      .active(this.token, this.values.birthday, this.values.password)
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
