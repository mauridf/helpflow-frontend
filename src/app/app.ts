import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink } from '@angular/router';

// Angular Material Modules
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';

import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    MatMenuModule
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class App {
  sidebarOpened = false;

  constructor(public authService: AuthService) {}

  // Computed properties para template
  usuario = computed(() => this.authService.usuarioAtual());
  estaLogado = computed(() => this.authService.estaLogado());
  isGestor = computed(() => this.authService.isGestor());
  isAtendente = computed(() => this.authService.isAtendente());
  isCliente = computed(() => this.authService.isCliente());

  toggleSidebar(): void {
    this.sidebarOpened = !this.sidebarOpened;
  }

  logout(): void {
    this.authService.logout();
  }

  // Obter iniciais para avatar
  getIniciais(): string {
    const usuario = this.usuario();
    if (!usuario?.nome) return '?';
    
    return usuario.nome
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }

  // Verificar se usuário tem avatar
  temAvatar(): boolean {
    return !!this.usuario()?.avatar;
  }
}