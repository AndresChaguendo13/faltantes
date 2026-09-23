import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Dashboard } from './pages/dashboard/dashboard';
import { authGuard } from './guards/auth-guard';
import { Productos } from './pages/productos/productos';
import { Categorias } from './pages/categorias/categorias';
import { ProveedoresComponent } from './proveedores/proveedores';
export const routes: Routes = [

  {
    path: '',
    component: Login
  },

  {
    path: 'dashboard',
    component: Dashboard,
    canActivate: [authGuard]
  },






  {
    path: 'productos',
    component: Productos,
    canActivate: [authGuard]
  },

  {
    path: 'categorias',
    component: Categorias,
    canActivate: [authGuard]
  },

  {
    path: 'proveedores',
    component: ProveedoresComponent,
    canActivate: [authGuard]
  },



  {
    path: '**',
    redirectTo: ''
  }


];
