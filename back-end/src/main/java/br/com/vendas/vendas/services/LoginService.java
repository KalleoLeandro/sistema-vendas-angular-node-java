package br.com.vendas.vendas.services;

import java.util.Map;

import br.com.vendas.vendas.models.requests.AtualizacaoLoginRequest;
import br.com.vendas.vendas.models.requests.CadastroLoginRequest;
import br.com.vendas.vendas.models.requests.LoginRequest;
import br.com.vendas.vendas.models.responses.LoginCadastroResponse;
import br.com.vendas.vendas.models.responses.LoginResponse;

public interface LoginService {
	
	public LoginResponse validarLogin(LoginRequest loginRequest);

	public Boolean validarToken(String token);
	
	public void cadastrarLogin(CadastroLoginRequest cadastroLoginRequest);

	public void atualizarLogin(AtualizacaoLoginRequest atualizacaoLoginRequest);

	public LoginCadastroResponse buscarPorId(Integer id);

	public Map<String, Object> listarPorPagina(Integer limit, Integer page);
	
	public void excluirLogin(Integer id);

}
