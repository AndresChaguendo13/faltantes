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
  ProductoService,
  Producto
} from '../../services/producto';

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

  ventas: VentaResponse[] = [];

  cargando = false;
  error = '';

  mostrarFormulario = false;

  // =========================
  // BUSCADOR
  // =========================

  codigoBusqueda = '';

  productoEncontrado: Producto | null = null;

  cantidadProducto = 1;

  buscandoProducto = false;

  // =========================
  // CARRITO
  // =========================

  carrito: ProductoCarrito[] = [];

  constructor(
    private ventaService: VentaService,
    private productoService: ProductoService,
    private notification: NotificationService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarVentas();
  }

  // =========================
  // HISTORIAL
  // =========================

  cargarVentas(): void {

    this.cargando = true;
    this.error = '';

    this.ventaService.listar().subscribe({

      next: (ventas) => {

        this.ventas = ventas || [];

        this.cargando = false;

        this.cdr.detectChanges();
      },

      error: (error) => {

        console.error(
          'ERROR AL CARGAR VENTAS:',
          error
        );

        this.cargando = false;

        if (error.status === 401) {

          this.error =
            'Sesión expirada. Inicia sesión nuevamente.';

        } else if (error.status === 403) {

          this.error =
            'No tienes permisos para consultar las ventas.';

        } else if (error.status === 0) {

          this.error =
            'No se pudo conectar con el servidor.';

        } else {

          this.error =
            'No se pudieron cargar las ventas.';
        }

        this.cdr.detectChanges();
      }
    });
  }

  // =========================
  // NUEVA VENTA
  // =========================

  abrirNuevaVenta(): void {

    this.codigoBusqueda = '';
    this.productoEncontrado = null;
    this.cantidadProducto = 1;
    this.carrito = [];

    this.error = '';

    this.mostrarFormulario = true;

    this.cdr.detectChanges();
  }

  cerrarFormulario(): void {

    this.mostrarFormulario = false;

    this.codigoBusqueda = '';
    this.productoEncontrado = null;
    this.cantidadProducto = 1;
    this.carrito = [];

    this.cdr.detectChanges();
  }

  // =========================
  // BUSCAR PRODUCTO
  // =========================

  buscarProducto(): void {

    const codigo = this.codigoBusqueda.trim();

    if (!codigo) {

      this.notification.warning(
        'Ingresa un código de barras.'
      );

      return;
    }

    this.buscandoProducto = true;
    this.productoEncontrado = null;

    this.productoService.buscarPorCodigo(codigo).subscribe({

      next: (producto) => {

        this.productoEncontrado = producto;

        this.cantidadProducto = 1;

        this.buscandoProducto = false;

        this.cdr.detectChanges();
      },

      error: (error) => {

        console.error(
          'ERROR AL BUSCAR PRODUCTO:',
          error
        );

        this.productoEncontrado = null;

        this.buscandoProducto = false;

        if (error.status === 404) {

          this.notification.warning(
            'No existe un producto con ese código de barras.'
          );

        } else if (error.status === 0) {

          this.notification.error(
            'No se pudo conectar con el servidor.'
          );

        } else {

          this.notification.error(
            'No se pudo buscar el producto.'
          );
        }

        this.cdr.detectChanges();
      }
    });
  }

  // =========================
  // AGREGAR AL CARRITO
  // =========================

  agregarAlCarrito(): void {

    if (!this.productoEncontrado) {
      return;
    }

    const cantidad = Number(this.cantidadProducto);

    if (!Number.isInteger(cantidad) || cantidad <= 0) {

      this.notification.warning(
        'La cantidad debe ser mayor que cero.'
      );

      return;
    }

    if (cantidad > this.productoEncontrado.cantidad) {

      this.notification.warning(
        `Solo hay ${this.productoEncontrado.cantidad} unidades disponibles.`
      );

      return;
    }

    const existente = this.carrito.find(
      item => item.producto.id === this.productoEncontrado!.id
    );

    if (existente) {

      const nuevaCantidad =
        existente.cantidad + cantidad;

      if (nuevaCantidad > this.productoEncontrado.cantidad) {

        this.notification.warning(
          `No puedes agregar más de ${this.productoEncontrado.cantidad} unidades.`
        );

        return;
      }

      existente.cantidad = nuevaCantidad;

      existente.subtotal =
        nuevaCantidad * existente.precioUnitario;

    } else {

      const precio =
        Number(
          this.productoEncontrado.precioVenta ??
          this.productoEncontrado.precio ??
          0
        );

      this.carrito.push({

        producto: this.productoEncontrado,

        cantidad: cantidad,

        precioUnitario: precio,

        subtotal: cantidad * precio

      });
    }

    this.notification.success(
      'Producto agregado al carrito.'
    );

    this.codigoBusqueda = '';
    this.productoEncontrado = null;
    this.cantidadProducto = 1;

    this.cdr.detectChanges();
  }

  // =========================
  // AUMENTAR CANTIDAD
  // =========================

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

  // =========================
  // DISMINUIR CANTIDAD
  // =========================

  disminuirCantidad(item: ProductoCarrito): void {

    if (item.cantidad <= 1) {
      return;
    }

    item.cantidad--;

    item.subtotal =
      item.cantidad * item.precioUnitario;

    this.cdr.detectChanges();
  }

  // =========================
  // ELIMINAR PRODUCTO
  // =========================

  eliminarDelCarrito(item: ProductoCarrito): void {

    this.carrito =
      this.carrito.filter(
        producto => producto.producto.id !== item.producto.id
      );

    this.cdr.detectChanges();
  }

  // =========================
  // TOTAL
  // =========================

  obtenerTotalCarrito(): number {

    return this.carrito.reduce(
      (total, item) =>
        total + item.subtotal,
      0
    );
  }

  // =========================
  // HISTORIAL
  // =========================

  verVenta(venta: VentaResponse): void {

    console.log(
      'VENTA SELECCIONADA:',
      venta
    );
  }

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
