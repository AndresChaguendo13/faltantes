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

  buscarDesdeMenu(texto: string): void {
    const termino = texto.trim();

    if (!termino) {
      return;
    }

    /*
     * Por ahora el buscador global lleva al módulo Productos.
     * Después podremos conectar aquí búsqueda por código,
     * producto, cliente, proveedor, etc.
     */
    this.router.navigate(['/productos'], {
      queryParams: { q: termino }
    });
  }

  cerrarSesion(): void {
    this.menuUsuarioAbierto = false;
    localStorage.removeItem('token');
    this.router.navigate(['/']);
  }

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}
}
