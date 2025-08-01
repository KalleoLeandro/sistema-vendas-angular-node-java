import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { LoginReponse } from '@models/LoginReponse';
import { environment } from 'environments/environment';
import { catchError, Observable, shareReplay, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private httpClient = inject(HttpClient);
  private url = signal(environment.BFF);

  public validarLogin(hash: string): Observable<LoginReponse> {
    return this.httpClient.post<LoginReponse>(`${this.url()}/validar-login`, { hash }).pipe(
      shareReplay(),
      catchError((error: HttpErrorResponse) =>
        throwError(() => error)
      )
    )
  }

  public validarToken(token: string): Observable<Boolean> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'authorization': `${token}`,
      })
    }

    return this.httpClient.post<Boolean>(`${this.url()}/validar-token`, null, httpOptions).pipe(
      catchError((error: HttpErrorResponse) =>
        throwError(() => error)
      )
    );
  }

  public getPerfil(token: string): Observable<Boolean> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'authorization': `${token}`,
      })
    }

    return this.httpClient.post<Boolean>(`${this.url()}/retorna-perfil`, null, httpOptions).pipe(
      catchError((error: HttpErrorResponse) =>
        throwError(() => error)
      )
    );
  }

  public buscarUsuarioPorId(id: number | null, token: string): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'authorization': `${token}`,
      })
    }

    return this.httpClient.get<Boolean>(`${this.url()}/buscar-por-id/${id}`, httpOptions).pipe(
      catchError((error: HttpErrorResponse) =>
        throwError(() => error)
      )
    );
  }

  public atualizarUsuario(formulario: FormGroup<any>, token: string): Observable<any>  {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'authorization': `${token}`,
      })
    }

    return this.httpClient.put<any>(`${this.url()}/atualizar-login`, formulario.getRawValue(), httpOptions).pipe(
      catchError((error: HttpErrorResponse) =>
        throwError(() => error)
      )
    );
  }

  public cadastrarUsuario(formulario: FormGroup<any>, token: string): Observable<any>  {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'authorization': `${token}`,
      })
    }

    return this.httpClient.post<any>(`${this.url()}/cadastrar-login`, formulario.getRawValue(), httpOptions).pipe(
      catchError((error: HttpErrorResponse) =>
        throwError(() => error)
      )
    );
  }

  public buscarLoginsPorPagina(page: number, limit: number, token: string): Observable<any>  {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'authorization': `${token}`,
      })
    }

    return this.httpClient.get<any>(`${this.url()}/buscar-por-pagina?page=${page}&limit=${limit}`, httpOptions).pipe(
      catchError((error: HttpErrorResponse) =>
        throwError(() => error)
      )
    );
  }
}