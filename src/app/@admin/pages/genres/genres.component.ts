import { LABEL } from './../../core/constants/title.constants';
import { ACTIVE_FILTERS } from '@core/constants/filters';
import { basicAlert } from '@shared/alerts/toasts';
import { GENRE_LIST_QUERY } from '@graphql/operations/query/genre';
import { Component, OnInit } from '@angular/core';
import { DocumentNode } from 'graphql';
import { IResultData } from '@core/interfaces/result-data.interface';
import { ITableColumns } from '@core/interfaces/table-columns.interface';
import { formBasicDialog, optionsWithDetails } from '@shared/alerts/alerts';
import { GenresService } from './genres.service';
import { TYPE_ALERT } from '@shared/alerts/values.config';
import { TitleService } from '@admin/core/services/title.service';

@Component({
  selector: 'app-genres',
  templateUrl: './genres.component.html',
  styleUrls: ['./genres.component.scss'],
})
export class GenresComponent implements OnInit {
  query: DocumentNode = GENRE_LIST_QUERY;
  context: object;
  itemsPage: number;
  resultData: IResultData;
  include: boolean;
  columns: Array<ITableColumns>;
  filterActiveValues = ACTIVE_FILTERS.ACTIVE;

  constructor(private service: GenresService, private titleService: TitleService) {}

  ngOnInit(): void {
    this.titleService.updateTitle(LABEL.GENRES);
    this.context = {};
    this.itemsPage = 15;
    this.resultData = {
      listKey: 'genres',
      definitionKey: 'genres',
    };
    this.include = false;
    this.columns = [
      {
        property: 'id',
        label: '#',
      },
      {
        property: 'name',
        label: 'Nombre del género',
      },
      {
        property: 'slug',
        label: 'slug',
      },
      {
        property: 'active',
        label: '¿Activo?',
      },
    ];
  }

  async takeAction($event) {
    // Coger la informacion para las acciones.
    const action = $event[0];
    const genre = $event[1];
    // Cogemos el valor por defecto.
    const defaultValue =
      genre.name !== undefined && genre.name !== '' ? genre.name : '';
    const html = `<input id="name" value="${defaultValue}" class="swal2-input" required>`;
    // Teniendo en cuenta el caso, ejecutar una acción.
    switch (action) {
      case 'add':
        // Añadir el item
        this.addForm(html);
        break;

      case 'edit':
        // Editar el item
        this.updateForm(html, genre);
        break;

      case 'info':
        // Informacion del item
        const result = await optionsWithDetails(
          'Detalles',
          `Name: ${genre.name}<br/>
          Slug: ${genre.slug}`,
          400,
          '<i class="bx bxs-edit" style="color: #ffffff"></i> Editar', // true
          genre.active !== false ?
          '<i class="bx bxs-lock-alt" style="color:#ffffff" ></i> Bloquear' :
          '<i class="bx bxs-lock-open-alt" style="color:#ffffff" ></i> Desbloquear'
        );
        if (result === true) {
          this.updateForm(html, genre);
        } else if (result === false) {
          this.unblockForm(genre, (genre.active !== false) ? false : true);
        }
        break;

        case 'block':
          // Bloquear el item
          this.unblockForm(genre, false);
          break;
        case 'unblock':
          // Desbloquear el item
          this.unblockForm(genre, true);
          break;

      default:
        break;
    }
  }

  private async addForm(html: string) {
    const result = await formBasicDialog('Añadir género', html, 'name');
    this.addGenre(result);
  }

  private addGenre(result) {
    if (result.value) {
      // tslint:disable-next-line: deprecation
      this.service.add(result.value).subscribe((res: any) => {
        if (res.status) {
          basicAlert(TYPE_ALERT.SUCCESS, res.message);
          return;
        }
        basicAlert(TYPE_ALERT.WARNING, res.message);
      });
    }
  }

  private async updateForm(html: string, genre: any) {
    if (genre.active !== false) {
      const result = await formBasicDialog('Modificar género', html, 'name');
      this.updateGenre(genre.id, result);
    } else {
      basicAlert(TYPE_ALERT.ERROR, 'El genero esta bloqueado. Para poder modificarlo debe desbloquearlo primero.');
      return;
    }
  }

  private updateGenre(id: string, result) {
    if (result.value) {
      // tslint:disable-next-line: deprecation
      this.service.update(id, result.value).subscribe((res: any) => {
        if (res.status) {
          basicAlert(TYPE_ALERT.SUCCESS, res.message);
          return;
        }
        basicAlert(TYPE_ALERT.WARNING, res.message);
      });
    }
  }

  private async unblockForm(genre: any, unblock: boolean) {
    const result = unblock ?
    await optionsWithDetails(
      '¿Desbloquear?',
      `Si desbloqueas el usuario ${genre.name}, se volvera a mostrar en la lista.`,
      400,
      '<i class="bx bx-x-circle" style="color:#ffffff"></i> Cancelar',
      '<i class="bx bxs-lock-open-alt" style="color:#ffffff"></i> Desbloquear'
    ) :
    await optionsWithDetails(
      '¿Bloquear?',
      `Si bloqueas el usuario ${genre.name}, no se volvera a mostrar en la lista.`,
      400,
      '<i class="bx bx-x-circle" style="color:#ffffff"></i> Cancelar',
      '<i class="bx bxs-lock-alt" style="color:#ffffff"></i> Bloquear'
    );
    if (result === false) {
      // Si el resultado es falso, queremos bloquear.
      this.blockGenre(genre.id, unblock);
    } else {
      basicAlert(TYPE_ALERT.INFO, 'Operación cancelada');
    }
  }

  blockGenre(id: string, unblock: boolean) {
    // tslint:disable-next-line: deprecation
    this.service.unblock(id, unblock).subscribe((res: any) => {
      if (res.status) {
        basicAlert(TYPE_ALERT.SUCCESS, res.message);
        return;
      }
      basicAlert(TYPE_ALERT.WARNING, res.message);
    });
  }
}
