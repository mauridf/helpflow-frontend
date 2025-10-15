import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiService } from './api.service';
import { PaginatedResponse, PageRequest } from '../models/pagination.model';
import { Usuario, CreateUsuarioRequest, UpdateUsuarioRequest } from '../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  constructor(private apiService: ApiService) { }

  listarTodos(): Observable<Usuario[]> {
    return this.apiService.get<Usuario[]>('usuarios');
  }

  listarTodosPaginado(pageRequest: PageRequest): Observable<PaginatedResponse<Usuario>> {
    // Em produção, isso seria um endpoint específico da API
    // Por enquanto, simulamos a paginação no cliente
    
    return this.listarTodos().pipe(
      map(usuarios => this.simularPaginacao(usuarios, pageRequest))
    );
  }

  listarAtendentesPaginado(pageRequest: PageRequest): Observable<PaginatedResponse<Usuario>> {
    return this.listarAtendentes().pipe(
      map(atendentes => this.simularPaginacao(atendentes, pageRequest))
    );
  }

  listarClientesPaginado(pageRequest: PageRequest): Observable<PaginatedResponse<Usuario>> {
    return this.listarClientes().pipe(
      map(clientes => this.simularPaginacao(clientes, pageRequest))
    );
  }

  private simularPaginacao(usuarios: Usuario[], pageRequest: PageRequest): PaginatedResponse<Usuario> {
    let dados = [...usuarios];
    
    // Aplicar ordenação
    if (pageRequest.sort) {
      dados = this.aplicarOrdenacao(dados, pageRequest.sort, pageRequest.direction || 'asc');
    }
    
    // Calcular índices de paginação
    const startIndex = pageRequest.page * pageRequest.size;
    const endIndex = startIndex + pageRequest.size;
    const paginatedData = dados.slice(startIndex, endIndex);
    
    return {
      content: paginatedData,
      totalElements: dados.length,
      totalPages: Math.ceil(dados.length / pageRequest.size),
      size: pageRequest.size,
      number: pageRequest.page,
      first: pageRequest.page === 0,
      last: endIndex >= dados.length,
      empty: paginatedData.length === 0
    };
  }

  private aplicarOrdenacao(usuarios: Usuario[], campo: string, direcao: 'asc' | 'desc'): Usuario[] {
    return usuarios.sort((a, b) => {
      let valorA: any = a;
      let valorB: any = b;
      
      // Navegar para propriedades aninhadas se necessário
      const propriedades = campo.split('.');
      for (const prop of propriedades) {
        valorA = valorA[prop];
        valorB = valorB[prop];
      }
      
      // Converter para string para comparação case-insensitive se for string
      if (typeof valorA === 'string') {
        valorA = valorA.toLowerCase();
        valorB = valorB.toLowerCase();
      }
      
      // Converter datas se necessário
      if (campo.includes('createdAt') || campo.includes('updatedAt')) {
        valorA = new Date(valorA).getTime();
        valorB = new Date(valorB).getTime();
      }
      
      let resultado = 0;
      if (valorA < valorB) resultado = -1;
      if (valorA > valorB) resultado = 1;
      
      return direcao === 'desc' ? -resultado : resultado;
    });
  }
  
  buscarPorId(id: string): Observable<Usuario> {
    return this.apiService.get<Usuario>(`usuarios/${id}`);
  }

  buscarPorEmail(email: string): Observable<Usuario> {
    return this.apiService.get<Usuario>(`usuarios/email/${email}`);
  }

  criar(usuario: CreateUsuarioRequest): Observable<Usuario> {
    return this.apiService.post<Usuario>('usuarios', usuario);
  }

  atualizar(id: string, usuario: UpdateUsuarioRequest): Observable<Usuario> {
    return this.apiService.put<Usuario>(`usuarios/${id}`, usuario);
  }

  listarAtendentes(): Observable<Usuario[]> {
    return this.apiService.get<Usuario[]>('usuarios/atendentes');
  }

  listarClientes(): Observable<Usuario[]> {
    return this.apiService.get<Usuario[]>('usuarios/clientes');
  }

  inativarUsuario(id: string): Observable<any> {
    return this.apiService.put(`usuarios/${id}/inativar`, {});
  }

  ativarUsuario(id: string): Observable<any> {
    return this.apiService.put(`usuarios/${id}/ativar`, {});
  }

  alterarStatusUsuario(id: string, ativo: boolean): Observable<Usuario> {
    return this.apiService.patch<Usuario>(`usuarios/${id}/status`, { ativo });
  }
}