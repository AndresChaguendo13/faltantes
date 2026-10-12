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
import { MovimientoCajaService, MovimientoCajaResponse } from '../../services/movimiento-caja.service';
import { CompraService, CompraResponse } from '../../services/compra.service';

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
  ventasTransferencia = 0;
  ventasTransferenciaCaja = 0;
  comprasGlobalesHoy = 0;
  comprasNormalesGlobalesHoy = 0;
  comprasLibresGlobalesHoy = 0;
  movimientosCaja: MovimientoCajaResponse[] = [];
  totalIngresosMovimientos = 0;
  totalVentasLibres = 0;
  totalOtrosIngresos = 0;
  totalRetirosMovimientos = 0;
  totalCompras = 0;
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
    private movimientoCajaService: MovimientoCajaService,
    private compraService: CompraService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarCaja();
    this.cargarHistorial();
    this.cargarVentasDelDia();
    this.cargarComprasGlobalesHoy();
  }

  cargarVentasDelDia(): void {
    /*
     * Estas tarjetas de la parte superior son GLOBALES DEL DÍA.
     * No deben depender de la caja actualmente abierta.
     *
     * La separación de la caja actual se hace exclusivamente en
     * cargarTransferenciasCajaActual() y en el resumen de caja.
     */
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
          .reduce(
            (total, venta) => total + Number(venta.total || 0),
            0
          );

        this.ventasFiado = ventasDelDia
          .filter(venta => this.obtenerTipoPago(venta) === 'FIADO')
          .reduce(
            (total, venta) => total + Number(venta.total || 0),
            0
          );

        this.ventasTransferencia = ventasDelDia
          .filter(
            venta => this.obtenerTipoPago(venta) === 'TRANSFERENCIA'
          )
          .reduce(
            (total, venta) => total + Number(venta.total || 0),
            0
          );

        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('ERROR CARGANDO VENTAS GLOBALES DEL DÍA:', error);
        this.cantidadVentas = 0;
        this.totalVentas = 0;
        this.ventasContado = 0;
        this.ventasFiado = 0;
        this.ventasTransferencia = 0;
        this.cdr.detectChanges();
      }
    });
  }

  cargarComprasGlobalesHoy(): void {
    this.compraService.listar().subscribe({
      next: (compras: CompraResponse[]) => {
        const comprasDelDia = (compras || []).filter(
          compra => this.esVentaDeHoy(compra.fecha)
        );

        this.comprasNormalesGlobalesHoy = comprasDelDia.reduce(
          (total, compra) => {
            const totalCompra = (compra.detalles || []).reduce(
              (subtotal, detalle) =>
                subtotal +
                Number(detalle.cantidad || 0) *
                Number(detalle.precioCompra || 0),
              0
            );

            return total + totalCompra;
          },
          0
        );

        this.comprasGlobalesHoy =
          this.comprasNormalesGlobalesHoy +
          this.comprasLibresGlobalesHoy;

        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('ERROR CARGANDO COMPRAS GLOBALES DEL DÍA:', error);
        this.comprasNormalesGlobalesHoy = 0;
        this.comprasGlobalesHoy = this.comprasLibresGlobalesHoy;
        this.cdr.detectChanges();
      }
    });

    this.movimientoCajaService.listarHoy().subscribe({
      next: (movimientos: MovimientoCajaResponse[]) => {
        this.comprasLibresGlobalesHoy = (movimientos || [])
          .filter(
            movimiento =>
              movimiento.tipo === 'RETIRO' &&
              this.esVentaDeHoy(movimiento.fecha) &&
              (movimiento.motivo || '')
                .toUpperCase()
                .startsWith('COMPRA LIBRE:')
          )
          .reduce(
            (total, movimiento) =>
              total + Number(movimiento.monto || 0),
            0
          );

        this.comprasGlobalesHoy =
          this.comprasNormalesGlobalesHoy +
          this.comprasLibresGlobalesHoy;

        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error(
          'ERROR CARGANDO COMPRAS LIBRES GLOBALES DEL DÍA:',
          error
        );
        this.comprasLibresGlobalesHoy = 0;
        this.comprasGlobalesHoy =
          this.comprasNormalesGlobalesHoy;
        this.cdr.detectChanges();
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

        // Datos exclusivos de la caja actualmente abierta.
        this.cargarResumen();
        this.cargarMovimientosCaja();
        this.cargarTransferenciasCajaActual();

        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.cajaActual = null;
        this.resumen = null;

        // Evita conservar datos de una caja anterior.
        this.ventasTransferenciaCaja = 0;
        this.movimientosCaja = [];
        this.totalIngresosMovimientos = 0;
        this.totalVentasLibres = 0;
        this.totalOtrosIngresos = 0;
        this.totalRetirosMovimientos = 0;
        this.totalCompras = 0;

        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  cargarTransferenciasCajaActual(): void {
    if (!this.cajaActual) {
      this.ventasTransferenciaCaja = 0;
      return;
    }

    const fechaApertura = this.cajaActual.fechaApertura;
    const inicioCaja = new Date(fechaApertura);

    if (Number.isNaN(inicioCaja.getTime())) {
      this.ventasTransferenciaCaja = 0;
      return;
    }

    this.ventaService.listar().subscribe({
      next: (ventas: VentaResponse[]) => {
        const ahora = new Date();

        this.ventasTransferenciaCaja = (ventas || [])
          .filter(venta => {
            if (!venta.fecha) return false;

            const fechaVenta = new Date(venta.fecha);

            if (Number.isNaN(fechaVenta.getTime())) {
              return false;
            }

            return (
              fechaVenta >= inicioCaja &&
              fechaVenta <= ahora &&
              this.obtenerTipoPago(venta) === 'TRANSFERENCIA'
            );
          })
          .reduce(
            (total, venta) => total + Number(venta.total || 0),
            0
          );

        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error(
          'ERROR CARGANDO TRANSFERENCIAS DE LA CAJA ACTUAL:',
          error
        );
        this.ventasTransferenciaCaja = 0;
        this.cdr.detectChanges();
      }
    });
  }

  cargarMovimientosCaja(): void {
    if (!this.cajaActual) {
      this.movimientosCaja = [];
      this.totalIngresosMovimientos = 0;
      this.totalVentasLibres = 0;
      this.totalOtrosIngresos = 0;
      this.totalRetirosMovimientos = 0;
      this.totalCompras = 0;
      return;
    }

    this.movimientoCajaService.listarPorCaja(this.cajaActual.id).subscribe({
      next: (movimientos) => {
        this.movimientosCaja = movimientos || [];
        const ingresos = this.movimientosCaja.filter(
          m => m.tipo === 'INGRESO'
        );

        this.totalIngresosMovimientos = ingresos.reduce(
          (total, m) => total + Number(m.monto || 0),
          0
        );

        this.totalVentasLibres = ingresos
          .filter(m =>
            (m.motivo || '').toUpperCase().startsWith('VENTA LIBRE:')
          )
          .reduce(
            (total, m) => total + Number(m.monto || 0),
            0
          );

        this.totalOtrosIngresos =
          this.totalIngresosMovimientos - this.totalVentasLibres;

        this.totalRetirosMovimientos = this.movimientosCaja
          .filter(m => m.tipo === 'RETIRO')
          .reduce(
            (total, m) => total + Number(m.monto || 0),
            0
          );

        this.totalCompras = this.movimientosCaja
          .filter(m => {
            if (m.tipo !== 'RETIRO') return false;

            const motivo = (m.motivo || '').toUpperCase();

            return (
              motivo.startsWith('COMPRA DE INVENTARIO:') ||
              motivo.startsWith('COMPRA DE INVENTARIO #') ||
              motivo.startsWith('COMPRA LIBRE:')
            );
          })
          .reduce(
            (total, m) => total + Number(m.monto || 0),
            0
          );

        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('ERROR CARGANDO MOVIMIENTOS DE CAJA:', error);
        this.movimientosCaja = [];
        this.totalIngresosMovimientos = 0;
        this.totalVentasLibres = 0;
        this.totalOtrosIngresos = 0;
        this.totalRetirosMovimientos = 0;
        this.totalCompras = 0;
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

        // Cargar inmediatamente todos los datos de la nueva caja.
        this.cargarResumen();
        this.cargarMovimientosCaja();
        this.cargarTransferenciasCajaActual();
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

    const idCaja = this.cajaActual.id;

    this.procesando = true;
    this.error = '';

    /*
     * El cierre puede quedar guardado en el backend antes de que el POST
     * termine de responder. Para evitar que el botón se quede eternamente
     * en "Cerrando...", verificamos en paralelo si la caja sigue abierta.
     */
    this.cajaService.cerrarCaja(this.montoFinal).subscribe({
      next: () => {
        this.finalizarCierreCaja();
      },
      error: (error) => {
        console.error('ERROR CERRANDO CAJA:', error);

        // Antes de mostrar error, comprobamos el estado real de la caja.
        this.verificarCierreCaja(idCaja, error, 0);
      }
    });

    // Primera comprobación independiente de la respuesta del POST.
    setTimeout(() => {
      this.verificarCierreCaja(idCaja, null, 0);
    }, 700);
  }

  private verificarCierreCaja(
    idCaja: number,
    errorOriginal: any,
    intento: number
  ): void {
    if (!this.procesando || !this.cajaActual || this.cajaActual.id !== idCaja) {
      return;
    }

    this.cajaService.obtenerActual().subscribe({
      next: (caja) => {
        /*
         * Si todavía está abierta, el backend aún puede estar terminando
         * el cierre. Reintentamos durante unos segundos.
         */
        if (caja && caja.id === idCaja && caja.estado === 'ABIERTA') {
          if (intento < 12) {
            setTimeout(() => {
              this.verificarCierreCaja(idCaja, errorOriginal, intento + 1);
            }, 500);
          } else if (errorOriginal) {
            this.procesando = false;
            this.error = this.obtenerMensajeError(
              errorOriginal,
              'No fue posible cerrar la caja.'
            );
            this.cdr.detectChanges();
          }

          return;
        }

        // Ya no existe una caja ABIERTA con ese ID: el cierre se realizó.
        this.finalizarCierreCaja();
      },
      error: (errorActual) => {
        /*
         * /caja/actual devuelve 404 cuando ya no hay caja abierta.
         * Eso confirma que la caja fue cerrada.
         */
        if (errorActual?.status === 404) {
          this.finalizarCierreCaja();
          return;
        }

        if (intento < 12) {
          setTimeout(() => {
            this.verificarCierreCaja(idCaja, errorOriginal, intento + 1);
          }, 500);
        } else {
          this.procesando = false;
          this.error = this.obtenerMensajeError(
            errorOriginal || errorActual,
            'No fue posible verificar el cierre de la caja.'
          );
          this.cdr.detectChanges();
        }
      }
    });
  }

  private finalizarCierreCaja(): void {
    if (!this.procesando) {
      return;
    }

    this.mostrarModalCerrar = false;
    this.procesando = false;

    // La caja actual ya no está abierta.
    this.cajaActual = null;
    this.resumen = null;
    this.ventasTransferenciaCaja = 0;
    this.movimientosCaja = [];
    this.totalIngresosMovimientos = 0;
    this.totalVentasLibres = 0;
    this.totalOtrosIngresos = 0;
    this.totalRetirosMovimientos = 0;
    this.totalCompras = 0;
    this.montoFinal = 0;

    this.mensaje = 'La caja fue cerrada correctamente.';

    // Actualizamos el historial y las métricas globales sin bloquear la vista.
    this.cargarHistorial();
    this.cargarVentasDelDia();
    this.cargarComprasGlobalesHoy();

    this.cdr.detectChanges();
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
    // Actualiza tanto los datos globales del día como los de la caja actual.
    this.cargarVentasDelDia();
    this.cargarComprasGlobalesHoy();
    this.cargarCaja();
    this.cargarHistorial();
  }

  obtenerTipoMovimiento(movimiento: MovimientoCajaResponse): string {
    return movimiento.tipo === 'INGRESO' ? 'INGRESO' : 'RETIRO';
  }

  obtenerConceptoMovimiento(movimiento: MovimientoCajaResponse): string {
    const motivo = movimiento.motivo || 'Movimiento de caja';

    return motivo
      .replace(/^VENTA LIBRE:\s*/i, 'Venta libre: ')
      .replace(/^COMPRA LIBRE:\s*/i, 'Compra libre: ');
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
    return (
      Number(this.resumen?.ventasContado || 0) +
      Number(this.resumen?.abonosFiados || 0) +
      Number(this.totalIngresosMovimientos || 0)
    );
  }

  get montoEsperadoActual(): number {
    if (!this.cajaActual) return 0;

    /*
     * El monto esperado pertenece únicamente a la caja actual.
     * Las transferencias globales NO se usan aquí.
     *
     * Sí se incluyen las transferencias realizadas desde la apertura
     * de esta caja, porque forman parte del total de la jornada actual.
     */
    return (
      Number(this.cajaActual.montoInicial || 0) +
      Number(this.resumen?.ventasContado || 0) +
      Number(this.ventasTransferenciaCaja || 0) +
      Number(this.resumen?.abonosFiados || 0) +
      Number(this.totalIngresosMovimientos || 0) -
      Number(this.totalRetirosMovimientos || 0)
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
