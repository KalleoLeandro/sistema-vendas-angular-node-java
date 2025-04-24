import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from '@services/login.service';
import { UtilsService } from '@services/utils.service';
import { NgxMaskDirective } from 'ngx-mask';

@Component({
  selector: 'app-cadastro-usuario',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgxMaskDirective],
  standalone: true,
  templateUrl: './cadastro-usuario.component.html',
  styleUrl: './cadastro-usuario.component.css'
})
export class CadastroUsuarioComponent {
  #formBuilder = inject(FormBuilder);
  #router = inject(Router);
  #activatedRoute = inject(ActivatedRoute);
  #utilsService = inject(UtilsService);
  #loginService = inject(LoginService);

  public cadastroForm: FormGroup = this.#formBuilder.group({
    id: [{ value: '', disabled: true }],
    nome: ['', Validators.required],
    cpf: ['', Validators.required],
    login: ['', Validators.required],
    senha: ['', Validators.required],
    perfil: ['', Validators.required]
  });

  public perfil: Array<string> = ["dev", "user", "admin"];
  public resposta: string = "";

  public estados: Array<string> = [];

  public cpfInvalido: boolean = false;
  public dataInvalida: boolean = false;
  public hoje: string = "";
  public id: number | null = null;

  public token: string = sessionStorage.getItem('token') || '';



  constructor() {
    this.id = this.#activatedRoute.snapshot.paramMap.get('id') as unknown as number;
    if (this.id != null && this.id != undefined) {
      this.carregarUsuario();
    }
  }


  public carregarUsuario() {
    this.#loginService.buscarUsuarioPorId(this.id, this.token).subscribe({
      next: (response) => {
        this.cadastroForm.controls['id'].patchValue(response.id);
        this.cadastroForm.controls['nome'].patchValue(response.nome);
        this.cadastroForm.controls['cpf'].patchValue(response.cpf);
        this.cadastroForm.controls['login'].patchValue(response.login);
        this.cadastroForm.controls['senha'].patchValue(response.senha);
        this.cadastroForm.controls['perfil'].patchValue(response.perfil);
      },
      error: (error) => {
        console.log(error);
      }
    })
  }

  public cpfValido() {
    const cpf = this.cadastroForm.controls['cpf'].value.replaceAll(".", "").replaceAll("-", "");
    if (cpf.length === 11) {
      this.#utilsService.validarCpf(cpf, this.token).subscribe({
        next: (res) => {
          this.cpfInvalido = !res.valido;
        },
        error: (error) => {
          this.cpfInvalido = true;
        }
      });
    } else {
      this.cpfInvalido = false;
    }
  }

  public cadastrarAtualizarUsuario() {
    (this.id !== null && this.id !== undefined ?
      this.#loginService.atualizarUsuario(this.cadastroForm, this.token as string)
      : this.#loginService.cadastrarUsuario(this.cadastroForm, this.token as string)).subscribe({
        next: (res) => {
          this.id != null && this.id != undefined ? this.resposta = "Dados atualizados com sucesso!" : this.resposta = "Dados cadastrados com sucesso!";
          document.getElementById("botaoModal")?.click();
        },
        error: (err) => {
          this.id != null && this.id != undefined ? this.resposta = "Erro ao atualizar o usuário!" : this.resposta = "Erro ao cadastrar o usuário!";
          document.getElementById("botaoModal")?.click();
        }
      });
  }

  public limparFormulario() {
    this.cadastroForm.reset();
    this.cadastroForm.patchValue({
      sexo: 'm'
    })
  }

  public redirecionar() {
    if (!this.resposta.includes("Erro")) {
      this.#router.navigate(['/']);
    }
  }
}
