import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {

  menuUsuarioAbierto: boolean = false;
  mostrarConfirmacion: boolean = false;

  constructor(private router: Router) {}

  abrirMenuUsuario(): void {
    this.menuUsuarioAbierto = !this.menuUsuarioAbierto;
  }

  cerrarMenuUsuario(): void {
    this.menuUsuarioAbierto = false;
  }

  confirmarCerrarSesion(): void {
    this.menuUsuarioAbierto = false;
    this.mostrarConfirmacion = true;
  }

  cancelarCerrarSesion(): void {
    this.mostrarConfirmacion = false;
  }

  cerrarSesion(): void {
    localStorage.removeItem('token');
    this.mostrarConfirmacion = false;

    this.router.navigate(['/']);
  }

}
