import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';


// =====================================================
// MODELO USUARIO
// =====================================================

export interface Usuario {

  id: number;

  nombre: string;

  username: string;

  rol: string;
}


// =====================================================
// CREAR USUARIO
// =====================================================

export interface UsuarioRequest {

  nombre: string;

  username: string;

  password: string;

  rol: string;
}


// =====================================================
// ACTUALIZAR USUARIO
// =====================================================

export interface UsuarioUpdateRequest {

  nombre?: string;

  username?: string;

  password?: string;

  rol?: string;
}


// =====================================================
// CAMBIAR CONTRASEÑA
// =====================================================

export interface CambiarPasswordRequest {

  passwordActual: string;

  nuevaPassword: string;

  confirmarPassword: string;
}


// =====================================================
// SERVICIO DE USUARIOS
// =====================================================

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private apiUrl =
    'http://localhost:8080/usuarios';


  constructor(
    private http: HttpClient
  ) {}


  // =====================================================
  // LISTAR USUARIOS
  // =====================================================

  listar(): Observable<Usuario[]> {

    return this.http.get<Usuario[]>(
      this.apiUrl
    );
  }


  // =====================================================
  // CREAR USUARIO
  // =====================================================

  crear(
    usuario: UsuarioRequest
  ): Observable<Usuario> {

    return this.http.post<Usuario>(
      this.apiUrl,
      usuario
    );
  }


  // =====================================================
  // ACTUALIZAR USUARIO
  // =====================================================

  actualizar(
    id: number,
    usuario: UsuarioUpdateRequest
  ): Observable<Usuario> {

    return this.http.put<Usuario>(
      `${this.apiUrl}/${id}`,
      usuario
    );
  }


  // =====================================================
  // ELIMINAR USUARIO
  // =====================================================

  eliminar(
    id: number
  ): Observable<void> {

    return this.http.delete<void>(
      `${this.apiUrl}/${id}`
    );
  }


  // =====================================================
  // OBTENER MI PERFIL
  // =====================================================

  obtenerMiPerfil(): Observable<Usuario> {

    return this.http.get<Usuario>(
      `${this.apiUrl}/me`
    );
  }


  // =====================================================
  // CAMBIAR MI CONTRASEÑA
  // =====================================================

  cambiarPassword(
    request: CambiarPasswordRequest
  ): Observable<void> {

    return this.http.put<void>(
      `${this.apiUrl}/me/password`,
      request
    );
  }

}
