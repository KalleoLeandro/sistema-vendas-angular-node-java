import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { LoginService } from '@services/login.service';
import { provideRouter, Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { CommonModule } from '@angular/common';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { LoginReponse } from '@models/LoginReponse';



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
        { provide: Router, useValue: routerSpy},
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

  it('should navigate to /home if token is valid on ngOnInit', () => {
    loginService.validarToken.and.returnValue(of(true));
  
    component.ngOnInit();
  
    expect(loginService.validarToken).toHaveBeenCalledWith(component.token);
    expect(router.navigate).toHaveBeenCalledWith(['/home']);
  });

  it('should store token and navigate to /home on successful login', () => {
    const mockResponse:LoginReponse = { token: '123abc', userName: 'Kalleo', status: 200, expiration: '01/01/2000', message: 'Login ok'};
    loginService.validarLogin.and.returnValue(of(mockResponse));
  
    component.loginForm.setValue({ login: 'kalleo', senha: '1234' });
  
    component.logar();
  
    expect(loginService.validarLogin).toHaveBeenCalled();
    expect(sessionStorage.getItem('token')).toBe(mockResponse.token!);
    expect(sessionStorage.getItem('userName')).toBe(mockResponse.userName!);
    expect(router.navigate).toHaveBeenCalledWith(['/home']);
  });

  it('should reset form and set invalido=true on 401 error', () => {
    const errorResponse = { status: 401 };
    loginService.validarLogin.and.returnValue(throwError(() => errorResponse));
  
    component.loginForm.setValue({ login: 'kalleo', senha: 'errado' });
    component.logar();
  
    expect(component.loginForm.value.login).toBe('');
    expect(component.loginForm.value.senha).toBe('');
    expect(component.invalido).toBeTrue();
  });

  it('should set invalido=false when change is triggered with any input value', () => {
    component.invalido = true;
    component.loginForm.setValue({ login: 'user', senha: '' });
  
    component.change();
  
    expect(component.invalido).toBeFalse();
  });
});
