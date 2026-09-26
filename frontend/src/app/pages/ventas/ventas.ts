import {
  Component,
  OnInit,
  ChangeDetectorRef,
  HostListener
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  VentaService,
  VentaRequest

} from '../../services/ventas';

import {
  ProductoService,
  Producto
} from '../../services/producto';

import {
  CategoriaService,
  Categoria
} from '../../services/categoria';

import {
  ClienteService,
  Cliente
} from '../../services/cliente.service';



import { NotificationService } from '../../shared/services/notification.service';

interface ProductoCarrito {
  producto: Producto;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

@Component({
  selector: 'app-ventas',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './ventas.html',
  styleUrl: './ventas.css'
})
export class Ventas implements OnInit {

  cargandoProductos = false;

  productos: Producto[] = [];
  productosVisibles: Producto[] = [];
  private bufferEscaner = '';
  private ultimoEventoEscaner = 0;
  private temporizadorEscaner: any;

  categorias: Categoria[] = [];
  categoriaSeleccionada: number | null = null;

  codigoBusqueda = '';
  buscandoProducto = false;


  private temporizadorBusqueda: any;

  carrito: ProductoCarrito[] = [];

  mostrarFinalizarVenta = false;

  tipoPago: 'CONTADO' | 'FIADO' = 'CONTADO';

  montoRecibido = 0;

  clienteSeleccionadoId: number | null = null;

  clientes: Cliente[] = [];

  cargandoClientes = false;

  guardandoVenta = false;

  constructor(
    private productoService: ProductoService,
    private categoriaService: CategoriaService,
    private clienteService: ClienteService,
    private ventaService: VentaService,
    private notification: NotificationService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarProductosPOS();
    this.cargarCategorias();

    setTimeout(() => this.enfocarBuscador());
  }

  // =========================
  // PRODUCTOS
  // =========================

  private cargarProductosPOS(): void {

    this.cargandoProductos = true;

    this.productoService.listarAleatoriosParaVenta().subscribe({

      next: (productos) => {

        this.productos = productos || [];
        this.productosVisibles = [...this.productos];

        this.cargandoProductos = false;

        this.cdr.detectChanges();
      },

      error: (error) => {

        console.error(
          'ERROR CARGANDO PRODUCTOS POS:',
          error
        );

        this.cargandoProductos = false;

        this.notification.error(
          'No fue posible cargar los productos para la venta.',
          'Error'
        );

        this.cdr.detectChanges();
      }
    });
  }

  private cargarCategorias(): void {

    this.categoriaService.listar().subscribe({

      next: (categorias) => {

        this.categorias = categorias || [];

        this.cdr.detectChanges();
      },

      error: (error) => {

        console.error('ERROR CARGANDO CATEGORÍAS:', error);

        this.categorias = [];

        this.cdr.detectChanges();
      }
    });
  }

  ///SCANEA EN CUALQUIER PARTE
  @HostListener('document:keydown', ['$event'])
  manejarEscanerGlobal(event: KeyboardEvent): void {

    const ahora = Date.now();

    // Si estamos escribiendo directamente en el buscador,
    // dejamos que el buscador normal se encargue.
    const elemento = event.target as HTMLElement;

    if (elemento?.id === 'codigoBusqueda') {
      return;
    }

    // El lector de código de barras normalmente envía
    // los caracteres extremadamente rápido.
    const diferencia = ahora - this.ultimoEventoEscaner;

    if (diferencia > 100) {
      this.bufferEscaner = '';
    }

    this.ultimoEventoEscaner = ahora;

    // ENTER = terminó el escaneo
    if (event.key === 'Enter') {

      const codigo = this.bufferEscaner.trim();

      this.bufferEscaner = '';

      clearTimeout(this.temporizadorEscaner);

      // Los códigos de barras normalmente tienen
      // varios caracteres.
      if (codigo.length >= 6) {

        event.preventDefault();
        event.stopPropagation();

        this.codigoBusqueda = codigo;

        this.buscarProducto();

      }

      return;
    }

    // Solo capturamos caracteres normales
    if (event.key.length === 1) {

      this.bufferEscaner += event.key;

      clearTimeout(this.temporizadorEscaner);

      this.temporizadorEscaner = setTimeout(() => {
        this.bufferEscaner = '';
      }, 150);

    }
  }
  // =========================
  // FILTROS
  // =========================

  buscarMientrasEscribe(): void {

    clearTimeout(this.temporizadorBusqueda);

    const termino = this.codigoBusqueda.trim();

    // Si se borra la búsqueda,
    // volvemos a mostrar los productos iniciales.
    if (!termino) {

      this.productosVisibles = [...this.productos];

      this.cdr.detectChanges();

      return;
    }

    // Comenzamos a buscar desde 2 caracteres.
    if (termino.length < 2) {

      return;
    }

    this.temporizadorBusqueda = setTimeout(() => {

      this.productoService.buscarParaVenta(termino).subscribe({

        next: (respuesta) => {

          this.productosVisibles =
            (respuesta.content || []).slice(0, 20);

          this.cdr.detectChanges();

        },

        error: (error) => {

          console.error(
            'ERROR BUSCANDO PRODUCTOS:',
            error
          );

          this.productosVisibles = [];

          this.cdr.detectChanges();

        }

      });

    }, 250);
  }

  private aplicarFiltros(termino: string): void {

    this.productosVisibles = this.productos.filter(producto => {

      const coincideTexto =
        !termino ||
        producto.nombre?.toLowerCase().includes(termino) ||
        producto.codigoBarras?.toLowerCase().includes(termino) ||
        producto.proveedor?.toLowerCase().includes(termino);

      const coincideCategoria =
        this.categoriaSeleccionada === null ||
        this.obtenerCategoriaId(producto) === this.categoriaSeleccionada;

      return coincideTexto && coincideCategoria;
    });

    this.cdr.detectChanges();
  }

  seleccionarCategoria(id: number | null): void {

    this.categoriaSeleccionada = id;

    this.aplicarFiltros(
      this.codigoBusqueda.trim().toLowerCase()
    );
  }

  limpiarFiltros(): void {

    this.codigoBusqueda = '';
    this.categoriaSeleccionada = null;
    this.productosVisibles = [...this.productos];

    setTimeout(() => this.enfocarBuscador());

    this.cdr.detectChanges();
  }

  private obtenerCategoriaId(producto: Producto): number | null {

    if (producto.categoriaId != null) {
      return producto.categoriaId;
    }

    if (
      producto.categoria &&
      typeof producto.categoria === 'object' &&
      producto.categoria.id != null
    ) {
      return Number(producto.categoria.id);
    }

    return null;
  }

  obtenerNombreCategoria(producto: Producto): string {

    if (producto.categoriaNombre) {
      return producto.categoriaNombre;
    }

    if (
      producto.categoria &&
      typeof producto.categoria === 'object' &&
      producto.categoria.nombre
    ) {
      return producto.categoria.nombre;
    }

    return 'Sin categoría';
  }

  // =========================
  // ESCÁNER
  // =========================

  buscarProducto(): void {

    const termino = this.codigoBusqueda.trim();

    if (!termino) {
      return;
    }

    clearTimeout(this.temporizadorBusqueda);

    this.buscandoProducto = true;

    // Primero intentamos código exacto.
    this.productoService.buscarPorCodigo(termino).subscribe({

      next: (producto) => {

        this.buscandoProducto = false;

        // Código de barras exacto:
        // entra directamente al carrito.
        this.agregarProductoDirectamente(producto);

      },

      error: (error) => {

        if (error.status === 404) {

          // No es código exacto.
          // Buscamos por nombre, código parcial o proveedor.
          this.productoService.buscarParaVenta(termino).subscribe({

            next: (respuesta) => {

              this.buscandoProducto = false;

              const productos =
                (respuesta.content || []).slice(0, 20);

              this.productosVisibles = productos;

              if (productos.length === 0) {

                this.notification.warning(
                  `No encontramos productos para "${termino}".`,
                  'Producto no encontrado'
                );

              }

              this.cdr.detectChanges();

            },

            error: () => {

              this.buscandoProducto = false;

              this.productosVisibles = [];

              this.notification.error(
                'No fue posible buscar el producto.',
                'Error de búsqueda'
              );

              this.cdr.detectChanges();

            }

          });

          return;
        }

        this.buscandoProducto = false;

        this.notification.error(
          'No fue posible buscar el producto.',
          'Error de búsqueda'
        );

        this.cdr.detectChanges();

      }

    });
  }

  // =========================
  // CARRITO
  // =========================

  private agregarProductoDirectamente(producto: Producto): void {

    if (producto.cantidad <= 0) {

      this.notification.warning(
        `El producto "${producto.nombre}" no tiene stock disponible.`,
        'Sin stock'
      );

      this.limpiarBusqueda();
      return;
    }

    const existente = this.carrito.find(
      item => item.producto.id === producto.id
    );

    if (existente) {

      if (existente.cantidad >= producto.cantidad) {

        this.notification.warning(
          `No hay más unidades disponibles de "${producto.nombre}".`,
          'Stock máximo'
        );

        this.limpiarBusqueda();
        return;
      }

      existente.cantidad++;
      existente.subtotal =
        existente.cantidad * existente.precioUnitario;

    } else {

      const precio =
        Number(
          producto.precioVenta ??
          producto.precio ??
          0
        );

      this.carrito.push({
        producto,
        cantidad: 1,
        precioUnitario: precio,
        subtotal: precio
      });
    }

    // Sin alerta de producto agregado.
    this.limpiarBusqueda();

    this.cdr.detectChanges();
  }

  seleccionarProducto(producto: Producto): void {
    this.agregarProductoDirectamente(producto);
  }

  private limpiarBusqueda(): void {

    clearTimeout(this.temporizadorBusqueda);

    this.codigoBusqueda = '';

    // Volver a mostrar los productos iniciales.
    this.productosVisibles = [...this.productos];

    setTimeout(() => {
      this.enfocarBuscador();
    });

    this.cdr.detectChanges();
  }

  private enfocarBuscador(): void {

    const input = document.querySelector(
      '#codigoBusqueda'
    ) as HTMLInputElement | null;

    input?.focus();
  }

  aumentarCantidad(item: ProductoCarrito): void {

    if (item.cantidad >= item.producto.cantidad) {

      this.notification.warning(
        `Stock máximo disponible: ${item.producto.cantidad}.`
      );

      return;
    }

    item.cantidad++;
    item.subtotal =
      item.cantidad * item.precioUnitario;

    this.cdr.detectChanges();
  }

  disminuirCantidad(item: ProductoCarrito): void {

    if (item.cantidad <= 1) {
      return;
    }

    item.cantidad--;
    item.subtotal =
      item.cantidad * item.precioUnitario;

    this.cdr.detectChanges();
  }

  eliminarDelCarrito(item: ProductoCarrito): void {

    this.carrito =
      this.carrito.filter(
        producto => producto.producto.id !== item.producto.id
      );

    this.cdr.detectChanges();
  }

  vaciarCarrito(): void {

    if (this.carrito.length === 0) {
      return;
    }

    this.carrito = [];

    this.cdr.detectChanges();
  }

  obtenerTotalCarrito(): number {

    return this.carrito.reduce(
      (total, item) =>
        total + item.subtotal,
      0
    );
  }

  obtenerCantidadCarrito(): number {

    return this.carrito.reduce(
      (total, item) =>
        total + item.cantidad,
      0
    );
  }

  continuarVenta(): void {

    if (this.carrito.length === 0) {
      return;
    }

    this.tipoPago = 'CONTADO';

    this.montoRecibido =
      this.obtenerTotalCarrito();

    this.clienteSeleccionadoId = null;

    // Cargar clientes para tenerlos listos
    // si el usuario selecciona FIADO.
    this.cargarClientes();

    this.mostrarFinalizarVenta = true;

    this.cdr.detectChanges();
  }

  volverAlCarrito(): void {
    this.mostrarFinalizarVenta = false;

    this.cdr.detectChanges();
  }

  seleccionarTipoPago(tipo: 'CONTADO' | 'FIADO'): void {
    this.tipoPago = tipo;

    if (tipo === 'CONTADO') {
      this.montoRecibido = this.obtenerTotalCarrito();
      this.clienteSeleccionadoId = null;
    } else {
      this.montoRecibido = 0;
    }

    this.cdr.detectChanges();
  }

  obtenerCambio(): number {
    const total = this.obtenerTotalCarrito();

    return Math.max(
      0,
      Number(this.montoRecibido || 0) - total
    );
  }





  obtenerClaseStock(producto: Producto): string {

    if (producto.cantidad <= 0) {
      return 'sin-stock';
    }

    if (
      producto.stockMinimo != null &&
      producto.cantidad <= producto.stockMinimo
    ) {
      return 'stock-bajo';
    }

    return 'stock-normal';
  }

  obtenerTextoStock(producto: Producto): string {

    if (producto.cantidad <= 0) {
      return 'Sin stock';
    }

    return `${producto.cantidad} disponibles`;
  }


  // ======================================================
// FINALIZAR VENTA
// ======================================================




  cargarClientes(): void {
    this.cargandoClientes = true;

    this.clienteService.listar().subscribe({
      next: (clientes) => {
        this.clientes = clientes.filter(cliente => cliente.activo);
        this.cargandoClientes = false;

        this.cdr.detectChanges();
      },

      error: (error) => {
        console.error('ERROR CARGANDO CLIENTES:', error);

        this.clientes = [];
        this.cargandoClientes = false;

        this.notification.error(
          'No fue posible cargar los clientes.',
          'Error'
        );

        this.cdr.detectChanges();
      }
    });
  }


  confirmarVenta(): void {

    if (this.carrito.length === 0) {
      return;
    }

    const total = this.obtenerTotalCarrito();

    // -----------------------------------------
    // VALIDACIÓN CONTADO
    // -----------------------------------------

    if (this.tipoPago === 'CONTADO') {

      if (Number(this.montoRecibido || 0) < total) {

        this.notification.warning(
          'El dinero recibido no puede ser menor al total de la venta.',
          'Dinero insuficiente'
        );

        return;
      }
    }

    // -----------------------------------------
    // VALIDACIÓN FIADO
    // -----------------------------------------

    if (
      this.tipoPago === 'FIADO' &&
      this.clienteSeleccionadoId === null
    ) {

      this.notification.warning(
        'Debes seleccionar un cliente para registrar una venta fiada.',
        'Cliente requerido'
      );

      return;
    }

    // -----------------------------------------
    // PREPARAR VENTA
    // -----------------------------------------

    const venta: VentaRequest = {

      tipoPago: this.tipoPago,

      clienteId:
        this.tipoPago === 'FIADO'
          ? this.clienteSeleccionadoId
          : null,

      detalles: this.carrito.map(item => ({
        productoId: item.producto.id,
        cantidad: item.cantidad
      }))
    };

    this.guardandoVenta = true;

    // -----------------------------------------
    // GUARDAR EN BACKEND
    // -----------------------------------------

    this.ventaService.crear(venta).subscribe({

      next: (respuesta) => {

        console.log('VENTA REGISTRADA:', respuesta);

        this.guardandoVenta = false;

        this.mostrarFinalizarVenta = false;

        this.carrito = [];

        this.codigoBusqueda = '';

        this.montoRecibido = 0;

        this.clienteSeleccionadoId = null;

        this.tipoPago = 'CONTADO';

        this.notification.success(
          `Venta #${respuesta.id} registrada correctamente.`,
          'Venta realizada'
        );

        this.cargarProductosPOS();

        this.cdr.detectChanges();
      },

      error: (error) => {

        console.error('ERROR REGISTRANDO VENTA:', error);

        this.guardandoVenta = false;

        let mensaje =
          'No fue posible registrar la venta.';

        if (error?.error?.message) {
          mensaje = error.error.message;
        }

        this.notification.error(
          mensaje,
          'Error al registrar venta'
        );

        this.cdr.detectChanges();
      }
    });
  }


}
