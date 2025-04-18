import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { LoginReponse } from '@models/LoginReponse';
import { environment } from 'environments/environment';
import { catchError, Observable, shareReplay, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  #httpClient = inject(HttpClient);
  #url = signal(environment.BFF);

  public validarLogin(hash: string): Observable<LoginReponse> {    
    return this.#httpClient.post<LoginReponse>(`${this.#url()}/validar-login`, { hash }).pipe(
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

    return this.#httpClient.post<Boolean>(`${this.#url()}/validar-token`, null, httpOptions).pipe(
      catchError((error: HttpErrorResponse) =>
        throwError(() => error)
      )
    );
  }
}

