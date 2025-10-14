import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { 
    path: 'dashboard', 
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  { 
    path: 'tickets', 
    loadComponent: () => import('./features/tickets/tickets.component').then(m => m.TicketsComponent)
  },
  { 
    path: 'usuarios', 
    loadComponent: () => import('./features/usuarios/usuarios.component').then(m => m.UsuariosComponent)
  },
  { path: '**', redirectTo: '/dashboard' }
];