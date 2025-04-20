package br.com.vendas.vendas.controllers;

import static org.mockito.ArgumentMatchers.any;

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
	
	private  CadastroLoginRequest cadastroLoginRequest; 
	
	private AtualizacaoLoginRequest atualizacaoLoginRequest;
	
	@BeforeEach
    public void setup() {
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
        
        
        
       
    }
	
	@Test
	public void testLoginOk() {
		Mockito.when(service.validarLogin(any())).thenReturn(loginResponse);
		ResponseEntity<LoginResponse> response = controller.validarLogin(loginRequest);
		Assertions.assertEquals(HttpStatus.OK, response.getStatusCode());
		Assertions.assertNotNull(response);
	}
	
	@Test
	public void testTokenOk() {
		Mockito.when(service.validarToken(any())).thenReturn(true);
		ResponseEntity<Boolean> response = controller.validarToken("token");
		Assertions.assertEquals(HttpStatus.OK, response.getStatusCode());
		Assertions.assertTrue(response.getBody());
	}
	
	@Test
	public void testCadastrarLoginOk() {
		Mockito.doNothing().when(service).cadastrarLogin(any());
		ResponseEntity<Void> response = controller.cadastrarLogin(cadastroLoginRequest);
		Assertions.assertEquals(HttpStatus.CREATED, response.getStatusCode());		
	}
	
	@Test
	public void testAtualizarLoginOk() {
		Mockito.doNothing().when(service).atualizarLogin(any());
		ResponseEntity<Void> response = controller.atualizarLogin(atualizacaoLoginRequest);
		Assertions.assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());		
	}
}