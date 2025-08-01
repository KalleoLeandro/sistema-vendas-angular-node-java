import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UtilsService } from './utils.service';
import { environment } from 'environments/environment';

describe('UtilsService', () => {
  let service: UtilsService;
  let httpMock: HttpTestingController;

  const mockToken = 'mock-token';
  const mockCpf = '12345678900';
  const apiUrl = environment.BFF;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UtilsService],
    });

    service = TestBed.inject(UtilsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // garante que não há chamadas pendentes
  });

  it('deve ser criado', () => {
    expect(service).toBeTruthy();
  });

  it('deve fazer uma requisição POST para validar o CPF com token', () => {
    const mockResponse = { valido: true };

    service.validarCpf(mockCpf, mockToken).subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${apiUrl}/validar-cpf`);
    expect(req.request.method).toBe('POST');
    expect(req.request.headers.get('authorization')).toBe(mockToken);
    expect(req.request.body).toEqual({ cpf: mockCpf });

    req.flush(mockResponse);
  });

  it('deve tratar erro ao validar CPF', () => {
    const mockError = { status: 400, statusText: 'Bad Request' };

    service.validarCpf(mockCpf, mockToken).subscribe({
      error: (error) => {
        expect(error.status).toBe(400);
        expect(error.statusText).toBe('Bad Request');
      }
    });

    const req = httpMock.expectOne(`${apiUrl}/validar-cpf`);
    req.flush(null, mockError);
  });
});
