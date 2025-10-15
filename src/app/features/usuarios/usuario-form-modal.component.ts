import { Component, Inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';

import { UsuariosService } from '../../core/services/usuarios.service';
import { SetupService, Perfil } from '../../core/services/setup.service';
import { Usuario, CreateUsuarioRequest, UpdateUsuarioRequest } from '../../core/models/usuario.model';
import { AvatarUploadComponent } from '../../shared/avatar-upload/avatar-upload.component';

export interface UsuarioFormModalData {
  usuario?: Usuario; // Para edição
  modoEdicao: boolean;
}

@Component({
  selector: 'app-usuario-form-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatIconModule,
    AvatarUploadComponent
  ],
  templateUrl: './usuario-form-modal.component.html',
  styleUrls: ['./usuario-form-modal.component.scss']
})
export class UsuarioFormModalComponent implements OnInit {
  carregando = signal(false);
  salvando = signal(false);
  perfis = signal<Perfil[]>([]);
  usuarioForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<UsuarioFormModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: UsuarioFormModalData,
    private usuariosService: UsuariosService,
    private setupService: SetupService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.usuarioForm = this.fb.group({
        nome: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
        email: ['', [Validators.required, Validators.email]],
        senha: ['', this.getValidadoresSenha()],
        telefone: ['', [Validators.pattern(/^\(\d{2}\) \d{4,5}-\d{4}$/)]],
        perfilId: ['', Validators.required],
        avatar: ['']
    });
    this.carregarPerfis();
    
    if (this.data.modoEdicao && this.data.usuario) {
      this.preencherFormulario(this.data.usuario);
    }
  }

  private getValidadoresSenha(): Validators[] {
    if (this.data.modoEdicao) {
      // Em edição, senha é opcional
      return [Validators.minLength(6)];
    } else {
      // Em criação, senha é obrigatória
      return [Validators.required, Validators.minLength(6)];
    }
  }

  carregarPerfis(): void {
    this.carregando.set(true);
    
    this.setupService.listarPerfis().subscribe({
      next: (perfis) => {
        this.perfis.set(perfis);
        this.carregando.set(false);
      },
      error: (error) => {
        console.error('Erro ao carregar perfis:', error);
        this.snackBar.open('Erro ao carregar perfis', 'Fechar', { duration: 5000 });
        this.carregando.set(false);
      }
    });
  }

  preencherFormulario(usuario: Usuario): void {
    this.usuarioForm.patchValue({
      nome: usuario.nome,
      email: usuario.email,
      telefone: usuario.telefone || '',
      perfilId: usuario.perfilId,
      avatar: usuario.avatar || ''
    });

    // Em edição, remover validação de required da senha
    this.senha?.clearValidators();
    this.senha?.setValidators([Validators.minLength(6)]);
    this.senha?.updateValueAndValidity();
  }

  onSubmit(): void {
    if (this.usuarioForm.valid) {
      this.salvando.set(true);

      if (this.data.modoEdicao && this.data.usuario) {
        this.atualizarUsuario();
      } else {
        this.criarUsuario();
      }
    } else {
      this.marcarCamposComoSujos();
    }
  }

  criarUsuario(): void {
    const dados: CreateUsuarioRequest = {
      nome: this.usuarioForm.value.nome!,
      email: this.usuarioForm.value.email!,
      senha: this.usuarioForm.value.senha!,
      telefone: this.usuarioForm.value.telefone || undefined,
      perfilId: this.usuarioForm.value.perfilId!
    };

    this.usuariosService.criar(dados).subscribe({
      next: (usuarioCriado) => {
        this.salvando.set(false);
        this.snackBar.open('Usuário criado com sucesso!', 'Fechar', { duration: 3000 });
        this.dialogRef.close(usuarioCriado);
      },
      error: (error) => {
        console.error('Erro ao criar usuário:', error);
        this.salvando.set(false);
        
        let mensagemErro = 'Erro ao criar usuário';
        if (error.status === 400) {
          mensagemErro = 'E-mail já está em uso';
        }
        
        this.snackBar.open(mensagemErro, 'Fechar', { duration: 5000 });
      }
    });
  }

  atualizarUsuario(): void {
    const dados: UpdateUsuarioRequest = {
      nome: this.usuarioForm.value.nome!,
      telefone: this.usuarioForm.value.telefone || undefined,
      avatar: this.usuarioForm.value.avatar || undefined
    };

    // Se senha foi preenchida, incluir na atualização
    if (this.usuarioForm.value.senha) {
      // Nota: A API atual não suporta alteração de senha por aqui
      // Isso seria feito pelo endpoint específico de alterar senha
      console.warn('Alteração de senha deve ser feita pelo endpoint específico');
    }

    this.usuariosService.atualizar(this.data.usuario!.id, dados).subscribe({
      next: (usuarioAtualizado) => {
        this.salvando.set(false);
        this.snackBar.open('Usuário atualizado com sucesso!', 'Fechar', { duration: 3000 });
        this.dialogRef.close(usuarioAtualizado);
      },
      error: (error) => {
        console.error('Erro ao atualizar usuário:', error);
        this.salvando.set(false);
        this.snackBar.open('Erro ao atualizar usuário', 'Fechar', { duration: 5000 });
      }
    });
  }

  formatarTelefone(event: any): void {
    let value = event.target.value.replace(/\D/g, '');
    
    if (value.length <= 10) {
      value = value.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
    } else {
      value = value.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
    }
    
    this.telefone?.setValue(value, { emitEvent: false });
  }

  private marcarCamposComoSujos(): void {
    Object.keys(this.usuarioForm.controls).forEach(key => {
      const control = this.usuarioForm.get(key);
      if (control) {
        control.markAsTouched();
      }
    });
  }

  fechar(): void {
    this.dialogRef.close();
  }

  onAvatarAlterado(url: string): void {
    this.usuarioForm.patchValue({ avatar: url });
    this.usuarioForm.get('avatar')?.markAsDirty();
  }

  // Getters para os controles do formulário
  get nome() { return this.usuarioForm.get('nome'); }
  get email() { return this.usuarioForm.get('email'); }
  get senha() { return this.usuarioForm.get('senha'); }
  get telefone() { return this.usuarioForm.get('telefone'); }
  get perfilId() { return this.usuarioForm.get('perfilId'); }
  get avatar() { return this.usuarioForm.get('avatar'); }

  // Helper para template
  get tituloModal(): string {
    return this.data.modoEdicao ? 'Editar Usuário' : 'Novo Usuário';
  }

  get textoBotaoSalvar(): string {
    return this.data.modoEdicao ? 'Atualizar' : 'Criar Usuário';
  }
}