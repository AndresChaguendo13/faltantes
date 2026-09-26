import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Caja {
  id: number;
  fechaApertura: string;
  fechaCierre?: string | null;

  montoInicial: number;
  montoFinal?: number | null;
  montoEsperado?: number | null;
  diferencia?: number | null;

  estado: 'ABIERTA' | 'CERRADA';
}

export interface CajaResumen {
  ventasContado: number;
  ventasFiado: number;
  abonosFiados: number;
  totalRecibido: number;
}

export interface CajaDetalle {
  id: number;
  fechaApertura: string;
  fechaCierre: string | null;

  montoInicial: number;
  ventasContado: number;
  abonosFiados: number;

  montoEsperado: number;
  montoFinal: number | null;
  diferencia: number | null;

  estado: string;
  resultado: string;
}

@Injectable({
  providedIn: 'root'
})
export class CajaService {

  private apiUrl = 'http://localhost:8080/caja';

  constructor(private http: HttpClient) {}

  obtenerActual(): Observable<Caja> {
    return this.http.get<Caja>(
      `${this.apiUrl}/actual`
    );
  }

  obtenerResumenHoy(): Observable<CajaResumen> {
    return this.http.get<CajaResumen>(
      `${this.apiUrl}/resumen-hoy`
    );
  }

  abrirCaja(montoInicial: number): Observable<Caja> {
    return this.http.post<Caja>(
      `${this.apiUrl}/abrir`,
      { montoInicial }
    );
  }

  cerrarCaja(montoFinal: number): Observable<Caja> {
    return this.http.post<Caja>(
      `${this.apiUrl}/cerrar`,
      { montoFinal }
    );
  }

  listar(): Observable<Caja[]> {
    return this.http.get<Caja[]>(
      this.apiUrl
    );
  }

  obtenerDetalle(id: number): Observable<CajaDetalle> {
    return this.http.get<CajaDetalle>(
      `${this.apiUrl}/${id}`
    );
  }
}
