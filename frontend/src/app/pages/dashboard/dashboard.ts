import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import {
  CurrencyPipe,
  DecimalPipe,
  DatePipe
} from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DashboardService, DashboardResponse } from '../../services/dashboard';
import {Producto, ProductoService} from '../../services/producto';


export interface NotaRapida {
  id: number;
  titulo: string;
  contenido: string;
  recordatorio: string;
  completada: boolean;
  actualizadoEn: string;
}


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
  mostrarModalNota: boolean = false;
  notaEditandoId: number | null = null;
  notaAEliminar: NotaRapida | null = null;
  mostrarConfirmacionEliminarNota: boolean = false;

  notaForm = {
    titulo: '',
    contenido: '',
    recordatorio: ''
  };

  private readonly claveNotasRapidas = 'faltantes_notas_rapidas';

  constructor(
    private router: Router,
    private dashboardService: DashboardService,
    private productoService: ProductoService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarDashboard();
    this.iniciarReloj();
    this.cargarNotasRapidas();
  }

  ngOnDestroy(): void {
    if (this.intervaloReloj) {
      clearInterval(this.intervaloReloj);
      this.intervaloReloj = null;
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
    if (typeof window === 'undefined') {
      return;
    }

    try {
      const guardadas = localStorage.getItem(this.claveNotasRapidas);
      this.notasRapidas = guardadas ? JSON.parse(guardadas) : [];
      this.ordenarNotasRapidas();
    } catch (error) {
      console.error('ERROR CARGANDO NOTAS RÁPIDAS:', error);
      this.notasRapidas = [];
    }
  }

  private guardarNotasRapidas(): void {
    if (typeof window === 'undefined') {
      return;
    }

    localStorage.setItem(
      this.claveNotasRapidas,
      JSON.stringify(this.notasRapidas)
    );
  }

  private ordenarNotasRapidas(): void {
    this.notasRapidas.sort((a, b) => {
      if (a.completada !== b.completada) {
        return a.completada ? 1 : -1;
      }

      return new Date(b.actualizadoEn).getTime() -
        new Date(a.actualizadoEn).getTime();
    });
  }

  abrirNuevaNota(): void {
    this.notaEditandoId = null;
    this.notaForm = {
      titulo: '',
      contenido: '',
      recordatorio: ''
    };
    this.mostrarModalNota = true;
  }

  editarNota(nota: NotaRapida): void {
    this.notaEditandoId = nota.id;
    this.notaForm = {
      titulo: nota.titulo,
      contenido: nota.contenido,
      recordatorio: nota.recordatorio || ''
    };
    this.mostrarModalNota = true;
  }

  cerrarModalNota(): void {
    this.mostrarModalNota = false;
    this.notaEditandoId = null;
  }

  guardarNota(): void {
    const titulo = this.notaForm.titulo.trim();
    const contenido = this.notaForm.contenido.trim();

    if (!titulo || !contenido) {
      return;
    }

    const ahora = new Date().toISOString();

    if (this.notaEditandoId === null) {
      this.notasRapidas.unshift({
        id: Date.now(),
        titulo,
        contenido,
        recordatorio: this.notaForm.recordatorio,
        completada: false,
        actualizadoEn: ahora
      });
    } else {
      const nota = this.notasRapidas.find(
        item => item.id === this.notaEditandoId
      );

      if (nota) {
        nota.titulo = titulo;
        nota.contenido = contenido;
        nota.recordatorio = this.notaForm.recordatorio;
        nota.actualizadoEn = ahora;
      }
    }

    this.ordenarNotasRapidas();
    this.guardarNotasRapidas();
    this.cerrarModalNota();
    this.cdr.detectChanges();
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

    this.notasRapidas = this.notasRapidas.filter(
      item => item.id !== this.notaAEliminar!.id
    );

    this.guardarNotasRapidas();
    this.cancelarEliminarNota();
    this.cdr.detectChanges();
  }

  alternarNotaCompletada(nota: NotaRapida): void {
    nota.completada = !nota.completada;
    nota.actualizadoEn = new Date().toISOString();
    this.ordenarNotasRapidas();
    this.guardarNotasRapidas();
  }

  trackNota(_: number, nota: NotaRapida): number {
    return nota.id;
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
}
