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

  ventas: VentaResponse[] = [];

  cargando = false;
  error = '';

  totalVentas = 0;
  cantidadVentas = 0;
  ventasContado = 0;
  ventasFiado = 0;


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
  // CONSTRUCTOR
  // =========================

  constructor(
    private ventaService: VentaService,
    private cajaService: CajaService,
    private cdr: ChangeDetectorRef
  ) {}


  // =========================
  // INIT
  // =========================

  ngOnInit(): void {
    this.cargarBalance();
    this.cargarCaja();
    this.cargarHistorialCajas();
  }


  // =========================
  // BALANCE
  // =========================

  cargarBalance(): void {

    this.cargando = true;

    this.error = '';

    this.ventaService.listar().subscribe({

      next: (ventas) => {

        this.ventas = ventas || [];

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


  //cargar historial

  cargarHistorialCajas(): void {

    this.cargandoHistorialCajas = true;

    this.cajaService.listar().subscribe({

      next: (cajas) => {

        this.historialCajas = cajas || [];

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
    const monto = Number(this.montoInicial || 0);

    if (monto < 0) {
      this.errorCaja =
        'El monto inicial no puede ser negativo.';
      return;
    }

    this.tipoConfirmacionCaja = 'ABRIR';
    this.mostrarConfirmacionCaja = true;
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

    if (this.tipoConfirmacionCaja === 'ABRIR') {
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
