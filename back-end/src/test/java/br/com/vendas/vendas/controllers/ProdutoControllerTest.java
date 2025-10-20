package br.com.vendas.vendas.controllers;

import static org.mockito.ArgumentMatchers.any;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.ActiveProfiles;

import br.com.vendas.vendas.models.requests.AtualizacaoProdutoRequest;
import br.com.vendas.vendas.models.requests.CadastroProdutoRequest;
import br.com.vendas.vendas.models.responses.ProdutoCadastroResponse;
import br.com.vendas.vendas.services.ProdutoService;

@SpringBootTest
@ActiveProfiles("test")
public class ProdutoControllerTest {

	@InjectMocks
	private ProdutoController controller;

	@Mock
	private ProdutoService service;
	
	private CadastroProdutoRequest cadastroProdutoRequest;
	
	private AtualizacaoProdutoRequest atualizacaoProdutoRequest;
	
	private ProdutoCadastroResponse produtoCadastroResponse;

	@BeforeEach
	void setup() {
		cadastroProdutoRequest = new CadastroProdutoRequest();
		cadastroProdutoRequest.setNome("Teste");
		cadastroProdutoRequest.setPrecoCusto(1.0);
		cadastroProdutoRequest.setPrecoVenda(2.0);
		cadastroProdutoRequest.setQuantidade(1);
		cadastroProdutoRequest.setMedida(1);
		cadastroProdutoRequest.setCategoria(1);
		
		atualizacaoProdutoRequest = new AtualizacaoProdutoRequest();
		atualizacaoProdutoRequest.setId(1);
		cadastroProdutoRequest.setPrecoCusto(1.0);
		cadastroProdutoRequest.setPrecoVenda(2.0);
		cadastroProdutoRequest.setQuantidade(1);
		cadastroProdutoRequest.setMedida(1);
		cadastroProdutoRequest.setCategoria(1);
		
		produtoCadastroResponse = new ProdutoCadastroResponse();
		produtoCadastroResponse.setId(1);
		produtoCadastroResponse.setPrecoCusto(1.0);
		produtoCadastroResponse.setPrecoVenda(2.0);
		produtoCadastroResponse.setQuantidade(1);
		produtoCadastroResponse.setMedida(1);
		produtoCadastroResponse.setCategoria(1);
	}

	@Test
	void testCadastrarProdutoOk() {
		Mockito.doNothing().when(service).cadastrarProduto(any());
		ResponseEntity<Void> response = controller.cadastrarLogin(cadastroProdutoRequest);
		Assertions.assertEquals(HttpStatus.CREATED, response.getStatusCode());
	}
	
	@Test
	void testAutalizarProdutoOk() {
		Mockito.doNothing().when(service).atualizarProduto(any());
		ResponseEntity<Void> response = controller.atualizarProduto(atualizacaoProdutoRequest);
		Assertions.assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
	}
	
	@Test
	void testBuscarPorIdOk() {
		Mockito.when(service.buscarPorId(any())).thenReturn(produtoCadastroResponse);
		ResponseEntity<ProdutoCadastroResponse> response = controller.buscarPorId(1);
		Assertions.assertEquals(HttpStatus.OK, response.getStatusCode());
		Assertions.assertNotNull(response.getBody());
	}
	
	@Test
	void testListaPorPaginaOk() {
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

		Mockito.when(service.listarPorPagina(any(), any())).thenReturn(mock);
		ResponseEntity<Map<String, Object>> response = controller.listarPorPagina(10, 1);
		Assertions.assertEquals(HttpStatus.OK, response.getStatusCode());
		Assertions.assertNotNull(response.getBody());
	}
	
	@Test
	void excluirProdutoOk() {
		Mockito.doNothing().when(service).excluirProduto(any());
		ResponseEntity<Void> response = controller.excluirProduto(2);
		Assertions.assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());		
	}
}
