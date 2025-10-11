import { TestBed } from '@angular/core/testing';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { LoginReponse } from '@models/LoginReponse';
import { environment } from 'environments/environment';
import { FormControl, FormGroup } from '@angular/forms';
import { LoginService } from './login.service';

describe('LoginService', () => {
  let service: LoginService;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;

  beforeEach(() => {

    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get','post', 'delete']);



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

  describe('getPerfil', () => {
    it('deve chamar post com o token correto e retornar true', (done) => {
      const token = 'token123';
      const mockResponse = true;

      httpClientSpy.post.and.returnValue(of(mockResponse));

      service.getPerfil(token).subscribe(res => {
        expect(httpClientSpy.post).toHaveBeenCalledWith(
          `${environment.BFF}/retorna-perfil`,
          null,
          jasmine.objectContaining({
            headers: jasmine.any(HttpHeaders)
          })
        );
        expect(res).toBe(true);
        done();
      });
    });

    it('deve lidar com erro ao chamar getPerfil', (done) => {
      const token = 'token123';
      const error = new HttpErrorResponse({ status: 403 });

      httpClientSpy.post.and.returnValue(throwError(() => error));

      service.getPerfil(token).subscribe({
        error: (err) => {
          expect(err.status).toBe(403);
          done();
        }
      });
    });
  });

  describe('buscarUsuarioPorId', () => {
    it('deve fazer GET com id e token e retornar resultado', (done) => {
      const token = 'token';
      const id = 1;
      const mockResponse = { nome: 'João' };

      httpClientSpy.get = jasmine.createSpy().and.returnValue(of(mockResponse));

      service.buscarUsuarioPorId(id, token).subscribe(res => {
        expect(httpClientSpy.get).toHaveBeenCalledWith(
          `${environment.BFF}/buscar-por-id/${id}`,
          jasmine.anything()
        );
        expect(res).toEqual(mockResponse);
        done();
      });
    });

    it('deve tratar erro ao buscar usuário por ID', (done) => {
      const token = 'token';
      const id = 1;
      const error = new HttpErrorResponse({ status: 404 });

      httpClientSpy.get = jasmine.createSpy().and.returnValue(throwError(() => error));

      service.buscarUsuarioPorId(id, token).subscribe({
        error: (err) => {
          expect(err.status).toBe(404);
          done();
        }
      });
    });
  });

  describe('atualizarUsuario', () => {
    it('deve fazer PUT com formulário e retornar resultado', (done) => {
      const token = 'token';
      const form = new FormGroup({ nome: new FormControl('Maria') });
      const mockResponse = { atualizado: true };

      httpClientSpy.put = jasmine.createSpy().and.returnValue(of(mockResponse));

      service.atualizarUsuario(form, token).subscribe(res => {
        expect(httpClientSpy.put).toHaveBeenCalledWith(
          `${environment.BFF}/atualizar-login`,
          form.getRawValue(),
          jasmine.anything()
        );
        expect(res).toEqual(mockResponse);
        done();
      });
    });

    it('deve tratar erro ao atualizar usuário', (done) => {
      const token = 'token';
      const form = new FormGroup({ nome: new FormControl('Maria') });
      const error = new HttpErrorResponse({ status: 400 });

      httpClientSpy.put = jasmine.createSpy().and.returnValue(throwError(() => error));

      service.atualizarUsuario(form, token).subscribe({
        error: (err) => {
          expect(err.status).toBe(400);
          done();
        }
      });
    });
  });

  describe('cadastrarUsuario', () => {
    it('deve fazer POST com formulário e retornar resultado', (done) => {
      const token = 'token';
      const form = new FormGroup({ nome: new FormControl('João') });
      const mockResponse = { cadastrado: true };

      httpClientSpy.post.and.returnValue(of(mockResponse));

      service.cadastrarUsuario(form, token).subscribe(res => {
        expect(httpClientSpy.post).toHaveBeenCalledWith(
          `${environment.BFF}/cadastrar-login`,
          form.getRawValue(),
          jasmine.anything()
        );
        expect(res).toEqual(mockResponse);
        done();
      });
    });

    it('deve tratar erro ao cadastrar usuário', (done) => {
      const token = 'token';
      const form = new FormGroup({ nome: new FormControl('João') });
      const error = new HttpErrorResponse({ status: 409 });

      httpClientSpy.post.and.returnValue(throwError(() => error));

      service.cadastrarUsuario(form, token).subscribe({
        error: (err) => {
          expect(err.status).toBe(409);
          done();
        }
      });
    });
  });

  describe('buscarLoginsPorPagina', () => {
    it('deve buscar lista de logins por página', (done) => {
      const page = 1;
      const limit = 10;
      const token = 'token';
      const mockResponse = [{ nome: 'João' }];

      httpClientSpy.get = jasmine.createSpy().and.returnValue(of(mockResponse));

      service.buscarLoginsPorPagina(page, limit, token).subscribe(res => {
        expect(httpClientSpy.get).toHaveBeenCalledWith(
          `${environment.BFF}/buscar-por-pagina?page=${page}&limit=${limit}`,
          jasmine.anything()
        );
        expect(res).toEqual(mockResponse);
        done();
      });
    });

    it('deve dar erro ao buscar logins por página', (done) => {
      const page = 1;
      const limit = 10;
      const token = 'token';

      const error = new HttpErrorResponse({ status: 409 });

      httpClientSpy.get.and.returnValue(throwError(() => error));

      service.buscarLoginsPorPagina(page, limit, token).subscribe({
        error: (err) => {
          expect(err.status).toBe(409);
          done();
        }
      });
    })
  });

  describe('excluirUsuario', () => {
    it('deve fazer DELETE ao excluir usuário', (done) => {
      const token = 'token';
      const id = 2;

      const mockResponse = { message: 'Usuário excluído com sucesso!' };

      httpClientSpy.delete = jasmine.createSpy().and.returnValue(of(mockResponse));

      service.excluirUsuario(id, token).subscribe(res => {
        expect(httpClientSpy.delete).toHaveBeenCalledWith(
          `${environment.BFF}/excluir-login/${id}`,
          jasmine.anything()
        );
        expect(res).toEqual(mockResponse);
        done();
      });
    })

    it('deve dar erro ao excluir usuário', (done) => {
      const token = 'token';
      const id = 2;

      const error = new HttpErrorResponse({ status: 409 });

      httpClientSpy.delete.and.returnValue(throwError(() => error));

      service.excluirUsuario(id, token).subscribe({
        error: (err) => {
          expect(err.status).toBe(409);
          done();
        }
      });
    })

  })
});


