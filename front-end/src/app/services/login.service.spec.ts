import { TestBed } from '@angular/core/testing';
import { LoginService } from './login.service';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

describe('LoginService', () => {
  let service: LoginService;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    TestBed.configureTestingModule({      
      providers: [
        provideHttpClient(),
        HttpTestingController,
        LoginService
      ]
    });

    service = TestBed.inject(LoginService);
    httpMock = TestBed.inject(HttpTestingController);    
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
