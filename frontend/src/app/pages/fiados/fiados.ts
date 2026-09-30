import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';

import {
  Fiado,
  FiadoDetalle,
  FiadoService
} from '../../services/fiado';

import { NotificationService } from '../../shared/services/notification.service';

@Component({
  selector: 'app-fiados',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './fiados.html',
  styleUrl: './fiados.css'
})
export class Fiados implements OnInit {

  fiados: Fiado[] = [];
  fiadosVisibles: Fiado[] = [];

  cargando = false;
  guardandoAbono = false;

  error = '';
  terminoBusqueda = '';
  filtroEstado = 'todos';

  mostrarDetalle = false;
  fiadoSeleccionado: FiadoDetalle | null = null;

  valorAbono = 0;

  paginaActual = 1;
  elementosPorPagina = 10;

  constructor(
    private fiadoService: FiadoService,
    private cdr: ChangeDetectorRef,
    private notification: NotificationService
  ) {}

  ngOnInit(): void {
    this.cargarFiados();
  }

  cargarFiados(): void {
    this.cargando = true;
    this.error = '';
    this.cdr.detectChanges();

    this.fiadoService.listar().subscribe({
      next: (data: Fiado[]) => {
        this.fiados = data ?? [];
        this.paginaActual = 1;
        this.aplicarFiltros();
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('ERROR AL CARGAR FIADOS:', err);

        this.error = this.obtenerMensajeError(
          err,
          'No fue posible cargar los fiados.'
        );

        this.cargando = false;

        this.notification.error(
          this.error,
          'Error al cargar fiados'
        );

        this.cdr.detectChanges();
      }
    });
  }

  aplicarFiltros(): void {
    const termino = this.terminoBusqueda
      .trim()
      .toLowerCase();

    this.fiadosVisibles = this.fiados.filter((fiado) => {
      const coincideTexto =
        !termino ||
        (fiado.nombreCliente ?? '').toLowerCase().includes(termino) ||
        String(fiado.id).includes(termino) ||
        String(fiado.ventaId ?? '').includes(termino);

      const estado = (fiado.estado ?? '').toUpperCase();

      const coincideEstado =
        this.filtroEstado === 'todos' ||
        (this.filtroEstado === 'pendientes' && estado === 'PENDIENTE') ||
        (this.filtroEstado === 'pagados' && estado === 'PAGADO');

      return coincideTexto && coincideEstado;
    });

    const totalPaginas = this.totalPaginas;

    if (this.paginaActual > totalPaginas) {
      this.paginaActual = totalPaginas;
    }

    if (this.paginaActual < 1) {
      this.paginaActual = 1;
    }
  }

  get totalFiado(): number {
    return this.fiados.reduce(
      (total, fiado) => total + Number(fiado.valorOriginal || 0),
      0
    );
  }

  get totalAbonado(): number {
    return this.fiados.reduce(
      (total, fiado) => total + Number(fiado.valorAbonado || 0),
      0
    );
  }

  get saldoPendiente(): number {
    return this.fiados.reduce(
      (total, fiado) => total + Number(fiado.saldoPendiente || 0),
      0
    );
  }

  get cantidadPendientes(): number {
    return this.fiados.filter(
      fiado => (fiado.estado ?? '').toUpperCase() === 'PENDIENTE'
    ).length;
  }

  get fiadosPaginados(): Fiado[] {
    const inicio = (this.paginaActual - 1) * this.elementosPorPagina;

    return this.fiadosVisibles.slice(
      inicio,
      inicio + this.elementosPorPagina
    );
  }

  get totalPaginas(): number {
    return Math.max(
      1,
      Math.ceil(
        this.fiadosVisibles.length / this.elementosPorPagina
      )
    );
  }

  get inicioPagina(): number {
    if (!this.fiadosVisibles.length) {
      return 0;
    }

    return (this.paginaActual - 1) * this.elementosPorPagina + 1;
  }

  get finPagina(): number {
    return Math.min(
      this.paginaActual * this.elementosPorPagina,
      this.fiadosVisibles.length
    );
  }

  cambiarPagina(pagina: number): void {
    if (pagina < 1 || pagina > this.totalPaginas) {
      return;
    }

    this.paginaActual = pagina;
  }

  abrirDetalle(fiado: Fiado): void {
    this.error = '';
    this.fiadoSeleccionado = null;
    this.mostrarDetalle = true;
    this.valorAbono = 0;

    this.fiadoService.obtenerDetalle(fiado.id).subscribe({
      next: (detalle: FiadoDetalle) => {
        this.fiadoSeleccionado = detalle;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('ERROR AL CARGAR DETALLE DEL FIADO:', err);

        this.mostrarDetalle = false;

        this.notification.error(
          this.obtenerMensajeError(
            err,
            'No fue posible cargar el detalle del fiado.'
          ),
          'Error'
        );

        this.cdr.detectChanges();
      }
    });
  }

  cerrarDetalle(): void {
    if (this.guardandoAbono) {
      return;
    }

    this.mostrarDetalle = false;
    this.fiadoSeleccionado = null;
    this.valorAbono = 0;
    this.error = '';
  }

  registrarAbono(): void {
    if (!this.fiadoSeleccionado) {
      return;
    }

    const valor = Number(this.valorAbono || 0);
    const saldo = Number(
      this.fiadoSeleccionado.saldoPendiente || 0
    );

    if (valor <= 0) {
      this.notification.warning(
        'Ingresa un valor de abono mayor que cero.',
        'Abono inválido'
      );
      return;
    }

    if (valor > saldo) {
      this.notification.warning(
        'El abono no puede ser mayor que el saldo pendiente.',
        'Abono inválido'
      );
      return;
    }

    this.guardandoAbono = true;

    this.fiadoService
      .registrarAbono(this.fiadoSeleccionado.id, valor)
      .subscribe({
        next: () => {
          this.notification.success(
            'El abono se registró correctamente.',
            'Abono registrado'
          );

          this.guardandoAbono = false;
          this.valorAbono = 0;

          this.cargarFiados();
          this.recargarDetalle(this.fiadoSeleccionado!.id);
        },
        error: (err: any) => {
          console.error('ERROR AL REGISTRAR ABONO:', err);

          this.guardandoAbono = false;

          this.notification.error(
            this.obtenerMensajeError(
              err,
              'No fue posible registrar el abono.'
            ),
            'Error al registrar abono'
          );

          this.cdr.detectChanges();
        }
      });
  }

  private recargarDetalle(fiadoId: number): void {
    this.fiadoService.obtenerDetalle(fiadoId).subscribe({
      next: (detalle: FiadoDetalle) => {
        this.fiadoSeleccionado = detalle;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('ERROR AL ACTUALIZAR DETALLE:', err);
        this.cdr.detectChanges();
      }
    });
  }

  limpiarFiltros(): void {
    this.terminoBusqueda = '';
    this.filtroEstado = 'todos';
    this.paginaActual = 1;
    this.aplicarFiltros();
  }

  formatearMoneda(valor: number | null | undefined): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0
    }).format(Number(valor || 0));
  }

  formatearFecha(fecha: string | null | undefined): string {
    if (!fecha) {
      return '-';
    }

    const fechaObj = new Date(fecha);

    if (Number.isNaN(fechaObj.getTime())) {
      return '-';
    }

    return new Intl.DateTimeFormat('es-CO', {
      dateStyle: 'short',
      timeStyle: 'short'
    }).format(fechaObj);
  }

  esPagado(fiado: Fiado): boolean {
    return (fiado.estado ?? '').toUpperCase() === 'PAGADO';
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

  trackById(index: number, fiado: Fiado): number {
    return fiado.id ?? index;
  }
}
