import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Dashboard } from './pages/dashboard/dashboard';
import { authGuard } from './guards/auth-guard';
import { Productos } from './pages/productos/productos';

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
    path: '**',
    redirectTo: ''
  }

];
