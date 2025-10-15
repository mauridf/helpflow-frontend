import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

export interface ConfirmacaoModalData {
  titulo: string;
  mensagem: string;
  textoConfirmacao?: string;
  textoCancelamento?: string;
  corConfirmacao?: 'primary' | 'warn' | 'accent';
}

@Component({
  selector: 'app-confirmacao-modal',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  template: `
    <div class="confirmacao-modal">
      <div mat-dialog-title class="modal-header">
        <h2>{{ data.titulo }}</h2>
      </div>

      <div mat-dialog-content class="modal-content">
        <p>{{ data.mensagem }}</p>
      </div>

      <div mat-dialog-actions class="modal-actions">
        <button mat-button (click)="onCancelar()">
          {{ data.textoCancelamento || 'Cancelar' }}
        </button>
        
        <button 
          mat-raised-button 
          [color]="data.corConfirmacao || 'warn'"
          (click)="onConfirmar()">
          {{ data.textoConfirmacao || 'Confirmar' }}
        </button>
      </div>
    </div>
  `,
  styles: [`
    .confirmacao-modal {
      min-width: 350px;
      max-width: 500px;
    }

    .modal-header {
      padding: 16px 24px 8px;
      border-bottom: 1px solid #e0e0e0;

      h2 {
        margin: 0;
        color: #333;
        font-size: 20px;
      }
    }

    .modal-content {
      padding: 20px 24px;

      p {
        margin: 0;
        line-height: 1.5;
        color: #666;
      }
    }

    .modal-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      padding: 16px 24px;
      border-top: 1px solid #e0e0e0;
    }

    @media (max-width: 480px) {
      .confirmacao-modal {
        min-width: unset;
        width: 95vw;
      }

      .modal-actions {
        flex-direction: column-reverse;
        
        button {
          width: 100%;
          margin: 0;
        }
      }
    }
  `]
})
export class ConfirmacaoModalComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmacaoModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmacaoModalData
  ) {}

  onConfirmar(): void {
    this.dialogRef.close(true);
  }

  onCancelar(): void {
    this.dialogRef.close(false);
  }
}