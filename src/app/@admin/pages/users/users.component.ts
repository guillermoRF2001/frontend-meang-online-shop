import { USERS_LIST_QUERY } from '@graphql/operations/query/user';
import { Component, OnInit } from '@angular/core';
import { IResultData } from '@core/interfaces/result-data.interface';
import { DocumentNode } from 'graphql';
import { ITableColumns } from '@core/interfaces/table-columns.interface';
import {
  optionsWithDetails,
  userFormBasicDialog,
} from '@shared/alerts/alerts';
import { basicAlert } from '@shared/alerts/toasts';
import { TYPE_ALERT } from '@shared/alerts/values.config';
import { UsersAdminService } from './users-admin.service';
import { IRegisterForm } from '@core/interfaces/register.interface';
import { ACTIVE_FILTERS } from '@core/constants/filters';
import { TitleService } from '@admin/core/services/title.service';
import { LABEL } from '@admin/core/constants/title.constants';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
  query: DocumentNode = USERS_LIST_QUERY;
  context: object;
  itemsPage: number;
  resultData: IResultData;
  include: boolean;
  columns: Array<ITableColumns>;
  filterActiveValues = ACTIVE_FILTERS.ACTIVE;

  constructor(private service: UsersAdminService, private titleService: TitleService) {}

  ngOnInit(): void {
    this.titleService.updateTitle(LABEL.USERS);
    this.context = {};
    this.itemsPage = 15;
    this.resultData = {
      listKey: 'users',
      definitionKey: 'users',
    };
    this.include = true;
    this.columns = [
      {
        property: 'id',
        label: '#',
      },
      {
        property: 'name',
        label: 'Nombre',
      },
      {
        property: 'lastname',
        label: 'Apellidos',
      },
      {
        property: 'email',
        label: 'Correo electrónico',
      },
      {
        property: 'role',
        label: 'Permisos',
      },
      {
        property: 'active',
        label: '¿Activo?',
      },
    ];
  }

  private initializeForm(user: any) {
    const defaultName =
      user.name !== undefined && user.name !== '' ? user.name : '';
    const defaultLastname =
      user.lastname !== undefined && user.lastname !== '' ? user.lastname : '';
    const defaultEmail =
      user.email !== undefined && user.email !== '' ? user.email : '';
    const roles = new Array(2);
    roles[0] = user.role !== undefined && user.role === 'ADMIN' ? 'selected' : '';
    roles[1] = user.role !== undefined && user.role === 'CLIENT' ? 'selected' : '';
    return `
      <label for="name" class="float-left"><b>Nombre</b></label>
      <input id="name" value="${defaultName}" class="swal2-input" placeholder="Nombre" required>
      <label for="lastname" class="float-left"><b>Apellidos</b></label>
      <input id="lastname" value="${defaultLastname}" class="swal2-input" placeholder="Apellidos" required>
      <label for="email" class="float-left"><b>Correo</b></label>
      <input id="email" value="${defaultEmail}" class="swal2-input" placeholder="Correo" required>
      <label for="role" class="float-left"><b>Role</b></label>
      <select id="role" class="swal2-input">
        <option value="ADMIN" ${roles[0]}>Administrador</option>
        <option value="CLIENT" ${roles[1]}>Cliente</option>
      </select>
      `;
  }
  async takeAction($event) {
    // Coger la informacion para las acciones.
    const action = $event[0];
    const user = $event[1];
    // Cogemos el valor por defecto.
    const html = this.initializeForm(user);
    switch (action) {
      case 'add':
        // Añadir el item
        this.addForm(html);
        break;

      case 'edit':
        // Editar el item
        this.updateForm(html, user);
        break;

      case 'info':
        // Informacion del item
        const result = await optionsWithDetails(
          'Detalles',
          `<i class='bx bx-id-card' style= 'font-size: 20px'></i>&nbsp;&nbsp;ID :  ${user.id}<br/>
          <i class="fas fa-circle"></i>&nbsp;&nbsp;${user.name} ${user.lastname}<br/>
          <i class="bx bxs-envelope" style="background-color:blue; color: #ffffff"></i>&nbsp;&nbsp;${user.email}<br/>
          <i class='bx bxs-cake' style='color:#9a12f7; font-size: 20px'></i>&nbsp;&nbsp;${user.birthday}<br/>
          <i class="fas fa-user-circle"></i>&nbsp;&nbsp;${user.role}`,
          400,
          '<i class="bx bxs-edit" style="color: #ffffff; font-size: 20px"></i> Editar', // true
          (user.active !== false) ?
          '<i class="bx bxs-lock-alt" style="color:#ffffff; font-size: 20px"></i> Bloquear' :
          '<i class="bx bxs-lock-open-alt" style="color:#ffffff; font-size: 20px"></i> Desbloquear'
          // false
        );
        if (result === true) {
          this.updateForm(html, user);
        } else if (result === false) {
          if (user.active !== false) {
            this.unblockForm(user, false);
          } else {
            this.unblockForm(user, true);
          }
        }
        break;

      case 'block':
        // Bloquear el item
        this.unblockForm(user, false);
        break;
      case 'unblock':
        // Desbloquear el item
        this.unblockForm(user, true);
        break;

      default:
        break;
    }
  }

  private async addForm(html: string) {
    const result = await userFormBasicDialog('Añadir Usuario', html);
    this.addUser(result);
  }

  private addUser(result) {
    if (result.value) {
      const user: IRegisterForm = result.value;
      user.password = '1234';
      user.active = false;
      // tslint:disable-next-line: deprecation
      this.service.register(user).subscribe((res: any) => {
        if (res.status) {
          // tslint:disable-next-line: deprecation
          this.service.sendEmailActive(res.user.id, user.email).subscribe(
            resEmail => {
              (resEmail.status) ?
              basicAlert(TYPE_ALERT.SUCCESS, resEmail.message) :
              basicAlert(TYPE_ALERT.SUCCESS, resEmail.message);
            }
          );
          return;
        }
        basicAlert(TYPE_ALERT.WARNING, res.message);
      });
    }
  }

  private async updateForm(html: string, user: any) {
    if (user.active !== false) {
      const result = await userFormBasicDialog('Modificar usuario', html);
      this.updateUser(result, user.id);
    } else {
      basicAlert(TYPE_ALERT.ERROR, 'El usuario esta bloqueado. Para poder modificarlo debe desbloquearlo primero.');
      return;
    }
  }

  private updateUser(result, id: string) {
    if (result.value) {
      const user = result.value;
      user.id = id;
      // tslint:disable-next-line: deprecation
      this.service.update(result.value).subscribe((res: any) => {
        if (res.status) {
          basicAlert(TYPE_ALERT.SUCCESS, res.message);
          return;
        }
        basicAlert(TYPE_ALERT.WARNING, res.message);
      });
    }
  }

  async unblockForm(user: any, unblock: boolean) {
    const result = (unblock) ?
    await optionsWithDetails(
      '¿Desbloquear?',
      `Si desbloqueas el usuario ${user.name}, se volvera a mostrar en la lista.`,
      400,
      '<i class="bx bx-x-circle" style="color:#ffffff"></i> Cancelar',
      '<i class="bx bxs-lock-open-alt" style="color:#ffffff"></i> Desbloquear'
    ) :
    await optionsWithDetails(
      '¿Bloquear?',
      `Si bloqueas el usuario ${user.name}, no se volvera a mostrar en la lista.`,
      400,
      '<i class="bx bx-x-circle" style="color:#ffffff"></i> Cancelar',
      '<i class="bx bxs-lock-alt" style="color:#ffffff"></i> Bloquear'
    );
    if (result === false) {
      // Si el resultado es falso, queremos bloquear.
      this.unblockUser(user.id, unblock, true);
    } else {
      basicAlert(TYPE_ALERT.INFO, 'Operación cancelada');
    }
  }

  private unblockUser(id: string, unblock: boolean = false, admin: boolean = false) {
    // tslint:disable-next-line: deprecation
    this.service.unblock(id, unblock, admin).subscribe((res: any) => {
      if (res.status) {
        basicAlert(TYPE_ALERT.SUCCESS, res.message);
        return;
      }
      basicAlert(TYPE_ALERT.WARNING, res.message);
    });
  }
}
