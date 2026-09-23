import { CommonModule } from '@angular/common';
import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import {
  Proveedor,
  ProveedorService
} from '../../services/proveedor';

import {
  Producto,
  ProductoService
} from '../../services/producto';

import { NotificationService } from '../../shared/services/notification.service';

interface DetalleCompra {
  productoId: number;
  nombre: string;
  codigoBarras: string;
  cantidad: number;
  precioCompra: number;
  subtotal: number;
}

@Component({
  selector: 'app-compras',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './compras.html',
  styleUrl: './compras.css'
})
export class Compras implements OnInit {

  private apiUrl = 'http://localhost:8080/compras';

  proveedores: Proveedor[] = [];
  productos: Producto[] = [];
  productosFiltrados: Producto[] = [];

  detalles: DetalleCompra[] = [];

  proveedorId: number | null = null;

  busquedaProducto = '';

  cargando = false;
  guardando = false;

  error = '';

  constructor(
    private proveedorService: ProveedorService,
    private productoService: ProductoService,
    private http: HttpClient,
    private notification: NotificationService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {

    this.cargando = true;
    this.error = '';

    this.proveedorService.listar().subscribe({
      next: proveedores => {
        this.proveedores = proveedores.filter(
          proveedor => proveedor.activo !== false
        );

        this.productos = [];
        this.productosFiltrados = [];
        this.cargando = false;

        this.cdr.detectChanges();
      },

      error: err => {

        console.error(
          'Error cargando proveedores:',
          err
        );

        this.cargando = false;

        this.error =
          'No fue posible cargar los proveedores.';

        this.notification.error(
          this.error,
          'Error'
        );

        this.cdr.detectChanges();
      }
    });
  }

  cargarProductosPorProveedor(): void {
    if (!this.proveedorId) {
      this.productos = [];
      this.productosFiltrados = [];
      return;
    }

    const proveedor = this.proveedores.find(
      p => p.id === this.proveedorId
    );

    if (!proveedor) {
      this.productos = [];
      this.productosFiltrados = [];
      return;
    }

    this.cargando = true;
    this.error = '';

    this.productoService.buscarPorProveedor(proveedor.nombre).subscribe({
      next: respuesta => {
        this.productos = respuesta.content ?? [];
        this.productosFiltrados = [...this.productos];
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: err => {
        console.error('Error cargando productos del proveedor:', err);

        this.productos = [];
        this.productosFiltrados = [];
        this.cargando = false;
        this.error = 'No fue posible cargar los productos del proveedor.';

        this.notification.error(
          this.error,
          'Error'
        );

        this.cdr.detectChanges();
      }
    });
  }

  cargarProductos(): void {

    this.productoService.listar().subscribe({

      next: respuesta => {

        this.productos =
          respuesta.content ?? [];

        this.productosFiltrados =
          [...this.productos];

        this.cargando = false;

        this.cdr.detectChanges();
      },

      error: err => {

        console.error(
          'Error cargando productos:',
          err
        );

        this.cargando = false;

        this.error =
          'No fue posible cargar los productos.';

        this.notification.error(
          this.error,
          'Error'
        );

        this.cdr.detectChanges();
      }
    });
  }

  filtrarProductos(): void {

    const texto =
      this.busquedaProducto
        .trim()
        .toLowerCase();

    if (!texto) {

      this.productosFiltrados =
        [...this.productos];

      return;
    }

    this.productosFiltrados =
      this.productos.filter(producto =>

        producto.nombre
          .toLowerCase()
          .includes(texto)

        ||

        (producto.codigoBarras ?? '')
          .toLowerCase()
          .includes(texto)

      );
  }

  agregarProducto(producto: Producto): void {

    const existente =
      this.detalles.find(
        detalle =>
          detalle.productoId === producto.id
      );

    if (existente) {

      existente.cantidad++;

      this.actualizarSubtotal(
        existente
      );

      this.notification.info(
        `Se aumentó la cantidad de ${producto.nombre}.`,
        'Producto agregado'
      );

      return;
    }

    const precioCompra =
      Number(producto.costoCompra) || 0;

    this.detalles.push({

      productoId: producto.id,

      nombre: producto.nombre,

      codigoBarras:
      producto.codigoBarras,

      cantidad: 1,

      precioCompra,

      subtotal: precioCompra

    });

    this.cdr.detectChanges();
  }

  eliminarDetalle(index: number): void {

    this.detalles.splice(
      index,
      1
    );

    this.cdr.detectChanges();
  }

  cambiarCantidad(
    detalle: DetalleCompra
  ): void {

    if (
      !detalle.cantidad ||
      detalle.cantidad < 1
    ) {

      detalle.cantidad = 1;
    }

    this.actualizarSubtotal(
      detalle
    );
  }

  cambiarPrecio(
    detalle: DetalleCompra
  ): void {

    if (
      detalle.precioCompra === null ||
      detalle.precioCompra === undefined ||
      detalle.precioCompra < 0
    ) {

      detalle.precioCompra = 0;
    }

    this.actualizarSubtotal(
      detalle
    );
  }

  actualizarSubtotal(
    detalle: DetalleCompra
  ): void {

    detalle.subtotal =
      Number(detalle.cantidad) *
      Number(detalle.precioCompra);

    this.cdr.detectChanges();
  }

  get totalCompra(): number {

    return this.detalles.reduce(
      (total, detalle) =>
        total +
        Number(detalle.subtotal),
      0
    );
  }

  get cantidadProductos(): number {

    return this.detalles.reduce(
      (total, detalle) =>
        total +
        Number(detalle.cantidad),
      0
    );
  }

  registrarCompra(): void {

    this.error = '';

    if (!this.proveedorId) {

      this.error =
        'Debes seleccionar un proveedor.';

      this.notification.warning(
        'Selecciona el proveedor de la compra.',
        'Proveedor requerido'
      );

      return;
    }

    if (this.detalles.length === 0) {

      this.error =
        'Debes agregar al menos un producto.';

      this.notification.warning(
        'Agrega al menos un producto a la compra.',
        'Productos requeridos'
      );

      return;
    }

    const detalleInvalido =
      this.detalles.find(detalle =>

        !detalle.cantidad ||
        detalle.cantidad < 1 ||

        detalle.precioCompra === null ||
        detalle.precioCompra === undefined ||
        detalle.precioCompra < 1

      );

    if (detalleInvalido) {

      this.error =
        'Verifica la cantidad y el precio de compra de todos los productos.';

      this.notification.warning(
        'Todos los productos deben tener una cantidad y un precio de compra válidos.',
        'Datos inválidos'
      );

      return;
    }

    const payload = {

      proveedorId:
      this.proveedorId,

      detalles:
        this.detalles.map(
          detalle => ({

            productoId:
            detalle.productoId,

            cantidad:
              Number(detalle.cantidad),

            precioCompra:
              Number(detalle.precioCompra)

          })
        )
    };

    this.guardando = true;

    this.http
      .post(
        this.apiUrl,
        payload
      )
      .subscribe({

        next: () => {

          this.guardando = false;

          this.notification.success(
            'La compra fue registrada correctamente y el inventario fue actualizado.',
            'Compra registrada'
          );

          this.detalles = [];

          this.proveedorId = null;

          this.busquedaProducto = '';

          this.productosFiltrados =
            [...this.productos];

          this.cdr.detectChanges();
        },

        error: err => {

          console.error(
            'Error registrando compra:',
            err
          );

          this.guardando = false;

          let mensaje =
            'No fue posible registrar la compra.';

          if (err?.error?.message) {

            mensaje =
              err.error.message;

          } else if (err?.error?.error) {

            mensaje =
              err.error.error;

          }

          this.error = mensaje;

          this.notification.error(
            mensaje,
            'Error al registrar compra'
          );

          this.cdr.detectChanges();
        }
      });
  }

  cancelarCompra(): void {

    if (
      this.detalles.length === 0 &&
      !this.proveedorId
    ) {

      return;
    }

    this.detalles = [];

    this.proveedorId = null;

    this.busquedaProducto = '';

    this.error = '';

    this.productosFiltrados =
      [...this.productos];

    this.cdr.detectChanges();
  }
}
