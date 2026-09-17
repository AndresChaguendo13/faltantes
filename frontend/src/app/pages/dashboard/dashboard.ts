import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ProductoService } from '../../services/producto';
import { CurrencyPipe } from '@angular/common';


@Component({
  selector: 'app-dashboard',
  imports: [
    RouterLink,
    RouterLinkActive,
    CurrencyPipe
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {

  menuUsuarioAbierto: boolean = false;
  mostrarConfirmacion: boolean = false;

  totalProductos: number = 0;
  valorInventario: number = 0;
  productosStockBajo: number = 0;
  productosProximosVencer: number = 0;
  productosVencidos: number = 0;
  productosSinFecha: number = 0;

  constructor(
    private router: Router,
    private productoService: ProductoService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarEstadisticas();
  }

  cargarEstadisticas(): void {

    this.productoService.listar().subscribe({

      next: (respuesta) => {

        const productos = respuesta.content || [];

        this.totalProductos = respuesta.totalElements;

        this.productosStockBajo = productos.filter(
          producto =>
            producto.cantidad <= producto.stockMinimo
        ).length;

        this.productosVencidos = productos.filter(
          producto =>
            this.obtenerEstadoVencimiento(
              producto.fechaVencimiento
            ) === 'vencido'
        ).length;

        this.productosProximosVencer = productos.filter(
          producto =>
            this.obtenerEstadoVencimiento(
              producto.fechaVencimiento
            ) === 'proximo'
        ).length;

        this.productosSinFecha = productos.filter(
          producto =>
            !producto.fechaVencimiento
        ).length;

        this.valorInventario = productos.reduce(
          (total, producto) =>
            total +
            (producto.costoCompra || 0) *
            (producto.cantidad || 0),
          0
        );

        this.cdr.detectChanges();
      },

      error: (error) => {
        console.error(
          'ERROR AL CARGAR ESTADÍSTICAS:',
          error
        );
      }

    });

  }

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

  abrirMenuUsuario(): void {
    this.menuUsuarioAbierto = !this.menuUsuarioAbierto;
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
