import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Proveedor {
  id: number;
  nombre: string;
  nit?: string;
  telefono?: string;
  correo?: string;
  direccion?: string;
  activo?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ProveedorService {

  private apiUrl = 'http://localhost:8080/proveedores';

  constructor(private http: HttpClient) {}

  listar(): Observable<Proveedor[]> {
    return this.http.get<Proveedor[]>(this.apiUrl);
  }
}
