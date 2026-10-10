import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export type TipoMovimientoCaja = 'INGRESO' | 'RETIRO';

export interface MovimientoCajaRequest {
  tipo: TipoMovimientoCaja;
  monto: number;
  motivo: string;
}

export interface MovimientoCajaResponse {
  id: number;
  cajaId: number;
  tipo: TipoMovimientoCaja;
  monto: number;
  fecha: string;
  motivo: string;
}

@Injectable({ providedIn: 'root' })
export class MovimientoCajaService {
  private apiUrl = 'http://localhost:8080/movimientos-caja';

  constructor(private http: HttpClient) {}

  registrar(request: MovimientoCajaRequest): Observable<MovimientoCajaResponse> {
    return this.http.post<MovimientoCajaResponse>(this.apiUrl, request);
  }

  listarPorCaja(cajaId: number): Observable<MovimientoCajaResponse[]> {
    return this.http.get<MovimientoCajaResponse[]>(`${this.apiUrl}/caja/${cajaId}`);
  }

  listarHoy(): Observable<MovimientoCajaResponse[]> {
    return this.http.get<MovimientoCajaResponse[]>(`${this.apiUrl}/hoy`);
  }
}
