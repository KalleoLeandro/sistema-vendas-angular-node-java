import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { LoginService } from '@services/login.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { CommonModule } from '@angular/common';
import { provideHttpClientTesting } from '@angular/common/http/testing';



describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let loginService: jasmine.SpyObj<LoginService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const loginServiceSpy = jasmine.createSpyObj('LoginService', ['validarToken', 'validarLogin']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({      
      imports: [ReactiveFormsModule, CommonModule, LoginComponent],
      providers: [
        FormBuilder,
        { provide: LoginService, useValue: loginServiceSpy },        
        provideHttpClientTesting
      ],
    });

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    loginService = TestBed.inject(LoginService) as jasmine.SpyObj<LoginService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should create the component', () => {    
    expect(component).toBeTruthy();
  });

  it('deve validar o token na inicialização do componente', () => {
    const token = 'testToken';
    sessionStorage.setItem('token', token);

    loginService.validarToken.and.returnValue(of(true));

    fixture.detectChanges();

    expect(loginService.validarToken).toHaveBeenCalledWith(token);
  });

  it('deve setar a flag invalid com false caso retorno de 401', () => {
    component.loginForm.controls['login'].setValue('testUser');
    component.loginForm.controls['senha'].setValue('testPassword');    

    loginService.validarLogin.and.returnValue(throwError(() => ({ status: 401 })));

    component.logar();

    expect(component.invalido).toBeTrue();
    expect(component.loginForm.controls['login'].value).toBe('');
    expect(component.loginForm.controls['senha'].value).toBe('');
  });
  
  it('Deve verificar se os campos estão vazios e invalidar a variável de controle', () => {    
    component.loginForm.controls['login'].setValue('testUser');
    component.loginForm.controls['senha'].setValue('testPassword');    
    
    component.change();  
    
    expect(component.invalido).toBeFalse();
  });

  it('Deve salvar os dados do usuário e redirecionar o mesmo para a tela home', ()=>{
    const response = { token: 'testToken', userName: 'testUser', status: 200, expiration: '01/01/2000'};
    loginService.validarLogin.and.returnValue(of(response));

    component.loginForm.controls['login'].setValue('testUser');
    component.loginForm.controls['senha'].setValue('testPassword');

    const hash = 'encryptedData';    

    component.logar();

    expect(sessionStorage.getItem('token')).toBe('testToken');
    expect(sessionStorage.getItem('userName')).toBe('testUser');    
  })
});
