import { TestBed } from '@angular/core/testing';
import { ListarUsuariosComponent } from './listar-usuarios.component';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ListaUsuariosResponse } from '@models/ListaUsuariosResponse';
import { LoginService } from '@services/login.service';

describe('ListarUsuariosComponent', () => {
  let component: ListarUsuariosComponent;
  let routerMock: any;
  let loginServiceMock: any;

  const mockResponse: ListaUsuariosResponse = {
    lista: [{ id: 1, nome: 'Teste', cpf: '222.333.444-05', login: 'teste', perfil: 'adm', active: true}],
    total: 1
  };

  const setup = () => {
    routerMock = { navigate: jasmine.createSpy('navigate') };

    loginServiceMock = {
      buscarLoginsPorPagina: jasmine.createSpy('buscarLoginsPorPagina').and.returnValue(of(mockResponse)),
      excluirUsuario: jasmine.createSpy('excluirUsuario').and.returnValue(of({}))
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: routerMock },
        { provide: LoginService, useValue: loginServiceMock }
      ]
    });

    component = TestBed.createComponent(ListarUsuariosComponent).componentInstance;
  };

  beforeEach(() => {
    setup();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve chamar carregarUsuarios no ngOnInit', () => {
    const spy = spyOn(component, 'carregarUsuarios');
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });

  it('deve carregar usuários com sucesso', () => {
    component.carregarUsuarios();
    expect(loginServiceMock.buscarLoginsPorPagina).toHaveBeenCalledWith(1, 10);
    expect(component.listaUsuarios().lista.length).toBe(1);
    expect(component.totalPages).toBe(1);
  });

  it('deve tratar erro ao carregar usuários', () => {
    loginServiceMock.buscarLoginsPorPagina.and.returnValue(throwError(() => new Error('Erro')));
    component.carregarUsuarios();
    expect(loginServiceMock.buscarLoginsPorPagina).toHaveBeenCalled();
  });

  it('deve navegar para tela de alteração', () => {
    component.alterarUsuario(5);
    expect(routerMock.navigate).toHaveBeenCalledWith(['/usuarios/cadastro/5']);
  });

  it('deve abrir modal ao chamar modalExcluirUsuario', () => {
    const clickSpy = jasmine.createSpy('click');
    spyOn(document, 'getElementById').and.returnValue({ click: clickSpy } as any);

    component.modalExcluirUsuario(1);

    expect(component.excluir).toBeTrue();
    expect(component.id).toBe(1);
    expect(clickSpy).toHaveBeenCalled();
  });

  it('deve excluir usuário com sucesso', () => {
    component.listaUsuarios.set(mockResponse);
    component.id = 1;

    component.excluirUsuario();

    expect(loginServiceMock.excluirUsuario).toHaveBeenCalledWith(1);
    expect(component.resposta).toBe('Usuário excluído com sucesso.');
    expect(component.listaUsuarios().lista.length).toBe(0);
  });

  it('deve tratar erro ao excluir usuário', () => {
    loginServiceMock.excluirUsuario.and.returnValue(throwError(() => new Error('Erro')));

    component.id = 1;
    component.listaUsuarios.set(mockResponse);

    component.excluirUsuario();

    expect(component.resposta).toBe('Erro ao excluir o usuário!');
  });

  it('deve mudar o tamanho e recarregar', () => {
    const spy = spyOn(component, 'carregarUsuarios');
    component.mudarTamanho();
    expect(component.page).toBe(1);
    expect(spy).toHaveBeenCalled();
  });

  it('deve ir para página válida', () => {
    const spy = spyOn(component, 'carregarUsuarios');
    component.totalPages = 5;
    component.irParaPagina(2);
    expect(component.page).toBe(2);
    expect(spy).toHaveBeenCalled();
  });

  it('não deve ir para página inválida', () => {
    const spy = spyOn(component, 'carregarUsuarios');
    component.totalPages = 5;
    component.irParaPagina(10);
    expect(component.page).toBe(1);
    expect(spy).not.toHaveBeenCalled();
  });

  it('deve ir para página anterior', () => {
    const spy = spyOn(component, 'carregarUsuarios');
    component.page = 2;
    component.paginaAnterior();
    expect(component.page).toBe(1);
    expect(spy).toHaveBeenCalled();
  });

  it('não deve ir para página anterior quando page = 1', () => {
    const spy = spyOn(component, 'carregarUsuarios');
    component.page = 1;
    component.paginaAnterior();
    expect(spy).not.toHaveBeenCalled();
  });

  it('deve ir para próxima página', () => {
    const spy = spyOn(component, 'carregarUsuarios');
    component.page = 1;
    component.totalPages = 5;
    component.proximaPagina();
    expect(component.page).toBe(2);
    expect(spy).toHaveBeenCalled();
  });

  it('não deve ir para próxima página quando já está na última', () => {
    const spy = spyOn(component, 'carregarUsuarios');
    component.page = 5;
    component.totalPages = 5;
    component.proximaPagina();
    expect(spy).not.toHaveBeenCalled();
  });
});
