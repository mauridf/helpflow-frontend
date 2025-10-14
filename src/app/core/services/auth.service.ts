import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

import { ApiService } from './api.service';
import { LoginRequest, LoginResponse, Usuario } from '../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly tokenKey = 'authToken';
  private readonly usuarioKey = 'usuarioData';
  
  // Estado reativo com Signals
  public usuarioAtual = signal<Usuario | null>(null);
  public estaLogado = signal<boolean>(false);

  constructor(
    private apiService: ApiService,
    private http: HttpClient,
    private router: Router
  ) {
    this.carregarUsuarioSalvo();
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.apiService.post<LoginResponse>('auth/login', credentials).pipe(
      tap(response => {
        this.salvarToken(response.token);
        this.carregarUsuario(response.usuarioId);
      })
    );
  }

  alterarSenha(senhaAtual: string, novaSenha: string): Observable<any> {
    return this.apiService.postWithParams('auth/alterar-senha', null, {
      params: { senhaAtual, novaSenha }
    });
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.usuarioKey);
    this.usuarioAtual.set(null);
    this.estaLogado.set(false);
    this.router.navigate(['/login']);
  }

  private salvarToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  private carregarUsuario(usuarioId: string): void {
    this.apiService.get<Usuario>(`usuarios/${usuarioId}`).subscribe({
      next: (usuario) => {
        this.usuarioAtual.set(usuario);
        this.estaLogado.set(true);
        localStorage.setItem(this.usuarioKey, JSON.stringify(usuario));
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        console.error('Erro ao carregar usuário:', error);
        this.logout();
      }
    });
  }

  private carregarUsuarioSalvo(): void {
    const token = localStorage.getItem(this.tokenKey);
    const usuarioData = localStorage.getItem(this.usuarioKey);
    
    if (token && usuarioData) {
      try {
        const usuario = JSON.parse(usuarioData);
        this.usuarioAtual.set(usuario);
        this.estaLogado.set(true);
      } catch {
        this.logout();
      }
    }
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  // Métodos de verificação de perfil
  isGestor(): boolean {
    const usuario = this.usuarioAtual();
    return usuario?.perfilNome === 'Gestor';
  }

  isAtendente(): boolean {
    const usuario = this.usuarioAtual();
    return usuario?.perfilNome === 'Atendente';
  }

  isCliente(): boolean {
    const usuario = this.usuarioAtual();
    return usuario?.perfilNome === 'Cliente';
  }

  temPermissao(perfilRequerido: string[]): boolean {
    const usuario = this.usuarioAtual();
    if (!usuario) return false;
    
    return perfilRequerido.includes(usuario.perfilNome);
  }
}