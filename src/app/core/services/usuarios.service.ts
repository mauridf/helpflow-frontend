import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiService } from './api.service';
import { Usuario, CreateUsuarioRequest, UpdateUsuarioRequest } from '../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  constructor(private apiService: ApiService) { }

  listarTodos(): Observable<Usuario[]> {
    return this.apiService.get<Usuario[]>('usuarios');
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
}