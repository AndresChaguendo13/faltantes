import { Component } from '@angular/core';

@Component({
  selector: 'app-acerca-del-sistema',
  standalone: true,
  imports: [],
  templateUrl: './acerca-del-sistema.html',
  styleUrl: './acerca-del-sistema.css'
})
export class AcercaDelSistema {

  readonly version = '1.0.0';
  readonly anio = '2026';

  readonly whatsappNumero = '+57 311 422 7246';

  readonly whatsappUrl =
    'https://wa.me/573114227246?text=Hola%2C%20quisiera%20obtener%20informaci%C3%B3n%20sobre%20Mercado%20LA%2011.';

}
