import { Injectable } from '@angular/core';
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

  constructor(private apiService: ApiService) { }

  obterDadosIniciais(): Observable<SetupData> {
    return this.apiService.get<SetupData>('setup/dados-iniciais');
  }

  listarPerfis(): Observable<Perfil[]> {
    return this.apiService.get<Perfil[]>('setup/perfis');
  }
}