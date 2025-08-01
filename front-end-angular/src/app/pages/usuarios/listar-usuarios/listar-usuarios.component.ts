import { CommonModule } from '@angular/common';
import { signal } from '@angular/core';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ListaUsuariosResponse } from '@models/ListaUsuariosResponse';
import { LoginService } from '@services/login.service';

@Component({
  selector: 'app-listar-usuarios',
  imports: [CommonModule, FormsModule],
  templateUrl: './listar-usuarios.component.html',
  styleUrl: './listar-usuarios.component.css'
})
export class ListarUsuariosComponent implements OnInit {
  private router = inject(Router);
  private loginService = inject(LoginService);

  public listaUsuarios = signal<ListaUsuariosResponse>({ lista: [], total: 0 });
  public page: number = 1;  
  public token: string = '';
  public paginacao = [{
    numero: 2, descricao: '2 por página'
  },
  {
    numero: 5, descricao: '5 por página'
  },
  {
    numero: 10, descricao: '10 por página'
  }];
  public limit = 2;
  public totalPages: number = 0;

  ngOnInit(): void {
    this.token = sessionStorage.getItem('token') || '';
    this.carregarUsuarios();
  }

  public alterarPagina() {

  }

  public alterarUsuario(id: number) {
    this.router.navigate([`/usuarios/cadastro/${id}`]);
  }

  public excluirUsuario(id: number) {

  }

   public carregarUsuarios(): void {
    this.loginService.buscarLoginsPorPagina(this.page, this.limit, this.token).subscribe({
      next: (response: ListaUsuariosResponse) => {
        this.listaUsuarios.set(response);
        this.totalPages = Math.ceil(response.total / this.limit);

      },
      error: (error: any) => {
        console.log(error);
      },
    });
  }

  public mudarTamanho() {
    this.page = 1;
    this.carregarUsuarios();
  }

  public irParaPagina(pagina: number): void {
    if (pagina >= 1 && pagina <= this.totalPages) {
      this.page = pagina;
      this.carregarUsuarios();
    }
  }

  public paginaAnterior(): void {
    if (this.page > 1) {
      this.page--;
      this.carregarUsuarios();
    }
  }

  public proximaPagina(): void {
    if (this.page < this.totalPages) {
      this.page++;
      this.carregarUsuarios();
    }
  }
}


