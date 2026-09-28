import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface DevolucionVentaRequest {
  ventaId: number;
  productoId: number;
  cantidad: number;
  motivo: string;
}

export interface DevolucionVentaResponse {
  id: number;
  ventaId: number;
  productoId: number;
  nombreProducto: string;
  cantidad: number;
  valor: number;
  motivo: string;
  fecha: string;
}

@Injectable({
  providedIn: 'root'
})
export class DevolucionesVentaService {

  private apiUrl = 'http://localhost:8080/devoluciones-venta';

  constructor(private http: HttpClient) {}

  devolverProducto(
    request: DevolucionVentaRequest
  ): Observable<DevolucionVentaResponse> {

    return this.http.post<DevolucionVentaResponse>(
      this.apiUrl,
      request
    );
  }

  listar(): Observable<DevolucionVentaResponse[]> {

    return this.http.get<DevolucionVentaResponse[]>(
      this.apiUrl
    );
  }
}
