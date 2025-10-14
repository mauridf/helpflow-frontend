import { Component, OnInit, signal, computed } from '@angular/core';
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

import { AuthService } from '../../core/services/auth.service';
import { UsuariosService } from '../../core/services/usuarios.service';
import { Usuario } from '../../core/models/usuario.model';

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
    MatChipsModule
  ],
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss']
})
export class UsuariosComponent implements OnInit {
  carregando = signal(true);
  usuarios = signal<Usuario[]>([]);

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
      // Gestor vê todos os usuários
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
      // Atendente vê apenas clientes
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

  verDetalhes(usuario: Usuario): void {
    // Navegar para detalhes ou abrir modal
    console.log('Ver detalhes:', usuario);
    this.snackBar.open(`Visualizando ${usuario.nome}`, 'Fechar', { duration: 3000 });
  }

  editarUsuario(usuario: Usuario): void {
    // Navegar para edição ou abrir modal
    console.log('Editar usuário:', usuario);
    this.snackBar.open(`Editando ${usuario.nome}`, 'Fechar', { duration: 3000 });
  }

  buscarPorEmail(): void {
    const email = prompt('Digite o e-mail para buscar:');
    if (email) {
      this.usuariosService.buscarPorEmail(email).subscribe({
        next: (usuario) => {
          this.snackBar.open(`Usuário encontrado: ${usuario.nome}`, 'Fechar', { duration: 3000 });
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

  getPerfilColor(perfil: string): string {
    switch (perfil) {
      case 'Gestor': return 'primary';
      case 'Atendente': return 'accent';
      case 'Cliente': return 'warn';
      default: return 'basic';
    }
  }
}