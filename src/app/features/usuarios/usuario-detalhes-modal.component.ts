import { Component, Inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';

import { UsuariosService } from '../../core/services/usuarios.service';
import { Usuario } from '../../core/models/usuario.model';

export interface UsuarioDetalhesModalData {
  usuarioId: string;
}

@Component({
  selector: 'app-usuario-detalhes-modal',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatDividerModule
  ],
  templateUrl: './usuario-detalhes-modal.component.html',
  styleUrls: ['./usuario-detalhes-modal.component.scss']
})
export class UsuarioDetalhesModalComponent implements OnInit {
  carregando = signal(true);
  usuario = signal<Usuario | null>(null);

  constructor(
    private dialogRef: MatDialogRef<UsuarioDetalhesModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: UsuarioDetalhesModalData,
    private usuariosService: UsuariosService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.carregarDetalhesUsuario();
  }

  carregarDetalhesUsuario(): void {
    this.carregando.set(true);

    this.usuariosService.buscarPorId(this.data.usuarioId).subscribe({
      next: (usuario) => {
        this.usuario.set(usuario);
        this.carregando.set(false);
      },
      error: (error) => {
        console.error('Erro ao carregar detalhes do usuário:', error);
        this.snackBar.open('Erro ao carregar detalhes do usuário', 'Fechar', { duration: 5000 });
        this.carregando.set(false);
        this.fechar();
      }
    });
  }

  getPerfilColor(perfil: string): string {
    switch (perfil) {
      case 'Gestor': return 'primary';
      case 'Atendente': return 'accent';
      case 'Cliente': return 'warn';
      default: return 'basic';
    }
  }

  getStatusColor(ativo: boolean): string {
    return ativo ? 'primary' : 'warn';
  }

  getStatusText(ativo: boolean): string {
    return ativo ? 'Ativo' : 'Inativo';
  }

  formatarData(data: string): string {
    return new Date(data).toLocaleString('pt-BR');
  }

  fechar(): void {
    this.dialogRef.close();
  }

  // Método para obter iniciais do nome
  getIniciais(nome: string): string {
    return nome
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }
}