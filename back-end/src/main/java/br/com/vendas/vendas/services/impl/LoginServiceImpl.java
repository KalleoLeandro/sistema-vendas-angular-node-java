package br.com.vendas.vendas.services.impl;

import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import br.com.vendas.vendas.exceptions.DefaultErrorException;
import br.com.vendas.vendas.models.dto.LoginDTO;
import br.com.vendas.vendas.models.requests.AtualizacaoLoginRequest;
import br.com.vendas.vendas.models.requests.CadastroLoginRequest;
import br.com.vendas.vendas.models.requests.LoginRequest;
import br.com.vendas.vendas.models.responses.LoginCadastroResponse;
import br.com.vendas.vendas.models.responses.LoginResponse;
import br.com.vendas.vendas.repositories.LoginRepository;
import br.com.vendas.vendas.services.LoginService;
import br.com.vendas.vendas.utils.GeralUtils;
import br.com.vendas.vendas.utils.JwtUtils;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class LoginServiceImpl implements LoginService {

	private static final Logger logger = LoggerFactory.getLogger(LoginServiceImpl.class);
	
	private final LoginRepository loginRepository;	
	private final GeralUtils geralUtils;
	private final JwtUtils jwtUtils;

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
						geralUtils.converterData(jwtUtils.getExpirationDateFromToken(response.getToken())));
				return response;
			} else {
				response.setStatus(HttpStatus.UNAUTHORIZED);
				return response;
			}
		} catch (Exception e) {
			logger.error(e.getMessage());
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

	@Override
	public void cadastrarLogin(CadastroLoginRequest cadastroLoginRequest) {		
		try{			
			if(!geralUtils.isCpfInvalido(cadastroLoginRequest.getCpf().replaceAll("[^0-9]", ""))) {
			logger.info("Executando o LoginRepository.cadastrarLogin");
			loginRepository.cadastrarLogin(cadastroLoginRequest);
			} else {
				throw new DefaultErrorException("Cpf inválido", HttpStatus.BAD_REQUEST);
			}
		}catch (Exception e) {
			throw new DefaultErrorException(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@Override
	public void atualizarLogin(AtualizacaoLoginRequest atualizacaoLoginRequest) {		
		try{			
			if(!geralUtils.isCpfInvalido(atualizacaoLoginRequest.getCpf().replaceAll("[^0-9]", ""))) {
			logger.info("Executando o LoginRepository.atualizarLogin");
			loginRepository.atualizarLogin(atualizacaoLoginRequest);
			} else { 
				throw new DefaultErrorException("Cpf inválido", HttpStatus.BAD_REQUEST);
			}
		}catch (Exception e) {
			throw new DefaultErrorException(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@Override
	public LoginCadastroResponse buscarPorId(Integer id) {
		try{
			if(id == 1) {
				throw new DefaultErrorException("Erro ao recuperar os dados do login", HttpStatus.INTERNAL_SERVER_ERROR);
			}
			logger.info("Executando o LoginRepository.buscarPorId");
			return loginRepository.buscarPorId(id);			
		}catch (EmptyResultDataAccessException e) {
	        logger.warn("Nenhum usuário encontrado com o id informado", id);
	        throw new DefaultErrorException("Usuário não encontrado", HttpStatus.NO_CONTENT);
	    } catch (Exception e) {
			throw new DefaultErrorException(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@Override
	public Map<String, Object> listarPorPagina(Integer limit, Integer page) {
		try{			
			logger.info("Executando o LoginRepository.listarPorPagina");
			return loginRepository.listarPorPagina(limit, page);			
		}catch (EmptyResultDataAccessException e) {
	        logger.warn("Sem itens retornado", limit, page);
	        throw new DefaultErrorException("Sem itens retornado", HttpStatus.NO_CONTENT);
	    } catch (Exception e) {
			throw new DefaultErrorException(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
	
	@Override
	public void excluirLogin(Integer id) {		
		try{
			logger.info("Executando o LoginRepository.excluirLogin");
			loginRepository.excluirLogin(id);			
		}catch (Exception e) {
			throw new DefaultErrorException(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
}
