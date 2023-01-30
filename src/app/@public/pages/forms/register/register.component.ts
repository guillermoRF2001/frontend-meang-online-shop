import { IResultRegister, IRegisterForm } from '@core/interfaces/register.interface';
import { UsersService } from '@core/services/users.service';
import { Component, OnInit } from '@angular/core';
import { basicAlert } from '@shared/alerts/toasts';
import { TYPE_ALERT } from '@shared/alerts/values.config';
import { Router } from '@angular/router';
import { EMAIL_PATTERN } from '@core/constants/regex';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  emailPattern = EMAIL_PATTERN;
  register: IRegisterForm = {
    name: '',
    lastname: '',
    email: '',
    password: '',
    birthday: '',
  };
  constructor(private api: UsersService, private router: Router) { }

  ngOnInit(): void {
    const data = new Date();
    data.setFullYear(data.getFullYear() - 18);
    this.register.birthday = (data.toISOString()).substring(0, 10);
  }

  private formaNumbers(num: number | string){
    return (+num < 10) ? `0${num}` : num;
  }
  dataAsign($event){
    const fecha = `${$event.year}-${this.formaNumbers($event.month)}-${this.formaNumbers($event.day)}`;
    this.register.birthday = fecha;
  }

  add(){
    // tslint:disable-next-line: deprecation
    this.api.register(this.register).subscribe((result: IResultRegister) => {
      console.log('Result', result);
      if (result.status) {
        if (result.user !== null) {
          // Guardamos la sesion.
          basicAlert(TYPE_ALERT.SUCCESS, result.message);
          this.router.navigate(['/login']);
          return;
        }
        basicAlert(TYPE_ALERT.ERROR, result.message);
        return;
      }
      basicAlert(TYPE_ALERT.WARNING, result.message);
    });
  }
}
