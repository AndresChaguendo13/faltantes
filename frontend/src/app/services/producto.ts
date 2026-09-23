import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Producto {
  id: number;
  nombre: string;
  codigoBarras: string;
  cantidad: number;
  stockMinimo: number;
  costoCompra: number;
  precioVenta?: number;
  precio?: number;
  categoria: any;
  categoriaId?: number | null;
  categoriaNombre?: string | null;
  proveedor: string;
  fechaVencimiento: string;
}

export interface ProductoPage {
  content: Producto[];
  pageable: any;
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
  empty: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  private apiUrl = 'http://localhost:8080/productos';

  constructor(private http: HttpClient) {}

  listar(): Observable<ProductoPage> {
    return this.http.get<ProductoPage>(this.apiUrl);
  }

  buscarPorId(id: number): Observable<Producto> {
    return this.http.get<Producto>(
      `${this.apiUrl}/${id}`
  );
  }

  buscarPorCodigo(codigo: string): Observable<Producto> {
    return this.http.get<Producto>(
      `${this.apiUrl}/codigo/${codigo}`
  );
  }

  buscarPorProveedor(proveedor: string): Observable<ProductoPage> {
    return this.http.get<ProductoPage>(
      `${this.apiUrl}/proveedor/${encodeURIComponent(proveedor)}`
    );
  }



  crear(producto: any): Observable<Producto> {
    return this.http.post<Producto>(
      this.apiUrl,
      producto
    );
  }

  actualizar(id: number, producto: any): Observable<Producto> {
    return this.http.put<Producto>(
      `${this.apiUrl}/${id}`,
    producto
  );
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${id}`
  );
  }
}
