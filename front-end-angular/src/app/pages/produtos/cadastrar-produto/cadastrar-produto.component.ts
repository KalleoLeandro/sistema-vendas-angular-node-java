import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ProdutoService } from '@services/produto.service';
import { CurrencyMaskModule } from 'ng2-currency-mask';

@Component({
  selector: 'app-cadastrar-produto',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, CurrencyMaskModule],
  templateUrl: './cadastrar-produto.component.html',
  styleUrl: './cadastrar-produto.component.css'
})
export class CadastrarProdutoComponent {
  private formBuilder = inject(FormBuilder);
  private router = inject(Router);
  private produtoService = inject(ProdutoService);
  private activatedRoute = inject(ActivatedRoute);


  private lastValidValues: Record<string, number> = {
    precoCusto: 0,
    precoVenda: 0,
  };

  public resposta: string = "";
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

  readonly MAX_VALUE = 10000;

  public id: number | null = null;


  public cadastroForm: FormGroup = this.formBuilder.group({
    id: [{ value: '', disabled: true }],
    nome: ['', Validators.required],
    precoCusto: ['', Validators.required],
    precoVenda: ['', Validators.required],
    quantidade: ['', Validators.compose([Validators.required, Validators.min(1)])],
    medida: ['', Validators.required],
    categoria: ['', Validators.required]
  });

  constructor() {
    this.id = this.activatedRoute.snapshot.paramMap.get('id') as unknown as number;
    if (this.id != null && this.id != undefined) {
      this.carregarProduto();
    }
  }

  onChangePreco(event: any) {
    const field = event.target.name;
    const control = this.cadastroForm.get(field);
    const value = control?.value ?? 0;

    if (value <= this.MAX_VALUE) {
      this.lastValidValues[field] = value;
    } else {
      control?.setValue(this.lastValidValues[field]);
    }
  }

  public redirecionar() {
    if (!this.resposta.includes("Erro")) {
      this.router.navigate(['/']);
    }
  }

  public carregarProduto() {
    this.produtoService.buscarProdutoPorId(this.id).subscribe({
      next: (response) => {
        this.cadastroForm.controls['id'].patchValue(response.id);
        this.cadastroForm.controls['nome'].patchValue(response.nome);
        this.cadastroForm.controls['precoCusto'].patchValue(response.precoCusto);
        this.cadastroForm.controls['precoVenda'].patchValue(response.precoVenda);
        this.cadastroForm.controls['quantidade'].patchValue(response.quantidade);
        this.cadastroForm.controls['medida'].patchValue(response.medida);
        this.cadastroForm.controls['categoria'].patchValue(response.categoria);
      },
      error: (error) => {
        console.log(error);
      }
    })
  }

  public cadastrarAtualizarProduto() {
    (this.id !== null && this.id !== undefined ?
      this.produtoService.atualizarProduto(this.cadastroForm)
      : this.produtoService.cadastrarProduto(this.cadastroForm)).subscribe({
        next: (res) => {
          this.id != null && this.id != undefined ? this.resposta = "Dados atualizados com sucesso!" : this.resposta = "Dados cadastrados com sucesso!";
          document.getElementById("botaoModal")?.click();
        },
        error: (err) => {
          this.id != null && this.id != undefined ? this.resposta = "Erro ao atualizar o produto!" : this.resposta = "Erro ao cadastrar o produto!";
          document.getElementById("botaoModal")?.click();
        }
      });
  }

  public limparFormulario() {
    this.cadastroForm.reset();
  }

  
  public getDescricaoMedida(id: number): string {
    return this.medida.find(m => m.id === id)?.descricao || '';
  }

  public getDescricaoCategoria(id: number): string {
    return this.categoria.find(m => m.id === id)?.descricao || '';
  }
}
