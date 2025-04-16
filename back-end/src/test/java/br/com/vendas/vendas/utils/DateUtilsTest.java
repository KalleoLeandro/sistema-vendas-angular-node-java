package br.com.vendas.vendas.utils;

import java.time.LocalDateTime;
import java.util.Date;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("test")
public class DateUtilsTest {
		
	@Test
	public void testConverterDataOk() {
		
		String data = DateUtils.converterData(new Date());
		
		int[] dataSplit = new int[3];
		dataSplit[0] = LocalDateTime.now().getDayOfMonth();
		dataSplit[1] = LocalDateTime.now().getMonthValue();
		dataSplit[2] = LocalDateTime.now().getYear();
		
		String dataFormatada = dataSplit[0] + "/" + (dataSplit[1] >=10 ? dataSplit[1] : "0" + dataSplit[1]) + "/" + dataSplit[2];
		Assertions.assertEquals(dataFormatada, data);
	}
	
	@Test
	public void testConverterDataVazio() {
		
		String data = DateUtils.converterData(null);	
		
		Assertions.assertEquals("", data);
	}
	
	@Test
	public void testConverterDataPorTextoOk() {
		String data = DateUtils.converterDataPorTexto("1990-01-01");
		
		Assertions.assertEquals("01-01-1990", data);
	}
	
	@Test
	public void testConverterDataPorTextoVazio() {
		String data = DateUtils.converterDataPorTexto("");
		
		Assertions.assertEquals("", data);
	}

}