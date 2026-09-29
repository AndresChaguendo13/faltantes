import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  Router
} from '@angular/router';

import {
  Usuario,
  UsuarioService
} from '../../services/usuario';

import {
  NotificationService
} from '../../shared/services/notification.service';

import {
  timeout,
  finalize
} from 'rxjs';


@Component({
  selector: 'app-mi-perfil',
  standalone: true,

  imports: [
    CommonModule
  ],

  templateUrl: './mi-perfil.html',

  styleUrl: './mi-perfil.css'
})
export class MiPerfil implements OnInit {

  usuario: Usuario | null = null;

  cargando = true;

  error = '';


  constructor(
    private usuarioService: UsuarioService,
    private notificationService: NotificationService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}


  // =====================================================
  // INICIO
  // =====================================================

  ngOnInit(): void {

    this.cargarPerfil();

  }


  // =====================================================
  // CARGAR PERFIL
  // =====================================================

  cargarPerfil(): void {

    console.log('=================================');
    console.log('CARGANDO MI PERFIL');
    console.log('=================================');

    this.cargando = true;

    this.error = '';

    this.usuario = null;

    this.cdr.detectChanges();


    this.usuarioService
      .obtenerMiPerfil()

      .pipe(

        // Evita que la pantalla quede cargando
        // indefinidamente si el backend no responde.
        timeout({
          first: 10000
        }),

        // Siempre se ejecuta al terminar:
        // éxito, error o timeout.
        finalize(() => {

          this.cargando = false;

          this.cdr.detectChanges();

          console.log(
            'FINALIZÓ CARGA DEL PERFIL'
          );

        })

      )

      .subscribe({

        // =================================================
        // ÉXITO
        // =================================================

        next: (usuario: Usuario) => {

          console.log(
            'PERFIL RECIBIDO:',
            usuario
          );

          this.usuario = usuario;

          this.error = '';

          this.cdr.detectChanges();

        },


        // =================================================
        // ERROR
        // =================================================

        error: (error: any) => {

          console.error(
            'ERROR OBTENIENDO PERFIL:',
            error
          );


          if (error?.name === 'TimeoutError') {

            this.error =
              'El servidor tardó demasiado en responder. Verifica que Spring Boot esté ejecutándose.';

          } else if (error?.status === 401) {

            this.error =
              'Tu sesión ha expirado. Inicia sesión nuevamente.';

          } else if (error?.status === 403) {

            this.error =
              'No tienes autorización para consultar tu perfil.';

          } else if (error?.status === 404) {

            this.error =
              'No se encontró el servicio de perfil en el servidor.';

          } else if (error?.status === 500) {

            this.error =
              'El servidor encontró un error al consultar tu perfil.';

          } else if (error?.status === 0) {

            this.error =
              'No se pudo conectar con el servidor. Verifica que Spring Boot esté ejecutándose.';

          } else {

            this.error =
              error?.error?.message ||
              'No fue posible cargar la información del perfil.';

          }


          this.cdr.detectChanges();


          this.notificationService.error(
            this.error,
            'Error al cargar perfil'
          );

        }

      });

  }


  // =====================================================
  // VOLVER
  // =====================================================

  volver(): void {

    this.router.navigate([
      '/dashboard'
    ]);

  }

}
