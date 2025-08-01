import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListarUsuariosComponent } from './listar-usuarios.component';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { LoginService } from '@services/login.service';
import { ListaUsuariosResponse } from '@models/ListaUsuariosResponse';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

describe('ListarUsuariosComponent', () => {
  let component: ListarUsuariosComponent;
  let fixture: ComponentFixture<ListarUsuariosComponent>;
  let mockLoginService: jasmine.SpyObj<LoginService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(() => {
    mockLoginService = jasmine.createSpyObj('LoginService', ['buscarLoginsPorPagina']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [ListarUsuariosComponent],
      providers: [
        { provide: LoginService, useValue: mockLoginService },
        { provide: Router, useValue: mockRouter },
      ]
    });

    fixture = TestBed.createComponent(ListarUsuariosComponent);
    component = fixture.componentInstance;
    spyOn(sessionStorage, 'getItem').and.returnValue('fake-token');
  });

  it('deve instanciar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve carregar os usuários no ngOnInit', () => {
    const response: ListaUsuariosResponse = { lista: [], total: 0 };
    mockLoginService.buscarLoginsPorPagina.and.returnValue(of(response));

    component.ngOnInit();

    expect(mockLoginService.buscarLoginsPorPagina).toHaveBeenCalledWith(1, 2, 'fake-token');
    expect(component.listaUsuarios()).toEqual(response);
  });

  it('deve calcular o total de páginas corretamente', () => {
    const response: ListaUsuariosResponse = {
      lista: [{
        id: 1, nome: 'Teste',
        cpf: '',
        login: '',
        perfil: '',
        active: false
      }], total: 5
    };
    component.limit = 2;
    mockLoginService.buscarLoginsPorPagina.and.returnValue(of(response));

    component.carregarUsuarios();

    expect(component.totalPages).toBe(3);
  });

  it('deve navegar para a página de edição do usuário', () => {
    component.alterarUsuario(10);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/usuarios/cadastro/10']);
  });

  it('não deve mudar de página se número inválido for passado', () => {
    spyOn(component, 'carregarUsuarios');
    component.totalPages = 5;

    component.irParaPagina(0);
    component.irParaPagina(6);

    expect(component.carregarUsuarios).not.toHaveBeenCalled();
  });

  it('deve ir para próxima e página anterior', () => {
    spyOn(component, 'carregarUsuarios');

    component.page = 2;
    component.totalPages = 5;
    component.proximaPagina();
    expect(component.page).toBe(3);

    component.paginaAnterior();
    expect(component.page).toBe(2);
  });

  it('deve mudar tamanho da página e recarregar', () => {
    spyOn(component, 'carregarUsuarios');
    component.page = 3;
    component.mudarTamanho();

    expect(component.page).toBe(1);
    expect(component.carregarUsuarios).toHaveBeenCalled();
  });

  it('deve lidar com erro ao carregar usuários', () => {
    const consoleSpy = spyOn(console, 'log');
    mockLoginService.buscarLoginsPorPagina.and.returnValue(throwError(() => new Error('Erro')));

    component.carregarUsuarios();

    expect(consoleSpy).toHaveBeenCalledWith(jasmine.any(Error));
  });
});
