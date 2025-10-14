export interface Usuario {
  id: string;
  nome: string;
  email: string;
  telefone?: string;
  perfilId: string;
  perfilNome: string;
  avatar?: string;
  ativo: boolean;
  createdAt: string;
  departamento?: Departamento;
}

export interface Departamento {
  id: string;
  nome: string;
  descricao?: string;
  email?: string;
  responsavel?: Usuario;
  ativo: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Perfil {
  id: string;
  nome: string;
  nivelAcesso: number;
  permissoes: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  email: string;
  senha: string;
}

export interface LoginResponse {
  token: string;
  tipo: string;
  usuarioId: string;
  usuarioNome: string;
  perfil: string;
}

export interface CreateUsuarioRequest {
  nome: string;
  email: string;
  senha: string;
  telefone?: string;
  perfilId: string;
}

export interface UpdateUsuarioRequest {
  nome?: string;
  telefone?: string;
  avatar?: string;
}