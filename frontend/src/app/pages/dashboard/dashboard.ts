import { Component, OnInit, OnDestroy, ChangeDetectorRef, HostListener } from '@angular/core';
import {
  CurrencyPipe,
  DecimalPipe,
  DatePipe
} from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DashboardService, DashboardResponse } from '../../services/dashboard';
import {Producto, ProductoService} from '../../services/producto';
import { NotaRapida, NotaRapidaService } from '../../services/nota-rapida';




@Component({
  selector: 'app-dashboard',
  imports: [
    RouterLink,
    RouterLinkActive,
    CurrencyPipe,
    DecimalPipe,
    DatePipe,
    FormsModule
  ],


  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})




export class Dashboard implements OnInit, OnDestroy {

  menuUsuarioAbierto: boolean = false;
  mostrarConfirmacion: boolean = false;

  totalProductos: number = 0;
  valorInventario: number = 0;
  productosStockBajo: number = 0;

  ventasHoy: number = 0;
  ventasContadoHoy: number = 0;
  ventasFiadoHoy: number = 0;
  cuentasPorCobrar: number = 0;

  totalCompras: number = 0;
  totalVentas: number = 0;

  productosProximosVencer: number = 0;
  productosVencidos: number = 0;
  productosSinFecha: number = 0;

  utilidadBrutaHoy: number = 0;
  margenUtilidadHoy: number = 0;
  costoVentasHoy: number = 0;

  devolucionesVentaHoy: number = 0;
  devolucionesCompraHoy: number = 0;

  estadoCaja: string = '';
  montoInicialCaja: number = 0;
  ventasContadoCaja: number = 0;
  abonosFiadosCaja: number = 0;
  montoEsperadoCaja: number = 0;
  montoFinalCaja: number = 0;
  diferenciaCaja: number = 0;
  resultadoCaja: string = '';

  productosMasVendidos: any[] = [];

  comprasPendientes: number = 0;

  almacenesActivos: number = 0;


  productoConsultado: Producto | null = null;

  mostrarConsulta: boolean = false;

  buscandoProducto: boolean = false;

  errorBusquedaProducto: string = '';

  // =====================================================
  // FECHA Y HORA EN TIEMPO REAL
  // =====================================================

  fechaActualTexto: string = '';
  horaActualTexto: string = '';
  private intervaloReloj: ReturnType<typeof setInterval> | null = null;

  // =====================================================
  // NOTAS RÁPIDAS / RECORDATORIOS
  // =====================================================

  notasRapidas: NotaRapida[] = [];

  // Paginación: máximo 5 notas visibles por página.
  paginaNotasActual: number = 1;
  readonly notasPorPagina: number = 5;

  alarmaIntervalo: ReturnType<typeof setInterval> | null = null;
  notasAlertadas = new Set<number>();
  mostrarModalNota: boolean = false;
  notaEditandoId: number | null = null;
  notaAEliminar: NotaRapida | null = null;
  mostrarConfirmacionEliminarNota: boolean = false;

  // =====================================================
// ALERTA INTERNA DE NOTA
// =====================================================

  mostrarModalAlertaNota: boolean = false;
  notaEnAlerta: NotaRapida | null = null;

  private audioContext: AudioContext | null = null;



  notaForm = {
    titulo: '',
    contenido: '',
    recordatorio: '',
    alarma: false
  };


  constructor(
    private router: Router,
    private dashboardService: DashboardService,
    private productoService: ProductoService,
    private notaRapidaService: NotaRapidaService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarDashboard();
    this.iniciarReloj();
    this.cargarNotasRapidas();
    this.iniciarAlarmaNotas();
  }

  ngOnDestroy(): void {
    if (this.intervaloReloj) {
      clearInterval(this.intervaloReloj);
      this.intervaloReloj = null;
    }

    if (this.alarmaIntervalo) {
      clearInterval(this.alarmaIntervalo);
      this.alarmaIntervalo = null;
    }
  }

  private iniciarReloj(): void {
    this.actualizarFechaHora();
    this.intervaloReloj = setInterval(() => {
      this.actualizarFechaHora();
    }, 1000);
  }

  private actualizarFechaHora(): void {
    const ahora = new Date();

    this.fechaActualTexto = new Intl.DateTimeFormat('es-CO', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).format(ahora).replace('.', '');

    this.horaActualTexto = new Intl.DateTimeFormat('es-CO', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(ahora);

    this.cdr.detectChanges();
  }

  // =====================================================
  // CRUD NOTAS RÁPIDAS
  // =====================================================

  private cargarNotasRapidas(): void {
    this.notaRapidaService.listar().subscribe({
      next: (notas) => {
        this.notasRapidas = notas;
        this.ordenarNotasRapidas();
        this.ajustarPaginaNotas();
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('ERROR CARGANDO NOTAS RÁPIDAS:', error);
        this.notasRapidas = [];
      }
    });
  }

  private ordenarNotasRapidas(): void {
    this.notasRapidas.sort((a, b) => {
      if (a.estado !== b.estado) {
        return a.estado === 'COMPLETADA' ? 1 : -1;
      }

      return new Date(b.fechaActualizacion).getTime() -
        new Date(a.fechaActualizacion).getTime();
    });
  }

  get totalPaginasNotas(): number {
    return Math.max(1, Math.ceil(this.notasRapidas.length / this.notasPorPagina));
  }

  get notasRapidasPaginadas(): NotaRapida[] {
    const inicio = (this.paginaNotasActual - 1) * this.notasPorPagina;
    return this.notasRapidas.slice(inicio, inicio + this.notasPorPagina);
  }

  get paginasNotas(): number[] {
    return Array.from({ length: this.totalPaginasNotas }, (_, i) => i + 1);
  }

  cambiarPaginaNotas(pagina: number): void {
    if (pagina < 1 || pagina > this.totalPaginasNotas) return;
    this.paginaNotasActual = pagina;
  }

  paginaNotasAnterior(): void {
    this.cambiarPaginaNotas(this.paginaNotasActual - 1);
  }

  paginaNotasSiguiente(): void {
    this.cambiarPaginaNotas(this.paginaNotasActual + 1);
  }

  private ajustarPaginaNotas(): void {
    if (this.paginaNotasActual > this.totalPaginasNotas) {
      this.paginaNotasActual = this.totalPaginasNotas;
    }
    if (this.paginaNotasActual < 1) {
      this.paginaNotasActual = 1;
    }
  }

  abrirNuevaNota(): void {

    // Preparamos el sonido mediante una acción real del usuario.
    this.prepararAudio();

    this.notaEditandoId = null;

    this.notaForm = {
      titulo: '',
      contenido: '',
      recordatorio: '',
      alarma: false
    };

    this.mostrarModalNota = true;
  }

  editarNota(nota: NotaRapida): void {
    this.notaEditandoId = nota.id;

    this.notaForm = {
      titulo: nota.titulo,
      contenido: nota.descripcion,
      recordatorio: nota.fechaAlerta
        ? this.formatearParaDatetimeLocal(nota.fechaAlerta)
        : '',
      alarma: nota.alarma
    };

    this.mostrarModalNota = true;
  }

  cerrarModalNota(): void {
    this.mostrarModalNota = false;
    this.notaEditandoId = null;
  }

  guardarNota(): void {
    // Si se edita una nota, permitimos que su nueva fecha de alerta
    // vuelva a dispararse.
    if (this.notaEditandoId !== null) {
      this.notasAlertadas.delete(this.notaEditandoId);
    }

    const titulo = this.notaForm.titulo.trim();
    const contenido = this.notaForm.contenido.trim();

    if (!titulo || !contenido) {
      return;
    }

    // Si se activa la alarma, la fecha y hora son obligatorias.
    if (this.notaForm.alarma && !this.notaForm.recordatorio) {
      console.warn('Para activar la alarma debes seleccionar fecha y hora.');
      return;
    }

    const datos = {
      titulo,
      descripcion: contenido,
      fechaAlerta: this.notaForm.recordatorio
        ? this.convertirDatetimeLocalAISO(this.notaForm.recordatorio)
        : null,
      alarma: this.notaForm.alarma
    };

    const operacion = this.notaEditandoId === null
      ? this.notaRapidaService.crear(datos)
      : this.notaRapidaService.actualizar(
        this.notaEditandoId,
        datos
      );

    operacion.subscribe({
      next: () => {
        this.cargarNotasRapidas();
        this.cerrarModalNota();
      },
      error: (error) => {
        console.error('ERROR GUARDANDO NOTA RÁPIDA:', error);
      }
    });

  }

  solicitarEliminarNota(nota: NotaRapida): void {
    this.notaAEliminar = nota;
    this.mostrarConfirmacionEliminarNota = true;
  }

  cancelarEliminarNota(): void {
    this.mostrarConfirmacionEliminarNota = false;
    this.notaAEliminar = null;
  }

  confirmarEliminarNota(): void {
    if (!this.notaAEliminar) {
      return;
    }

    const id = this.notaAEliminar.id;

    this.notaRapidaService.eliminar(id).subscribe({
      next: () => {
        this.notasRapidas = this.notasRapidas.filter(
          item => item.id !== id
        );
        this.notasAlertadas.delete(id);

        this.ajustarPaginaNotas();
        this.cancelarEliminarNota();
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('ERROR ELIMINANDO NOTA RÁPIDA:', error);
      }
    });
  }

  alternarNotaCompletada(nota: NotaRapida): void {
    this.notaRapidaService.alternarCompletada(nota.id).subscribe({
      next: (actualizada) => {
        nota.estado = actualizada.estado;
        nota.fechaActualizacion = actualizada.fechaActualizacion;
        this.ordenarNotasRapidas();
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('ERROR ACTUALIZANDO ESTADO DE NOTA:', error);
      }
    });
  }

  trackNota(_: number, nota: NotaRapida): number {
    return nota.id;
  }

  private iniciarAlarmaNotas(): void {
    this.comprobarAlarmasNotas();

    this.alarmaIntervalo = setInterval(() => {
      this.comprobarAlarmasNotas();
    }, 1000);
  }

  private comprobarAlarmasNotas(): void {
    const ahora = Date.now();

    for (const nota of this.notasRapidas) {
      if (
        !nota.alarma ||
        nota.estado === 'COMPLETADA' ||
        !nota.fechaAlerta ||
        this.notasAlertadas.has(nota.id)
      ) {
        continue;
      }

      const momentoAlerta = this.obtenerTimestampAlerta(nota.fechaAlerta);

      if (momentoAlerta <= ahora) {
        this.notasAlertadas.add(nota.id);
        this.emitirAlerta(nota);
      }
    }
  }









  private obtenerTimestampAlerta(valor: string): number {
    if (!valor) return NaN;

    const match = valor.match(
      /^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})(?::(\d{2}))?/
    );

    if (!match) return NaN;

    return new Date(
      Number(match[1]),
      Number(match[2]) - 1,
      Number(match[3]),
      Number(match[4]),
      Number(match[5]),
      Number(match[6] || 0)
    ).getTime();
  }

  cerrarModalAlertaNota(): void {
    this.mostrarModalAlertaNota = false;
    this.notaEnAlerta = null;
  }

  @HostListener('document:click')
  prepararAudioPorInteraccion(): void {
    this.prepararAudio();
  }

  private emitirAlerta(nota: NotaRapida): void {

    // Guardamos la nota que debe mostrarse.
    this.notaEnAlerta = nota;

    // Abrimos nuestro propio modal Angular.
    this.mostrarModalAlertaNota = true;

    // Actualizamos inmediatamente la interfaz.
    this.cdr.detectChanges();

    // Sonido interno del sistema.
    this.reproducirPitido();
  }

  private convertirDatetimeLocalAISO(valor: string): string {
    // El backend usa LocalDateTime, por eso enviamos la hora local
    // sin convertirla a UTC. Así la alarma coincide con la hora elegida.
    const limpio = (valor || '').trim();
    if (!limpio) return '';
    return limpio.length === 16 ? `${limpio}:00` : limpio;
  }

  private formatearParaDatetimeLocal(valor: string): string {
    if (!valor) return '';

    const match = valor.match(
      /^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})/
    );

    if (!match) return '';

    return `${match[1]}-${match[2]}-${match[3]}T${match[4]}:${match[5]}`;
  }

  cargarDashboard(): void {

    this.dashboardService.obtenerDashboard().subscribe({

      next: (respuesta: DashboardResponse) => {

        console.log('DASHBOARD:', respuesta);

        this.totalProductos =
          respuesta.totalProductos || 0;

        this.productosStockBajo =
          respuesta.productosStockBajo || 0;

        this.totalCompras =
          respuesta.totalCompras || 0;

        this.totalVentas =
          respuesta.totalVentas || 0;

        this.valorInventario =
          respuesta.valorInventario || 0;

        this.ventasHoy =
          respuesta.ventasHoy || 0;

        this.ventasContadoHoy =
          respuesta.ventasContadoHoy || 0;

        this.ventasFiadoHoy =
          respuesta.ventasFiadoHoy || 0;

        this.cuentasPorCobrar =
          respuesta.cuentasPorCobrar || 0;

        this.utilidadBrutaHoy =
          respuesta.utilidadBrutaHoy || 0;

        this.margenUtilidadHoy =
          respuesta.margenUtilidadHoy || 0;

        this.costoVentasHoy =
          respuesta.costoVentasHoy || 0;

        this.devolucionesVentaHoy =
          respuesta.devolucionesVentaHoy || 0;

        this.devolucionesCompraHoy =
          respuesta.devolucionesCompraHoy || 0;

        this.estadoCaja =
          respuesta.estadoCaja || '';

        this.montoInicialCaja =
          respuesta.montoInicialCaja || 0;

        this.ventasContadoCaja =
          respuesta.ventasContadoCaja || 0;

        this.abonosFiadosCaja =
          respuesta.abonosFiadosCaja || 0;

        this.montoEsperadoCaja =
          respuesta.montoEsperadoCaja || 0;

        this.montoFinalCaja =
          respuesta.montoFinalCaja || 0;

        this.diferenciaCaja =
          respuesta.diferenciaCaja || 0;

        this.resultadoCaja =
          respuesta.resultadoCaja || '';

        this.productosMasVendidos =
          respuesta.productosMasVendidos || [];

        this.cdr.detectChanges();
      },

      error: (error) => {
        console.error(
          'ERROR AL CARGAR DASHBOARD:',
          error
        );
      }

    });

  }

  buscarProductoDesdeDashboard(
    codigo: string,
    input: HTMLInputElement
  ): void {

    const texto = codigo.trim();
    input.value = '';

    if (!texto) {
      return;
    }

    this.buscandoProducto = true;
    this.errorBusquedaProducto = '';
    this.productoConsultado = null;

    this.productoService.buscarPorCodigo(texto).subscribe({

      next: (producto) => {

        console.log(
          'PRODUCTO ENCONTRADO DESDE DASHBOARD:',
          producto
        );

        this.productoConsultado = producto;

        this.mostrarConsulta = true;

        this.buscandoProducto = false;

        this.cdr.detectChanges();

      },

      error: (error) => {

        console.error(
          'ERROR BUSCANDO PRODUCTO DESDE DASHBOARD:',
          error
        );

        this.productoConsultado = null;

        if (error.status === 404) {

          this.errorBusquedaProducto =
            'Producto no encontrado.';

        } else if (error.status === 401) {

          this.errorBusquedaProducto =
            'Sesión expirada. Inicia sesión nuevamente.';

        } else {

          this.errorBusquedaProducto =
            'No se pudo consultar el producto.';

        }

        this.mostrarConsulta = true;

        this.buscandoProducto = false;

        this.cdr.detectChanges();

      }

    });

  }


  cerrarConsultaProducto(): void {

    this.mostrarConsulta = false;

    this.productoConsultado = null;

    this.errorBusquedaProducto = '';

    this.buscandoProducto = false;

    this.cdr.detectChanges();

  }

  abrirMenuUsuario(): void {
    this.menuUsuarioAbierto =
      !this.menuUsuarioAbierto;
  }

  cerrarMenuUsuario(): void {
    this.menuUsuarioAbierto = false;
  }

  confirmarCerrarSesion(): void {
    this.menuUsuarioAbierto = false;
    this.mostrarConfirmacion = true;
  }

  cancelarCerrarSesion(): void {
    this.mostrarConfirmacion = false;
  }

  cerrarSesion(): void {
    localStorage.removeItem('token');
    this.mostrarConfirmacion = false;

    this.router.navigate(['/']);
  }



  private prepararAudio(): void {

    try {

      const AudioContextClass =
        window.AudioContext ||
        (window as any).webkitAudioContext;

      if (!AudioContextClass) {
        return;
      }

      if (!this.audioContext) {
        this.audioContext = new AudioContextClass();
      }

      if (this.audioContext.state === 'suspended') {
        this.audioContext.resume().catch(() => {});
      }

    } catch (error) {

      console.error(
        'No fue posible inicializar el audio de notas:',
        error
      );

    }
  }



  private reproducirPitido(): void {

    this.prepararAudio();

    if (!this.audioContext) {
      return;
    }

    const ctx = this.audioContext;

    const tocar = (
      frecuencia: number,
      inicio: number
    ) => {

      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();

      oscillator.type = 'sine';

      oscillator.frequency.setValueAtTime(
        frecuencia,
        ctx.currentTime + inicio
      );

      gain.gain.setValueAtTime(
        0.0001,
        ctx.currentTime + inicio
      );

      gain.gain.exponentialRampToValueAtTime(
        0.35,
        ctx.currentTime + inicio + 0.03
      );

      gain.gain.exponentialRampToValueAtTime(
        0.0001,
        ctx.currentTime + inicio + 0.35
      );

      oscillator.connect(gain);
      gain.connect(ctx.destination);

      oscillator.start(ctx.currentTime + inicio);

      oscillator.stop(
        ctx.currentTime + inicio + 0.35
      );
    };

    tocar(880, 0);
    tocar(988, 0.45);
    tocar(880, 0.90);
  }


}
