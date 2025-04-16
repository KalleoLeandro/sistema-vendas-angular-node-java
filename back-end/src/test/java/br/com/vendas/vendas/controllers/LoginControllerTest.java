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
}