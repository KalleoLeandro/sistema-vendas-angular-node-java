import { TestBed } from '@angular/core/testing';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { LoginService } from './login.service';
import { LoginReponse } from '@models/LoginReponse';
import { environment } from 'environments/environment';

describe('LoginService', () => {
  let service: LoginService;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;

  beforeEach(() => {

    httpClientSpy = jasmine.createSpyObj('HttpClient', ['post']);


    TestBed.configureTestingModule({
      providers: [
        LoginService,
        { provide: HttpClient, useValue: httpClientSpy }
      ]
    });

    service = TestBed.inject(LoginService);
  });

  describe('validarLogin', () => {
    it('deve chamar o método post do HttpClient e retornar um LoginReponse', (done) => {
      const mockResponse: LoginReponse = {
        status: 200,
        token: "token",
        expiration: "01/01/2000",
        userName: "Teste"
      };
      const hash = 'test_hash';
      const url = `${environment.BFF}/validar-login`;

      httpClientSpy.post.and.returnValue(of(mockResponse));

      service.validarLogin(hash).subscribe(response => {
        expect(httpClientSpy.post).toHaveBeenCalledOnceWith(url, { hash });
        expect(response).toEqual(mockResponse);
        done();
      });
    });

    it('deve lidar com erro ao chamar validarLogin', (done) => {
      const hash = 'test_hash';
      const errorResponse = new HttpErrorResponse({
        error: 'error message',
        status: 500,
        statusText: 'Internal Server Error',
        url: `${environment.BFF}/validar-login`

      });

      httpClientSpy.post.and.returnValue(throwError(() => errorResponse));

      service.validarLogin(hash).subscribe({
        next: () => {
          fail('Esperado erro, mas obteve sucesso');
          done();
        },
        error: (error) => {
          expect(error).toEqual(errorResponse);
          done();
        }
      });
    });
  });

  describe('validarToken', () => {
    it('deve chamar o método post do HttpClient com token e retornar um valor booleano', (done) => {
      const token = 'test_token';
      const mockResponse = true;
      
      httpClientSpy.post.and.returnValue(of(mockResponse));
      
      service.validarToken(token).subscribe({
        next: (result) => {            
          expect(result).toBe(mockResponse);
          done();
        },
        error: (err) => {
          done.fail(err);
        }
      });
    });


    it('deve lançar erro ao tentar validar token', (done) => {
      const token = 'invalid_token';
      const errorResponse = new HttpErrorResponse({
        status: 500,
        statusText: 'Internal Server Error',
        error: 'error message',
      });

      httpClientSpy.post.and.returnValue(throwError(() => errorResponse));

      service.validarToken(token).subscribe({
        next: () => {
          fail('esperado erro, mas obteve sucesso');
          done();
        },
        error: (error) => {
          expect(error).toBeInstanceOf(HttpErrorResponse);
          expect(error.status).toBe(500);
          expect(error.statusText).toBe('Internal Server Error');
          expect(error.error).toBe('error message');
          done();
        }
      });
    });
  });
});

