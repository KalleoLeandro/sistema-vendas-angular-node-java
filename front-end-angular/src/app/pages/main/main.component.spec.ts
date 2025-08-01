import { TestBed } from '@angular/core/testing';
import { MainComponent } from './main.component';
import { LoginService } from '@services/login.service';
import { provideRouter, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HomeComponent } from '../home/home.component';
import { CadastroUsuarioComponent } from '@pages/usuarios/cadastro-usuario/cadastro-usuario.component';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';

describe('MainComponent', () => {
  let component: MainComponent;
  let loginServiceSpy: jasmine.SpyObj<LoginService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;


  beforeEach(() => {

    httpClientSpy = jasmine.createSpyObj('HttpClient', ['post']);

    TestBed.configureTestingModule({
      imports: [CommonModule, MainComponent],
      providers: [
        provideRouter([
          {
            path: '',
            pathMatch: 'full',
            component: HomeComponent,
          },
          {
            path: 'cadastro/',
            component: CadastroUsuarioComponent,
          },
        ]),
        { provide: HttpClient, useValue: httpClientSpy },
        provideHttpClientTesting
      ],
    });

    component = TestBed.createComponent(MainComponent).componentInstance;
    loginServiceSpy = TestBed.inject(LoginService) as jasmine.SpyObj<LoginService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should create the component', () => {    
    expect(component).toBeTruthy();
  });

});
