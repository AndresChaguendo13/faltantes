import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { fromEvent, Subscription } from 'rxjs';

import { ProductoService } from '../../services/producto';
import { ProductLookupService } from './product-lookup.service';

@Injectable({
  providedIn: 'root'
})
export class GlobalScannerService {

  private buffer = '';
  private ultimoEvento = 0;
  private temporizador: any;
  private subscription: Subscription;

  constructor(
    private router: Router,
    private productoService: ProductoService,
    private productLookup: ProductLookupService
  ) {

    this.subscription = fromEvent<KeyboardEvent>(
      document,
      'keydown'
    ).subscribe(event => {

      this.procesarTecla(event);

    });

  }

  private procesarTecla(event: KeyboardEvent): void {

    // =====================================================
    // VENTAS TIENE SU PROPIO SCANNER
    // =====================================================

    if (this.router.url.includes('/ventas')) {
      this.limpiarBuffer();
      return;
    }

    // =====================================================
    // IGNORAR ATAJOS DEL SISTEMA
    // =====================================================

    if (
      event.ctrlKey ||
      event.altKey ||
      event.metaKey
    ) {
      return;
    }

    const ahora = Date.now();

    const diferencia =
      ahora - this.ultimoEvento;

    // =====================================================
    // NUEVA LECTURA
    // =====================================================

    if (
      this.buffer.length > 0 &&
      diferencia > 250
    ) {
      this.buffer = '';
    }

    this.ultimoEvento = ahora;

    // =====================================================
    // ENTER = FINAL DEL ESCANEO
    // =====================================================

    if (event.key === 'Enter') {

      const codigo =
        this.buffer.trim();

      this.limpiarBuffer();

      if (codigo.length >= 6) {

        event.preventDefault();
        event.stopPropagation();

        this.buscarProducto(codigo);

      }

      return;
    }

    // =====================================================
    // CAPTURAR CARACTER
    // =====================================================

    if (event.key.length === 1) {

      this.buffer += event.key;

      clearTimeout(this.temporizador);

      this.temporizador = setTimeout(() => {

        this.buffer = '';

      }, 500);

    }

  }

  // =====================================================
  // BUSCAR PRODUCTO
  // =====================================================

  private buscarProducto(codigo: string): void {



    this.productoService
      .buscarPorCodigo(codigo)
      .subscribe({

        next: producto => {



          this.productLookup.mostrarProducto(producto);


        },

        error: error => {


          this.productLookup.mostrarError(codigo);

        }

      });

  }

  // =====================================================
  // LIMPIAR SCANNER
  // =====================================================

  private limpiarBuffer(): void {

    this.buffer = '';

    clearTimeout(
      this.temporizador
    );

    this.ultimoEvento = 0;

  }

  ngOnDestroy(): void {

    this.subscription.unsubscribe();

    clearTimeout(
      this.temporizador
    );

  }

}
