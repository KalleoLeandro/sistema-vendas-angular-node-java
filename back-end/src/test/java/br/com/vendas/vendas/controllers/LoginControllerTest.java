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

import br.com.vendas.vendas.models.requests.AtualizacaoLoginRequest;
import br.com.vendas.vendas.models.requests.CadastroLoginRequest;
import br.com.vendas.vendas.models.requests.LoginRequest;
import br.com.vendas.vendas.models.responses.LoginCadastroResponse;
import br.com.vendas.vendas.models.responses.LoginResponse;
import br.com.vendas.vendas.services.impl.LoginServiceImpl;

@SpringBootTest
@ActiveProfiles("test")
public class LoginControllerTest {

	@InjectMocks
	LoginController controller;

	@Mock
	LoginServiceImpl service;

	private LoginRequest loginRequest;

	private LoginResponse loginResponse;

	private CadastroLoginRequest cadastroLoginRequest;

	private AtualizacaoLoginRequest atualizacaoLoginRequest;

	private LoginCadastroResponse loginCadastroResponse;

	@BeforeEach
	void setup() {
		loginRequest = new LoginRequest();
		loginRequest.setLogin("user");
		loginRequest.setSenha("password");

		loginResponse = new LoginResponse();
		loginResponse.setStatus(HttpStatus.OK);
		loginResponse.setToken("token");
		loginResponse.setExpiration("01/01/2024 12:00:00");
		loginResponse.setUserName("user");

		cadastroLoginRequest = new CadastroLoginRequest();
		cadastroLoginRequest.setNome("teste");
		cadastroLoginRequest.setCpf("22233344405");
		cadastroLoginRequest.setLogin("user");
		cadastroLoginRequest.setSenha("password");
		cadastroLoginRequest.setPerfil("dev");

		atualizacaoLoginRequest = new AtualizacaoLoginRequest();
		atualizacaoLoginRequest.setId(1);
		atualizacaoLoginRequest.setNome("teste");
		atualizacaoLoginRequest.setCpf("22233344405");
		atualizacaoLoginRequest.setLogin("user");
		atualizacaoLoginRequest.setSenha("password");
		atualizacaoLoginRequest.setPerfil("dev");

		loginCadastroResponse = new LoginCadastroResponse();
		loginCadastroResponse.setId(1);
		loginCadastroResponse.setNome("teste");
		loginCadastroResponse.setCpf("22233344405");
		loginCadastroResponse.setLogin("user");		
		loginCadastroResponse.setPerfil("dev");
	}

	@Test
	void testLoginOk() {
		Mockito.when(service.validarLogin(any())).thenReturn(loginResponse);
		ResponseEntity<LoginResponse> response = controller.validarLogin(loginRequest);
		Assertions.assertEquals(HttpStatus.OK, response.getStatusCode());
		Assertions.assertNotNull(response);
	}

	@Test
	void testTokenOk() {
		Mockito.when(service.validarToken(any())).thenReturn(true);
		ResponseEntity<Boolean> response = controller.validarToken("token");
		Assertions.assertEquals(HttpStatus.OK, response.getStatusCode());
		Assertions.assertTrue(response.getBody());
	}

	@Test
	void testCadastrarLoginOk() {
		Mockito.doNothing().when(service).cadastrarLogin(any());
		ResponseEntity<Void> response = controller.cadastrarLogin(cadastroLoginRequest);
		Assertions.assertEquals(HttpStatus.CREATED, response.getStatusCode());
	}

	@Test
	void testAtualizarLoginOk() {
		Mockito.doNothing().when(service).atualizarLogin(any());
		ResponseEntity<Void> response = controller.atualizarLogin(atualizacaoLoginRequest);
		Assertions.assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
	}

	@Test
	void testBuscarPorIdOk() {
		Mockito.when(service.buscarPorId(any())).thenReturn(loginCadastroResponse);
		ResponseEntity<LoginCadastroResponse> response = controller.buscarPorId(1);
		Assertions.assertEquals(HttpStatus.OK, response.getStatusCode());
		Assertions.assertNotNull(response.getBody());
	}

	@Test
	void testListaPorPaginaOk() {
		LoginCadastroResponse loginMock = LoginCadastroResponse.builder().id(2).nome("Nome Teste").cpf("12345678901")
				.login("teste").perfil("user").build();

		List<LoginCadastroResponse> listaMockada = List.of(loginMock);
		Map<String, Object> mock = new HashMap<String, Object>();
		mock.put("lista", listaMockada);
		mock.put("total", 5);

		Mockito.when(service.listarPorPagina(any(), any())).thenReturn(mock);
		ResponseEntity<Map<String, Object>> response = controller.listarPorPagina(10, 1);
		Assertions.assertEquals(HttpStatus.OK, response.getStatusCode());
		Assertions.assertNotNull(response.getBody());
	}
	
	@Test
	void excluirLoginOk() {
		Mockito.doNothing().when(service).excluirLogin(any());
		ResponseEntity<Void> response = controller.excluirLogin(2);
		Assertions.assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());		
	}
}