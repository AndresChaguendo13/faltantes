import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

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



@Component({
  selector: 'app-balance',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink
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
  // COMPRAS DEL DÍA
  // =========================

  compras: CompraResponse[] = [];
  comprasPaginaActual = 1;
  comprasPorPagina = 10;

  // Devoluciones de compra ya registradas.
  // Se usan para calcular las unidades que todavía pueden devolverse.
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
// PAGINACIÓN VENTAS
// =========================

  ventasPaginaActual = 1;
  ventasPorPagina = 10;

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


  // =========================
  // DEVOLUCIONES DE COMPRA
  // =========================

  cargarDevolucionesCompra(): void {
    this.devolucionesCompraService.listar().subscribe({
      next: (devoluciones) => {
        this.devolucionesCompra = devoluciones || [];
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error(
          'ERROR CARGANDO DEVOLUCIONES DE COMPRA:',
          error
        );
        this.devolucionesCompra = [];
        this.cdr.detectChanges();
      }
    });
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
