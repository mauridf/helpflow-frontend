import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AuthService } from '../../core/services/auth.service';
import { UsuariosService } from '../../core/services/usuarios.service';
import { UpdateUsuarioRequest } from '../../core/models/usuario.model';

@Component({
  selector: 'app-meus-dados',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './meus-dados.component.html',
  styleUrls: ['./meus-dados.component.scss']
})
export class MeusDadosComponent implements OnInit {
  carregando = signal(false);
  salvando = signal(false);
  usuarioForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    public authService: AuthService,
    private usuariosService: UsuariosService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.usuarioForm = this.fb.group({
    nome: ['', [Validators.required, Validators.minLength(3)]],
    telefone: [''],
    avatar: ['']
  });
    this.carregarMeusDados();
  }

  carregarMeusDados(): void {
    this.carregando.set(true);
    
    const usuario = this.authService.usuarioAtual();
    if (usuario?.id) {
      this.usuariosService.buscarPorId(usuario.id).subscribe({
        next: (usuarioDetalhado) => {
          this.usuarioForm.patchValue({
            nome: usuarioDetalhado.nome,
            telefone: usuarioDetalhado.telefone || '',
            avatar: usuarioDetalhado.avatar || ''
          });
          this.carregando.set(false);
        },
        error: (error) => {
          console.error('Erro ao carregar dados:', error);
          this.snackBar.open('Erro ao carregar seus dados', 'Fechar', { duration: 5000 });
          this.carregando.set(false);
        }
      });
    }
  }

  salvarDados(): void {
    if (this.usuarioForm.valid) {
      this.salvando.set(true);
      
      const usuario = this.authService.usuarioAtual();
      if (!usuario?.id) return;

      const dados: UpdateUsuarioRequest = {
        nome: this.usuarioForm.value.nome!,
        telefone: this.usuarioForm.value.telefone || undefined,
        avatar: this.usuarioForm.value.avatar || undefined
      };

      this.usuariosService.atualizar(usuario.id, dados).subscribe({
        next: (usuarioAtualizado) => {
          this.salvando.set(false);
          this.authService.usuarioAtual.set(usuarioAtualizado);
          localStorage.setItem('usuarioData', JSON.stringify(usuarioAtualizado));
          
          this.snackBar.open('Dados atualizados com sucesso!', 'Fechar', { 
            duration: 3000 
          });
        },
        error: (error) => {
          console.error('Erro ao atualizar dados:', error);
          this.salvando.set(false);
          this.snackBar.open('Erro ao atualizar dados', 'Fechar', { 
            duration: 5000 
          });
        }
      });
    }
  }

  get nome() { return this.usuarioForm.get('nome'); }
  get telefone() { return this.usuarioForm.get('telefone'); }
  get avatar() { return this.usuarioForm.get('avatar'); }
}