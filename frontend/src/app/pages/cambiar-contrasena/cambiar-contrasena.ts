import {
  Component
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  FormsModule
} from '@angular/forms';

import {
  Router
} from '@angular/router';

import {
  UsuarioService
} from '../../services/usuario';

import {
  NotificationService
} from '../../shared/services/notification.service';


@Component({
  selector: 'app-cambiar-contrasena',

  standalone: true,

  imports: [
    CommonModule,
    FormsModule
  ],

  templateUrl: './cambiar-contrasena.html',

  styleUrl: './cambiar-contrasena.css'
})
export class CambiarContrasena {

  passwordActual = '';

  nuevaPassword = '';

  confirmarPassword = '';


  mostrarPasswordActual = false;

  mostrarNuevaPassword = false;

  mostrarConfirmarPassword = false;


  guardando = false;

  error = '';


  constructor(
    private usuarioService: UsuarioService,
    private notificationService: NotificationService,
    private router: Router
  ) {}


  cambiarPassword(): void {

    this.error = '';


    if (!this.passwordActual) {

      this.error =
        'Ingresa tu contraseña actual.';

      return;
    }


    if (!this.nuevaPassword) {

      this.error =
        'Ingresa una nueva contraseña.';

      return;
    }


    if (this.nuevaPassword.length < 6) {

      this.error =
        'La nueva contraseña debe tener al menos 6 caracteres.';

      return;
    }


    if (!this.confirmarPassword) {

      this.error =
        'Confirma la nueva contraseña.';

      return;
    }


    if (
      this.nuevaPassword !==
      this.confirmarPassword
    ) {

      this.error =
        'Las nuevas contraseñas no coinciden.';

      return;
    }


    this.guardando = true;


    this.usuarioService
      .cambiarPassword({

        passwordActual:
        this.passwordActual,

        nuevaPassword:
        this.nuevaPassword,

        confirmarPassword:
        this.confirmarPassword

      })
      .subscribe({

        next: () => {

          this.guardando = false;

          this.passwordActual = '';

          this.nuevaPassword = '';

          this.confirmarPassword = '';

          this.notificationService.success(
            'Tu contraseña fue actualizada correctamente.',
            'Contraseña actualizada'
          );

          this.router.navigate([
            '/mi-perfil'
          ]);

        },


        error: (error: any) => {

          console.error(
            'Error cambiando contraseña:',
            error
          );

          this.guardando = false;

          if (
            error?.status === 400
          ) {

            this.error =
              error?.error?.message ||
              'Los datos enviados no son válidos.';

          } else if (
            error?.status === 401
          ) {

            this.error =
              'La contraseña actual es incorrecta.';

          } else {

            this.error =
              error?.error?.message ||
              'No fue posible cambiar la contraseña.';

          }

          this.notificationService.error(
            this.error,
            'No se pudo cambiar la contraseña'
          );

        }

      });

  }


  volver(): void {

    this.router.navigate([
      '/mi-perfil'
    ]);

  }

}
