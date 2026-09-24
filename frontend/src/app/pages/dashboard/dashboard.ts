import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectorRef
} from '@angular/core';

import {
  CurrencyPipe,
  DecimalPipe,
  DatePipe
} from '@angular/common';

import { FormsModule } from '@angular/forms';

import {
  Router,
  RouterLink,
  RouterLinkActive
} from '@angular/router';

import {
  DashboardService,
  DashboardResponse
} from '../../services/dashboard';

import {
  Producto,
  ProductoService
} from '../../services/producto';


// =====================================================
// INTERFAZ NOTA RÁPIDA
// =====================================================

export interface NotaRapida {
  id: number;
  titulo: string;
  contenido: string;
  recordatorio: string;
  completada: boolean;
  fechaCreacion: string;
}


// =====================================================
// COMPONENTE
// =====================================================

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

  styleUrl: './dashboard.css'
})


export class Dashboard implements OnInit, OnDestroy {


  // ===================================================
  // MENÚ USUARIO
  // ===================================================

  menuUsuarioAbierto: boolean = false;

  mostrarConfirmacion: boolean = false;


  // ===================================================
  // DASHBOARD
  // ===================================================

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


  // ===================================================
  // CONSULTA DE PRODUCTO
  // ===================================================

  productoConsultado: Producto | null = null;

  mostrarConsulta: boolean = false;

  buscandoProducto: boolean = false;

  errorBusquedaProducto: string = '';


  // ===================================================
  // FECHA Y HORA
  // ===================================================

  fechaActual: Date = new Date();

  private relojDashboard: any;


  // ===================================================
  // NOTAS RÁPIDAS
  // ===================================================

  notas: NotaRapida[] = [];

  mostrarModalNota: boolean = false;

  modoEdicionNota: boolean = false;

  notaEditandoId: number | null = null;


  notaFormulario: NotaRapida = {

    id: 0,

    titulo: '',

    contenido: '',

    recordatorio: '',

    completada: false,

    fechaCreacion: ''

  };


  // ===================================================
  // CONSTRUCTOR
  // ===================================================

  constructor(
    private router: Router,

    private dashboardService: DashboardService,

    private productoService: ProductoService,

    private cdr: ChangeDetectorRef
  ) {}


  // ===================================================
  // INICIALIZACIÓN
  // ===================================================

  ngOnInit(): void {

    this.cargarDashboard();

    this.iniciarReloj();

    this.cargarNotas();

  }


  // ===================================================
  // DESTRUCCIÓN
  // ===================================================

  ngOnDestroy(): void {

    if (this.relojDashboard) {

      clearInterval(this.relojDashboard);

    }

  }


  // ===================================================
  // CARGAR DASHBOARD
  // ===================================================

  cargarDashboard(): void {

    this.dashboardService.obtenerDashboard().subscribe({

      next: (respuesta: DashboardResponse) => {

        console.log(
          'DASHBOARD:',
          respuesta
        );


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


  // ===================================================
  // RELOJ
  // ===================================================

  iniciarReloj(): void {

    this.fechaActual = new Date();


    this.relojDashboard = setInterval(() => {

      this.fechaActual = new Date();

      this.cdr.detectChanges();

    }, 1000);

  }


  // ===================================================
  // BÚSQUEDA DE PRODUCTO DESDE DASHBOARD
  // ===================================================

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

        }

        else if (error.status === 401) {

          this.errorBusquedaProducto =
            'Sesión expirada. Inicia sesión nuevamente.';

        }

        else {

          this.errorBusquedaProducto =
            'No se pudo consultar el producto.';

        }


        this.mostrarConsulta = true;

        this.buscandoProducto = false;

        this.cdr.detectChanges();

      }

    });

  }


  // ===================================================
  // CERRAR CONSULTA DE PRODUCTO
  // ===================================================

  cerrarConsultaProducto(): void {

    this.mostrarConsulta = false;

    this.productoConsultado = null;

    this.errorBusquedaProducto = '';

    this.buscandoProducto = false;

    this.cdr.detectChanges();

  }


  // ===================================================
  // NOTAS RÁPIDAS
  // ===================================================

  cargarNotas(): void {

    const notasGuardadas =
      localStorage.getItem('dashboard_notas');


    if (!notasGuardadas) {

      this.notas = [];

      return;

    }


    try {

      this.notas =
        JSON.parse(notasGuardadas);

    }

    catch (error) {

      console.error(
        'ERROR CARGANDO NOTAS:',
        error
      );

      this.notas = [];

    }

  }


  // ===================================================
  // GUARDAR NOTAS
  // ===================================================

  guardarNotas(): void {

    localStorage.setItem(
      'dashboard_notas',
      JSON.stringify(this.notas)
    );

  }


  // ===================================================
  // NUEVA NOTA
  // ===================================================

  abrirNuevaNota(): void {

    this.modoEdicionNota = false;

    this.notaEditandoId = null;


    this.notaFormulario = {

      id: Date.now(),

      titulo: '',

      contenido: '',

      recordatorio: '',

      completada: false,

      fechaCreacion:
        new Date().toISOString()

    };


    this.mostrarModalNota = true;

  }


  // ===================================================
  // EDITAR NOTA
  // ===================================================

  editarNota(nota: NotaRapida): void {

    this.modoEdicionNota = true;

    this.notaEditandoId = nota.id;


    this.notaFormulario = {

      ...nota

    };


    this.mostrarModalNota = true;

  }


  // ===================================================
  // CERRAR MODAL
  // ===================================================

  cerrarModalNota(): void {

    this.mostrarModalNota = false;

    this.modoEdicionNota = false;

    this.notaEditandoId = null;

  }


  // ===================================================
  // GUARDAR NOTA
  // ===================================================

  guardarNota(): void {

    const titulo =
      this.notaFormulario.titulo.trim();


    const contenido =
      this.notaFormulario.contenido.trim();


    if (!titulo) {

      return;

    }


    // -----------------------------------------------
    // EDITAR
    // -----------------------------------------------

    if (this.modoEdicionNota) {

      const indice =
        this.notas.findIndex(
          nota =>
            nota.id === this.notaEditandoId
        );


      if (indice !== -1) {

        this.notas[indice] = {

          ...this.notaFormulario,

          titulo,

          contenido

        };

      }

    }


      // -----------------------------------------------
      // CREAR
    // -----------------------------------------------

    else {

      this.notas.unshift({

        ...this.notaFormulario,

        titulo,

        contenido

      });

    }


    this.guardarNotas();

    this.cerrarModalNota();

  }


  // ===================================================
  // ELIMINAR NOTA
  // ===================================================

  eliminarNota(id: number): void {

    const confirmar =
      window.confirm(
        '¿Deseas eliminar esta nota?'
      );


    if (!confirmar) {

      return;

    }


    this.notas =
      this.notas.filter(
        nota =>
          nota.id !== id
      );


    this.guardarNotas();

  }


  // ===================================================
  // COMPLETAR / DESCOMPLETAR NOTA
  // ===================================================

  alternarNota(nota: NotaRapida): void {

    nota.completada =
      !nota.completada;


    this.guardarNotas();

  }


  // ===================================================
  // MENÚ USUARIO
  // ===================================================

  abrirMenuUsuario(): void {

    this.menuUsuarioAbierto =
      !this.menuUsuarioAbierto;

  }


  cerrarMenuUsuario(): void {

    this.menuUsuarioAbierto = false;

  }


  // ===================================================
  // CERRAR SESIÓN
  // ===================================================

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
