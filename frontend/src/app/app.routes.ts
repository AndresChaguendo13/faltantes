import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Dashboard } from './pages/dashboard/dashboard';
import { authGuard } from './guards/auth-guard';
import { Productos } from './pages/productos/productos';
import { Categorias } from './pages/categorias/categorias';
import { ProveedoresComponent } from './proveedores/proveedores';
import { ClientesComponent } from './pages/clientes/clientes';
import { Compras } from './pages/compras/compras';
import { Ventas } from './pages/ventas/ventas';
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
    path: 'compras',
    component: Compras,
    canActivate: [authGuard]
  },

  {
    path: 'clientes',
    component: ClientesComponent,
    canActivate: [authGuard]
  },

  {
    path: 'ventas',
    component: Ventas,
    canActivate: [authGuard]
  },


  {
    path: '**',
    redirectTo: ''
  }


];
