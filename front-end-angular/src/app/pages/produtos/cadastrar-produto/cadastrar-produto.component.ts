import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { UtilsService } from '@services/utils.service';
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
  private activatedRoute = inject(ActivatedRoute);
  private utilsService = inject(UtilsService);

  private lastValidValues: Record<string, number> = {
    precoCusto: 0,
    precoVenda: 0,
  };

  public resposta: string = "";
  public categoria: Array<string> = ["Alimentos", "Limpeza", "Eletrônicos", "Vestuário", "Brinquedos", "Acessórios"];
  public medida: Array<string> = ["Kg", "Mt", "Un", "Lt", "Cx", "Pc"];

  readonly MAX_VALUE = 10000;

  public cadastroForm: FormGroup = this.formBuilder.group({
    id: [{ value: '', disabled: true }],
    nome: ['', Validators.required],
    precoCusto: ['', Validators.required],
    precoVenda: ['', Validators.required],
    quantidade: ['', Validators.compose([Validators.required, Validators.min(1)])],
    medida: ['', Validators.required],
    categoria: ['', Validators.required]
  });

  constructor() { }

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

  public limparFormulario() {
    //this.cadastroForm.reset();
  }

}
