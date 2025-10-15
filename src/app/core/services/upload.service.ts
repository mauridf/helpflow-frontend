import { Injectable, signal } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface UploadProgress {
  progress: number;
  loaded: number;
  total: number;
}

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  
  constructor() { }

  // Simulação de upload - em produção, integrar com serviço real
  uploadAvatar(file: File): Observable<{ url: string }> {
    return new Observable(observer => {
      // Simular progresso do upload
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        if (progress >= 100) {
          clearInterval(interval);
          
          // Gerar URL temporária (em produção, retornaria URL do servidor)
          const temporaryUrl = URL.createObjectURL(file);
          
          observer.next({ url: temporaryUrl });
          observer.complete();
        }
      }, 100);
    });
  }

  // Validar arquivo de imagem
  validarArquivo(file: File): { valido: boolean; erro?: string } {
    // Verificar tipo
    const tiposPermitidos = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!tiposPermitidos.includes(file.type)) {
      return { 
        valido: false, 
        erro: 'Tipo de arquivo não permitido. Use JPEG, PNG, GIF ou WebP.' 
      };
    }

    // Verificar tamanho (max 5MB)
    const tamanhoMaximo = 5 * 1024 * 1024; // 5MB em bytes
    if (file.size > tamanhoMaximo) {
      return { 
        valido: false, 
        erro: 'Arquivo muito grande. Tamanho máximo: 5MB.' 
      };
    }

    return { valido: true };
  }

  // Gerar thumbnail/preview
  gerarPreview(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = (e) => reject(e);
      reader.readAsDataURL(file);
    });
  }
}