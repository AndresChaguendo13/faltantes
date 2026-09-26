import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface DetalleVentaRequest {
  productoId: number;
  cantidad: number;
}

export interface VentaRequest {
  tipoPago: 'CONTADO' | 'FIADO';
  clienteId: number | null;
  detalles: DetalleVentaRequest[];
}

export interface DetalleVentaResponse {
  producto: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

export interface VentaResponse {
  id: number;
  fecha: string;
  total: number;
  tipoPago: string;
  clienteId?: number;
  nombreCliente?: string;
  fiadoId?: number;
  detalles: DetalleVentaResponse[];
}

@Injectable({
  providedIn: 'root'
})
export class VentaService {

  private apiUrl = 'http://localhost:8080/ventas';

  constructor(private http: HttpClient) {}

  listar(): Observable<VentaResponse[]> {
    return this.http.get<VentaResponse[]>(this.apiUrl);
  }

  buscarPorId(id: number): Observable<VentaResponse> {
    return this.http.get<VentaResponse>(
      `${this.apiUrl}/${id}`
    );
  }

  crear(venta: VentaRequest): Observable<VentaResponse> {
    return this.http.post<VentaResponse>(
      this.apiUrl,
      venta
    );
  }

  obtenerTotalVentasHoy(): Observable<number> {
    return this.http.get<number>(
      `${this.apiUrl}/total-hoy`
    );
  }

  obtenerTotalContadoHoy(): Observable<number> {
    return this.http.get<number>(
      `${this.apiUrl}/total-contado-hoy`
    );
  }

  obtenerTotalFiadoHoy(): Observable<number> {
    return this.http.get<number>(
      `${this.apiUrl}/total-fiado-hoy`
    );
  }



}
