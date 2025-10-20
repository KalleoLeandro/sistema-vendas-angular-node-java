import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { environment } from 'environments/environment';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProdutoService {

  private httpClient = inject(HttpClient);
  private url = signal(environment.BFF);

  constructor() { }

  public cadastrarProduto(formulario: FormGroup<any>): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      withCredentials: true
    }

    return this.httpClient.post<any>(`${this.url()}/cadastrar-produto`, formulario.getRawValue(), httpOptions).pipe(
      catchError((error: HttpErrorResponse) =>
        throwError(() => error)
      )
    );
  }

  public atualizarProduto(formulario: FormGroup<any>): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      withCredentials: true
    }

    return this.httpClient.put<any>(`${this.url()}/atualizar-produto`, formulario.getRawValue(), httpOptions).pipe(
      catchError((error: HttpErrorResponse) =>
        throwError(() => error)
      )
    );
  }

  public buscarProdutosPorPagina(page: number, limit: number): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      withCredentials: true
    }

    return this.httpClient.get<any>(`${this.url()}/buscar-produtos-por-pagina?page=${page}&limit=${limit}`, httpOptions).pipe(
      catchError((error: HttpErrorResponse) =>
        throwError(() => error)
      )
    );
  }

  public buscarProdutoPorId(id: number | null): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      withCredentials: true
    }

    return this.httpClient.get<Boolean>(`${this.url()}/buscar-produto-por-id/${id}`, httpOptions).pipe(
      catchError((error: HttpErrorResponse) =>
        throwError(() => error)
      )
    );
  }

  public excluirProduto(id: number): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      withCredentials: true
    }

    return this.httpClient.delete<any>(`${this.url()}/excluir-produto/${id}`, httpOptions).pipe(
      catchError((error: HttpErrorResponse) =>
        throwError(() => error)
      )
    );
  }
}
