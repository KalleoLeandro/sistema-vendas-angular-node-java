import { TestBed } from '@angular/core/testing';
import { CadastrarProdutoComponent } from './cadastrar-produto.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { ActivatedRoute, Router } from '@angular/router';
import { ProdutoService } from '@services/produto.service';
import { of, throwError } from 'rxjs';

describe('CadastrarProdutoComponent (completo)', () => {
  let routerMock: any;
  let produtoServiceMock: any;

  /**
   * Helper que recria o TestBed e instancia o componente com ActivatedRoute configurado.
   * @param idParam string|null - valor retornado por paramMap.get('id')
   */
  const createComponentWithRoute = (idParam: string | null) => {
    // Reset para garantir providers diferentes entre cenários
    TestBed.resetTestingModule();

    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, FormsModule, CurrencyMaskModule, CadastrarProdutoComponent],
      providers: [
        { provide: Router, useValue: routerMock },
        { provide: ProdutoService, useValue: produtoServiceMock },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => idParam
              }
            }
          }
        }
      ]
    }).compileComponents();

    const fixture = TestBed.createComponent(CadastrarProdutoComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges(); // garante fluxo de criação/constructor executado
    return { fixture, component };
  };

  beforeEach(() => {
    routerMock = {
      navigate: jasmine.createSpy('navigate')
    };

    // default mocks: buscarProdutoPorId retorna um produto exemplo (pode ser sobrescrito no teste)
    produtoServiceMock = {
      buscarProdutoPorId: jasmine.createSpy('buscarProdutoPorId').and.returnValue(
        of({
          id: 2,
          nome: 'Teste',
          precoCusto: 5,
          precoVenda: 10,
          quantidade: 1,
          medida: 1,
          categoria: 1
        })
      ),
      cadastrarProduto: jasmine.createSpy('cadastrarProduto').and.returnValue(of({})),
      atualizarProduto: jasmine.createSpy('atualizarProduto').and.returnValue(of({}))
    };
  });

  it('deve criar o componente', () => {
    const { component } = createComponentWithRoute(null);
    expect(component).toBeTruthy();
  });

  it('quando não há id na rota, não deve chamar buscarProdutoPorId', () => {
    // criar com id null
    produtoServiceMock.buscarProdutoPorId.calls.reset();
    const { component } = createComponentWithRoute(null);

    expect(component.id).toBeNull();
    expect(produtoServiceMock.buscarProdutoPorId).not.toHaveBeenCalled();
  });

  it('quando há id na rota, deve chamar buscarProdutoPorId e popular o formulário', () => {
    // garantir que o serviço retorne o mock esperado
    produtoServiceMock.buscarProdutoPorId.and.returnValue(of({
      id: 7,
      nome: 'Produto X',
      precoCusto: 12,
      precoVenda: 24,
      quantidade: 3,
      medida: 2,
      categoria: 4
    }));
    produtoServiceMock.buscarProdutoPorId.calls.reset();

    const { component } = createComponentWithRoute('7');

    // buscarProdutoPorId foi chamado no construtor/carregarProduto
    expect(produtoServiceMock.buscarProdutoPorId).toHaveBeenCalled();
    // e o form foi populado com os valores do serviço
    expect(component.cadastroForm.get('nome')?.value).toBe('Produto X');
    expect(component.cadastroForm.get('precoCusto')?.value).toBe(12);
    expect(component.id).toBe('7' as unknown as number); // seu código faz cast assim
  });

  it('carregarProduto deve tratar erro (não altera form e loga o erro)', () => {    
    produtoServiceMock.buscarProdutoPorId.and.returnValue(throwError(() => ({ status: 500 })));
    const consoleSpy = spyOn(console, 'log');

    const { component } = createComponentWithRoute('100');   
    expect(consoleSpy).toHaveBeenCalled();    
    expect(component.cadastroForm.get('nome')?.value).toBe('');
  });

  it('deve cadastrar produto com sucesso e abrir modal', () => {
    // garantir fluxo de cadastrar (sem id)
    produtoServiceMock.cadastrarProduto.and.returnValue(of({}));
    const clickSpy = jasmine.createSpy('click');
    spyOn(document, 'getElementById').and.returnValue({ click: clickSpy } as any);

    const { component } = createComponentWithRoute(null);

    component.cadastroForm.patchValue({
      nome: 'Produto Novo',
      precoCusto: 10,
      precoVenda: 20,
      quantidade: 2,
      medida: 1,
      categoria: 1
    });

    component.cadastrarAtualizarProduto();

    expect(produtoServiceMock.cadastrarProduto).toHaveBeenCalledWith(component.cadastroForm);
    expect(clickSpy).toHaveBeenCalled();
    expect(component.resposta).toContain('sucesso');
  });

  it('deve tratar erro ao cadastrar e abrir modal com mensagem de erro', () => {
    produtoServiceMock.cadastrarProduto.and.returnValue(throwError(() => ({ status: 500 })));
    const clickSpy = jasmine.createSpy('click');
    spyOn(document, 'getElementById').and.returnValue({ click: clickSpy } as any);

    const { component } = createComponentWithRoute(null);

    component.cadastrarAtualizarProduto();

    expect(clickSpy).toHaveBeenCalled();
    expect(component.resposta).toBe('Erro ao cadastrar o produto!');
  });

  it('deve atualizar produto com sucesso (com id) e abrir modal', () => {
    // criar com id na rota para entrar no caminho de atualizar
    produtoServiceMock.atualizarProduto.and.returnValue(of({}));
    const clickSpy = jasmine.createSpy('click');
    spyOn(document, 'getElementById').and.returnValue({ click: clickSpy } as any);

    const { component } = createComponentWithRoute('2');

    component.cadastroForm.patchValue({
      nome: 'Atualizado',
      precoCusto: 5,
      precoVenda: 11,
      quantidade: 1,
      medida: 1,
      categoria: 1
    });

    component.cadastrarAtualizarProduto();

    expect(produtoServiceMock.atualizarProduto).toHaveBeenCalledWith(component.cadastroForm);
    expect(clickSpy).toHaveBeenCalled();
    expect(component.resposta).toContain('sucesso');
  });

  it('deve tratar erro ao atualizar e abrir modal com mensagem de erro', () => {
    produtoServiceMock.atualizarProduto.and.returnValue(throwError(() => ({ status: 500 })));
    const clickSpy = jasmine.createSpy('click');
    spyOn(document, 'getElementById').and.returnValue({ click: clickSpy } as any);

    const { component } = createComponentWithRoute('2');

    component.cadastrarAtualizarProduto();

    expect(clickSpy).toHaveBeenCalled();
    expect(component.resposta).toBe('Erro ao atualizar o produto!');
  });

  it('onChangePreco deve resetar para lastValidValues quando valor ultrapassa MAX_VALUE', () => {
    const { component } = createComponentWithRoute(null);
    // garantir que o controle tenha um valor acima do limite
    component.cadastroForm.controls['precoCusto'].setValue(15000);

    // chama o handler simulando evento do DOM
    component.onChangePreco({ target: { name: 'precoCusto' } });

    // lastValidValues inicia com 0, então valor deve voltar para 0
    expect(component.cadastroForm.controls['precoCusto'].value).toBe(0);
  });

  it('onChangePreco deve manter valor quando dentro do limite', () => {
    const { component } = createComponentWithRoute(null);
    component.cadastroForm.controls['precoVenda'].setValue(5000);

    component.onChangePreco({ target: { name: 'precoVenda' } });

    expect(component.cadastroForm.controls['precoVenda'].value).toBe(5000);
  });

  it('limparFormulario deve resetar os campos', () => {
    const { component } = createComponentWithRoute(null);
    component.cadastroForm.patchValue({ nome: 'Qualquer' });

    component.limparFormulario();

    // reset() deixa o campo em null (ou '' dependendo da versão), validar null
    expect(component.cadastroForm.get('nome')?.value).toBeNull();
  });

  it('redirecionar deve navegar quando resposta não contém "Erro"', () => {
    const { component } = createComponentWithRoute(null);
    component.resposta = 'Dados cadastrados com sucesso!';

    component.redirecionar();

    expect(routerMock.navigate).toHaveBeenCalledWith(['/']);
  });

  it('redirecionar não deve navegar quando resposta contém "Erro"', () => {
    const { component } = createComponentWithRoute(null);
    component.resposta = 'Erro ao cadastrar o produto!';

    component.redirecionar();

    expect(routerMock.navigate).not.toHaveBeenCalled();
  });

  it('getDescricaoMedida/getDescricaoCategoria devem retornar texto correto e vazio para ids inválidos', () => {
    const { component } = createComponentWithRoute(null);

    expect(component.getDescricaoMedida(1)).toBe('Kg');
    expect(component.getDescricaoCategoria(1)).toBe('Alimentos');

    // ids inexistentes retornam string vazia
    expect(component.getDescricaoMedida(999)).toBe('');
    expect(component.getDescricaoCategoria(999)).toBe('');
  });
});
