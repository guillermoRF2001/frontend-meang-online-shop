import { SEND_EMAIL_ACTION } from './../../@graphql/operations/mutation/mail';
import { Apollo } from 'apollo-angular';
import { ApiService } from '@graphql/services/api.service';
import { Injectable } from '@angular/core';
import { IMail } from '@core/interfaces/mail.interface';
import { map } from 'rxjs/internal/operators/map';

@Injectable({
  providedIn: 'root'
})
export class MailService extends ApiService{

  constructor(apollo: Apollo) {
    super(apollo);
  }

  send(mail: IMail){
    return this.set(
      SEND_EMAIL_ACTION,
      { mail }
    ).pipe(map((result: any) => {
      return result.sendEmail;
    }));
  }
}
