package br.com.vendas.vendas.services;

import static org.mockito.ArgumentMatchers.anyInt;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.dao.DataAccessException;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.test.context.ActiveProfiles;

import br.com.vendas.vendas.exceptions.DefaultErrorException;
import br.com.vendas.vendas.models.requests.AtualizacaoProdutoRequest;
import br.com.vendas.vendas.models.requests.CadastroProdutoRequest;
import br.com.vendas.vendas.models.responses.ProdutoCadastroResponse;
import br.com.vendas.vendas.repositories.ProdutoRepository;
import br.com.vendas.vendas.services.impl.ProdutoServiceImpl;

@SpringBootTest
@ActiveProfiles("test")
public class ProdutoServiceImplTest {
	
	@InjectMocks
	private ProdutoServiceImpl produtoService;
	
	@Mock
	private ProdutoRepository produtoRepository;
	
	private CadastroProdutoRequest cadastroProdutoRequest;
	
	private AtualizacaoProdutoRequest atualizacaoProdutoRequest;
	
	private ProdutoCadastroResponse produtoCadastroResponse;
	
	
	@BeforeEach
	void setup() {
		MockitoAnnotations.openMocks(this);
		produtoService = new ProdutoServiceImpl(produtoRepository);
		
		cadastroProdutoRequest = new CadastroProdutoRequest();
		cadastroProdutoRequest.setNome("Teste");
		cadastroProdutoRequest.setPrecoCusto(1.0);
		cadastroProdutoRequest.setPrecoVenda(2.0);
		cadastroProdutoRequest.setQuantidade(1);
		cadastroProdutoRequest.setMedida(1);
		cadastroProdutoRequest.setCategoria(1);
		
		atualizacaoProdutoRequest = new AtualizacaoProdutoRequest();
		atualizacaoProdutoRequest.setId(1);
		atualizacaoProdutoRequest.setPrecoCusto(1.0);
		atualizacaoProdutoRequest.setPrecoVenda(2.0);
		atualizacaoProdutoRequest.setQuantidade(1);
		atualizacaoProdutoRequest.setMedida(1);
		atualizacaoProdutoRequest.setCategoria(1);
		
		produtoCadastroResponse = new ProdutoCadastroResponse();
		produtoCadastroResponse.setId(1);
		produtoCadastroResponse.setPrecoCusto(1.0);
		produtoCadastroResponse.setPrecoVenda(2.0);
		produtoCadastroResponse.setQuantidade(1);
		produtoCadastroResponse.setMedida(1);
		produtoCadastroResponse.setCategoria(1);
	}

	@SuppressWarnings("static-access")
	@Test
	void testCadastrarProdutoOk() {		

		Mockito.doNothing().when(produtoRepository).cadastrarProduto(Mockito.any(CadastroProdutoRequest.class));

		produtoRepository.cadastrarProduto(cadastroProdutoRequest);

		Mockito.verify(produtoRepository, Mockito.times(1)).cadastrarProduto(Mockito.any(CadastroProdutoRequest.class));
	}
	
	@Test
	void testCadastrarProduto_Falha() {
		
		Mockito.doThrow(new DefaultErrorException("Erro ao gravar os dados na base", HttpStatus.INTERNAL_SERVER_ERROR))
				.when(produtoRepository).cadastrarProduto(cadastroProdutoRequest);

		DefaultErrorException exception = Assertions.assertThrows(DefaultErrorException.class, () -> {
			produtoService.cadastrarProduto(cadastroProdutoRequest);
		});

		Assertions.assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, exception.getStatus());
		Assertions.assertEquals("Erro ao gravar os dados na base", exception.getMessage());
	}
	
	@SuppressWarnings("static-access")
	@Test
	void testAtualizarProdutoOk() {

		Mockito.doNothing().when(produtoRepository).atualizarProduto(Mockito.any(AtualizacaoProdutoRequest.class));

		produtoService.atualizarProduto(atualizacaoProdutoRequest);

		Mockito.verify(produtoRepository, Mockito.times(1)).atualizarProduto(Mockito.any(AtualizacaoProdutoRequest.class));
	}
	
	@Test
	void testAtualizarProduto_Falha() {
		
		Mockito.doThrow(new DefaultErrorException("Erro ao gravar os dados na base", HttpStatus.INTERNAL_SERVER_ERROR))
				.when(produtoRepository).atualizarProduto(atualizacaoProdutoRequest);

		DefaultErrorException exception = Assertions.assertThrows(DefaultErrorException.class, () -> {
			produtoService.atualizarProduto(atualizacaoProdutoRequest);
		});

		Assertions.assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, exception.getStatus());
		Assertions.assertEquals("Erro ao gravar os dados na base", exception.getMessage());
	}
	
	@Test
	void testBuscarPorIdOk() {
		Mockito.when(produtoService.buscarPorId(anyInt())).thenReturn(produtoCadastroResponse);

		ProdutoCadastroResponse response = produtoService.buscarPorId(2);
		Assertions.assertNotNull(response);
		Mockito.verify(produtoRepository, Mockito.times(1)).buscarPorId(anyInt());
	}
	
	@Test
	void testBuscarPorIdNoFound() {
		Mockito.when(produtoRepository.buscarPorId(Mockito.anyInt()))
	       .thenThrow(new EmptyResultDataAccessException("Nenhum produto encontrado com o id informado", 1));

		
		DefaultErrorException exception = Assertions.assertThrows(DefaultErrorException.class, () -> {
			produtoService.buscarPorId(2);
		});
		
		Assertions.assertEquals(HttpStatus.NO_CONTENT, exception.getStatus());
		Assertions.assertEquals("Produto não encontrado", exception.getMessage());
	}
	
	@Test
	void testBuscarPorId_Falha() {
		Mockito.when(produtoRepository.buscarPorId(Mockito.anyInt()))
	       .thenThrow(new DefaultErrorException("Erro ao localizar os dados na base", HttpStatus.INTERNAL_SERVER_ERROR));

		
		DefaultErrorException exception = Assertions.assertThrows(DefaultErrorException.class, () -> {
			produtoService.buscarPorId(1);
		});
		
		Assertions.assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, exception.getStatus());
		Assertions.assertEquals("Erro ao localizar os dados na base", exception.getMessage());
	}
	
	@Test
	void testListarPorPagina_Sucesso() {	    
		ProdutoCadastroResponse loginMock = ProdutoCadastroResponse.builder()
				.id(2)
				.nome("Nome Teste")
				.precoCusto(10.0)
				.precoVenda(12.0)				
				.quantidade(1)
				.medida(1)
				.categoria(1)
				.build();

	    List<ProdutoCadastroResponse> listaMockada = List.of(loginMock);
	    Map<String, Object> mock = new HashMap<String, Object>();
	    mock.put("lista", listaMockada);
	    mock.put("total", 5);

	    Mockito.when(produtoService.listarPorPagina(10, 0)).thenReturn(mock);

	    Map<String, Object> result = produtoService.listarPorPagina(10, 0);
	    
	    Assertions.assertNotNull(result);
	    @SuppressWarnings("unchecked")
		List<ProdutoCadastroResponse> lista = (List<ProdutoCadastroResponse>) result.get("lista");
	    Assertions.assertEquals(1, lista.size());
	    Assertions.assertEquals("Nome Teste", lista.get(0).getNome());
	    Assertions.assertEquals(10.0, lista.get(0).getPrecoCusto());
	    Assertions.assertEquals(1, lista.get(0).getQuantidade());
	}

	
	@Test
	void testListarPorPagina_SemItensRetornados() {
	    Mockito.when(produtoService.listarPorPagina(Mockito.anyInt(), Mockito.anyInt()))
	           .thenThrow(new EmptyResultDataAccessException(1));

	    DefaultErrorException ex = Assertions.assertThrows(DefaultErrorException.class, () -> {
	    	produtoService.listarPorPagina(10, 1);
	    });

	    Assertions.assertEquals("Sem itens retornado", ex.getMessage());
	    Assertions.assertEquals(HttpStatus.NO_CONTENT, ex.getStatus());
	}
	
	@Test
	void testListarPorPagina_ErroInesperado() {
	    Mockito.when(produtoService.listarPorPagina(Mockito.anyInt(), Mockito.anyInt()))
	           .thenThrow(new RuntimeException("Erro inesperado"));

	    DefaultErrorException ex = Assertions.assertThrows(DefaultErrorException.class, () -> {
	    	produtoService.listarPorPagina(10, 1);
	    });

	    Assertions.assertEquals("Erro inesperado", ex.getMessage());
	    Assertions.assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, ex.getStatus());
	}
	
	@SuppressWarnings("static-access")
	@Test
	void testExcluirLoginComSucesso() {

		Mockito.doNothing().when(produtoRepository).excluirProduto(anyInt());

		produtoService.excluirProduto(1);

		Mockito.verify(produtoRepository, Mockito.times(1)).excluirProduto(anyInt());
	}
	
	@Test
	void testExcluirLoginFalha() {
		Mockito.doThrow(new DefaultErrorException("Erro ao excluir o dado na base", HttpStatus.INTERNAL_SERVER_ERROR))
		.when(produtoRepository).excluirProduto(anyInt());

	    DefaultErrorException ex = Assertions.assertThrows(DefaultErrorException.class, () -> {
	    	produtoService.excluirProduto(2);
	    });

	    Assertions.assertEquals("Erro ao excluir o dado na base", ex.getMessage());
	    Assertions.assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, ex.getStatus());
	}
}
