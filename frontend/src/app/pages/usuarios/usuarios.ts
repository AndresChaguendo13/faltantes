import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { timeout } from 'rxjs';

import {
  Usuario,
  UsuarioRequest,
  UsuarioUpdateRequest,
  UsuarioService
} from '../../services/usuario';

import { NotificationService } from '../../shared/services/notification.service';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './usuarios.html',
  styleUrl: './usuarios.css'
})
export class Usuarios implements OnInit {

  // =====================================================
  // LISTA DE USUARIOS
  // =====================================================

  usuarios: Usuario[] = [];

  cargando = false;
  creando = false;
  editando = false;
  eliminando = false;

  error = '';
  busqueda = '';

  // =====================================================
  // MODAL CREAR
  // =====================================================

  mostrarModal = false;

  mostrarPassword = false;
  mostrarConfirmacion = false;

  nuevoUsuario: UsuarioRequest = {
    nombre: '',
    username: '',
    password: '',
    rol: 'EMPLEADO'
  };

  confirmarPassword = '';

  // =====================================================
  // MODAL EDITAR
  // =====================================================

  mostrarModalEditar = false;

  usuarioEditando: Usuario | null = null;

  usuarioEditar: UsuarioUpdateRequest = {
    nombre: '',
    username: '',
    rol: 'EMPLEADO'
  };

  nuevaPasswordEditar = '';
  confirmarPasswordEditar = '';

  mostrarPasswordEditar = false;
  mostrarConfirmacionEditar = false;

  // =====================================================
  // MODAL ELIMINAR
  // =====================================================

  mostrarModalEliminar = false;

  usuarioEliminando: Usuario | null = null;

  constructor(
    private usuarioService: UsuarioService,
    private notificationService: NotificationService,
    private cdr: ChangeDetectorRef
  ) {}

  // =====================================================
  // INICIO
  // =====================================================

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  // =====================================================
  // CARGAR USUARIOS
  // =====================================================

  cargarUsuarios(): void {

    this.cargando = true;
    this.error = '';

    this.cdr.detectChanges();

    this.usuarioService.listar().subscribe({

      next: (usuarios: Usuario[]) => {

        console.log(
          'USUARIOS RECIBIDOS:',
          usuarios
        );

        this.usuarios = usuarios || [];
        this.cargando = false;

        this.cdr.detectChanges();
      },

      error: (error: any) => {

        console.error(
          'ERROR CARGANDO USUARIOS:',
          error
        );

        this.usuarios = [];
        this.cargando = false;

        this.error =
          error?.error?.message ||
          'No fue posible cargar los usuarios.';

        this.cdr.detectChanges();
      }

    });
  }

  // =====================================================
  // BUSCADOR
  // =====================================================

  get usuariosFiltrados(): Usuario[] {

    const termino =
      this.busqueda
        .trim()
        .toLowerCase();

    if (!termino) {
      return this.usuarios;
    }

    return this.usuarios.filter(usuario =>

      (usuario.nombre || '')
        .toLowerCase()
        .includes(termino)

      ||

      (usuario.username || '')
        .toLowerCase()
        .includes(termino)

      ||

      (usuario.rol || '')
        .toLowerCase()
        .includes(termino)

    );
  }

  // =====================================================
  // NUEVO USUARIO
  // =====================================================

  abrirNuevoUsuario(): void {

    this.nuevoUsuario = {
      nombre: '',
      username: '',
      password: '',
      rol: 'EMPLEADO'
    };

    this.confirmarPassword = '';

    this.mostrarPassword = false;
    this.mostrarConfirmacion = false;

    this.error = '';

    this.mostrarModal = true;

    this.cdr.detectChanges();
  }

  cerrarModal(): void {

    if (this.creando) {
      return;
    }

    this.mostrarModal = false;

    this.error = '';

    this.cdr.detectChanges();
  }

  // =====================================================
  // VALIDACIÓN CONTRASEÑA
  // =====================================================

  get contrasenasCoinciden(): boolean {

    if (
      !this.nuevoUsuario.password ||
      !this.confirmarPassword
    ) {
      return false;
    }

    return (
      this.nuevoUsuario.password ===
      this.confirmarPassword
    );
  }

  get mostrarErrorContrasena(): boolean {

    return (
      !!this.confirmarPassword &&
      !!this.nuevoUsuario.password &&
      !this.contrasenasCoinciden
    );
  }

  // =====================================================
  // CREAR USUARIO
  // =====================================================

  crearUsuario(): void {

    this.error = '';

    const nombre =
      (this.nuevoUsuario.nombre || '')
        .trim();

    const username =
      (this.nuevoUsuario.username || '')
        .trim();

    if (!nombre) {

      this.error =
        'El nombre es obligatorio.';

      return;
    }

    if (!username) {

      this.error =
        'El nombre de usuario es obligatorio.';

      return;
    }

    if (!this.nuevoUsuario.password) {

      this.error =
        'La contraseña es obligatoria.';

      return;
    }

    if (!this.confirmarPassword) {

      this.error =
        'Debes confirmar la contraseña.';

      return;
    }

    if (!this.contrasenasCoinciden) {

      this.error =
        'Las contraseñas no coinciden.';

      return;
    }

    if (!this.nuevoUsuario.rol) {

      this.error =
        'Debes seleccionar un rol.';

      return;
    }

    const request: UsuarioRequest = {

      nombre,

      username,

      password:
      this.nuevoUsuario.password,

      rol:
      this.nuevoUsuario.rol

    };

    this.creando = true;

    this.cdr.detectChanges();

    this.usuarioService
      .crear(request)
      .pipe(
        timeout({
          first: 15000
        })
      )
      .subscribe({

        next: (usuario: Usuario) => {

          this.finalizarCreacionUsuario(
            usuario
          );
        },

        error: (error: any) => {

          console.error(
            'ERROR CREANDO USUARIO:',
            error
          );

          if (
            error?.name ===
            'TimeoutError'
          ) {

            this.verificarCreacionUsuario(
              username
            );

            return;
          }

          this.creando = false;

          if (error?.status === 409) {

            this.error =
              error?.error?.message ||
              'Ya existe un usuario con ese nombre de usuario.';

          } else if (error?.status === 400) {

            this.error =
              error?.error?.message ||
              'Los datos enviados no son válidos.';

          } else if (error?.status === 401) {

            this.error =
              'Tu sesión ha expirado. Inicia sesión nuevamente.';

          } else if (error?.status === 403) {

            this.error =
              'No tienes permisos para crear usuarios.';

          } else if (error?.status === 0) {

            this.error =
              'No se pudo conectar con el servidor.';

          } else {

            this.error =
              error?.error?.message ||
              'No fue posible crear el usuario.';
          }

          this.cdr.detectChanges();
        }

      });
  }

  // =====================================================
  // FINALIZAR CREACIÓN
  // =====================================================

  private finalizarCreacionUsuario(
    usuario: Usuario
  ): void {

    this.creando = false;

    this.usuarios = [
      ...this.usuarios,
      usuario
    ];

    this.nuevoUsuario = {

      nombre: '',
      username: '',
      password: '',
      rol: 'EMPLEADO'

    };

    this.confirmarPassword = '';

    this.mostrarPassword = false;
    this.mostrarConfirmacion = false;

    this.mostrarModal = false;

    this.cdr.detectChanges();

    this.notificationService.success(

      `El usuario "${usuario.username}" fue creado correctamente.`,

      'Usuario creado'
    );
  }

  // =====================================================
  // VERIFICAR CREACIÓN DESPUÉS DE TIMEOUT
  // =====================================================

  private verificarCreacionUsuario(
    username: string
  ): void {

    this.usuarioService
      .listar()
      .pipe(
        timeout({
          first: 5000
        })
      )
      .subscribe({

        next: (usuarios: Usuario[]) => {

          const usuarioCreado =
            usuarios.find(usuario =>

              usuario.username
                .toLowerCase() ===
              username.toLowerCase()

            );

          if (usuarioCreado) {

            this.finalizarCreacionUsuario(
              usuarioCreado
            );

            return;
          }

          this.creando = false;

          this.error =
            'No pudimos confirmar la creación del usuario.';

          this.cdr.detectChanges();
        },

        error: () => {

          this.creando = false;

          this.error =
            'No pudimos confirmar si el usuario fue creado. Revisa la lista antes de intentarlo nuevamente.';

          this.cdr.detectChanges();
        }

      });
  }

  // =====================================================
  // EDITAR USUARIO
  // =====================================================

  abrirEditarUsuario(
    usuario: Usuario
  ): void {

    this.usuarioEditando = usuario;

    this.usuarioEditar = {

      nombre:
      usuario.nombre,

      username:
      usuario.username,

      rol:
      usuario.rol

    };

    this.nuevaPasswordEditar = '';
    this.confirmarPasswordEditar = '';

    this.mostrarPasswordEditar = false;
    this.mostrarConfirmacionEditar = false;

    this.error = '';

    this.mostrarModalEditar = true;

    this.cdr.detectChanges();
  }

  cerrarModalEditar(): void {

    if (this.editando) {
      return;
    }

    this.mostrarModalEditar = false;

    this.usuarioEditando = null;

    this.nuevaPasswordEditar = '';
    this.confirmarPasswordEditar = '';

    this.error = '';

    this.cdr.detectChanges();
  }

  // =====================================================
  // VALIDAR CONTRASEÑA EDICIÓN
  // =====================================================

  get contrasenasEditarCoinciden(): boolean {

    if (
      !this.nuevaPasswordEditar &&
      !this.confirmarPasswordEditar
    ) {

      return true;
    }

    return (
      this.nuevaPasswordEditar ===
      this.confirmarPasswordEditar
    );
  }

  // =====================================================
  // GUARDAR EDICIÓN
  // =====================================================

  guardarEdicionUsuario(): void {

    if (!this.usuarioEditando) {
      return;
    }

    this.error = '';

    const nombre =
      (this.usuarioEditar.nombre || '')
        .trim();

    const username =
      (this.usuarioEditar.username || '')
        .trim();

    const rol =
      (this.usuarioEditar.rol || '')
        .trim();

    if (!nombre) {

      this.error =
        'El nombre es obligatorio.';

      return;
    }

    if (!username) {

      this.error =
        'El nombre de usuario es obligatorio.';

      return;
    }

    if (!rol) {

      this.error =
        'Debes seleccionar un rol.';

      return;
    }

    if (!this.contrasenasEditarCoinciden) {

      this.error =
        'Las contraseñas no coinciden.';

      return;
    }

    if (
      this.nuevaPasswordEditar &&
      this.nuevaPasswordEditar.length < 6
    ) {

      this.error =
        'La nueva contraseña debe tener al menos 6 caracteres.';

      return;
    }

    const request: UsuarioUpdateRequest = {

      nombre,

      username,

      rol

    };

    if (this.nuevaPasswordEditar) {

      request.password =
        this.nuevaPasswordEditar;
    }

    this.editando = true;

    this.cdr.detectChanges();

    this.usuarioService
      .actualizar(
        this.usuarioEditando.id,
        request
      )
      .subscribe({

        next: (usuarioActualizado: Usuario) => {

          const indice =
            this.usuarios.findIndex(
              usuario =>
                usuario.id ===
                usuarioActualizado.id
            );

          if (indice !== -1) {

            this.usuarios[indice] =
              usuarioActualizado;

            this.usuarios =
              [...this.usuarios];
          }

          this.editando = false;

          this.mostrarModalEditar = false;

          this.usuarioEditando = null;

          this.nuevaPasswordEditar = '';
          this.confirmarPasswordEditar = '';

          this.error = '';

          this.cdr.detectChanges();

          this.notificationService.success(

            `El usuario "${usuarioActualizado.username}" fue actualizado correctamente.`,

            'Usuario actualizado'
          );
        },

        error: (error: any) => {

          console.error(
            'ERROR ACTUALIZANDO USUARIO:',
            error
          );

          this.editando = false;

          if (error?.status === 409) {

            this.error =
              error?.error?.message ||
              'Ya existe un usuario con ese nombre de usuario.';

          } else if (error?.status === 400) {

            this.error =
              error?.error?.message ||
              'Los datos enviados no son válidos.';

          } else if (error?.status === 403) {

            this.error =
              'No tienes permisos para editar usuarios.';

          } else if (error?.status === 404) {

            this.error =
              'El usuario ya no existe. Actualiza la lista.';

          } else if (error?.status === 0) {

            this.error =
              'No se pudo conectar con el servidor.';

          } else {

            this.error =
              error?.error?.message ||
              'No fue posible actualizar el usuario.';
          }

          this.cdr.detectChanges();
        }

      });
  }

  // =====================================================
  // ABRIR MODAL DE ELIMINACIÓN
  // =====================================================

  confirmarEliminar(
    usuario: Usuario
  ): void {

    this.error = '';

    this.usuarioEliminando =
      usuario;

    this.mostrarModalEliminar =
      true;

    this.cdr.detectChanges();
  }

  // =====================================================
  // CANCELAR ELIMINACIÓN
  // =====================================================

  cancelarEliminar(): void {

    if (this.eliminando) {
      return;
    }

    this.mostrarModalEliminar =
      false;

    this.usuarioEliminando =
      null;

    this.error = '';

    this.cdr.detectChanges();
  }

  // =====================================================
  // EJECUTAR ELIMINACIÓN
  // =====================================================

  ejecutarEliminar(): void {

    if (!this.usuarioEliminando) {
      return;
    }

    const usuario =
      this.usuarioEliminando;

    this.eliminando = true;

    this.error = '';

    this.cdr.detectChanges();

    this.usuarioService
      .eliminar(usuario.id)
      .subscribe({

        next: () => {

          this.usuarios =
            this.usuarios.filter(
              item =>
                item.id !== usuario.id
            );

          this.eliminando = false;

          this.mostrarModalEliminar =
            false;

          this.usuarioEliminando =
            null;

          this.cdr.detectChanges();

          this.notificationService.success(

            `El usuario "${usuario.username}" fue eliminado correctamente.`,

            'Usuario eliminado'
          );
        },

        error: (error: any) => {

          console.error(
            'ERROR ELIMINANDO USUARIO:',
            error
          );

          this.eliminando = false;

          this.mostrarModalEliminar =
            false;

          this.usuarioEliminando =
            null;

          if (error?.status === 401) {

            this.error =
              'Tu sesión ha expirado. Inicia sesión nuevamente.';

          } else if (error?.status === 403) {

            this.error =
              'No tienes permisos para eliminar usuarios.';

          } else if (error?.status === 404) {

            this.error =
              'El usuario no existe o ya fue eliminado.';

          } else if (error?.status === 409) {

            this.error =
              error?.error?.message ||
              'No se puede eliminar este usuario porque tiene información relacionada.';

          } else if (error?.status === 0) {

            this.error =
              'No se pudo conectar con el servidor.';

          } else {

            this.error =
              error?.error?.message ||
              'No fue posible eliminar el usuario.';
          }

          this.notificationService.error(

            this.error,

            'No se pudo eliminar'
          );

          this.cdr.detectChanges();
        }

      });
  }

}
