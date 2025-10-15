import { Component, Input, Output, EventEmitter, signal, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar } from '@angular/material/snack-bar';

import { UploadService } from '../../core/services/upload.service';

@Component({
  selector: 'app-avatar-upload',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatProgressBarModule],
  templateUrl: './avatar-upload.component.html',
  styleUrls: ['./avatar-upload.component.scss']
})
export class AvatarUploadComponent {
  @Input() avatarUrl: string = '';
  @Input() nomeUsuario: string = '';
  @Input() tamanho: number = 120; // tamanho em pixels
  @Output() avatarAlterado = new EventEmitter<string>();

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  carregando = signal(false);
  progressoUpload = signal(0);
  previewUrl = signal<string>('');

  constructor(
    private uploadService: UploadService,
    private snackBar: MatSnackBar
  ) {}

  // Obter iniciais para placeholder
  getIniciais(): string {
    if (!this.nomeUsuario) return '?';
    
    return this.nomeUsuario
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }

  // Abrir seletor de arquivos
  selecionarArquivo(): void {
    this.fileInput.nativeElement.click();
  }

  // Processar arquivo selecionado
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (!file) return;

    // Validar arquivo
    const validacao = this.uploadService.validarArquivo(file);
    if (!validacao.valido) {
      this.snackBar.open(validacao.erro!, 'Fechar', { duration: 5000 });
      this.limparInput();
      return;
    }

    // Gerar preview
    this.uploadService.gerarPreview(file).then(preview => {
      this.previewUrl.set(preview);
    });

    // Fazer upload
    this.fazerUpload(file);
  }

  // Fazer upload do arquivo
  private fazerUpload(file: File): void {
    this.carregando.set(true);
    this.progressoUpload.set(0);

    this.uploadService.uploadAvatar(file).subscribe({
      next: (result) => {
        this.carregando.set(false);
        this.progressoUpload.set(100);
        
        // Em produção, usar a URL retornada pelo servidor
        // Por enquanto, usamos a URL temporária
        this.avatarAlterado.emit(result.url);
        this.snackBar.open('Avatar atualizado com sucesso!', 'Fechar', { duration: 3000 });
        
        // Limpar preview após sucesso
        setTimeout(() => {
          this.previewUrl.set('');
          this.limparInput();
        }, 1000);
      },
      error: (error) => {
        console.error('Erro no upload:', error);
        this.carregando.set(false);
        this.snackBar.open('Erro ao fazer upload do avatar', 'Fechar', { duration: 5000 });
        this.limparInput();
      }
    });
  }

  // Remover avatar
  removerAvatar(): void {
    this.avatarAlterado.emit('');
    this.snackBar.open('Avatar removido', 'Fechar', { duration: 3000 });
  }

  // Limpar input de arquivo
  private limparInput(): void {
    if (this.fileInput.nativeElement) {
      this.fileInput.nativeElement.value = '';
    }
  }

  // Obter URL para exibição
  getAvatarUrl(): string {
    return this.previewUrl() || this.avatarUrl;
  }

  // Verificar se tem avatar
  temAvatar(): boolean {
    return !!this.getAvatarUrl();
  }

  // Estilos dinâmicos
  getContainerStyles(): any {
    return {
      width: `${this.tamanho}px`,
      height: `${this.tamanho}px`
    };
  }

  getAvatarStyles(): any {
    return {
      width: `${this.tamanho}px`,
      height: `${this.tamanho}px`,
      fontSize: `${this.tamanho * 0.3}px`
    };
  }
}