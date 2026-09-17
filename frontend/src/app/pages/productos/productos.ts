import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  ChangeDetectorRef,
  ViewChild,
  ElementRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  Producto,
  ProductoService
} from '../../services/producto';

import {
  Categoria,
  CategoriaService
} from '../../services/categoria';

import {
  Proveedor,
  ProveedorService
} from '../../services/proveedor';

import { finalize } from 'rxjs';


@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './productos.html',
  styleUrl: './productos.css'
})
export class Productos implements OnInit, AfterViewInit, OnDestroy {


  // =====================================================
  // REFERENCIAS
  // =====================================================

  @ViewChild('busquedaInput')
  busquedaInput!: ElementRef<HTMLInputElement>;

  @ViewChild('codigoBarrasInput')
  codigoBarrasInput!: ElementRef<HTMLInputElement>;


  // =====================================================
  // PRODUCTOS
  // =====================================================

  productos: Producto[] = [];

  productosVisibles: Producto[] = [];

  categorias: Categoria[] = [];

  proveedores: Proveedor[] = [];
  // =====================================================
  // ESTADOS
  // =====================================================

  cargando: boolean = false;

  guardando: boolean = false;

  buscando: boolean = false;

  error: string = '';

  mensaje: string = '';

  errorBusqueda: string = '';


  // =====================================================
  // FORMULARIO
  // =====================================================

  mostrarFormulario: boolean = false;

  modoEdicion: boolean = false;

  productoEditandoId: number | null = null;

  productoNuevo = {
    nombre: '',
    codigoBarras: '',
    cantidad: 0,
    precio: 0,
    stockMinimo: 0,
    costoCompra: 0,
    precioVenta: 0,
    categoriaId: null as number | null,
    proveedor: '',
    fechaVencimiento: ''
  };


  // =====================================================
  // CONSULTA RÁPIDA
  // =====================================================

  terminoBusqueda: string = '';

  filtroEstado: string = '';

  filtroVencimiento: string = '';

  filtroCategoria: number | null = null;


  productoConsultado: Producto | null = null;

  mostrarConsulta: boolean = false;


  // =====================================================
  // CONTROL DE FOCO
  // =====================================================

  private intervaloFoco: any;


  // =====================================================
  // CONSTRUCTOR
  // =====================================================

  constructor(
    private productoService: ProductoService,
    private categoriaService: CategoriaService,
    private proveedorService: ProveedorService,
    private cdr: ChangeDetectorRef
  ) {}


  // =====================================================
  // INICIO
  // =====================================================

  ngOnInit(): void {
    this.cargarProductos();
    this.cargarCategorias();
    this.cargarProveedores();
  }


  // =====================================================
  // VISTA
  // =====================================================

  ngAfterViewInit(): void {

    setTimeout(() => {

      this.enfocarBuscador();

    }, 500);


    this.intervaloFoco = setInterval(() => {

      this.mantenerLectorPreparado();

    }, 1000);

  }


  // =====================================================
  // DESTRUIR COMPONENTE
  // =====================================================

  ngOnDestroy(): void {

    if (this.intervaloFoco) {

      clearInterval(this.intervaloFoco);

    }

  }


  // =====================================================
  // MANTENER LECTOR PREPARADO
  // =====================================================

  mantenerLectorPreparado(): void {

    if (this.mostrarFormulario) {

      return;

    }


    const elementoActivo =
      document.activeElement;


    if (
      elementoActivo &&
      elementoActivo !== document.body &&
      elementoActivo !== this.busquedaInput?.nativeElement
    ) {

      if (!this.mostrarConsulta) {

        return;

      }

    }


    this.enfocarBuscador();

  }


  // =====================================================
  // ENFOCAR BUSCADOR
  // =====================================================

  enfocarBuscador(): void {

    if (this.mostrarFormulario) {

      return;

    }


    if (!this.busquedaInput) {

      return;

    }


    const input =
      this.busquedaInput.nativeElement;


    if (
      document.activeElement !== input
    ) {

      input.focus();

    }

  }


  // =====================================================
  // CARGAR PRODUCTOS
  // =====================================================

  cargarProductos(): void {

    this.cargando = true;

    this.error = '';


    this.productoService.listar().subscribe({

      next: (respuesta) => {

        console.log(
          'PRODUCTOS RECIBIDOS:',
          respuesta
        );


        this.productos =
          respuesta.content || [];


        this.productosVisibles =
          [...this.productos];


        this.cargando = false;


        this.cdr.detectChanges();

      },


      error: (error) => {

        console.error(
          'ERROR AL CARGAR PRODUCTOS:',
          error
        );


        this.cargando = false;


        if (error.status === 401) {

          this.error =
            'Sesión expirada. Inicia sesión nuevamente.';

        } else if (error.status === 0) {

          this.error =
            'No se pudo conectar con el servidor.';

        } else {

          this.error =
            'No se pudieron cargar los productos.';

        }


        this.cdr.detectChanges();

      }

    });

  }

  cargarCategorias(): void {
    this.categoriaService.listar().subscribe({
      next: (categorias) => {
        this.categorias = categorias || [];
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('ERROR AL CARGAR CATEGORÍAS:', error);
        this.categorias = [];
      }
    });
  }

  cargarProveedores(): void {
    this.proveedorService.listar().subscribe({
      next: (proveedores) => {
        this.proveedores = proveedores || [];
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('ERROR AL CARGAR PROVEEDORES:', error);
        this.proveedores = [];
      }
    });
  }


  // =====================================================
  // FILTRAR PRODUCTOS
  //
  // Se ejecuta mientras el empleado escribe.
  // =====================================================

  filtrarProductos(): void {

    const texto =
      this.terminoBusqueda
        .trim()
        .toLowerCase();

    this.productosVisibles =
      this.productos.filter((producto) => {

        // ==========================================
        // FILTRO POR TEXTO
        // ==========================================

        const nombre =
          (producto.nombre || '')
            .toLowerCase();

        const codigo =
          (producto.codigoBarras || '')
            .toLowerCase();

        const coincideTexto =
          !texto ||
          nombre.includes(texto) ||
          codigo.includes(texto);


        // ==========================================
        // FILTRO POR ESTADO DE STOCK
        // ==========================================

        const stockBajo =
          producto.cantidad <= producto.stockMinimo;

        const coincideEstado =
          !this.filtroEstado ||
          (this.filtroEstado === 'bajo' && stockBajo) ||
          (this.filtroEstado === 'normal' && !stockBajo);


        // ==========================================
        // FILTRO POR CATEGORÍA
        // ==========================================

        const coincideCategoria =
          !this.filtroCategoria ||
          producto.categoriaId === this.filtroCategoria;

        // ==========================================
        // FILTRO POR VENCIMIENTO
        // ==========================================

        const estadoVencimiento =
          this.obtenerEstadoVencimiento(
            producto.fechaVencimiento
          );

        const coincideVencimiento =
          !this.filtroVencimiento ||
          estadoVencimiento === this.filtroVencimiento;


        // ==========================================
        // RESULTADO
        // ==========================================

        return (
          coincideTexto &&
          coincideEstado &&
          coincideCategoria &&
          coincideVencimiento
        );

      });

    this.cdr.detectChanges();
  }

  // =====================================================
// ESTADO DE VENCIMIENTO
// =====================================================

  obtenerEstadoVencimiento(
    fecha: string | null | undefined
  ): string {

    if (!fecha) {
      return 'sin-fecha';
    }

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const vencimiento = new Date(fecha);
    vencimiento.setHours(0, 0, 0, 0);

    if (vencimiento < hoy) {
      return 'vencido';
    }

    const diferencia =
      vencimiento.getTime() - hoy.getTime();

    const dias =
      Math.ceil(
        diferencia / (1000 * 60 * 60 * 24)
      );

    if (dias <= 30) {
      return 'proximo';
    }

    return 'vigente';
  }


  textoVencimiento(
    fecha: string | null | undefined
  ): string {

    const estado =
      this.obtenerEstadoVencimiento(fecha);

    if (estado === 'vencido') {
      return 'Vencido';
    }

    if (estado === 'proximo') {
      return 'Próximo a vencer';
    }

    if (estado === 'vigente') {
      return 'Vigente';
    }

    return 'Sin fecha';
  }

  // =====================================================
  // ENTER EN BUSCADOR
  //
  // Si coincide exactamente con un código,
  // abrimos el modal.
  //
  // Si es un nombre, mantenemos el filtro.
  // =====================================================

  buscarProductoEscaneado(): void {

    const texto =
      this.terminoBusqueda.trim();


    if (!texto) {

      return;

    }


    if (this.mostrarFormulario) {

      return;

    }


    console.log(
      'BUSQUEDA:',
      texto
    );


    // =================================================
    // PRIMERO BUSCAMOS LOCALMENTE
    // =================================================

    const productoLocal =
      this.productos.find((producto) => {

        return (
          producto.codigoBarras &&
          producto.codigoBarras.toLowerCase() ===
          texto.toLowerCase()
        );

      });


    // =================================================
    // SI EXISTE LOCALMENTE
    // ABRIMOS DIRECTAMENTE EL MODAL
    // =================================================

    if (productoLocal) {

      this.productoConsultado =
        productoLocal;

      this.errorBusqueda = '';

      this.mostrarConsulta = true;


      this.terminoBusqueda = '';


      this.productosVisibles =
        [...this.productos];


      this.cdr.detectChanges();


      setTimeout(() => {

        this.enfocarBuscador();

      }, 150);


      return;

    }


    // =================================================
    // SI NO EXISTE LOCALMENTE
    //
    // Consultamos el backend por código.
    // Esto permite encontrar productos que no estén
    // en la página actualmente cargada.
    // =================================================

    this.buscarPorCodigoBackend(texto);

  }


  // =====================================================
  // CONSULTAR CÓDIGO EN BACKEND
  // =====================================================

  private buscarPorCodigoBackend(
    codigo: string
  ): void {

    this.buscando = true;

    this.errorBusqueda = '';


    this.productoService
      .buscarPorCodigo(codigo)

      .pipe(

        finalize(() => {

          this.buscando = false;

          this.terminoBusqueda = '';

          this.cdr.detectChanges();


          setTimeout(() => {

            this.enfocarBuscador();

          }, 150);

        })

      )

      .subscribe({

        next: (producto) => {

          console.log(
            'PRODUCTO ENCONTRADO:',
            producto
          );


          this.productoConsultado =
            producto;


          this.errorBusqueda = '';

          this.mostrarConsulta = true;


          this.cdr.detectChanges();

        },


        error: (error) => {

          console.error(
            'ERROR BUSCANDO PRODUCTO:',
            error
          );


          this.productoConsultado = null;


          if (error.status === 404) {

            this.errorBusqueda =
              'Producto no encontrado.';

          } else if (error.status === 401) {

            this.errorBusqueda =
              'Sesión expirada. Inicia sesión nuevamente.';

          } else {

            this.errorBusqueda =
              'No se pudo consultar el producto.';

          }


          this.mostrarConsulta = true;


          this.cdr.detectChanges();

        }

      });

  }


  // =====================================================
  // CERRAR CONSULTA
  // =====================================================

  cerrarConsulta(): void {

    this.mostrarConsulta = false;

    this.productoConsultado = null;

    this.errorBusqueda = '';

    this.terminoBusqueda = '';


    this.productosVisibles =
      [...this.productos];


    this.cdr.detectChanges();


    setTimeout(() => {

      this.enfocarBuscador();

    }, 150);

  }

  // =====================================================
// EDITAR PRODUCTO
// =====================================================

  editarProducto(producto: Producto): void {
    this.mensaje = '';
    this.error = '';

    this.modoEdicion = true;
    this.productoEditandoId = producto.id;

    this.productoNuevo = {
      nombre: producto.nombre || '',
      codigoBarras: producto.codigoBarras || '',
      cantidad: producto.cantidad ?? 0,
      precio: producto.precio ?? producto.precioVenta ?? 0,
      stockMinimo: producto.stockMinimo ?? 0,
      costoCompra: producto.costoCompra ?? 0,
      precioVenta: producto.precioVenta ?? producto.precio ?? 0,
      categoriaId:
        (producto as any).categoriaId ??
        producto.categoria?.id ??
        null,
      proveedor: producto.proveedor || '',
      fechaVencimiento: producto.fechaVencimiento || ''
    };

    this.mostrarFormulario = true;

    this.cdr.detectChanges();

    setTimeout(() => {
      if (this.codigoBarrasInput) {
        this.codigoBarrasInput.nativeElement.focus();
        this.codigoBarrasInput.nativeElement.select();
      }
    }, 150);
  }


  // =====================================================
  // ABRIR FORMULARIO
  // =====================================================

  abrirFormulario(): void {

    this.mensaje = '';

    this.error = '';

    this.modoEdicion = false;

    this.productoEditandoId = null;

    this.productoNuevo = {
      nombre: '',
      codigoBarras: '',
      cantidad: 0,
      precio: 0,
      stockMinimo: 0,
      costoCompra: 0,
      precioVenta: 0,
      categoriaId: null,
      proveedor: '',
      fechaVencimiento: ''
    };


    this.mostrarFormulario = true;


    this.cdr.detectChanges();


    setTimeout(() => {

      if (this.codigoBarrasInput) {

        this.codigoBarrasInput
          .nativeElement
          .focus();

        this.codigoBarrasInput
          .nativeElement
          .select();

      }

    }, 150);

  }


  // =====================================================
  // CERRAR FORMULARIO
  // =====================================================

  cerrarFormulario(): void {

    if (this.guardando) {

      return;

    }


    this.mostrarFormulario = false;


    this.cdr.detectChanges();


    setTimeout(() => {

      this.enfocarBuscador();

    }, 150);

  }


  // =====================================================
  // GUARDAR PRODUCTO
  // =====================================================

  guardarProducto(): void {
    this.mensaje = '';
    this.error = '';

    if (!this.productoNuevo.nombre.trim()) {
      this.error = 'El nombre del producto es obligatorio.';
      return;
    }

    if (!this.productoNuevo.codigoBarras.trim()) {
      this.error = 'El código de barras es obligatorio.';
      return;
    }

    if (this.productoNuevo.cantidad < 0) {
      this.error = 'La cantidad no puede ser negativa.';
      return;
    }

    if (this.productoNuevo.stockMinimo < 0) {
      this.error = 'El stock mínimo no puede ser negativo.';
      return;
    }

    if (this.productoNuevo.costoCompra < 0) {
      this.error = 'El costo de compra no puede ser negativo.';
      return;
    }

    if (this.productoNuevo.precio <= 0) {
      this.error = 'El precio debe ser mayor que cero.';
      return;
    }

    if (this.productoNuevo.precioVenta <= 0) {
      this.error = 'El precio de venta debe ser mayor que cero.';
      return;
    }

    this.guardando = true;

    const producto = {
      nombre: this.productoNuevo.nombre.trim(),
      codigoBarras: this.productoNuevo.codigoBarras.trim(),
      cantidad: this.productoNuevo.cantidad,
      precio: this.productoNuevo.precio,
      stockMinimo: this.productoNuevo.stockMinimo,
      costoCompra: this.productoNuevo.costoCompra,
      precioVenta: this.productoNuevo.precioVenta,
      proveedor: this.productoNuevo.proveedor.trim(),
      fechaVencimiento:
        this.productoNuevo.fechaVencimiento || null,
      categoriaId: this.productoNuevo.categoriaId
    };

    console.log('ENVIANDO PRODUCTO:', producto);

    this.productoService
      .crear(producto)
      .pipe(
        finalize(() => {
          this.guardando = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: (respuesta) => {
          console.log('PRODUCTO CREADO:', respuesta);

          this.mostrarFormulario = false;
          this.mensaje = 'Producto creado correctamente.';

          this.cargarProductos();

          setTimeout(() => {
            this.enfocarBuscador();
          }, 300);
        },

        error: (error) => {
          console.error('ERROR AL CREAR PRODUCTO:', error);

          if (error.status === 400) {
            this.error =
              error.error?.message ||
              'Los datos del producto no son válidos.';
          } else if (error.status === 409) {
            this.error =
              'Ya existe un producto con ese código de barras.';
          } else if (error.status === 401) {
            this.error =
              'Sesión expirada. Inicia sesión nuevamente.';
          } else if (error.status === 403) {
            this.error =
              'No tienes permisos para crear productos.';
          } else if (error.status === 0) {
            this.error =
              'No se pudo conectar con el servidor.';
          } else {
            this.error =
              'No se pudo crear el producto.';
          }

          this.cdr.detectChanges();
        }
      });
  }
// =====================================================
// GUARDAR O ACTUALIZAR PRODUCTO
// =====================================================

  guardarOActualizarProducto(): void {

    if (this.modoEdicion) {

      this.actualizarProducto();

    } else {

      this.guardarProducto();

    }
  }

  // =====================================================
// ACTUALIZAR PRODUCTO
// =====================================================

  private actualizarProducto(): void {
    this.mensaje = '';
    this.error = '';

    if (this.productoEditandoId === null) {
      this.error = 'No se encontró el producto a editar.';
      return;
    }

    if (!this.productoNuevo.nombre.trim()) {
      this.error = 'El nombre del producto es obligatorio.';
      return;
    }

    if (!this.productoNuevo.codigoBarras.trim()) {
      this.error = 'El código de barras es obligatorio.';
      return;
    }

    if (this.productoNuevo.cantidad < 0) {
      this.error = 'La cantidad no puede ser negativa.';
      return;
    }

    if (this.productoNuevo.stockMinimo < 0) {
      this.error = 'El stock mínimo no puede ser negativo.';
      return;
    }

    if (this.productoNuevo.costoCompra < 0) {
      this.error = 'El costo de compra no puede ser negativo.';
      return;
    }

    if (this.productoNuevo.precio <= 0) {
      this.error = 'El precio debe ser mayor que cero.';
      return;
    }

    if (this.productoNuevo.precioVenta <= 0) {
      this.error = 'El precio de venta debe ser mayor que cero.';
      return;
    }

    this.guardando = true;

    const producto = {
      id: this.productoEditandoId,
      nombre: this.productoNuevo.nombre.trim(),
      codigoBarras: this.productoNuevo.codigoBarras.trim(),
      cantidad: this.productoNuevo.cantidad,
      precio: this.productoNuevo.precio,
      stockMinimo: this.productoNuevo.stockMinimo,
      costoCompra: this.productoNuevo.costoCompra,
      precioVenta: this.productoNuevo.precioVenta,
      proveedor: this.productoNuevo.proveedor.trim(),
      fechaVencimiento:
        this.productoNuevo.fechaVencimiento || null,
      categoria: this.productoNuevo.categoriaId
        ? {
          id: this.productoNuevo.categoriaId
        }
        : null
    };

    console.log('ACTUALIZANDO PRODUCTO:', producto);

    this.productoService
      .actualizar(this.productoEditandoId, producto)
      .pipe(
        finalize(() => {
          this.guardando = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: (respuesta) => {
          console.log('PRODUCTO ACTUALIZADO:', respuesta);

          this.modoEdicion = false;
          this.productoEditandoId = null;
          this.mostrarFormulario = false;

          this.mensaje =
            'Producto actualizado correctamente.';

          this.cargarProductos();

          setTimeout(() => {
            this.enfocarBuscador();
          }, 300);
        },

        error: (error) => {
          console.error(
            'ERROR AL ACTUALIZAR PRODUCTO:',
            error
          );

          if (error.status === 400) {
            this.error =
              error.error?.message ||
              'Los datos del producto no son válidos.';
          } else if (error.status === 409) {
            this.error =
              'Ya existe otro producto con ese código de barras.';
          } else if (error.status === 401) {
            this.error =
              'Sesión expirada. Inicia sesión nuevamente.';
          } else if (error.status === 403) {
            this.error =
              'No tienes permisos para actualizar productos.';
          } else if (error.status === 0) {
            this.error =
              'No se pudo conectar con el servidor.';
          } else {
            this.error =
              'No se pudo actualizar el producto.';
          }

          this.cdr.detectChanges();
        }
      });
  }

}
