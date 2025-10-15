import { Component, Output, EventEmitter, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';

import { SetupService, Perfil } from '../../core/services/setup.service';

export interface FiltrosUsuarios {
  busca: string;
  perfilId: string;
  status: string;
}

@Component({
  selector: 'app-usuarios-filtros',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule
  ],
  templateUrl: './usuarios-filtros.component.html',
  styleUrls: ['./usuarios-filtros.component.scss']
})
export class UsuariosFiltrosComponent implements OnInit {
  @Output() filtrosAlterados = new EventEmitter<FiltrosUsuarios>();

  carregando = signal(true);
  perfis = signal<Perfil[]>([]);
  filtrosForm!: FormGroup;

  opcoesStatus = [
    { valor: '', label: 'Todos' },
    { valor: 'ativo', label: 'Ativos' },
    { valor: 'inativo', label: 'Inativos' }
  ];

  constructor(
    private fb: FormBuilder,
    private setupService: SetupService
  ) {}

  ngOnInit(): void {
    this.filtrosForm = this.fb.group({
        busca: [''],
        perfilId: [''],
        status: ['']
    });
    this.carregarPerfis();
    this.configurarObservables();
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
        this.carregando.set(false);
      }
    });
  }

  configurarObservables(): void {
    // Emitir filtros quando o formulário mudar
    this.filtrosForm.valueChanges.subscribe(() => {
      this.emitirFiltros();
    });
  }

  emitirFiltros(): void {
    const filtros: FiltrosUsuarios = {
      busca: this.filtrosForm.value.busca || '',
      perfilId: this.filtrosForm.value.perfilId || '',
      status: this.filtrosForm.value.status || ''
    };

    this.filtrosAlterados.emit(filtros);
  }

  limparFiltros(): void {
    this.filtrosForm.patchValue({
      busca: '',
      perfilId: '',
      status: ''
    });
  }

  getFiltrosAtivos(): number {
    let count = 0;
    const valores = this.filtrosForm.value;
    
    if (valores.busca) count++;
    if (valores.perfilId) count++;
    if (valores.status) count++;
    
    return count;
  }

  removerFiltro(tipo: keyof FiltrosUsuarios): void {
    this.filtrosForm.patchValue({ [tipo]: '' });
  }

  getLabelPerfil(perfilId: string): string {
    const perfil = this.perfis().find(p => p.id === perfilId);
    return perfil?.nome || '';
  }

  getLabelStatus(status: string): string {
    const opcao = this.opcoesStatus.find(s => s.valor === status);
    return opcao?.label || '';
  }
}