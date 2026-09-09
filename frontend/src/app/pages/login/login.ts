import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  username: string = '';

  password: string = '';

  mostrarPassword: boolean = false;

  cargando: boolean = false;

  error: string = '';

  constructor(
    private auth: Auth,
    private router: Router
  ) {}

  iniciarSesion(): void {

    this.error = '';

    // Validar usuario
    if (!this.username.trim()) {
      this.error = 'Por favor ingresa tu usuario.';
      return;
    }

    // Validar contraseña
    if (!this.password.trim()) {
      this.error = 'Por favor ingresa tu contraseña.';
      return;
    }

    this.cargando = true;

    const datos = {
      username: this.username.trim(),
      password: this.password
    };

    this.auth.login(datos).subscribe({

      // Login correcto
      next: (respuesta) => {

        console.log('LOGIN CORRECTO');
        console.log('Respuesta del servidor:', respuesta);

        // Guardar JWT
        localStorage.setItem('token', respuesta.token);

        this.cargando = false;

        // Ir al Dashboard
        this.router.navigate(['/dashboard']);

      },

      // Error
      error: (error) => {

        console.error('ERROR DE LOGIN:', error);

        this.cargando = false;

        if (error.status === 401) {

          this.error = 'Usuario o contraseña incorrectos.';

        } else if (error.status === 0) {

          this.error =
            'No se pudo conectar con el servidor. Verifica que Spring Boot esté ejecutándose.';

        } else {

          this.error =
            'Ocurrió un error al iniciar sesión.';

        }

      }

    });

  }

}
