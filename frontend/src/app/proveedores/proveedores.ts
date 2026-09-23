import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';
import { NotificationService } from '../shared/services/notification.service';

interface Proveedor {
  id?: number;
  nombre: string;
  nit: string;
  telefono: string;
  correo: string;
  direccion: string;
  activo: boolean;
}

@Component({
  selector: 'app-proveedores',
  standalone: true,

  imports: [
    CommonModule,
    FormsModule
  ],

  templateUrl: './proveedores.html',
  styleUrl: './proveedores.css'
})
export class ProveedoresComponent implements OnInit {

  private readonly API_URL = 'http://localhost:8080/proveedores';

  proveedores: Proveedor[] = [];
  proveedoresVisibles: Proveedor[] = [];

  cargando = false;
  guardando = false;
  eliminandoId: number | null = null;

  error = '';
  mensaje = '';

  terminoBusqueda = '';
  filtroEstado = 'todos';

  mostrarFormulario = false;
  modoEdicion = false;
  proveedorEditandoId: number | null = null;

  mostrarConfirmacionEliminar = false;
  proveedorAEliminar: Proveedor | null = null;

  proveedorNuevo: Proveedor = this.crearProveedorVacio();

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
  private notification: NotificationService
  ) {}

  ngOnInit(): void {
    this.cargarProveedores();
  }

  private crearProveedorVacio(): Proveedor {
    return {
      nombre: '',
      nit: '',
      telefono: '',
      correo: '',
      direccion: '',
      activo: true
    };
  }

  cargarProveedores(): void {

    this.cargando = true;
    this.error = '';

    this.cdr.detectChanges();

    this.http.get<Proveedor[]>(this.API_URL).subscribe({

      next: (data) => {

        this.proveedores = data ?? [];

        this.aplicarFiltros();

        this.cargando = false;

        this.cdr.detectChanges();

      },

      error: (err) => {

        console.error(
          'ERROR AL CARGAR PROVEEDORES:',
          err
        );

        this.error = this.obtenerMensajeError(
          err,
          'No fue posible cargar los proveedores.'
        );

        this.cargando = false;

        this.cdr.detectChanges();

      }

    });
  }

  aplicarFiltros(): void {
    const termino = this.terminoBusqueda.trim().toLowerCase();

    this.proveedoresVisibles = this.proveedores.filter((proveedor) => {
      const coincideTexto =
        !termino ||
        (proveedor.nombre ?? '').toLowerCase().includes(termino) ||
        (proveedor.nit ?? '').toLowerCase().includes(termino) ||
        (proveedor.telefono ?? '').toLowerCase().includes(termino) ||
        (proveedor.correo ?? '').toLowerCase().includes(termino);

      const coincideEstado =
        this.filtroEstado === 'todos' ||
        (this.filtroEstado === 'activos' && proveedor.activo) ||
        (this.filtroEstado === 'inactivos' && !proveedor.activo);

      return coincideTexto && coincideEstado;
    });
  }

  abrirNuevo(): void {
    this.mostrarFormulario = true;
    this.modoEdicion = false;
    this.proveedorEditandoId = null;
    this.proveedorNuevo = this.crearProveedorVacio();
    this.limpiarMensajes();
  }

  editar(proveedor: Proveedor): void {
    this.mostrarFormulario = true;
    this.modoEdicion = true;
    this.proveedorEditandoId = proveedor.id ?? null;
    this.proveedorNuevo = {
      id: proveedor.id,
      nombre: proveedor.nombre ?? '',
      nit: proveedor.nit ?? '',
      telefono: proveedor.telefono ?? '',
      correo: proveedor.correo ?? '',
      direccion: proveedor.direccion ?? '',
      activo: proveedor.activo ?? true
    };
    this.limpiarMensajes();
  }

  cerrarFormulario(): void {
    if (this.guardando) return;

    this.mostrarFormulario = false;
    this.modoEdicion = false;
    this.proveedorEditandoId = null;
    this.proveedorNuevo = this.crearProveedorVacio();
  }

  guardar(): void {
    this.limpiarMensajes();

    if (!this.validarFormulario()) {
      return;
    }

    this.guardando = true;

    const payload = {
      nombre: this.proveedorNuevo.nombre.trim(),
      nit: this.proveedorNuevo.nit.trim(),
      telefono: this.proveedorNuevo.telefono.trim(),
      correo: this.proveedorNuevo.correo.trim(),
      direccion: this.proveedorNuevo.direccion.trim()
    };

    if (this.modoEdicion && this.proveedorEditandoId !== null) {
      this.http.put<Proveedor>(
        `${this.API_URL}/${this.proveedorEditandoId}`,
        payload
      ).subscribe({
        next: () => {
          this.mensaje = '';

          this.notification.success(
            'El proveedor se actualizó correctamente.',
            'Proveedor actualizado'
          );
          this.guardando = false;
          this.cerrarFormulario();
          this.cargarProveedores();
        },
        error: (err) => {
          console.error(err);

          if (err.status === 409) {

            this.error = '';

            this.notification.warning(
              'Ya existe otro proveedor registrado con ese NIT.',
              'Proveedor duplicado'
            );

          } else {

            this.error = this.obtenerMensajeError(
              err,
              'No fue posible actualizar el proveedor.'
            );

          }

          this.guardando = false;
          this.cdr.detectChanges();
        }
      });
      return;
    }

    this.http.post<Proveedor>(this.API_URL, payload).subscribe({
      next: (respuesta) => {
        this.guardando = false;
        this.mostrarFormulario = false;
        this.mensaje = '';

        this.notification.success(
          'El proveedor se registró correctamente.',
          'Proveedor registrado'
        );

        this.cargarProveedores();
      },
      error: (err) => {
        console.error(err);
        this.error = this.obtenerMensajeError(err, 'No fue posible crear el proveedor.');
        this.guardando = false;
      }
    });
  }

  confirmarEliminar(proveedor: Proveedor): void {
    this.proveedorAEliminar = proveedor;
    this.mostrarConfirmacionEliminar = true;
    this.limpiarMensajes();
  }

  cancelarEliminar(): void {
    if (this.eliminandoId !== null) return;

    this.mostrarConfirmacionEliminar = false;
    this.proveedorAEliminar = null;
  }

  eliminar(): void {
    const id = this.proveedorAEliminar?.id;

    if (id === undefined) return;

    this.eliminandoId = id;
    this.error = '';

    this.http.delete<void>(`${this.API_URL}/${id}`).subscribe({
      next: () => {
        this.mensaje = '';

        this.notification.success(
          'El proveedor se eliminó correctamente.',
          'Proveedor eliminado'
        );
        this.eliminandoId = null;
        this.mostrarConfirmacionEliminar = false;
        this.proveedorAEliminar = null;
        this.cargarProveedores();
      },
      error: (err) => {
        console.error(err);
        this.error = '';

        this.notification.error(
          'No se pudo eliminar el proveedor.',
          'Error al eliminar'
        );
        this.eliminandoId = null;
      }
    });
  }

  limpiarFiltros(): void {
    this.terminoBusqueda = '';
    this.filtroEstado = 'todos';
    this.aplicarFiltros();
  }

  private validarFormulario(): boolean {
    const nombre = this.proveedorNuevo.nombre.trim();
    const nit = this.proveedorNuevo.nit.trim();
    const correo = this.proveedorNuevo.correo.trim();

    if (!nombre) {
      this.error = 'El nombre del proveedor es obligatorio.';
      return false;
    }

    if (!nit) {
      this.error = 'El NIT es obligatorio.';
      return false;
    }

    if (correo && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
      this.error = 'El correo electrónico no tiene un formato válido.';
      return false;
    }

    return true;
  }

  private limpiarMensajes(): void {
    this.error = '';
    this.mensaje = '';
  }

  private obtenerMensajeError(err: any, mensajePorDefecto: string): string {
    return err?.error?.message ||
      err?.error?.error ||
      (typeof err?.error === 'string' ? err.error : '') ||
      mensajePorDefecto;
  }

  trackById(index: number, proveedor: Proveedor): number {
    return proveedor.id ?? index;
  }
}
