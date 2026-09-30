import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  VentaService,
  VentaResponse
} from '../../services/ventas';

import {
  DevolucionesVentaService,
  DevolucionVentaRequest
} from '../../services/devoluciones-venta';

import {
  DevolucionesCompraService,
  DevolucionCompraRequest,
  DevolucionCompraResponse
} from '../../services/devoluciones-compra';

import {
  CompraService,
  CompraResponse
} from '../../services/compra.service';

import {
  CajaService,
  Caja,
  CajaResumen,
  CajaDetalle
} from '../../services/caja.service';




@Component({
  selector: 'app-balance',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './balance.html',
  styleUrl: './balance.css'
})
export class Balance implements OnInit {

  // =========================
  // VENTAS
  // =========================
  Math = Math;
  Number = Number;


  ventas: VentaResponse[] = [];

  cargando = false;
  error = '';

  totalVentas = 0;
  cantidadVentas = 0;
  ventasContado = 0;
  ventasFiado = 0;

  // Fecha que representa el balance mostrado.
  fechaBalance = new Date();

  ventaSeleccionada: VentaResponse | null = null;
  mostrarDetalleVenta = false;
  detalleDevolucionSeleccionado: any = null;
  mostrarDevolucion = false;

  cantidadDevolucion = 1;
  motivoDevolucion = '';

  procesandoDevolucion = false;
  errorDevolucion = '';


  // =========================
  // CAJA
  // =========================

  caja: Caja | null = null;

  resumenCaja: CajaResumen | null = null;

  cargandoCaja = false;

  procesandoCaja = false;

  montoInicial = 0;

  montoFinal = 0;

  errorCaja = '';

  mensajeCaja = '';
  // =========================
// CONFIRMACIÓN DE CAJA
// =========================

  mostrarConfirmacionCaja = false;

  tipoConfirmacionCaja: 'ABRIR' | 'CERRAR' | null = null;

  historialCajas: Caja[] = [];

  cargandoHistorialCajas = false;

  cajaSeleccionada: CajaDetalle | null = null;

  cargandoDetalleCaja = false;



// =========================
// PAGINACIÓN
// =========================

  cajasPaginaActual = 1;
  cajasPorPagina = 10;

  ventasPaginaActual = 1;
  ventasPorPagina = 10;

  // =========================
  // COMPRAS DEL DÍA
  // =========================

  compras: CompraResponse[] = [];
  comprasPaginaActual = 1;
  comprasPorPagina = 10;

  // Devoluciones ya registradas. Se usan para calcular cuántas unidades
  // de una compra todavía se pueden devolver. No se muestran en Balance.
  devolucionesCompra: DevolucionCompraResponse[] = [];

  compraSeleccionada: CompraResponse | null = null;
  mostrarDetalleCompra = false;

  detalleDevolucionCompraSeleccionado: any = null;
  mostrarDevolucionCompra = false;
  cantidadDevolucionCompra = 1;
  motivoDevolucionCompra = '';
  procesandoDevolucionCompra = false;
  errorDevolucionCompra = '';


// =========================
// PAGINACIÓN CAJAS
// =========================

  get totalPaginasCajas(): number {
    return Math.ceil(
      this.historialCajas.length / this.cajasPorPagina
    );
  }

  get paginasCajas(): number[] {
    return Array.from(
      { length: this.totalPaginasCajas },
      (_, i) => i + 1
    );
  }

  get historialCajasPaginadas(): Caja[] {

    const inicio =
      (this.cajasPaginaActual - 1) *
      this.cajasPorPagina;

    return this.historialCajas.slice(
      inicio,
      inicio + this.cajasPorPagina
    );
  }

  cambiarPaginaCajas(pagina: number): void {

    if (
      pagina < 1 ||
      pagina > this.totalPaginasCajas
    ) {
      return;
    }

    this.cajasPaginaActual = pagina;
  }


// =========================
// PAGINACIÓN VENTAS
// =========================

  get totalPaginasVentas(): number {
    return Math.ceil(
      this.ventas.length / this.ventasPorPagina
    );
  }

  get paginasVentas(): number[] {
    return Array.from(
      { length: this.totalPaginasVentas },
      (_, i) => i + 1
    );
  }

  get ventasPaginadas(): VentaResponse[] {

    const inicio =
      (this.ventasPaginaActual - 1) *
      this.ventasPorPagina;

    return this.ventas.slice(
      inicio,
      inicio + this.ventasPorPagina
    );
  }

  cambiarPaginaVentas(pagina: number): void {

    if (
      pagina < 1 ||
      pagina > this.totalPaginasVentas
    ) {
      return;
    }

    this.ventasPaginaActual = pagina;
  }

  // =========================
  // PAGINACIÓN COMPRAS
  // =========================

  get totalPaginasCompras(): number {
    return Math.ceil(
      this.compras.length / this.comprasPorPagina
    );
  }

  get paginasCompras(): number[] {
    return Array.from(
      { length: this.totalPaginasCompras },
      (_, i) => i + 1
    );
  }

  get comprasPaginadas(): CompraResponse[] {
    const inicio =
      (this.comprasPaginaActual - 1) *
      this.comprasPorPagina;

    return this.compras.slice(
      inicio,
      inicio + this.comprasPorPagina
    );
  }

  cambiarPaginaCompras(pagina: number): void {
    if (
      pagina < 1 ||
      pagina > this.totalPaginasCompras
    ) {
      return;
    }

    this.comprasPaginaActual = pagina;
  }

  esCompraDeHoy(fecha: any): boolean {
    if (!fecha) {
      return false;
    }

    const fechaCompra = new Date(fecha);

    if (Number.isNaN(fechaCompra.getTime())) {
      return false;
    }

    const hoy = new Date();

    return (
      fechaCompra.getFullYear() === hoy.getFullYear()
      && fechaCompra.getMonth() === hoy.getMonth()
      && fechaCompra.getDate() === hoy.getDate()
    );
  }

  obtenerTotalCompra(compra: CompraResponse): number {
    return (compra.detalles || []).reduce(
      (total, detalle) =>
        total + Number(detalle.cantidad || 0) * Number(detalle.precioCompra || 0),
      0
    );
  }

  obtenerCantidadProductosCompra(compra: CompraResponse): number {
    return (compra.detalles || []).reduce(
      (total, detalle) => total + Number(detalle.cantidad || 0),
      0
    );
  }

  verDetalleCompra(compra: CompraResponse): void {
    this.compraSeleccionada = compra;
    this.mostrarDetalleCompra = true;
    this.cdr.detectChanges();
  }

  cerrarDetalleCompra(): void {
    this.mostrarDetalleCompra = false;
    this.compraSeleccionada = null;
    this.cdr.detectChanges();
  }

  obtenerCantidadDisponibleCompra(
    compra: CompraResponse,
    detalle: any
  ): number {
    const devuelto = this.devolucionesCompra
      .filter(
        devolucion =>
          Number(devolucion.compraId) === Number(compra.id)
          && Number(devolucion.productoId) === Number(detalle.productoId)
      )
      .reduce(
        (total, devolucion) =>
          total + Number(devolucion.cantidad || 0),
        0
      );

    return Math.max(
      0,
      Number(detalle.cantidad || 0) - devuelto
    );
  }

  abrirDevolucionCompra(detalle: any): void {
    if (!this.compraSeleccionada) {
      return;
    }

    const disponible = this.obtenerCantidadDisponibleCompra(
      this.compraSeleccionada,
      detalle
    );

    if (disponible <= 0) {
      this.errorDevolucionCompra =
        'Este producto ya fue devuelto en su totalidad para esta compra.';
      return;
    }

    this.detalleDevolucionCompraSeleccionado = detalle;
    this.cantidadDevolucionCompra = 1;
    this.motivoDevolucionCompra = '';
    this.errorDevolucionCompra = '';
    this.mostrarDevolucionCompra = true;
    this.cdr.detectChanges();
  }

  cerrarDevolucionCompra(): void {
    this.mostrarDevolucionCompra = false;
    this.detalleDevolucionCompraSeleccionado = null;
    this.cantidadDevolucionCompra = 1;
    this.motivoDevolucionCompra = '';
    this.errorDevolucionCompra = '';
    this.procesandoDevolucionCompra = false;
    this.cdr.detectChanges();
  }

  confirmarDevolucionCompra(): void {
    if (!this.compraSeleccionada || !this.detalleDevolucionCompraSeleccionado) {
      return;
    }

    const cantidad = Number(this.cantidadDevolucionCompra);
    const disponible = this.obtenerCantidadDisponibleCompra(
      this.compraSeleccionada,
      this.detalleDevolucionCompraSeleccionado
    );

    if (!cantidad || cantidad <= 0) {
      this.errorDevolucionCompra =
        'La cantidad debe ser mayor que cero.';
      return;
    }

    if (cantidad > disponible) {
      this.errorDevolucionCompra =
        `Solo puedes devolver ${disponible} unidad(es) de este producto.`;
      return;
    }

    if (!this.motivoDevolucionCompra.trim()) {
      this.errorDevolucionCompra =
        'Debes indicar el motivo de la devolución.';
      return;
    }

    const request: DevolucionCompraRequest = {
      compraId: this.compraSeleccionada.id,
      productoId: this.detalleDevolucionCompraSeleccionado.productoId,
      cantidad,
      motivo: this.motivoDevolucionCompra.trim()
    };

    this.procesandoDevolucionCompra = true;
    this.errorDevolucionCompra = '';

    this.devolucionesCompraService
      .devolverProducto(request)
      .subscribe({
        next: () => {
          this.procesandoDevolucionCompra = false;
          this.cerrarDevolucionCompra();
          this.cargarCompras();
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error(
            'ERROR DEVOLVIENDO PRODUCTO DE COMPRA:',
            error
          );

          this.procesandoDevolucionCompra = false;
          this.errorDevolucionCompra =
            error?.error?.message
            || error?.error?.error
            || 'No fue posible realizar la devolución de compra.';

          this.cdr.detectChanges();
        }
      });
  }


  // =========================
// DETALLE DE VENTA
// =========================

  verDetalleVenta(venta: VentaResponse): void {
    this.ventaSeleccionada = venta;
    this.mostrarDetalleVenta = true;

    this.cdr.detectChanges();
  }

  cerrarDetalleVenta(): void {
    this.mostrarDetalleVenta = false;
    this.ventaSeleccionada = null;

    this.cdr.detectChanges();
  }

  // =========================
// DEVOLUCIONES
// =========================

  abrirDevolucion(detalle: any): void {

    this.detalleDevolucionSeleccionado = detalle;

    this.cantidadDevolucion = 1;

    this.motivoDevolucion = '';

    this.errorDevolucion = '';

    this.mostrarDevolucion = true;

    this.cdr.detectChanges();
  }


  cerrarDevolucion(): void {

    this.mostrarDevolucion = false;

    this.detalleDevolucionSeleccionado = null;

    this.cantidadDevolucion = 1;

    this.motivoDevolucion = '';

    this.errorDevolucion = '';

    this.procesandoDevolucion = false;

    this.cdr.detectChanges();
  }


  confirmarDevolucion(): void {

    if (!this.ventaSeleccionada || !this.detalleDevolucionSeleccionado) {
      return;
    }

    const cantidad = Number(this.cantidadDevolucion);

    if (!cantidad || cantidad <= 0) {

      this.errorDevolucion =
        'La cantidad debe ser mayor que cero.';

      return;
    }

    if (cantidad > this.detalleDevolucionSeleccionado.cantidad) {

      this.errorDevolucion =
        `No puedes devolver más de ${this.detalleDevolucionSeleccionado.cantidad} unidad(es).`;

      return;
    }

    if (!this.motivoDevolucion.trim()) {

      this.errorDevolucion =
        'Debes indicar el motivo de la devolución.';

      return;
    }

    const request: DevolucionVentaRequest = {

      ventaId: this.ventaSeleccionada.id,

      productoId:
      this.detalleDevolucionSeleccionado.productoId,

      cantidad: cantidad,

      motivo: this.motivoDevolucion.trim()
    };

    this.procesandoDevolucion = true;

    this.errorDevolucion = '';

    this.devolucionesVentaService
      .devolverProducto(request)
      .subscribe({

        next: (respuesta) => {

          console.log(
            'DEVOLUCIÓN REALIZADA:',
            respuesta
          );

          this.procesandoDevolucion = false;

          this.cerrarDevolucion();

          this.cargarBalance();
          this.cargarCaja();

          this.cdr.detectChanges();

        },

        error: (error) => {

          console.error(
            'ERROR DEVOLVIENDO PRODUCTO:',
            error
          );

          this.procesandoDevolucion = false;

          this.errorDevolucion =
            error?.error?.message ||
            'No fue posible realizar la devolución.';

          this.cdr.detectChanges();

        }

      });
  }




  // =========================
  // CONSTRUCTOR
  // =========================

  constructor(
    private ventaService: VentaService,
    private cajaService: CajaService,
    private devolucionesVentaService: DevolucionesVentaService,
    private devolucionesCompraService: DevolucionesCompraService,
    private compraService: CompraService,

    private cdr: ChangeDetectorRef
  ) {}


  // =========================
  // INIT
  // =========================

  ngOnInit(): void {
    this.cargarBalance();
    this.cargarCaja();
    this.cargarHistorialCajas();
    this.cargarCompras();
    this.cargarDevolucionesCompra();
  }


  // =========================
  // BALANCE DEL DÍA
  // =========================

  esVentaDeHoy(fecha: any): boolean {

    if (!fecha) {
      return false;
    }

    const fechaVenta = new Date(fecha);

    if (Number.isNaN(fechaVenta.getTime())) {
      return false;
    }

    const hoy = new Date();

    return (
      fechaVenta.getFullYear() === hoy.getFullYear()
      && fechaVenta.getMonth() === hoy.getMonth()
      && fechaVenta.getDate() === hoy.getDate()
    );
  }

  // Formato colombiano para los campos editables:
  // 1000 -> 1.000
  // 1250000 -> 1.250.000
  formatearMonto(valor: number | null | undefined): string {

    const numero = Number(valor || 0);

    if (!numero) {
      return '';
    }

    return new Intl.NumberFormat('es-CO', {
      maximumFractionDigits: 0
    }).format(numero);
  }

  actualizarMontoInicial(event: Event): void {

    const input = event.target as HTMLInputElement;

    const digitos = input.value.replace(/\D/g, '');

    this.montoInicial = digitos
      ? Number(digitos)
      : 0;
  }

  actualizarMontoFinal(event: Event): void {

    const input = event.target as HTMLInputElement;

    const digitos = input.value.replace(/\D/g, '');

    this.montoFinal = digitos
      ? Number(digitos)
      : 0;
  }

  // =========================
  // BALANCE
  // =========================

  cargarBalance(): void {

    this.cargando = true;

    this.error = '';

    this.ventaService.listar().subscribe({

      next: (ventas) => {

        const todasLasVentas = ventas || [];

        // El Balance trabaja únicamente con las ventas del día actual.
        // Las cajas cerradas siguen conservándose en el historial.
        this.ventas = todasLasVentas.filter(
          venta => this.esVentaDeHoy(venta.fecha)
        );

        this.ventasPaginaActual = 1;

        this.cantidadVentas = this.ventas.length;

        this.totalVentas = this.ventas.reduce(
          (total, venta) =>
            total + Number(venta.total || 0),
          0
        );

        this.ventasContado = this.ventas
          .filter(
            venta => venta.tipoPago === 'CONTADO'
          )
          .reduce(
            (total, venta) =>
              total + Number(venta.total || 0),
            0
          );

        this.ventasFiado = this.ventas
          .filter(
            venta => venta.tipoPago === 'FIADO'
          )
          .reduce(
            (total, venta) =>
              total + Number(venta.total || 0),
            0
          );

        this.cargando = false;

        this.cdr.detectChanges();

      },

      error: (error) => {

        console.error(
          'ERROR CARGANDO BALANCE:',
          error
        );

        this.cargando = false;

        this.error =
          'No se pudo cargar el balance.';

        this.cdr.detectChanges();

      }

    });

  }


  // =========================
  // COMPRAS DEL DÍA
  // =========================

  cargarDevolucionesCompra(): void {
    this.devolucionesCompraService.listar().subscribe({
      next: (devoluciones: DevolucionCompraResponse[]) => {
        this.devolucionesCompra = devoluciones || [];
      },
      error: (error) => {
        console.error('ERROR CARGANDO DEVOLUCIONES DE COMPRA:', error);
        this.devolucionesCompra = [];
      }
    });
  }

  cargarCompras(): void {
    this.compraService.listar().subscribe({
      next: (compras) => {
        this.compras = (compras || []).filter(
          compra => this.esCompraDeHoy(compra.fecha)
        );

        this.comprasPaginaActual = 1;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error(
          'ERROR CARGANDO COMPRAS DEL BALANCE:',
          error
        );
        this.compras = [];
        this.cdr.detectChanges();
      }
    });
  }


  //cargar historial

  cargarHistorialCajas(): void {

    this.cargandoHistorialCajas = true;

    this.cajaService.listar().subscribe({

      next: (cajas) => {

        this.historialCajas = cajas || [];
        this.cajasPaginaActual = 1;

        this.cargandoHistorialCajas = false;

        this.cdr.detectChanges();
      },

      error: (error) => {

        console.error(
          'ERROR CARGANDO HISTORIAL DE CAJAS:',
          error
        );

        this.historialCajas = [];

        this.cargandoHistorialCajas = false;

        this.cdr.detectChanges();
      }

    });
  }

  verDetalleCaja(id: number): void {

    this.cajaSeleccionada = null;

    this.cargandoDetalleCaja = true;

    this.cajaService.obtenerDetalle(id).subscribe({

      next: (detalle) => {

        console.log(
          'DETALLE CAJA:',
          detalle
        );

        this.cajaSeleccionada = detalle;

        this.cargandoDetalleCaja = false;

        this.cdr.detectChanges();
      },

      error: (error) => {

        console.error(
          'ERROR CARGANDO DETALLE DE CAJA:',
          error
        );

        this.cargandoDetalleCaja = false;

        this.cdr.detectChanges();
      }

    });
  }


  // =========================
  // CAJA
  // =========================

  cargarCaja(): void {

    this.cargandoCaja = true;
    this.errorCaja = '';

    this.cajaService.obtenerActual().subscribe({

      next: (caja) => {

        console.log('CAJA ACTUAL:', caja);

        this.caja = caja;

        this.cargarResumenCaja();

      },

      error: (error) => {

        console.log(
          'NO HAY CAJA ABIERTA:',
          error
        );

        this.caja = null;
        this.resumenCaja = null;

        this.cargandoCaja = false;

        this.cdr.detectChanges();

      }

    });

  }

  cerrarDetalleCaja(): void {
    this.cajaSeleccionada = null;
  }



  cargarResumenCaja(): void {

    this.cajaService.obtenerResumenHoy().subscribe({

      next: (resumen) => {

        console.log(
          'RESUMEN CAJA:',
          resumen
        );

        this.resumenCaja = resumen;

        this.cargandoCaja = false;

        this.cdr.detectChanges();

      },

      error: (error) => {

        console.error(
          'ERROR CARGANDO RESUMEN CAJA:',
          error
        );

        this.resumenCaja = null;

        this.cargandoCaja = false;

        this.cdr.detectChanges();

      }

    });

  }

  // =========================
// MODAL CONFIRMACIÓN CAJA
// =========================

  solicitarAbrirCaja(): void {
    console.log('🟡 1. solicitarAbrirCaja()');

    const monto = Number(this.montoInicial || 0);

    console.log('🟡 2. monto:', monto);

    if (monto < 0) {
      console.log('🔴 monto negativo');
      this.errorCaja = 'El monto inicial no puede ser negativo.';
      return;
    }

    console.log('🟡 3. antes de mostrar modal');

    this.tipoConfirmacionCaja = 'ABRIR';
    this.mostrarConfirmacionCaja = true;

    console.log('🟢 4. estado modal:', this.mostrarConfirmacionCaja);
    console.log('🟢 5. tipo:', this.tipoConfirmacionCaja);
  }

  solicitarCerrarCaja(): void {
    if (!this.caja) {
      return;
    }

    const monto = Number(this.montoFinal || 0);

    if (monto < 0) {
      this.errorCaja =
        'El monto final no puede ser negativo.';
      return;
    }

    this.tipoConfirmacionCaja = 'CERRAR';
    this.mostrarConfirmacionCaja = true;
  }

  cancelarConfirmacionCaja(): void {
    this.mostrarConfirmacionCaja = false;
    this.tipoConfirmacionCaja = null;
  }

  confirmarAccionCaja(): void {

    console.log('🟡 4. CONFIRMANDO CAJA:', {
      tipo: this.tipoConfirmacionCaja
    });

    if (this.tipoConfirmacionCaja === 'ABRIR') {

      console.log('🟢 5. EJECUTANDO APERTURA');

      this.mostrarConfirmacionCaja = false;
      this.tipoConfirmacionCaja = null;

      this.ejecutarAbrirCaja();

      return;
    }

    if (this.tipoConfirmacionCaja === 'CERRAR') {

      this.mostrarConfirmacionCaja = false;
      this.tipoConfirmacionCaja = null;

      this.ejecutarCerrarCaja();
    }
  }




  // =========================
  // ABRIR CAJA
  // =========================

  abrirCaja(): void {
    this.solicitarAbrirCaja();
  }

  ejecutarAbrirCaja(): void {

    const monto = Number(this.montoInicial || 0);
    console.log('🔵 6. ENVIANDO APERTURA AL BACKEND:', monto);

    this.procesandoCaja = true;
    this.errorCaja = '';
    this.mensajeCaja = '';

    this.cajaService.abrirCaja(monto).subscribe({

      next: (caja) => {

        console.log('CAJA ABIERTA:', caja);

        this.montoInicial = 0;

        this.procesandoCaja = false;

        this.mensajeCaja =
          'Caja abierta correctamente.';

        this.cargarCaja();

        this.cdr.detectChanges();
      },

      error: (error) => {

        console.error(
          'ERROR ABRIENDO CAJA:',
          error
        );

        this.procesandoCaja = false;

        this.errorCaja =
          error?.error?.message ||
          'No fue posible abrir la caja.';

        this.cdr.detectChanges();
      }

    });
  }


  // =========================
  // CERRAR CAJA
  // =========================

  cerrarCaja(): void {
    this.solicitarCerrarCaja();
  }

  ejecutarCerrarCaja(): void {

    if (!this.caja) {
      return;
    }

    const monto = Number(this.montoFinal || 0);

    this.procesandoCaja = true;
    this.errorCaja = '';
    this.mensajeCaja = '';

    this.cajaService.cerrarCaja(monto).subscribe({

      next: (cajaCerrada) => {

        console.log('CAJA CERRADA:', cajaCerrada);

        this.procesandoCaja = false;

        this.caja = null;

        this.resumenCaja = null;

        this.montoFinal = 0;

        this.mensajeCaja =
          'Caja cerrada correctamente.';

        this.cargarHistorialCajas();

        this.cdr.detectChanges();
      },

      error: (error) => {

        console.error(
          'ERROR CERRANDO CAJA:',
          error
        );

        this.procesandoCaja = false;

        this.errorCaja =
          error?.error?.message ||
          'No fue posible cerrar la caja.';

        this.cdr.detectChanges();
      }

    });
  }



  obtenerClaseDiferencia(): string {
    if (!this.cajaSeleccionada?.diferencia) {
      return 'detalle-cuadrada';
    }

    if (this.cajaSeleccionada.diferencia > 0) {
      return 'detalle-sobrante';
    }

    if (this.cajaSeleccionada.diferencia < 0) {
      return 'detalle-faltante';
    }

    return 'detalle-cuadrada';
  }


  // =========================
  // TOTAL ESPERADO
  // =========================

  obtenerMontoEsperado(): number {

    if (!this.caja) {

      return 0;

    }

    const inicial =
      Number(this.caja.montoInicial || 0);

    const contado =
      Number(
        this.resumenCaja?.ventasContado || 0
      );

    const abonos =
      Number(
        this.resumenCaja?.abonosFiados || 0
      );

    return inicial + contado + abonos;

  }


  // =========================
  // DETALLES
  // =========================

  obtenerTotalDetalles(
    venta: VentaResponse
  ): number {

    return venta.detalles.reduce(
      (total, detalle) =>
        total + detalle.subtotal,
      0
    );

  }

}
