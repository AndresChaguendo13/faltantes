import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface DevolucionCompraRequest {
  compraId: number;
  productoId: number;
  cantidad: number;
  motivo: string;
}

export interface DevolucionCompraResponse {
  id: number;
  compraId: number;
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
export class DevolucionesCompraService {

  private apiUrl = 'http://localhost:8080/devoluciones-compra';

  constructor(private http: HttpClient) {}

  devolverProducto(
    request: DevolucionCompraRequest
  ): Observable<DevolucionCompraResponse> {
    return this.http.post<DevolucionCompraResponse>(
      this.apiUrl,
      request
    );
  }

  listar(): Observable<DevolucionCompraResponse[]> {
    return this.http.get<DevolucionCompraResponse[]>(
      this.apiUrl
    );
  }
}
