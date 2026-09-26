import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Producto } from '../../services/producto';

export interface ProductLookupState {
  visible: boolean;
  producto: Producto | null;
  error: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductLookupService {

  private stateSubject = new BehaviorSubject<ProductLookupState>({
    visible: false,
    producto: null,
    error: ''
  });

  state$ = this.stateSubject.asObservable();

  mostrarProducto(producto: Producto): void {
    this.stateSubject.next({
      visible: true,
      producto,
      error: ''
    });
  }

  mostrarError(error: string): void {
    this.stateSubject.next({
      visible: true,
      producto: null,
      error
    });
  }

  cerrar(): void {
    this.stateSubject.next({
      visible: false,
      producto: null,
      error: ''
    });
  }
}
