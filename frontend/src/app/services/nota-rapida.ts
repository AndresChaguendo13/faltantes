import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface NotaRapida {
  id: number;
  titulo: string;
  descripcion: string;
  fechaIngreso: string;
  fechaAlerta: string | null;
  alarma: boolean;
  estado: 'PENDIENTE' | 'COMPLETADA';
  fechaActualizacion: string;
}

export interface NotaRapidaRequest {
  titulo: string;
  descripcion: string;
  fechaAlerta: string | null;
  alarma: boolean;
}

@Injectable({ providedIn: 'root' })
export class NotaRapidaService {
  private readonly apiUrl = 'http://localhost:8080/notas-rapidas';

  constructor(private http: HttpClient) {}

  listar(): Observable<NotaRapida[]> {
    return this.http.get<NotaRapida[]>(this.apiUrl);
  }

  crear(datos: NotaRapidaRequest): Observable<NotaRapida> {
    return this.http.post<NotaRapida>(this.apiUrl, datos);
  }

  actualizar(id: number, datos: NotaRapidaRequest): Observable<NotaRapida> {
    return this.http.put<NotaRapida>(`${this.apiUrl}/${id}`, datos);
  }

  alternarCompletada(id: number): Observable<NotaRapida> {
    return this.http.patch<NotaRapida>(`${this.apiUrl}/${id}/completar`, {});
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
