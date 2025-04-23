package br.com.vendas.vendas.services;

import static org.mockito.ArgumentMatchers.anyString;

import java.util.Map;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;

import br.com.vendas.vendas.exceptions.DefaultErrorException;
import br.com.vendas.vendas.services.impl.UtilsServiceImpl;
import br.com.vendas.vendas.utils.GeralUtils;

public class UtilsServiceImplTest {

	@InjectMocks
	UtilsServiceImpl service;

	@Mock
	GeralUtils geralUtils;

	@BeforeEach
	void setUp() {
		MockitoAnnotations.openMocks(this);
	}

	@Test
	void deveValidarCpf() throws Exception {
	    Mockito.when(geralUtils.isCpfInvalido(anyString())).thenReturn(false);

	    Map<String, Boolean> resultado = service.validarCpf("222.333.444-05");

	    Assertions.assertTrue(resultado.get("valido"));
	}

	@Test
	void deveInvalidarCpf() throws Exception {
	    Mockito.when(geralUtils.isCpfInvalido(anyString())).thenReturn(true);

	    Map<String, Boolean> resultado = service.validarCpf("222.333.444-05");

	    Assertions.assertFalse(resultado.get("valido"));
	}

	@Test
	void deveLancarErroAoValidarCpf() throws Exception {
	    Mockito.when(geralUtils.isCpfInvalido(anyString()))
	           .thenThrow(new RuntimeException("Erro"));

	    DefaultErrorException exception = Assertions.assertThrows(DefaultErrorException.class, () -> {
	        service.validarCpf("222.333.444-05");
	    });

	    Assertions.assertEquals("Erro ao validar o cpf", exception.getMessage());
	    Assertions.assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, exception.getStatus());
	}

}
