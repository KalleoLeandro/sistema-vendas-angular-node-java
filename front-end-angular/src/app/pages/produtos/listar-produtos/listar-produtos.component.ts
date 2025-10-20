import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ListaProdutosResponse } from '@models/ListaProdutosResponse';
import { ProdutoService } from '@services/produto.service';

@Component({
  selector: 'app-listar-produtos',
  imports: [CommonModule, FormsModule],
  templateUrl: './listar-produtos.component.html',
  styleUrl: './listar-produtos.component.css'
})
export class ListarProdutosComponent {
  private router = inject(Router);
  private produtoService = inject(ProdutoService);

  public listaProdutos = signal<ListaProdutosResponse>({ lista: [], total: 0 });
  public page: number = 1;
  public token: string = '';
  public resposta: string = "";
  public excluir: boolean = true;
  public id: number = 0;
  public paginacao = [{
    numero: 10, descricao: '10 por página'
  },
  {
    numero: 25, descricao: '25 por página'
  },
  {
    numero: 50, descricao: '50 por página'
  }];
  public limit = 10;
  public totalPages: number = 0;

   public categoria: Array<any> = [
    {id: 1, descricao: "Alimentos" }, 
    {id: 2, descricao: "Limpeza" }, 
    {id: 3, descricao: "Eletrônicos" }, 
    {id: 4, descricao: "Vestuário" }, 
    {id: 5, descricao: "Brinquedos" }, 
    {id: 6, descricao: "Acessórios" }];
  public medida: Array<any> = [
    {id: 1, descricao: "Kg"},
    {id: 2, descricao: "Mt"}, 
    {id: 3, descricao: "Un"}, 
    {id: 4, descricao: "Lt"}, 
    {id: 5, descricao: "Cx"}, 
    {id: 6, descricao: "Pc"}];

  ngOnInit(): void {
    this.carregarProdutos();
  }

  public alterarProduto(id: number) {
    this.router.navigate([`/produtos/cadastro/${id}`]);
  }

  public modalExcluirProduto(id: number) {
    this.excluir = true;
    this.id = id;
    this.resposta = "Tem certeza que deseja excluir esse produto(Essa operação é irreversível)?";
    document.getElementById("botaoModal")?.click();
  }

  public excluirProduto() {
    this.excluir = false;
    this.produtoService.excluirProduto(this.id).subscribe({
      next: (response: ListaProdutosResponse) => {
        this.resposta = "Produto excluído com sucesso.";
        this.listaProdutos.set({
          ...this.listaProdutos(),
          lista: this.listaProdutos().lista.filter(item => item.id !== this.id)
        });
      },
      error: (error: any) => {
        console.log(error);
        this.resposta = "Erro ao excluir o produto!";
      },
    });
  }

  public carregarProdutos(): void {
    this.produtoService.buscarProdutosPorPagina(this.page, this.limit).subscribe({
      next: (response: ListaProdutosResponse) => {
        this.listaProdutos.set(response);
        this.totalPages = Math.ceil(response.total / this.limit);
      },
      error: (error: any) => {
        console.log(error);
      },
    });
  }

  public mudarTamanho() {
    this.page = 1;
    this.carregarProdutos();
  }

  public irParaPagina(pagina: number): void {
    if (pagina >= 1 && pagina <= this.totalPages) {
      this.page = pagina;
      this.carregarProdutos();
    }
  }

  public paginaAnterior(): void {
    if (this.page > 1) {
      this.page--;
      this.carregarProdutos();
    }
  }

  public proximaPagina(): void {
    if (this.page < this.totalPages) {
      this.page++;
      this.carregarProdutos();
    }
  }

  public getDescricaoMedida(id: number): string {
    return this.medida.find(m => m.id === id)?.descricao || '';
  }

  public getDescricaoCategoria(id: number): string {
    return this.categoria.find(m => m.id === id)?.descricao || '';
  }
}
