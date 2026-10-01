import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { VentaResponse, VentaService } from '../../services/ventas';

@Component({
  selector: 'app-transferencias',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './transferencias.html',
  styleUrl: './transferencias.css'
})
export class Transferencias implements OnInit {

  transferencias: VentaResponse[] = [];

  cantidadTransferencias = 0;
  totalTransferencias = 0;

  // El async pipe fuerza la actualización de la vista incluso
  // cuando la aplicación está usando un modo de detección de cambios
  // más estricto o zoneless.
  cargando$ = new BehaviorSubject<boolean>(true);

  error = '';
  fechaHoy = new Date();

  constructor(private ventaService: VentaService) {}

  ngOnInit(): void {
    this.cargarTransferencias();
  }

  cargarTransferencias(): void {
    this.cargando$.next(true);
    this.error = '';

    this.ventaService.listar().subscribe({
      next: (ventas) => {
        const todasLasVentas = ventas || [];

        console.log('VENTAS RECIBIDAS:', todasLasVentas);

        this.transferencias = todasLasVentas
          .filter((venta) => {
            const tipoPago = String(venta.tipoPago || '')
              .trim()
              .toUpperCase();

            return (
              tipoPago === 'TRANSFERENCIA' &&
              this.esDeHoy(venta.fecha)
            );
          })
          .sort(
            (a, b) =>
              new Date(b.fecha).getTime() -
              new Date(a.fecha).getTime()
          );

        this.cantidadTransferencias =
          this.transferencias.length;

        this.totalTransferencias =
          this.transferencias.reduce(
            (total, venta) =>
              total + Number(venta.total || 0),
            0
          );

        console.log(
          'TRANSFERENCIAS DE HOY:',
          this.transferencias
        );
        console.log(
          'CANTIDAD:',
          this.cantidadTransferencias
        );
        console.log(
          'TOTAL:',
          this.totalTransferencias
        );

        this.cargando$.next(false);
      },

      error: (error) => {
        console.error(
          'ERROR CARGANDO TRANSFERENCIAS:',
          error
        );

        this.transferencias = [];
        this.cantidadTransferencias = 0;
        this.totalTransferencias = 0;

        if (error?.status === 401) {
          this.error =
            'La sesión expiró. Inicia sesión nuevamente.';
        } else if (error?.status === 403) {
          this.error =
            'No tienes permisos para consultar las ventas.';
        } else if (error?.status === 0) {
          this.error =
            'No se pudo conectar con el servidor.';
        } else {
          this.error =
            'No fue posible cargar las ventas. Error: ' +
            (error?.status || 'desconocido');
        }

        this.cargando$.next(false);
      }
    });
  }

  esDeHoy(fecha: string): boolean {
    if (!fecha) {
      return false;
    }

    const fechaVenta = new Date(fecha);

    if (Number.isNaN(fechaVenta.getTime())) {
      return false;
    }

    const hoy = new Date();

    return (
      fechaVenta.getFullYear() === hoy.getFullYear() &&
      fechaVenta.getMonth() === hoy.getMonth() &&
      fechaVenta.getDate() === hoy.getDate()
    );
  }

  nombreMedioPago(
    medioPago: string | null | undefined
  ): string {
    switch (
      String(medioPago || '')
        .trim()
        .toUpperCase()
      ) {
      case 'NEQUI':
        return 'Nequi';

      case 'DAVIPLATA':
        return 'Daviplata';

      case 'BANCOLOMBIA':
        return 'Bancolombia';

      case 'TARJETA_DEBITO':
        return 'Tarjeta débito';

      case 'TARJETA_CREDITO':
        return 'Tarjeta crédito';

      case 'OTRO':
        return 'Otro';

      default:
        return medioPago || 'No especificado';
    }
  }
}
