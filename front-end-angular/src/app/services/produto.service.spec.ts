import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { ProdutoService } from './produto.service';
import { environment } from 'environments/environment';

describe('ProdutoService', () => {
  let service: ProdutoService;
  let httpMock: HttpTestingController;
  const url = environment.BFF;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProdutoService],
    });

    service = TestBed.inject(ProdutoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  // ----------------------------------------------------
  // Buscar por ID
  // ----------------------------------------------------
  it('deve buscar produto por ID com sucesso', () => {
    const mockResponse = { id: 1, nome: 'Produto Teste' };

    service.buscarProdutoPorId(1).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${url}/buscar-produto-por-id/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('deve retornar erro ao buscar produto por ID', () => {
    service.buscarProdutoPorId(1).subscribe({
      next: () => fail('Era esperado erro, mas retornou sucesso'),
      error: (error: HttpErrorResponse) => {
        expect(error.status).toBe(404);
      }
    });

    const req = httpMock.expectOne(`${url}/buscar-produto-por-id/1`);
    expect(req.request.method).toBe('GET');
    req.flush('Erro', { status: 404, statusText: 'Not Found' });
  });

  // ----------------------------------------------------
  // Buscar por página
  // ----------------------------------------------------
  it('deve buscar produtos por página com sucesso', () => {
    const mockResponse = { items: [], total: 0 };

    service.buscarProdutosPorPagina(1, 10).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${url}/buscar-produtos-por-pagina?page=1&limit=10`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('deve retornar erro ao buscar produtos por página', () => {
    service.buscarProdutosPorPagina(1, 10).subscribe({
      next: () => fail('Era esperado erro, mas retornou sucesso'),
      error: (error: HttpErrorResponse) => {
        expect(error.status).toBe(500);
      }
    });

    const req = httpMock.expectOne(`${url}/buscar-produtos-por-pagina?page=1&limit=10`);
    expect(req.request.method).toBe('GET');
    req.flush('Erro', { status: 500, statusText: 'Server Error' });
  });

  // ----------------------------------------------------
  // Cadastrar
  // ----------------------------------------------------  
  it('deve cadastrar produto com sucesso', () => {
    const mockForm = {
      getRawValue: () => ({ nome: 'Produto Novo' })
    } as any;

    service.cadastrarProduto(mockForm).subscribe(response => {
      expect(response).toEqual({ sucesso: true });
    });

    const req = httpMock.expectOne(`${url}/cadastrar-produto`);
    expect(req.request.method).toBe('POST');
    req.flush({ sucesso: true });
  });

  it('deve retornar erro ao cadastrar produto', () => {
    const mockForm = {
      getRawValue: () => ({ nome: 'Produto Novo' })
    } as any;

    service.cadastrarProduto(mockForm).subscribe({
      next: () => fail('Era esperado erro, mas retornou sucesso'),
      error: (error: HttpErrorResponse) => {
        expect(error.status).toBe(400);
      }
    });

    const req = httpMock.expectOne(`${url}/cadastrar-produto`);
    expect(req.request.method).toBe('POST');
    req.flush('Erro', { status: 400, statusText: 'Bad Request' });
  });



  // ----------------------------------------------------
  // Atualizar
  // ----------------------------------------------------
  it('deve atualizar produto com sucesso', () => {
    const mockForm = {
      getRawValue: () => ({ id: 1, nome: 'Atualizado' })
    } as any;


    service.atualizarProduto(mockForm as any).subscribe(response => {
      expect(response).toEqual({ sucesso: true });
    });

    const req = httpMock.expectOne(`${url}/atualizar-produto`);
    expect(req.request.method).toBe('PUT');
    req.flush({ sucesso: true });
  });

  it('deve retornar erro ao atualizar produto', () => {
    const mockForm = {
      getRawValue: () => ({ id: 1, nome: 'Atualizado' })
    } as any;


    service.atualizarProduto(mockForm as any).subscribe({
      next: () => fail('Era esperado erro, mas retornou sucesso'),
      error: (error: HttpErrorResponse) => {
        expect(error.status).toBe(500);
      }
    });

    const req = httpMock.expectOne(`${url}/atualizar-produto`);
    expect(req.request.method).toBe('PUT');
    req.flush('Erro', { status: 500, statusText: 'Server Error' });
  });

  // ----------------------------------------------------
  // Excluir
  // ----------------------------------------------------
  it('deve excluir produto com sucesso', () => {
    service.excluirProduto(1).subscribe(response => {
      expect(response).toEqual({ sucesso: true });
    });

    const req = httpMock.expectOne(`${url}/excluir-produto/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush({ sucesso: true });
  });

  it('deve retornar erro ao excluir produto', () => {
    service.excluirProduto(1).subscribe({
      next: () => fail('Era esperado erro, mas retornou sucesso'),
      error: (error: HttpErrorResponse) => {
        expect(error.status).toBe(401);
      }
    });

    const req = httpMock.expectOne(`${url}/excluir-produto/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush('Erro', { status: 401, statusText: 'Unauthorized' });
  });
});
