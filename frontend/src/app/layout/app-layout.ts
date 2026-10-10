import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
  ElementRef,
  ViewChild,
  HostListener
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

  @ViewChild('busquedaGlobal')
  busquedaGlobal?: ElementRef<HTMLInputElement>;

  menuUsuarioAbierto = false;
  sidebarAbierto = true;
// =====================================================
// FECHA Y HORA EN TIEMPO REAL
// =====================================================

  fechaActual: string = '';
  horaActual: string = '';

  private reloj!: ReturnType<typeof setInterval>;
  ngOnInit(): void {
    // Algunos navegadores restauran el último texto de un input
    // después de que Angular termina de renderizar el layout.
    setTimeout(() => this.limpiarBusquedaGlobal(), 50);
    setTimeout(() => this.limpiarBusquedaGlobal(), 300);

    this.actualizarFechaHora();

    this.reloj = setInterval(() => {
      this.actualizarFechaHora();
    }, 1000);
  }

  ngOnDestroy(): void {
    clearInterval(this.reloj);
  }

  // =====================================================
  // CIERRE GLOBAL DE MODALES CON ESCAPE
  // =====================================================

  @HostListener('document:keydown.escape', ['$event'])
  cerrarModalConEscape(event: Event): void {
    event.preventDefault();

    const selectoresCierre = [
      '.modal-close',
      '.btn-modal-cerrar',
      '.lookup-close',
      '.quick-note-modal-close',
      '.modal-cerrar',
      '[aria-label*="Cerrar" i]',
      '[title*="Cerrar" i]'
    ];

    const candidatos: HTMLElement[] = [];

    for (const selector of selectoresCierre) {
      document.querySelectorAll<HTMLElement>(selector).forEach(elemento => {
        const estilo = window.getComputedStyle(elemento);

        if (
          estilo.display !== 'none' &&
          estilo.visibility !== 'hidden' &&
          elemento.offsetParent !== null
        ) {
          candidatos.push(elemento);
        }
      });
    }

    // Cierra el modal visible más reciente.
    for (let i = candidatos.length - 1; i >= 0; i--) {
      const boton = candidatos[i];

      if (!boton.hasAttribute('disabled')) {
        boton.click();
        return;
      }
    }

    // Respaldo para modales cuyo overlay ya tiene su propio cierre por clic.
    const overlays = Array.from(
      document.querySelectorAll<HTMLElement>(
        '.modal-overlay, .erp-modal-backdrop, .product-modal-overlay, .quick-note-modal-overlay, .product-lookup-overlay, .usuario-modal-overlay'
      )
    ).filter(overlay => {
      const estilo = window.getComputedStyle(overlay);

      return (
        estilo.display !== 'none' &&
        estilo.visibility !== 'hidden' &&
        overlay.offsetParent !== null
      );
    });

    const overlay = overlays[overlays.length - 1];

    if (overlay) {
      overlay.click();
    }
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

  limpiarBusquedaGlobal(): void {
    const input = this.busquedaGlobal?.nativeElement;

    if (!input) {
      return;
    }

    input.value = '';
    input.blur();
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



  irAMiPerfil(): void {

    this.menuUsuarioAbierto = false;

    this.router.navigate([
      '/mi-perfil'
    ]);
  }


  irACambiarPassword(): void {

    this.menuUsuarioAbierto = false;

    this.router.navigate([
      '/cambiar-contrasena'
    ]);
  }
}
