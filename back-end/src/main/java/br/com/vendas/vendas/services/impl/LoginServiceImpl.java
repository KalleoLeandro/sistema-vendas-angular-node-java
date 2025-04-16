package br.com.vendas.vendas.services.impl;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import br.com.vendas.vendas.exceptions.DefaultErrorException;
import br.com.vendas.vendas.models.dto.LoginDTO;
import br.com.vendas.vendas.models.requests.LoginRequest;
import br.com.vendas.vendas.models.responses.LoginResponse;
import br.com.vendas.vendas.repositories.LoginRepository;
import br.com.vendas.vendas.services.LoginService;
import br.com.vendas.vendas.utils.DateUtils;
import br.com.vendas.vendas.utils.JwtUtils;

@Service
public class LoginServiceImpl implements LoginService {

	private static final Logger logger = LoggerFactory.getLogger(LoginServiceImpl.class);

	@Autowired
	private LoginRepository loginRepository;

	@Autowired
	private JwtUtils jwtUtils;

	@Override
	public LoginResponse validarLogin(LoginRequest loginRequest) {
		try {
			logger.info("Executando o LoginRepository.existsByLoginAndSenha");
			LoginDTO dto = loginRepository.buscarPorLoginESenha(loginRequest.getLogin(), loginRequest.getSenha());
			LoginResponse response = new LoginResponse();
			if (dto != null) {
				response.setStatus(HttpStatus.OK);
				response.setUserName(dto.getNome());				
				response.setToken(jwtUtils.generateToken(response.getUserName(), loginRequest.getLogin(), dto.getPerfil()));
				response.setExpiration(
						DateUtils.converterData(jwtUtils.getExpirationDateFromToken(response.getToken())));
				return response;
			} else {
				response.setStatus(HttpStatus.UNAUTHORIZED);
				return response;
			}
		} catch (Exception e) {
			logger.error("Erro na execução da validação do login", HttpStatus.INTERNAL_SERVER_ERROR);
			throw new DefaultErrorException("Erro na execução da validação do login",
					HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@Override
	public Boolean validarToken(String token) {
		try {
			if (token.equalsIgnoreCase(""))
				return false;
			logger.info("Executando o validateToken");
			return jwtUtils.validateToken(token) ? true : false;
		} catch (Exception e) {
			logger.error("Erro na execução da validação do token", HttpStatus.INTERNAL_SERVER_ERROR);
			throw new DefaultErrorException("Erro na execução da validação do token",
					HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
}
