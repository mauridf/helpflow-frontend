import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  template: `
    <div class="dashboard-container">
      <h1>Dashboard</h1>
      
      <mat-card>
        <mat-card-content>
          <h2>Bem-vindo, {{ usuario()?.nome }}!</h2>
          <p>Perfil: <strong>{{ usuario()?.perfilNome }}</strong></p>
          
          <div class="dashboard-info">
            <div class="info-item" *ngIf="isGestor()">
              <mat-icon color="primary">admin_panel_settings</mat-icon>
              <span>Acesso total ao sistema</span>
            </div>
            
            <div class="info-item" *ngIf="isAtendente()">
              <mat-icon color="primary">support_agent</mat-icon>
              <span>Atendimento e gestão de tickets</span>
            </div>
            
            <div class="info-item" *ngIf="isCliente()">
              <mat-icon color="primary">person</mat-icon>
              <span>Acesso aos seus tickets e dados</span>
            </div>
          </div>

          <div class="next-steps">
            <h3>Próximos Desenvolvimentos:</h3>
            <ul>
              <li>✅ Sistema de Autenticação</li>
              <li>🔲 Gestão de Tickets</li>
              <li>🔲 Chat em Tempo Real</li>
              <li>🔲 Dashboard com Métricas</li>
              <li>🔲 Relatórios e SLAs</li>
            </ul>
          </div>
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
      max-width: 800px;
    }
    
    .dashboard-info {
      margin: 20px 0;
      
      .info-item {
        display: flex;
        align-items: center;
        gap: 8px;
        margin: 8px 0;
      }
    }
    
    .next-steps {
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #eee;
      
      ul {
        margin: 10px 0 0 20px;
        
        li {
          margin: 5px 0;
        }
      }
    }
  `]
})
export class DashboardComponent {
  constructor(private authService: AuthService) {}

  usuario = computed(() => this.authService.usuarioAtual());
  isGestor = computed(() => this.authService.isGestor());
  isAtendente = computed(() => this.authService.isAtendente());
  isCliente = computed(() => this.authService.isCliente());
}