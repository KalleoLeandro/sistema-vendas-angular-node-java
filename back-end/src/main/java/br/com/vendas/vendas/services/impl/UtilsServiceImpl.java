package br.com.vendas.vendas.services.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import br.com.vendas.vendas.exceptions.DefaultErrorException;
import br.com.vendas.vendas.services.UtilsService;
import br.com.vendas.vendas.utils.GeralUtils;

@Service
public class UtilsServiceImpl implements UtilsService{
	
	@Autowired
	private GeralUtils geralUtils;

	@Override
	public Boolean validarCpf(String cpf) {
		try {
			String cpfLimpo = cpf.replaceAll("[^0-9]", "");
			return (!geralUtils.isCpfInvalido(cpfLimpo));
		} catch(Exception e) {
			throw new DefaultErrorException("Erro ao validar o cpf", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

}
