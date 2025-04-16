package br.com.vendas.vendas.utils;

import java.text.SimpleDateFormat;
import java.util.Date;

import org.springframework.stereotype.Component;

@Component
public class DateUtils {

	public static String converterData(Date data) {
		try {
		String formatoDeDestino = "dd/MM/yyyy";
		SimpleDateFormat sdfDestino = new SimpleDateFormat(formatoDeDestino);
		String dataFormatada = sdfDestino.format(data);
		return dataFormatada;
		}catch (Exception e) {
			return "";
		}
	}

	public static String converterDataPorTexto(String data) {
		try {
			String[] dataParcial = data.split("-");
			return dataParcial[2] + "-" + dataParcial[1] + "-" + dataParcial[0];
		} catch (Exception e) {
			return "";
		}
	}
}
