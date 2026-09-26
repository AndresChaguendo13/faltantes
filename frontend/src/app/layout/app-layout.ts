import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectorRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet
} from '@angular/router';



import { ProductLookupService }
  from '../shared/services/product-lookup.service';

import { ProductoService }
  from '../services/producto';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './app-layout.html',
  styleUrl: './app-layout.css'
})
export class AppLayout implements OnInit, OnDestroy {

  menuUsuarioAbierto = false;
  sidebarAbierto = true;
// =====================================================
// FECHA Y HORA EN TIEMPO REAL
// =====================================================

  fechaActual: string = '';
  horaActual: string = '';

  private reloj!: ReturnType<typeof setInterval>;
  ngOnInit(): void {
    this.actualizarFechaHora();

    this.reloj = setInterval(() => {
      this.actualizarFechaHora();
    }, 1000);
  }

  ngOnDestroy(): void {
    clearInterval(this.reloj);
  }

  actualizarFechaHora(): void {
    const ahora = new Date();

    this.fechaActual = ahora.toLocaleDateString('es-CO', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });

    this.horaActual = ahora.toLocaleTimeString('es-CO', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  }

  toggleSidebar(): void {
    this.sidebarAbierto = !this.sidebarAbierto;
  }

  abrirMenuUsuario(): void {
    this.menuUsuarioAbierto = !this.menuUsuarioAbierto;
  }

  cerrarMenuUsuario(): void {
    this.menuUsuarioAbierto = false;
  }

  buscarDesdeMenu(
    termino: string,
    input: HTMLInputElement
  ): void {

    const codigo = termino.trim();

    if (!codigo) {
      return;
    }

    // Limpiar inmediatamente la barra
    input.value = '';

    this.productoService.buscarPorCodigo(codigo).subscribe({
      next: producto => {
        this.productLookup.mostrarProducto(producto);
      },
      error: () => {
        this.productLookup.mostrarError(codigo);
      }
    });
  }

  cerrarSesion(): void {
    this.menuUsuarioAbierto = false;
    localStorage.removeItem('token');
    this.router.navigate(['/']);
  }

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef,
    private productoService: ProductoService,
    private productLookup: ProductLookupService
  ) {}
}
