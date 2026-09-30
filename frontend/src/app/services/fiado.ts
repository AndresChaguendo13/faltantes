import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Fiado {
  id: number;
  clienteId: number;
  nombreCliente: string;
  valorOriginal: number;
  valorAbonado: number;
  saldoPendiente: number;
  estado: string;
  fecha: string;
  ventaId?: number | null;
}

export interface Abono {
  id: number;
  fiadoId: number;
  valor: number;
  fecha: string;
}

export interface FiadoDetalle extends Fiado {
  abonos: Abono[];
}

export interface AbonoRequest {
  valor: number;
}

@Injectable({
  providedIn: 'root'
})
export class FiadoService {

  private apiUrl = 'http://localhost:8080/fiados';

  constructor(private http: HttpClient) {}

  listar(): Observable<Fiado[]> {
    return this.http.get<Fiado[]>(this.apiUrl);
  }

  buscarPorId(id: number): Observable<Fiado> {
    return this.http.get<Fiado>(`${this.apiUrl}/${id}`);
  }

  obtenerDetalle(id: number): Observable<FiadoDetalle> {
    return this.http.get<FiadoDetalle>(`${this.apiUrl}/${id}/detalle`);
  }

  listarPorCliente(clienteId: number): Observable<Fiado[]> {
    return this.http.get<Fiado[]>(
      `${this.apiUrl}/cliente/${clienteId}`
    );
  }

  calcularSaldoCliente(clienteId: number): Observable<number> {
    return this.http.get<number>(
      `${this.apiUrl}/cliente/${clienteId}/saldo`
    );
  }

  registrarAbono(
    fiadoId: number,
    valor: number
  ): Observable<Abono> {
    return this.http.post<Abono>(
      `${this.apiUrl}/${fiadoId}/abonos`,
      { valor }
    );
  }

  listarAbonos(fiadoId: number): Observable<Abono[]> {
    return this.http.get<Abono[]>(
      `${this.apiUrl}/${fiadoId}/abonos`
    );
  }
}
