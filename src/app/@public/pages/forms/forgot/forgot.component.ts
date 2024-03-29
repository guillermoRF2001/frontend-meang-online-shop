import { PasswordService } from './../../../../@core/services/password.service';
import { Component, OnInit } from '@angular/core';
import { EMAIL_PATTERN } from '@core/constants/regex';
import { basicAlert } from '@shared/alerts/toasts';
import { TYPE_ALERT } from '@shared/alerts/values.config';

@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.component.html',
  styleUrls: ['./forgot.component.scss']
})
export class ForgotComponent implements OnInit {
  emailValue: string;
  emailPattern = EMAIL_PATTERN;
  constructor(private passwordService: PasswordService) { }

  ngOnInit(): void {
  }

  reset(){
    // tslint:disable-next-line: deprecation
    this.passwordService.reset(this.emailValue).subscribe( result => {
      if (result.status) {
        basicAlert(TYPE_ALERT.SUCCESS, result.message);
        return;
      }
      basicAlert(TYPE_ALERT.WARNING, result.message);
    });
  }
}
