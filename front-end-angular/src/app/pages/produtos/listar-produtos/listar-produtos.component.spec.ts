import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListarProdutosComponent } from './listar-produtos.component';
import { ProdutoService } from '@services/produto.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('ListarProdutosComponent', () => {
  let component: ListarProdutosComponent;
  let fixture: ComponentFixture<ListarProdutosComponent>;

  const mockRouter = {
    navigate: jasmine.createSpy('navigate'),
  };

  const mockProdutoService = {
    buscarProdutosPorPagina: jasmine.createSpy('buscarProdutosPorPagina'),
    excluirProduto: jasmine.createSpy('excluirProduto'),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListarProdutosComponent],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: ProdutoService, useValue: mockProdutoService }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ListarProdutosComponent);
    component = fixture.componentInstance;
  });

  function mockLista(total = 3) {
    return {
      lista: [
        { id: 1, nome: 'Produto 1' },
        { id: 2, nome: 'Produto 2' },
        { id: 3, nome: 'Produto 3' },
      ],
      total
    };
  }

  it('deve criar o componente', () => {
    mockProdutoService.buscarProdutosPorPagina.and.returnValue(of(mockLista()));
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('deve chamar buscarProdutosPorPagina no ngOnInit e carregar a lista', () => {
    mockProdutoService.buscarProdutosPorPagina.and.returnValue(of(mockLista()));
    fixture.detectChanges();

    expect(mockProdutoService.buscarProdutosPorPagina).toHaveBeenCalledWith(1, 10);
    expect(component.listaProdutos().lista.length).toBe(3);
  });

  it('deve calcular totalPages corretamente', () => {
    mockProdutoService.buscarProdutosPorPagina.and.returnValue(of(mockLista(40)));
    fixture.detectChanges();

    expect(component.totalPages).toBe(4);
  });

  it('deve navegar ao alterarProduto', () => {
    component.alterarProduto(10);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/produtos/cadastro/10']);
  });

  it('deve configurar modal ao chamar modalExcluirProduto', () => {
    spyOn(document, 'getElementById').and.returnValue({ click: () => {} } as any);

    component.modalExcluirProduto(5);

    expect(component.excluir).toBeTrue();
    expect(component.id).toBe(5);
    expect(component.resposta).toContain('Tem certeza');
  });

  it('deve excluir produto e atualizar a lista', () => {
    mockProdutoService.buscarProdutosPorPagina.and.returnValue(of(mockLista()));
    fixture.detectChanges();

    mockProdutoService.excluirProduto.and.returnValue(of({}));

    component.id = 2;
    component.excluirProduto?.(); // caso o nome no seu arquivo seja excluirProduto, troque esta linha
    expect(mockProdutoService.excluirProduto).toHaveBeenCalledWith(2);
  });

  it('deve tratar erro ao excluir produto', () => {
    mockProdutoService.excluirProduto.and.returnValue(throwError(() => new Error('Erro')));

    component.id = 1;    

    component.excluirProduto();

    expect(component.resposta).toBe('Erro ao excluir o produto!');
  });

  it('deve trocar tamanho de página e recarregar lista', () => {
    mockProdutoService.buscarProdutosPorPagina.and.returnValue(of(mockLista()));
    spyOn(component, 'carregarProdutos' as any); // se o seu for carregarProdutos, troque aqui

    component.mudarTamanho();

    expect(component.page).toBe(1);
    expect(component.carregarProdutos).toHaveBeenCalled();
  });

  it('deve ir para página específica', () => {
    mockProdutoService.buscarProdutosPorPagina.and.returnValue(of(mockLista(30)));
    fixture.detectChanges();

    spyOn(component, 'carregarProdutos' as any);

    component.irParaPagina(2);
    expect(component.page).toBe(2);
    expect(component.carregarProdutos).toHaveBeenCalled();
  });

  it('deve ir para página anterior', () => {
    const spy = spyOn(component, 'carregarProdutos');
    component.page = 2;
    component.paginaAnterior();
    expect(component.page).toBe(1);
    expect(spy).toHaveBeenCalled();
  });

  it('não deve ir para página anterior quando page = 1', () => {
    const spy = spyOn(component, 'carregarProdutos');
    component.page = 1;
    component.paginaAnterior();
    expect(spy).not.toHaveBeenCalled();
  });

  it('deve ir para próxima página', () => {
    const spy = spyOn(component, 'carregarProdutos');
    component.page = 1;
    component.totalPages = 5;
    component.proximaPagina();
    expect(component.page).toBe(2);
    expect(spy).toHaveBeenCalled();
  });

  it('não deve ir para próxima página quando já está na última', () => {
    const spy = spyOn(component, 'carregarProdutos');
    component.page = 5;
    component.totalPages = 5;
    component.proximaPagina();
    expect(spy).not.toHaveBeenCalled();
  });

  it('deve lidar com erro ao consultar produtos', () => {
    mockProdutoService.buscarProdutosPorPagina.and.returnValue(throwError(() => new Error('erro')));
    spyOn(console, 'log');

    fixture.detectChanges();

    expect(console.log).toHaveBeenCalled();
  });
});
