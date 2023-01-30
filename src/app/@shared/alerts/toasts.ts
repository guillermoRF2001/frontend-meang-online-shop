import { TYPE_ALERT } from './values.config';
import Swal from 'sweetalert2';

export function basicAlert(icon = TYPE_ALERT.SUCCESS, title: string = '') {
    Swal.fire({
        title,
        icon,
        position: 'top-start',
        padding: '1.50rem',
        confirmButtonText: 'OK',
        timer: 3000,
        timerProgressBar: true,
        toast: true,
      });
}

export function adminAlert(icon = TYPE_ALERT.ERROR, title: string = '', text: string = '') {
  Swal.fire({
      title,
      icon,
      text,
      position: 'top',
      padding: '1.50rem',
      heightAuto: false,
      width: '50rem',
      imageHeight: '50rem',
      confirmButtonText: 'OK',
      timer: 4000,
      timerProgressBar: true,
    });
}
