import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import {
  Cliente,
  ClienteService
} from '../../services/cliente.service';

import { NotificationService } from '../../shared/services/notification.service';



@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './clientes.html',
  styleUrl: './clientes.css'
})
export class ClientesComponent implements OnInit {

  clientes: Cliente[] = [];
  clientesVisibles: Cliente[] = [];

  cargando = false;
  guardando = false;
  eliminandoId: number | null = null;

  error = '';
  mensaje = '';

  terminoBusqueda = '';
  filtroEstado = 'todos';

  mostrarFormulario = false;
  modoEdicion = false;
  clienteEditandoId: number | null = null;

  mostrarConfirmacionEliminar = false;
  clienteAEliminar: Cliente | null = null;

  clienteNuevo: Cliente = this.crearClienteVacio();

  constructor(
    private clienteService: ClienteService,
    private cdr: ChangeDetectorRef,
    private notification: NotificationService
  ) {}

  ngOnInit(): void {
    this.cargarClientes();
  }

  private crearClienteVacio(): Cliente {
    return {
      id: 0,
      nombre: '',
      documento: '',
      telefono: '',
      direccion: '',
      activo: true
    };
  }

  cargarClientes(): void {
    this.cargando = true;
    this.error = '';
    this.cdr.detectChanges();

    this.clienteService.listar().subscribe({
      next: (data: Cliente[]) => {
        this.clientes = data ?? [];
        this.aplicarFiltros();

        this.cargando = false;
        this.cdr.detectChanges();
      },

      error: (err: any) => {
        console.error('ERROR AL CARGAR CLIENTES:', err);

        this.error = this.obtenerMensajeError(
          err,
          'No fue posible cargar los clientes.'
        );

        this.cargando = false;

        this.notification.error(
          this.error,
          'Error al cargar clientes'
        );

        this.cdr.detectChanges();
      }
    });
  }

  aplicarFiltros(): void {
    const termino = this.terminoBusqueda
      .trim()
      .toLowerCase();

    this.clientesVisibles = this.clientes.filter((cliente) => {

      const coincideTexto =
        !termino ||
        (cliente.nombre ?? '').toLowerCase().includes(termino) ||
        (cliente.documento ?? '').toLowerCase().includes(termino) ||
        (cliente.telefono ?? '').toLowerCase().includes(termino) ||
        (cliente.direccion ?? '').toLowerCase().includes(termino);

      const coincideEstado =
        this.filtroEstado === 'todos' ||
        (this.filtroEstado === 'activos' && cliente.activo) ||
        (this.filtroEstado === 'inactivos' && !cliente.activo);

      return coincideTexto && coincideEstado;
    });
  }

  abrirNuevo(): void {
    this.mostrarFormulario = true;
    this.modoEdicion = false;
    this.clienteEditandoId = null;

    this.clienteNuevo = this.crearClienteVacio();

    this.limpiarMensajes();
  }

  editar(cliente: Cliente): void {
    this.mostrarFormulario = true;
    this.modoEdicion = true;
    this.clienteEditandoId = cliente.id;

    this.clienteNuevo = {
      id: cliente.id,
      nombre: cliente.nombre ?? '',
      documento: cliente.documento ?? '',
      telefono: cliente.telefono ?? '',
      direccion: cliente.direccion ?? '',
      activo: cliente.activo ?? true
    };

    this.limpiarMensajes();
  }

  cerrarFormulario(): void {
    if (this.guardando) {
      return;
    }

    this.mostrarFormulario = false;
    this.modoEdicion = false;
    this.clienteEditandoId = null;

    this.clienteNuevo = this.crearClienteVacio();
  }

  guardar(): void {
    this.limpiarMensajes();

    if (!this.validarFormulario()) {
      return;
    }

    this.guardando = true;

    const payload = {
      nombre: this.clienteNuevo.nombre.trim(),
      documento: this.clienteNuevo.documento.trim(),
      telefono: this.clienteNuevo.telefono.trim(),
      direccion: this.clienteNuevo.direccion.trim()
    };

    if (
      this.modoEdicion &&
      this.clienteEditandoId !== null
    ) {

      this.clienteService
        .actualizar(this.clienteEditandoId, payload)
        .subscribe({

          next: () => {
            this.mensaje = '';

            this.notification.success(
              'El cliente se actualizó correctamente.',
              'Cliente actualizado'
            );

            this.guardando = false;

            this.cerrarFormulario();
            this.cargarClientes();
          },

          error: (err: any) => {
            console.error(err);

            this.guardando = false;

            if (err.status === 409) {
              this.error = '';

              this.notification.warning(
                'Ya existe otro cliente registrado con ese documento.',
                'Cliente duplicado'
              );
            } else {
              this.error = this.obtenerMensajeError(
                err,
                'No fue posible actualizar el cliente.'
              );

              this.notification.error(
                this.error,
                'Error al actualizar'
              );
            }

            this.cdr.detectChanges();
          }
        });

      return;
    }

    this.clienteService.crear(payload).subscribe({

      next: () => {
        this.guardando = false;
        this.mostrarFormulario = false;
        this.mensaje = '';

        this.notification.success(
          'El cliente se registró correctamente.',
          'Cliente registrado'
        );

        this.cargarClientes();
      },

      error: (err: any) => {
        console.error(err);

        this.guardando = false;

        if (err.status === 409) {
          this.error =
            'Ya existe un cliente registrado con ese documento.';

          this.notification.warning(
            'Ya existe un cliente registrado con ese documento.',
            'Cliente duplicado'
          );
        } else {
          this.error = this.obtenerMensajeError(
            err,
            'No fue posible crear el cliente.'
          );

          this.notification.error(
            this.error,
            'Error al crear cliente'
          );
        }

        this.cdr.detectChanges();
      }
    });
  }

  confirmarEliminar(cliente: Cliente): void {
    this.clienteAEliminar = cliente;
    this.mostrarConfirmacionEliminar = true;

    this.limpiarMensajes();
  }

  cancelarEliminar(): void {
    if (this.eliminandoId !== null) {
      return;
    }

    this.mostrarConfirmacionEliminar = false;
    this.clienteAEliminar = null;
  }

  eliminar(): void {
    const id = this.clienteAEliminar?.id;

    if (!id) {
      return;
    }

    this.eliminandoId = id;
    this.error = '';

    this.clienteService.eliminar(id).subscribe({

      next: () => {
        this.mensaje = '';

        this.notification.success(
          'El cliente se eliminó correctamente.',
          'Cliente eliminado'
        );

        this.eliminandoId = null;
        this.mostrarConfirmacionEliminar = false;
        this.clienteAEliminar = null;

        this.cargarClientes();
      },

      error: (err: any) => {
        console.error(err);

        this.error = '';

        this.notification.error(
          this.obtenerMensajeError(
            err,
            'No se pudo eliminar el cliente.'
          ),
          'Error al eliminar'
        );

        this.eliminandoId = null;

        this.cdr.detectChanges();
      }
    });
  }

  limpiarFiltros(): void {
    this.terminoBusqueda = '';
    this.filtroEstado = 'todos';

    this.aplicarFiltros();
  }

  private validarFormulario(): boolean {
    const nombre = this.clienteNuevo.nombre.trim();
    const documento = this.clienteNuevo.documento.trim();

    if (!nombre) {
      this.error = 'El nombre del cliente es obligatorio.';
      return false;
    }

    if (!documento) {
      this.error = 'El documento del cliente es obligatorio.';
      return false;
    }

    return true;
  }

  private limpiarMensajes(): void {
    this.error = '';
    this.mensaje = '';
  }

  private obtenerMensajeError(
    err: any,
    mensajePorDefecto: string
  ): string {

    return err?.error?.message ||
      err?.error?.error ||
      (typeof err?.error === 'string'
        ? err.error
        : '') ||
      mensajePorDefecto;
  }

  trackById(
    index: number,
    cliente: Cliente
  ): number {
    return cliente.id ?? index;
  }
}
