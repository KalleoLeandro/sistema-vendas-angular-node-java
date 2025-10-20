import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CadastroUsuarioComponent } from './cadastro-usuario.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { LoginService } from '@services/login.service';
import { UtilsService } from '@services/utils.service';
import { NgxMaskDirective, provideEnvironmentNgxMask } from 'ngx-mask';

describe('CadastroUsuarioComponent', () => {
  let component: CadastroUsuarioComponent;
  let fixture: ComponentFixture<CadastroUsuarioComponent>;
  let loginService: jasmine.SpyObj<LoginService>;
  let utilsService: jasmine.SpyObj<UtilsService>;
  let router: jasmine.SpyObj<Router>;
  let mockActivatedRoute: any;

  beforeEach(waitForAsync(() => {
    const loginServiceSpy = jasmine.createSpyObj('LoginService', [
      'buscarUsuarioPorId',
      'atualizarUsuario',
      'cadastrarUsuario'
    ]);

    mockActivatedRoute = {
      snapshot: {
        paramMap: {
          get: jasmine.createSpy('get').and.returnValue(null)
        }
      }
    };

    const utilsServiceSpy = jasmine.createSpyObj('UtilsService', ['validarCpf']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, FormsModule, CadastroUsuarioComponent, NgxMaskDirective],
      providers: [
        { provide: LoginService, useValue: loginServiceSpy },
        { provide: UtilsService, useValue: utilsServiceSpy },
        { provide: Router, useValue: routerSpy },
        {
          provide: ActivatedRoute,
          useValue: mockActivatedRoute
        },
        provideEnvironmentNgxMask({
          dropSpecialCharacters: true
        })
      ]
    }).compileComponents().then(() => {
      fixture = TestBed.createComponent(CadastroUsuarioComponent);
      component = fixture.componentInstance;
      loginService = TestBed.inject(LoginService) as jasmine.SpyObj<LoginService>;
      utilsService = TestBed.inject(UtilsService) as jasmine.SpyObj<UtilsService>;
      router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
      fixture.detectChanges();
    });
  }));

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve validar CPF como válido', () => {
    component.cadastroForm.controls['cpf'].setValue('123.456.789-00');
    utilsService.validarCpf.and.returnValue(of({ valido: true }));

    component.cpfValido();

    expect(utilsService.validarCpf).toHaveBeenCalled();
  });

  it('deve marcar CPF como inválido quando resposta for inválida', () => {
    component.cadastroForm.controls['cpf'].setValue('123.456.789-00');
    utilsService.validarCpf.and.returnValue(of({ valido: false }));

    component.cpfValido();

    expect(component.cpfInvalido).toBeTrue();
  });

  it('deve lidar com erro ao validar CPF', () => {
    component.cadastroForm.controls['cpf'].setValue('123.456.789-00');
    utilsService.validarCpf.and.returnValue(throwError(() => new Error('Erro')));

    component.cpfValido();

    expect(component.cpfInvalido).toBeTrue();
  });

  it('deve carregar usuário ao chamar carregarUsuario()', () => {
    loginService.buscarUsuarioPorId.and.returnValue(of({
      id: 1, nome: 'Teste', cpf: '12345678900', login: 'teste', senha: '1234', perfil: 'admin'
    }));

    component.id = 1;
    component.carregarUsuario();

    expect(loginService.buscarUsuarioPorId).toHaveBeenCalledWith(1);
    expect(component.cadastroForm.controls['nome'].value).toBe('Teste');
  });

  it('deve lidar com erro ao carregar usuário', () => {
    spyOn(console, 'log');
    loginService.buscarUsuarioPorId.and.returnValue(throwError(() => new Error('Erro')));

    component.id = 1;
    component.carregarUsuario();

    expect(console.log).toHaveBeenCalled();
  });

  it('deve cadastrar novo usuário', () => {
    component.id = null;
    loginService.cadastrarUsuario.and.returnValue(of({}));

    component.cadastrarAtualizarUsuario();

    expect(loginService.cadastrarUsuario).toHaveBeenCalled();
    expect(component.resposta).toContain('Dados cadastrados');
  });

  it('deve atualizar usuário existente', () => {
    component.id = 1;
    loginService.atualizarUsuario.and.returnValue(of({}));

    component.cadastrarAtualizarUsuario();

    expect(loginService.atualizarUsuario).toHaveBeenCalled();
    expect(component.resposta).toContain('Dados atualizados');
  });

  it('deve tratar erro ao cadastrar usuário', () => {
    component.id = null;
    loginService.cadastrarUsuario.and.returnValue(throwError(() => new Error('Erro')));

    component.cadastrarAtualizarUsuario();

    expect(component.resposta).toContain('Erro ao cadastrar');
  });

  it('deve limpar o formulário', () => {
    component.cadastroForm.controls['nome'].setValue('Teste');
    component.limparFormulario();

    expect(component.cadastroForm.controls['nome'].value).toBeNull();
  });

  it('deve redirecionar para home se resposta for sucesso', () => {
    component.resposta = 'Dados cadastrados com sucesso!';
    component.redirecionar();

    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });

  it('não deve redirecionar se resposta tiver erro', () => {
    component.resposta = 'Erro ao cadastrar!';
    component.redirecionar();

    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('deve chamar carregarUsuario no construtor quando id estiver presente', () => {
    mockActivatedRoute.snapshot.paramMap.get.and.callFake((key: string) => {
      return key === 'id' ? 1 : null;
    });  
    loginService.buscarUsuarioPorId.and.returnValue(of({
      id: 1, nome: 'Teste', cpf: '12345678900', login: 'teste', senha: '1234', perfil: 'admin'
    }));
  
    fixture = TestBed.createComponent(CadastroUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  
    expect(loginService.buscarUsuarioPorId).toHaveBeenCalledWith(1);
  });  

  it('não deve validar CPF quando o valor tiver menos de 11 dígitos', () => {
    component.cadastroForm.controls['cpf'].setValue('123.456');
    component.cpfInvalido = true;
  
    component.cpfValido();
  
    expect(component.cpfInvalido).toBeFalse();
    expect(utilsService.validarCpf).not.toHaveBeenCalled();
  });
  
});
