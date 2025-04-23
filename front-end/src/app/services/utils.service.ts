import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from 'environments/environment';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  #httpClient = inject(HttpClient);
  #url = signal(environment.BFF);

  

  public validarCpf(cpf: string, token: string): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'authorization': `${token}`,
      }),
    }

    return this.#httpClient.post<any>(`${this.#url()}/validar-cpf`, { cpf }, httpOptions).pipe(
      catchError((error: HttpErrorResponse) =>
        throwError(() => error)
      )
    );
  }

}
