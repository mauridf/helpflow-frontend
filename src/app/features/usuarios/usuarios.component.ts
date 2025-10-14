import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div>
      <h1>Usuários</h1>
      <p>Módulo de usuários em desenvolvimento...</p>
    </div>
  `
})
export class UsuariosComponent { }