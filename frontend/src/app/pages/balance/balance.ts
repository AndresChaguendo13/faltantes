import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  VentaService,
  VentaResponse
} from '../../services/ventas';

@Component({
  selector: 'app-balance',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './balance.html',
  styleUrl: './balance.css'
})
export class Balance implements OnInit {

  ventas: VentaResponse[] = [];
  cargando = false;
  error = '';

  totalVentas = 0;
  cantidadVentas = 0;
  ventasContado = 0;
  ventasFiado = 0;

  constructor(
    private ventaService: VentaService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarBalance();
  }

  cargarBalance(): void {

    this.cargando = true;
    this.error = '';

    this.ventaService.listar().subscribe({

      next: (ventas) => {

        this.ventas = ventas || [];

        this.cantidadVentas = this.ventas.length;

        this.totalVentas = this.ventas.reduce(
          (total, venta) => total + Number(venta.total || 0),
          0
        );

        this.ventasContado = this.ventas
          .filter(venta => venta.tipoPago === 'CONTADO')
          .reduce((total, venta) => total + Number(venta.total || 0), 0);

        this.ventasFiado = this.ventas
          .filter(venta => venta.tipoPago === 'FIADO')
          .reduce((total, venta) => total + Number(venta.total || 0), 0);

        this.cargando = false;

        this.cdr.detectChanges();
      },

      error: (error) => {

        console.error('ERROR CARGANDO BALANCE:', error);

        this.cargando = false;
        this.error = 'No se pudo cargar el balance.';
        this.cdr.detectChanges();
      }
    });
  }

  obtenerTotalDetalles(venta: VentaResponse): number {

    return venta.detalles.reduce(
      (total, detalle) => total + detalle.subtotal,
      0
    );
  }
}

