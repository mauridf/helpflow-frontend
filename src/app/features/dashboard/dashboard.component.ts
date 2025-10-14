import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  template: `
    <div class="dashboard-container">
      <h1>Dashboard</h1>
      <p>Sistema HelpFlow - Em Desenvolvimento</p>
      
      <mat-card>
        <mat-card-content>
          <h3>Bem-vindo ao HelpFlow!</h3>
          <p>Esta é a versão inicial do sistema. Módulos em desenvolvimento:</p>
          <ul>
            <li>✅ Configuração Inicial</li>
            <li>🔲 Autenticação</li>
            <li>🔲 Gestão de Tickets</li>
            <li>🔲 Chat em Tempo Real</li>
            <li>🔲 Dashboard</li>
          </ul>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 20px;
    }
    
    mat-card {
      margin-top: 20px;
      max-width: 600px;
    }
  `]
})
export class DashboardComponent { }