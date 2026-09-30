import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  DevolucionesVentaService,
  DevolucionVentaResponse
} from '../../services/devoluciones-venta';

import {
  DevolucionesCompraService,
  DevolucionCompraResponse
} from '../../services/devoluciones-compra';

@Component({
  selector: 'app-devoluciones',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './devoluciones.html',
  styleUrl: './devoluciones.css'
})
export class Devoluciones implements OnInit {

  devolucionesVenta: DevolucionVentaResponse[] = [];
  devolucionesCompra: DevolucionCompraResponse[] = [];

  cargandoDevoluciones = false;
  errorDevoluciones = '';

  tipoDevolucionListado: 'VENTA' | 'COMPRA' = 'VENTA';

  ventasPaginaActual = 1;
  ventasPorPagina = 10;

  comprasPaginaActual = 1;
  comprasPorPagina = 10;

  constructor(
    private devolucionesVentaService: DevolucionesVentaService,
    private devolucionesCompraService: DevolucionesCompraService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarDevoluciones();
  }

  cargarDevoluciones(): void {
    this.cargandoDevoluciones = true;
    this.errorDevoluciones = '';

    this.devolucionesVentaService.listar().subscribe({
      next: (devoluciones) => {
        this.devolucionesVenta = devoluciones || [];
        this.ventasPaginaActual = 1;

        this.devolucionesCompraService.listar().subscribe({
          next: (devolucionesCompra) => {
            this.devolucionesCompra = devolucionesCompra || [];
            this.comprasPaginaActual = 1;
            this.cargandoDevoluciones = false;
            this.cdr.detectChanges();
          },
          error: (error) => {
            console.error('ERROR CARGANDO DEVOLUCIONES DE COMPRA:', error);
            this.devolucionesCompra = [];
            this.cargandoDevoluciones = false;
            this.errorDevoluciones =
              'No se pudieron cargar las devoluciones de compra.';
            this.cdr.detectChanges();
          }
        });
      },
      error: (error) => {
        console.error('ERROR CARGANDO DEVOLUCIONES DE VENTA:', error);
        this.devolucionesVenta = [];
        this.devolucionesCompra = [];
        this.cargandoDevoluciones = false;
        this.errorDevoluciones =
          'No se pudieron cargar las devoluciones de venta.';
        this.cdr.detectChanges();
      }
    });
  }

  seleccionarTipoDevolucion(tipo: 'VENTA' | 'COMPRA'): void {
    this.tipoDevolucionListado = tipo;

    if (tipo === 'VENTA') {
      this.ventasPaginaActual = 1;
    } else {
      this.comprasPaginaActual = 1;
    }
  }

  get totalPaginasVentas(): number {
    return Math.max(
      1,
      Math.ceil(this.devolucionesVenta.length / this.ventasPorPagina)
    );
  }

  get totalPaginasCompras(): number {
    return Math.max(
      1,
      Math.ceil(this.devolucionesCompra.length / this.comprasPorPagina)
    );
  }

  get devolucionesVentaPaginadas(): DevolucionVentaResponse[] {
    const inicio = (this.ventasPaginaActual - 1) * this.ventasPorPagina;

    return this.devolucionesVenta.slice(
      inicio,
      inicio + this.ventasPorPagina
    );
  }

  get devolucionesCompraPaginadas(): DevolucionCompraResponse[] {
    const inicio = (this.comprasPaginaActual - 1) * this.comprasPorPagina;

    return this.devolucionesCompra.slice(
      inicio,
      inicio + this.comprasPorPagina
    );
  }

  get inicioVentas(): number {
    if (this.devolucionesVenta.length === 0) {
      return 0;
    }

    return ((this.ventasPaginaActual - 1) * this.ventasPorPagina) + 1;
  }

  get finVentas(): number {
    return Math.min(
      this.ventasPaginaActual * this.ventasPorPagina,
      this.devolucionesVenta.length
    );
  }

  get inicioCompras(): number {
    if (this.devolucionesCompra.length === 0) {
      return 0;
    }

    return ((this.comprasPaginaActual - 1) * this.comprasPorPagina) + 1;
  }

  get finCompras(): number {
    return Math.min(
      this.comprasPaginaActual * this.comprasPorPagina,
      this.devolucionesCompra.length
    );
  }

  cambiarPaginaVentas(pagina: number): void {
    this.ventasPaginaActual = Math.min(
      Math.max(1, pagina),
      this.totalPaginasVentas
    );
  }

  cambiarPaginaCompras(pagina: number): void {
    this.comprasPaginaActual = Math.min(
      Math.max(1, pagina),
      this.totalPaginasCompras
    );
  }
}
