import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Proveedor {
  id?: number;
  nombre: string;
  nit: string;
  telefono: string;
  correo: string;
  direccion: string;
  activo: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ProveedorService {

  private readonly API_URL = 'http://localhost:8080/proveedores';

  constructor(private http: HttpClient) {}

  listar(): Observable<Proveedor[]> {
    return this.http.get<Proveedor[]>(this.API_URL);
  }

  buscarPorId(id: number): Observable<Proveedor> {
    return this.http.get<Proveedor>(`${this.API_URL}/${id}`);
  }

  buscarPorNit(nit: string): Observable<Proveedor> {
    return this.http.get<Proveedor>(`${this.API_URL}/nit/${encodeURIComponent(nit)}`);
  }

  guardar(proveedor: Omit<Proveedor, 'id'>): Observable<Proveedor> {
    return this.http.post<Proveedor>(this.API_URL, proveedor);
  }

  actualizar(id: number, proveedor: Omit<Proveedor, 'id'>): Observable<Proveedor> {
    return this.http.put<Proveedor>(`${this.API_URL}/${id}`, proveedor);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }
}
