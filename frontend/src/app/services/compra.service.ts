import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface DetalleCompraResponse {
  productoId: number;
  producto: string;
  cantidad: number;
  precioCompra: number;
}

export interface CompraResponse {
  id: number;
  proveedor: string;
  fecha: string;
  detalles: DetalleCompraResponse[];
}

@Injectable({
  providedIn: 'root'
})
export class CompraService {

  private apiUrl = 'http://localhost:8080/compras';

  constructor(private http: HttpClient) {}

  listar(): Observable<CompraResponse[]> {
    return this.http.get<CompraResponse[]>(this.apiUrl);
  }

  buscarPorId(id: number): Observable<CompraResponse> {
    return this.http.get<CompraResponse>(`${this.apiUrl}/${id}`);
  }
}
