import { Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface Perfil {
  id: string;
  nome: string;
  nivelAcesso: number;
  createdAt: string;
  updatedAt: string;
}

export interface SetupData {
  perfis: Perfil[];
  prioridades: any[];
  slas: any[];
  departamentos: any[];
  categorias: any[];
}

@Injectable({
  providedIn: 'root'
})
export class SetupService {
  private dadosCache = signal<SetupData | null>(null);

  constructor(private apiService: ApiService) { }

  obterDadosIniciais(): Observable<SetupData> {
    // Retornar cache se disponível
    const cache = this.dadosCache();
    if (cache) {
      return new Observable(observer => {
        observer.next(cache);
        observer.complete();
      });
    }

    // Buscar da API e cachear
    return this.apiService.get<SetupData>('setup/dados-iniciais').pipe(
      tap(dados => this.dadosCache.set(dados))
    );
  }

  listarPerfis(): Observable<Perfil[]> {
    return this.obterDadosIniciais().pipe(
      map(dados => dados.perfis)
    );
  }

  // Limpar cache (útil para testes)
  limparCache(): void {
    this.dadosCache.set(null);
  }
}