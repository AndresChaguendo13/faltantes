import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Categoria {
  id: number;
  nombre: string;
}

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {

  private apiUrl = 'http://localhost:8080/categorias';

  constructor(
    private http: HttpClient
  ) {}

  listar(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(
      this.apiUrl
    );
  }

  crear(
    categoria: { nombre: string }
  ): Observable<Categoria> {

    return this.http.post<Categoria>(
      this.apiUrl,
      categoria
    );
  }

  actualizar(
    id: number,
    categoria: { nombre: string }
  ): Observable<Categoria> {

    return this.http.put<Categoria>(
      `${this.apiUrl}/${id}`,
      categoria
    );
  }

  eliminar(
    id: number
  ): Observable<void> {

    return this.http.delete<void>(
      `${this.apiUrl}/${id}`
    );
  }
}
