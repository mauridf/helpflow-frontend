import { Component, Input, Output, EventEmitter, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';

import { PaginatedResponse, PageRequest } from '../../core/models/pagination.model';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule,
    MatTooltipModule
  ],
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent {
  @Input() paginacao!: PaginatedResponse<any>;
  @Input() pageSizeOptions: number[] = [5, 10, 25, 50];
  @Input() showPageSizeOptions: boolean = true;
  @Input() showFirstLastButtons: boolean = true;
  
  @Output() pageChange = new EventEmitter<PageRequest>();

  // Computed properties para template
  paginaAtual = computed(() => this.paginacao.number + 1);
  totalPaginas = computed(() => this.paginacao.totalPages);
  inicioItem = computed(() => this.paginacao.number * this.paginacao.size + 1);
  fimItem = computed(() => {
    const fim = (this.paginacao.number + 1) * this.paginacao.size;
    return Math.min(fim, this.paginacao.totalElements);
  });

  // Navegação
  irParaPrimeiraPagina(): void {
    if (!this.paginacao.first) {
      this.emitirMudancaPagina(0, this.paginacao.size);
    }
  }

  irParaPaginaAnterior(): void {
    if (!this.paginacao.first) {
      this.emitirMudancaPagina(this.paginacao.number - 1, this.paginacao.size);
    }
  }

  irParaProximaPagina(): void {
    if (!this.paginacao.last) {
      this.emitirMudancaPagina(this.paginacao.number + 1, this.paginacao.size);
    }
  }

  irParaUltimaPagina(): void {
    if (!this.paginacao.last) {
      this.emitirMudancaPagina(this.paginacao.totalPages - 1, this.paginacao.size);
    }
  }

  alterarTamanhoPagina(novoTamanho: number): void {
    this.emitirMudancaPagina(0, novoTamanho); // Voltar para primeira página
  }

  private emitirMudancaPagina(pagina: number, tamanho: number): void {
    this.pageChange.emit({
      page: pagina,
      size: tamanho
    });
  }

  // Gerar array de páginas para exibição
  getPaginasParaExibir(): number[] {
    const paginas: number[] = [];
    const paginaAtual = this.paginaAtual();
    const totalPaginas = this.totalPaginas();
    
    // Mostrar até 5 páginas ao redor da atual
    let inicio = Math.max(1, paginaAtual - 2);
    let fim = Math.min(totalPaginas, paginaAtual + 2);
    
    // Ajustar se estiver perto do início
    if (paginaAtual <= 3) {
      fim = Math.min(5, totalPaginas);
    }
    
    // Ajustar se estiver perto do fim
    if (paginaAtual >= totalPaginas - 2) {
      inicio = Math.max(1, totalPaginas - 4);
    }
    
    for (let i = inicio; i <= fim; i++) {
      paginas.push(i);
    }
    
    return paginas;
  }

  irParaPagina(pagina: number): void {
    const paginaZeroBased = pagina - 1;
    if (paginaZeroBased !== this.paginacao.number) {
      this.emitirMudancaPagina(paginaZeroBased, this.paginacao.size);
    }
  }

  // Verificações de estado
  isPaginaAtual(pagina: number): boolean {
    return pagina === this.paginaAtual();
  }
}