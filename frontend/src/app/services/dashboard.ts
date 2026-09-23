import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface DashboardResponse {
  totalProductos: number;
  productosStockBajo: number;
  totalCompras: number;
  totalVentas: number;
  valorInventario: number;

  ventasContadoHoy: number;
  ventasFiadoHoy: number;
  ventasHoy: number;
  cuentasPorCobrar: number;

  estadoCaja: string;
  montoInicialCaja: number;
  ventasContadoCaja: number;
  abonosFiadosCaja: number;
  montoEsperadoCaja: number;
  montoFinalCaja: number;
  diferenciaCaja: number;
  resultadoCaja: string;

  devolucionesVentaHoy: number;
  devolucionesCompraHoy: number;
  valorDevolucionesVentaHoy: number;
  valorDevolucionesCompraHoy: number;

  costoVentasHoy: number;
  utilidadBrutaHoy: number;
  margenUtilidadHoy: number;

  productosMasVendidos: any[];
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private apiUrl = 'http://localhost:8080/dashboard';

  constructor(private http: HttpClient) {}

  obtenerDashboard(): Observable<DashboardResponse> {
    return this.http.get<DashboardResponse>(this.apiUrl);
  }
}
