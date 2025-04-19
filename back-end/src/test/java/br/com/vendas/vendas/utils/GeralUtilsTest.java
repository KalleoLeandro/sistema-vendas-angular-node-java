package br.com.vendas.vendas.utils;

import static org.mockito.ArgumentMatchers.anyString;

import java.time.LocalDateTime;
import java.util.Date;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import br.com.caelum.stella.validation.CPFValidator;

@SpringBootTest
@ActiveProfiles("test")
public class GeralUtilsTest {
	
	@InjectMocks
	private GeralUtils geralUtils;
	
	@Mock
    private CPFValidator cpfValidator;
		
	@Test
	public void testConverterDataOk() {
		
		String data = geralUtils.converterData(new Date());
		
		int[] dataSplit = new int[3];
		dataSplit[0] = LocalDateTime.now().getDayOfMonth();
		dataSplit[1] = LocalDateTime.now().getMonthValue();
		dataSplit[2] = LocalDateTime.now().getYear();
		
		String dataFormatada = dataSplit[0] + "/" + (dataSplit[1] >=10 ? dataSplit[1] : "0" + dataSplit[1]) + "/" + dataSplit[2];
		Assertions.assertEquals(dataFormatada, data);
	}
	
	@Test
	public void testConverterDataVazio() {
		
		String data = geralUtils.converterData(null);	
		
		Assertions.assertEquals("", data);
	}
	
	@Test
	public void testConverterDataPorTextoOk() {
		String data = geralUtils.converterDataPorTexto("1990-01-01");
		
		Assertions.assertEquals("01-01-1990", data);
	}
	
	@Test
	public void testConverterDataPorTextoVazio() {
		String data = geralUtils.converterDataPorTexto("");
		
		Assertions.assertEquals("", data);
	}
	
	@Test
	public void testCpfValido() {
		
		boolean teste = geralUtils.isCpfInvalido("22233344405");
		
		Assertions.assertFalse(teste);
	}
	
	@Test
	public void testCpfInvalido() {
		
		Mockito.doThrow(IllegalArgumentException.class).when(cpfValidator).assertValid(anyString());
		
		boolean teste = geralUtils.isCpfInvalido("111.222.333-44");
		
		Assertions.assertTrue(teste);
	}

}