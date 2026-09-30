import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  CajaService,
  Caja,
  CajaResumen,
  CajaDetalle
} from '../../services/caja.service';
import { VentaService, VentaResponse } from '../../services/ventas';

@Component({
  selector: 'app-caja',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './caja.html',
  styleUrl: './caja.css'
})
export class CajaComponent implements OnInit {

  cajaActual: Caja | null = null;
  resumen: CajaResumen | null = null;

  cantidadVentas = 0;
  totalVentas = 0;
  ventasContado = 0;
  ventasFiado = 0;
  historial: Caja[] = [];

  cajaSeleccionada: CajaDetalle | null = null;

  cargando = true;
  cargandoHistorial = false;
  procesando = false;

  error = '';
  mensaje = '';

  montoInicial = 0;
  montoFinal = 0;

  mostrarModalAbrir = false;
  mostrarModalCerrar = false;
  mostrarModalDetalle = false;

  paginaActual = 1;
  cajasPorPagina = 8;

  constructor(
    private cajaService: CajaService,
    private ventaService: VentaService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarCaja();
    this.cargarHistorial();
    this.cargarVentasDelDia();
  }

  cargarVentasDelDia(): void {
    this.ventaService.listar().subscribe({
      next: (ventas: VentaResponse[]) => {
        const ventasDelDia = (ventas || []).filter(
          venta => this.esVentaDeHoy(venta.fecha)
        );

        this.cantidadVentas = ventasDelDia.length;

        this.totalVentas = ventasDelDia.reduce(
          (total, venta) => total + Number(venta.total || 0),
          0
        );

        this.ventasContado = ventasDelDia
          .filter(venta => this.obtenerTipoPago(venta) === 'CONTADO')
          .reduce((total, venta) => total + Number(venta.total || 0), 0);

        this.ventasFiado = ventasDelDia
          .filter(venta => this.obtenerTipoPago(venta) === 'FIADO')
          .reduce((total, venta) => total + Number(venta.total || 0), 0);

        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('ERROR CARGANDO VENTAS DEL DÍA:', error);
        this.cantidadVentas = 0;
        this.totalVentas = 0;
        this.ventasContado = 0;
        this.ventasFiado = 0;
      }
    });
  }

  esVentaDeHoy(fecha: any): boolean {
    if (!fecha) return false;

    const fechaVenta = new Date(fecha);
    if (Number.isNaN(fechaVenta.getTime())) return false;

    const hoy = new Date();

    return (
      fechaVenta.getFullYear() === hoy.getFullYear() &&
      fechaVenta.getMonth() === hoy.getMonth() &&
      fechaVenta.getDate() === hoy.getDate()
    );
  }

  obtenerTipoPago(venta: any): string {
    const tipo =
      venta?.tipoPago ??
      venta?.metodoPago ??
      venta?.formaPago ??
      venta?.pago;

    return String(tipo || '').toUpperCase();
  }

  cargarCaja(): void {
    this.cargando = true;
    this.error = '';
    this.mensaje = '';

    this.cajaService.obtenerActual().subscribe({
      next: (caja) => {
        this.cajaActual = caja;
        this.cargarResumen();
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.cajaActual = null;
        this.resumen = null;
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  cargarResumen(): void {
    if (!this.cajaActual) {
      this.resumen = null;
      return;
    }

    this.cajaService.obtenerResumenHoy().subscribe({
      next: (resumen) => {
        this.resumen = resumen;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('ERROR CARGANDO RESUMEN DE CAJA:', error);
        this.resumen = null;
      }
    });
  }

  cargarHistorial(): void {
    this.cargandoHistorial = true;

    this.cajaService.listar().subscribe({
      next: (cajas) => {
        this.historial = cajas || [];
        this.cargandoHistorial = false;
        this.ajustarPagina();
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('ERROR CARGANDO HISTORIAL DE CAJA:', error);
        this.historial = [];
        this.cargandoHistorial = false;
      }
    });
  }

  abrirModalAbrir(): void {
    this.error = '';
    this.mensaje = '';
    this.montoInicial = 0;
    this.mostrarModalAbrir = true;
  }

  cerrarModalAbrir(): void {
    if (!this.procesando) {
      this.mostrarModalAbrir = false;
    }
  }

  abrirModalCerrar(): void {
    if (!this.cajaActual) return;

    this.error = '';
    this.mensaje = '';
    this.montoFinal = 0;
    this.mostrarModalCerrar = true;
  }

  cerrarModalCerrar(): void {
    if (!this.procesando) {
      this.mostrarModalCerrar = false;
    }
  }

  confirmarAbrirCaja(): void {
    if (this.montoInicial < 0 || !Number.isFinite(this.montoInicial)) {
      this.error = 'Ingrese un monto inicial válido.';
      return;
    }

    this.procesando = true;
    this.error = '';

    this.cajaService.abrirCaja(this.montoInicial).subscribe({
      next: (caja) => {
        this.cajaActual = caja;
        this.mostrarModalAbrir = false;
        this.procesando = false;
        this.mensaje = 'La caja fue abierta correctamente.';
        this.cargarResumen();
        this.cargarHistorial();
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('ERROR ABRIENDO CAJA:', error);
        this.procesando = false;
        this.error = this.obtenerMensajeError(error, 'No fue posible abrir la caja.');
      }
    });
  }

  confirmarCerrarCaja(): void {
    if (!this.cajaActual) return;

    if (this.montoFinal < 0 || !Number.isFinite(this.montoFinal)) {
      this.error = 'Ingrese un monto final válido.';
      return;
    }

    this.procesando = true;
    this.error = '';

    this.cajaService.cerrarCaja(this.montoFinal).subscribe({
      next: () => {
        this.mostrarModalCerrar = false;
        this.procesando = false;
        this.mensaje = 'La caja fue cerrada correctamente.';

        // Volvemos a consultar la caja actual para que la pantalla
        // se actualice automáticamente, sin necesidad de pulsar "Actualizar".
        this.cargarCaja();
        this.cargarHistorial();
      },
      error: (error) => {
        console.error('ERROR CERRANDO CAJA:', error);
        this.procesando = false;
        this.error = this.obtenerMensajeError(error, 'No fue posible cerrar la caja.');
      }
    });
  }

  verDetalle(caja: Caja): void {
    this.error = '';

    this.cajaService.obtenerDetalle(caja.id).subscribe({
      next: (detalle) => {
        this.cajaSeleccionada = detalle;
        this.mostrarModalDetalle = true;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('ERROR OBTENIENDO DETALLE DE CAJA:', error);
        this.error = this.obtenerMensajeError(
          error,
          'No fue posible obtener el detalle de la caja.'
        );
      }
    });
  }

  cerrarDetalle(): void {
    this.mostrarModalDetalle = false;
    this.cajaSeleccionada = null;
  }

  refrescar(): void {
    this.cargarCaja();
    this.cargarHistorial();
  }

  formatearMonto(valor: number | null | undefined): string {
    const numero = Number(valor || 0);

    return new Intl.NumberFormat('es-CO', {
      maximumFractionDigits: 0
    }).format(numero);
  }

  actualizarMontoInicial(event: Event): void {
    const input = event.target as HTMLInputElement;
    const digitos = input.value.replace(/\D/g, '');
    this.montoInicial = digitos ? Number(digitos) : 0;
  }

  actualizarMontoFinal(event: Event): void {
    const input = event.target as HTMLInputElement;
    const digitos = input.value.replace(/\D/g, '');
    this.montoFinal = digitos ? Number(digitos) : 0;
  }

  get totalRecibido(): number {
    return Number(this.resumen?.totalRecibido || 0);
  }

  get montoEsperadoActual(): number {
    if (!this.cajaActual) return 0;

    return (
      Number(this.cajaActual.montoInicial || 0) +
      Number(this.resumen?.ventasContado || 0) +
      Number(this.resumen?.abonosFiados || 0)
    );
  }

  get diferenciaActual(): number | null {
    if (!this.cajaActual?.montoFinal && this.cajaActual?.montoFinal !== 0) {
      return null;
    }

    return Number(this.cajaActual.montoFinal) - this.montoEsperadoActual;
  }

  get cajasPaginadas(): Caja[] {
    const inicio = (this.paginaActual - 1) * this.cajasPorPagina;
    return this.historial.slice(inicio, inicio + this.cajasPorPagina);
  }

  get totalPaginas(): number {
    return Math.max(1, Math.ceil(this.historial.length / this.cajasPorPagina));
  }

  get paginas(): number[] {
    return Array.from({ length: this.totalPaginas }, (_, i) => i + 1);
  }

  cambiarPagina(pagina: number): void {
    if (pagina < 1 || pagina > this.totalPaginas) return;
    this.paginaActual = pagina;
  }

  ajustarPagina(): void {
    if (this.paginaActual > this.totalPaginas) {
      this.paginaActual = this.totalPaginas;
    }
  }

  obtenerClaseResultado(resultado: string | null | undefined): string {
    switch (resultado) {
      case 'CUADRADA':
        return 'resultado-cuadrada';
      case 'SOBRANTE':
        return 'resultado-sobrante';
      case 'FALTANTE':
        return 'resultado-faltante';
      default:
        return 'resultado-pendiente';
    }
  }

  obtenerClaseEstado(estado: string | null | undefined): string {
    return estado === 'ABIERTA'
      ? 'estado-abierta'
      : 'estado-cerrada';
  }

  private obtenerMensajeError(error: any, mensajePorDefecto: string): string {
    return (
      error?.error?.message ||
      error?.error?.error ||
      error?.message ||
      mensajePorDefecto
    );
  }
}
