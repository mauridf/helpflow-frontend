import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatMenuModule } from '@angular/material/menu';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';

import { AuthService } from '../../core/services/auth.service';
import { UsuariosService } from '../../core/services/usuarios.service';
import { Usuario } from '../../core/models/usuario.model';
import { UsuarioFormModalComponent, UsuarioFormModalData } from './usuario-form-modal.component';
import { UsuarioDetalhesModalComponent } from './usuario-detalhes-modal.component';
import { ConfirmacaoModalComponent, ConfirmacaoModalData } from '../../shared/confirmacao-modal/confirmacao-modal.component';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatMenuModule,
    MatChipsModule,
    MatDividerModule
  ],
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss']
})
export class UsuariosComponent implements OnInit {
  private dialog = inject(MatDialog);
  
  carregando = signal(true);
  usuarios = signal<Usuario[]>([]);
  alterandoStatus = signal<string | null>(null);

  colunasExibidas = ['nome', 'email', 'perfilNome', 'ativo', 'createdAt', 'acoes'];

  constructor(
    public authService: AuthService,
    private usuariosService: UsuariosService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.carregarUsuarios();
  }

  carregarUsuarios(): void {
    this.carregando.set(true);

    if (this.authService.isGestor()) {
      this.usuariosService.listarTodos().subscribe({
        next: (usuarios) => {
          this.usuarios.set(usuarios);
          this.carregando.set(false);
        },
        error: (error) => {
          console.error('Erro ao carregar usuários:', error);
          this.snackBar.open('Erro ao carregar usuários', 'Fechar', { duration: 5000 });
          this.carregando.set(false);
        }
      });
    } else if (this.authService.isAtendente()) {
      this.usuariosService.listarClientes().subscribe({
        next: (clientes) => {
          this.usuarios.set(clientes);
          this.carregando.set(false);
        },
        error: (error) => {
          console.error('Erro ao carregar clientes:', error);
          this.snackBar.open('Erro ao carregar clientes', 'Fechar', { duration: 5000 });
          this.carregando.set(false);
        }
      });
    }
  }

  abrirModalDetalhesUsuario(usuarioId: string): void {
    this.dialog.open(UsuarioDetalhesModalComponent, {
      width: '600px',
      maxWidth: '95vw',
      data: { usuarioId }
    });
  }

  abrirModalCriarUsuario(): void {
    const dialogRef = this.dialog.open(UsuarioFormModalComponent, {
      width: '600px',
      maxWidth: '95vw',
      data: {
        modoEdicao: false
      } as UsuarioFormModalData
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // Usuário criado com sucesso, recarregar lista
        this.carregarUsuarios();
        this.snackBar.open('Usuário criado com sucesso!', 'Fechar', { duration: 3000 });
      }
    });
  }

  abrirModalEditarUsuario(usuario: Usuario): void {
    const dialogRef = this.dialog.open(UsuarioFormModalComponent, {
      width: '600px',
      maxWidth: '95vw',
      data: {
        usuario: usuario,
        modoEdicao: true
      } as UsuarioFormModalData
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // Usuário atualizado com sucesso, recarregar lista
        this.carregarUsuarios();
        this.snackBar.open('Usuário atualizado com sucesso!', 'Fechar', { duration: 3000 });
      }
    });
  }

  verDetalhes(usuario: Usuario): void {
    // Abrir modal de detalhes ou navegar para página de detalhes
    this.snackBar.open(`Visualizando ${usuario.nome}`, 'Fechar', { duration: 3000 });
    
    // TODO: Implementar modal de detalhes completo
    console.log('Detalhes do usuário:', usuario);
  }

  editarUsuario(usuario: Usuario): void {
    this.abrirModalEditarUsuario(usuario);
  }

  alternarStatusUsuario(usuario: Usuario): void {
    const acao = usuario.ativo ? 'inativar' : 'ativar';
    const mensagem = usuario.ativo 
      ? `Tem certeza que deseja inativar o usuário ${usuario.nome}?` 
      : `Tem certeza que deseja ativar o usuário ${usuario.nome}?`;

    const dialogRef = this.dialog.open(ConfirmacaoModalComponent, {
      width: '400px',
      data: {
        titulo: usuario.ativo ? 'Inativar Usuário' : 'Ativar Usuário',
        mensagem: mensagem,
        textoConfirmacao: usuario.ativo ? 'Inativar' : 'Ativar',
        textoCancelamento: 'Cancelar',
        corConfirmacao: usuario.ativo ? 'warn' : 'primary'
      } as ConfirmacaoModalData
    });

    dialogRef.afterClosed().subscribe((confirmado) => {
      if (confirmado) {
        this.executarAlternanciaStatus(usuario);
      }
    });
  }

  private executarAlternanciaStatus(usuario: Usuario): void {
    this.alterandoStatus.set(usuario.id);

    // Simular a alteração de status (a API real implementaria isso)
    // Por enquanto, vamos apenas simular com um timeout
    setTimeout(() => {
      // Em uma implementação real, chamaríamos:
      // this.usuariosService.alterarStatusUsuario(usuario.id, !usuario.ativo).subscribe(...)
      
      // Simulação local
      const usuariosAtualizados = this.usuarios().map(u => 
        u.id === usuario.id ? { ...u, ativo: !u.ativo } : u
      );
      
      this.usuarios.set(usuariosAtualizados);
      this.alterandoStatus.set(null);
      
      const acao = usuario.ativo ? 'inativado' : 'ativado';
      this.snackBar.open(`Usuário ${acao} com sucesso!`, 'Fechar', { duration: 3000 });
    }, 1000);
  }

  buscarPorEmail(): void {
    const email = prompt('Digite o e-mail para buscar:');
    if (email) {
      this.usuariosService.buscarPorEmail(email).subscribe({
        next: (usuario) => {
          this.snackBar.open(`Usuário encontrado: ${usuario.nome}`, 'Fechar', { duration: 3000 });
          // TODO: Mostrar usuário em um modal de detalhes
        },
        error: (error) => {
          console.error('Erro ao buscar usuário:', error);
          this.snackBar.open('Usuário não encontrado', 'Fechar', { duration: 5000 });
        }
      });
    }
  }

  // Métodos auxiliares para template
  podeCriarUsuario(): boolean {
    return this.authService.isGestor();
  }

  podeEditarUsuario(usuario: Usuario): boolean {
    if (this.authService.isGestor()) return true;
    if (this.authService.isAtendente() && usuario.perfilNome === 'Cliente') return true;
    return false;
  }

  podeAlterarStatus(usuario: Usuario): boolean {
    // Apenas gestores podem alterar status, e não podem inativar a si mesmos
    if (!this.authService.isGestor()) return false;
    
    const usuarioAtual = this.authService.usuarioAtual();
    return usuarioAtual?.id !== usuario.id;
  }

  getPerfilColor(perfil: string): string {
    switch (perfil) {
      case 'Gestor': return 'primary';
      case 'Atendente': return 'accent';
      case 'Cliente': return 'warn';
      default: return 'basic';
    }
  }

  estaAlterandoStatus(usuarioId: string): boolean {
    return this.alterandoStatus() === usuarioId;
  }
}