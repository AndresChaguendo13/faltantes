import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  FormsModule
} from '@angular/forms';

import {
  RouterLink
} from '@angular/router';

import {
  Categoria,
  CategoriaService
} from '../../services/categoria';

import { NotificationService } from '../../shared/services/notification.service';




@Component({
  selector: 'app-categorias',

  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ],

  templateUrl: './categorias.html',

  styleUrl: './categorias.css'
})
export class Categorias implements OnInit {


  // =====================================================
  // DATOS
  // =====================================================

  categorias: Categoria[] = [];

  categoriasFiltradas: Categoria[] = [];


  // =====================================================
  // ESTADOS
  // =====================================================

  cargando = false;

  guardando = false;

  eliminandoId: number | null = null;


  // =====================================================
  // FORMULARIO
  // =====================================================

  mostrarFormulario = false;

  modoEdicion = false;

  categoriaEditandoId: number | null = null;


  categoriaNueva = {

    nombre: ''

  };


  // =====================================================
  // ELIMINACIÓN
  // =====================================================

  mostrarConfirmacionEliminar = false;

  categoriaAEliminar: Categoria | null = null;


  // =====================================================
  // BÚSQUEDA
  // =====================================================

  terminoBusqueda = '';


  // =====================================================
  // MENSAJES
  // =====================================================

  mensaje = '';

  error = '';


  // =====================================================
  // CONSTRUCTOR
  // =====================================================

  constructor(

    private categoriaService: CategoriaService,

    private cdr: ChangeDetectorRef,

  private notification: NotificationService

  ) {}


  // =====================================================
  // INICIO
  // =====================================================

  ngOnInit(): void {

    this.cargarCategorias();

  }


  // =====================================================
  // CARGAR CATEGORÍAS
  // =====================================================

  cargarCategorias(): void {

    this.cargando = true;

    this.error = '';

    this.cdr.detectChanges();


    this.categoriaService
      .listar()
      .subscribe({

        next: (categorias) => {

          this.categorias =
            categorias || [];

          this.filtrarCategorias();

          this.cargando = false;

          this.cdr.detectChanges();

        },


        error: (error) => {

          console.error(
            'ERROR AL CARGAR CATEGORÍAS:',
            error
          );

          this.cargando = false;

          if (error.status === 401) {

            this.error =
              'Sesión expirada. Inicia sesión nuevamente.';

          }
          else if (error.status === 403) {

            this.error =
              'No tienes permisos para consultar las categorías.';

          }
          else if (error.status === 0) {

            this.error =
              'No se pudo conectar con el servidor.';

          }
          else {

            this.error =
              'No se pudieron cargar las categorías.';

          }

          this.cdr.detectChanges();

        }

      });

  }


  // =====================================================
  // FILTRAR
  // =====================================================

  filtrarCategorias(): void {

    const texto =
      this.terminoBusqueda
        .trim()
        .toLowerCase();


    this.categoriasFiltradas =
      this.categorias.filter(
        categoria => {

          const nombre =
            (
              categoria.nombre || ''
            ).toLowerCase();


          return (
            !texto ||
            nombre.includes(texto)
          );

        }
      );


    this.cdr.detectChanges();

  }


  // =====================================================
  // ABRIR NUEVA CATEGORÍA
  // =====================================================

  abrirFormulario(): void {

    this.mensaje = '';

    this.error = '';

    this.modoEdicion = false;

    this.categoriaEditandoId = null;


    this.categoriaNueva = {

      nombre: ''

    };


    this.mostrarFormulario = true;

    this.cdr.detectChanges();

  }


  // =====================================================
  // EDITAR
  // =====================================================

  editarCategoria(
    categoria: Categoria
  ): void {

    this.mensaje = '';

    this.error = '';

    this.modoEdicion = true;


    this.categoriaEditandoId =
      categoria.id;


    this.categoriaNueva = {

      nombre: categoria.nombre

    };


    this.mostrarFormulario = true;

    this.cdr.detectChanges();

  }


  // =====================================================
  // CERRAR FORMULARIO
  // =====================================================

  cerrarFormulario(): void {

    if (this.guardando) {

      return;

    }


    this.mostrarFormulario = false;

    this.modoEdicion = false;

    this.categoriaEditandoId = null;

    this.categoriaNueva = {

      nombre: ''

    };


    this.error = '';

    this.cdr.detectChanges();

  }


  // =====================================================
  // GUARDAR
  // =====================================================

  guardarCategoria(): void {

    this.mensaje = '';

    this.error = '';


    const nombre =
      this.categoriaNueva.nombre.trim();


    if (!nombre) {

      this.error =
        'El nombre de la categoría es obligatorio.';

      this.cdr.detectChanges();

      return;

    }


    this.guardando = true;

    this.cdr.detectChanges();


    const datos = {

      nombre: nombre

    };


    // ===================================================
    // ACTUALIZAR
    // ===================================================

    if (
      this.modoEdicion &&
      this.categoriaEditandoId !== null
    ) {

      this.categoriaService
        .actualizar(
          this.categoriaEditandoId,
          datos
        )
        .subscribe({

          next: () => {

            this.guardando = false;

            this.mostrarFormulario = false;

            this.modoEdicion = false;

            this.categoriaEditandoId = null;


            this.categoriaNueva = {

              nombre: ''

            };


            this.notification.success(
              'Categoría actualizada correctamente.',
              'Categoría actualizada'
            );


            this.cdr.detectChanges();


            this.cargarCategorias();

          },


          error: (error) => {

            console.error(
              'ERROR AL ACTUALIZAR CATEGORÍA:',
              error
            );


            this.notification.error(
              this.obtenerMensajeError(
                error,
                'No se pudo actualizar la categoría.'
              )
            );


            this.guardando = false;

            this.cdr.detectChanges();

          }

        });


      return;

    }


    // ===================================================
    // CREAR
    // ===================================================

    this.categoriaService
      .crear(datos)
      .subscribe({

        next: () => {

          this.guardando = false;

          this.mostrarFormulario = false;

          this.notification.success(
            'Categoría creada correctamente.',
            'Categoría creada'
          );


          this.categoriaNueva = {

            nombre: ''

          };


          this.cdr.detectChanges();


          this.cargarCategorias();

        },


        error: (error) => {

          console.error(
            'ERROR AL CREAR CATEGORÍA:',
            error
          );


          this.notification.error(
            this.obtenerMensajeError(
              error,
              'No se pudo crear la categoría.'
            )
          );


          this.guardando = false;

          this.cdr.detectChanges();

        }

      });

  }


  // =====================================================
  // ABRIR CONFIRMACIÓN
  // =====================================================

  prepararEliminar(
    categoria: Categoria
  ): void {

    this.mensaje = '';

    this.error = '';

    this.categoriaAEliminar =
      categoria;

    this.mostrarConfirmacionEliminar =
      true;

    this.cdr.detectChanges();

  }


  // =====================================================
  // CANCELAR ELIMINACIÓN
  // =====================================================

  cancelarEliminar(): void {

    if (this.eliminandoId !== null) {

      return;

    }


    this.mostrarConfirmacionEliminar =
      false;

    this.categoriaAEliminar = null;

    this.cdr.detectChanges();

  }


  // =====================================================
  // CONFIRMAR ELIMINACIÓN
  // =====================================================

  confirmarEliminar(): void {

    if (!this.categoriaAEliminar) {

      return;

    }


    const id =
      this.categoriaAEliminar.id;


    this.eliminandoId = id;

    this.error = '';

    this.cdr.detectChanges();


    this.categoriaService
      .eliminar(id)
      .subscribe({

        next: () => {

          this.eliminandoId = null;

          this.mostrarConfirmacionEliminar =
            false;

          this.categoriaAEliminar = null;


          this.notification.success(
            'Categoría eliminada correctamente.',
            'Categoría eliminada'
          );


          this.cdr.detectChanges();


          this.cargarCategorias();

        },


        error: (error) => {

          console.error(
            'ERROR AL ELIMINAR CATEGORÍA:',
            error
          );


          this.notification.error(
            this.obtenerMensajeError(
              error,
              'No se pudo eliminar la categoría.'
            )
          );


          this.eliminandoId = null;

          this.cdr.detectChanges();

        }

      });

  }


  // =====================================================
  // MENSAJES DE ERROR
  // =====================================================

  private obtenerMensajeError(
    error: any,
    mensajePorDefecto: string
  ): string {

    if (error?.status === 401) {

      return 'Sesión expirada. Inicia sesión nuevamente.';

    }


    if (error?.status === 403) {

      return 'No tienes permisos para realizar esta operación.';

    }


    if (error?.status === 409) {

      return 'La categoría ya existe.';

    }


    if (
      error?.error?.message
    ) {

      return error.error.message;

    }


    if (
      typeof error?.error === 'string'
    ) {

      return error.error;

    }


    if (error?.status === 0) {

      return 'No se pudo conectar con el servidor.';

    }


    return mensajePorDefecto;

  }

}
