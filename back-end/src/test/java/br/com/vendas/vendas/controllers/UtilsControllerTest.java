package br.com.vendas.vendas.controllers;

import static org.mockito.ArgumentMatchers.anyString;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.ActiveProfiles;

import br.com.vendas.vendas.services.UtilsService;

@SpringBootTest
@ActiveProfiles("test")
public class UtilsControllerTest {
	
	@InjectMocks
	UtilsController controller;
	
	@Mock
	UtilsService service;
	
	@Test
	public void testCpfValidado() {
		Mockito.when(service.validarCpf(anyString())).thenReturn(true);
		ResponseEntity<Boolean> response = controller.validarCpf("222.333.444-05");		
		Assertions.assertEquals(HttpStatus.OK, response.getStatusCode());
	}
}