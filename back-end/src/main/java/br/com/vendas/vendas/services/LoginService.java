package br.com.vendas.vendas.services;

import br.com.vendas.vendas.models.requests.CadastroLoginRequest;
import br.com.vendas.vendas.models.requests.LoginRequest;
import br.com.vendas.vendas.models.responses.LoginResponse;

public interface LoginService {
	
	public LoginResponse validarLogin(LoginRequest loginRequest);

	public Boolean validarToken(String token);
	
	public void cadastrarLogin(CadastroLoginRequest cadastroLoginRequest);

}
