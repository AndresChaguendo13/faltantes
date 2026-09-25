import { Routes } from '@angular/router';

import { Login } from './pages/login/login';
import { AppLayout } from './layout/app-layout';
import { Dashboard } from './pages/dashboard/dashboard';
import { Productos } from './pages/productos/productos';
import { Categorias } from './pages/categorias/categorias';
import { ProveedoresComponent } from './proveedores/proveedores';
import { ClientesComponent } from './pages/clientes/clientes';
import { Compras } from './pages/compras/compras';
import { Ventas } from './pages/ventas/ventas';
import { Balance } from './pages/balance/balance';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [

  // =====================================================
  // LOGIN
  // =====================================================

  {
    path: '',
    component: Login
  },


  // =====================================================
  // LAYOUT PRINCIPAL DEL ERP
  // =====================================================

  {
    path: '',
    component: AppLayout,
    canActivate: [authGuard],

    children: [

      {
        path: 'dashboard',
        component: Dashboard
      },

      {
        path: 'productos',
        component: Productos
      },

      {
        path: 'categorias',
        component: Categorias
      },

      {
        path: 'proveedores',
        component: ProveedoresComponent
      },

      {
        path: 'clientes',
        component: ClientesComponent
      },

      {
        path: 'compras',
        component: Compras
      },

      {
        path: 'ventas',
        component: Ventas
      },

      { path: 'balance', component: Balance },


      /*
       * Balance se conectará aquí cuando confirmemos
       * el nombre exacto de su clase exportada.
       *
       * No lo inventamos para evitar romper compilación.
       */
    ]
  },






  // =====================================================
  // RUTA DESCONOCIDA
  // =====================================================

  {
    path: '**',
    redirectTo: ''
  }

];
