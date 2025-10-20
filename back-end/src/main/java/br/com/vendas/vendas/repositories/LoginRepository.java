package br.com.vendas.vendas.repositories;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataAccessException;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

import br.com.vendas.vendas.exceptions.DefaultErrorException;
import br.com.vendas.vendas.models.dto.LoginDTO;
import br.com.vendas.vendas.models.requests.AtualizacaoLoginRequest;
import br.com.vendas.vendas.models.requests.CadastroLoginRequest;
import br.com.vendas.vendas.models.responses.LoginCadastroResponse;
import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class LoginRepository {

	private static final Logger logger = LoggerFactory.getLogger(LoginRepository.class);

	
	private final NamedParameterJdbcTemplate namedParameterJdbcTemplate;

	final RowMapper<LoginDTO> loginMapper = (rs, rowNum) -> LoginDTO.builder().nome(rs.getString("nome"))
			.cpf(rs.getString("cpf")).perfil(rs.getString("perfil")).build();

	final RowMapper<LoginCadastroResponse> loginCadastroMapper = (rs, rowNum) -> LoginCadastroResponse.builder()
			.id(rs.getInt("id")).nome(rs.getString("nome")).cpf(rs.getString("cpf")).login(rs.getString("login"))
			.perfil(rs.getString("perfil")).active(rs.getBoolean("active")).build();

	public LoginDTO buscarPorLoginESenha(String login, String senha) {

		String sql = "SELECT nome, cpf, perfil FROM usuarios WHERE login = :login AND senha = :senha";

		MapSqlParameterSource params = new MapSqlParameterSource().addValue("login", login).addValue("senha", senha);

		try {
			return namedParameterJdbcTemplate.<LoginDTO>queryForObject(sql, params, loginMapper);
		} catch (EmptyResultDataAccessException e) {
			return null;
		} catch (DataAccessException e) {
			logger.error(e.getMessage());
			throw new DefaultErrorException("Erro ao consultar os dados na base", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	public void cadastrarLogin(CadastroLoginRequest cadastroLoginRequest) {
		String sql = "INSERT INTO usuarios(nome,cpf, login, senha, perfil) values(:nome, :cpf, :login, :senha, :perfil)";
		MapSqlParameterSource params = new MapSqlParameterSource().addValue("nome", cadastroLoginRequest.getNome())
				.addValue("cpf", cadastroLoginRequest.getCpf()).addValue("login", cadastroLoginRequest.getLogin())
				.addValue("senha", cadastroLoginRequest.getSenha())
				.addValue("perfil", cadastroLoginRequest.getPerfil());

		try {
			namedParameterJdbcTemplate.update(sql, params);
		} catch (DataAccessException e) {
			e.printStackTrace();
			logger.error(e.getMessage());
			throw new DefaultErrorException("Erro ao gravar os dados na base", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	public void atualizarLogin(AtualizacaoLoginRequest atualizacaoLoginRequest) {
		String sql = "UPDATE usuarios set nome = :nome,cpf = :cpf, login = :login, senha = :senha, perfil = :perfil where id = :id";
		MapSqlParameterSource params = new MapSqlParameterSource().addValue("id", atualizacaoLoginRequest.getId())
				.addValue("nome", atualizacaoLoginRequest.getNome()).addValue("cpf", atualizacaoLoginRequest.getCpf())
				.addValue("login", atualizacaoLoginRequest.getLogin())
				.addValue("senha", atualizacaoLoginRequest.getSenha())
				.addValue("perfil", atualizacaoLoginRequest.getPerfil());

		try {
			namedParameterJdbcTemplate.update(sql, params);
		} catch (DataAccessException e) {
			logger.error(e.getMessage());
			throw new DefaultErrorException("Erro ao gravar os dados na base", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	public LoginCadastroResponse buscarPorId(Integer id) {
		String sql = "SELECT * FROM usuarios where id = :id";
		MapSqlParameterSource params = new MapSqlParameterSource().addValue("id", id);
		try {
			return namedParameterJdbcTemplate.<LoginCadastroResponse>queryForObject(sql, params, loginCadastroMapper);
		} catch (EmptyResultDataAccessException e) {
			logger.error(e.getMessage());
			throw new EmptyResultDataAccessException("Erro ao localizar os dados na base", 1);
		} catch (DataAccessException e) {
			logger.error(e.getMessage());
			throw new DefaultErrorException("Erro ao localizar os dados na base", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	public Map<String, Object> listarPorPagina(Integer limit, Integer page) {
		String sql = "SELECT * FROM usuarios where id != 1 ORDER BY id ASC LIMIT :limit OFFSET :page";		
	    MapSqlParameterSource params = new MapSqlParameterSource().addValue("limit", limit).addValue("page", ((page - 1) * limit));
	    
	    try {
	    	List<LoginCadastroResponse> lista = namedParameterJdbcTemplate.query(sql, params, loginCadastroMapper);
	    	sql = "SELECT COUNT(id) FROM usuarios where id != 1";
	    	Integer total = namedParameterJdbcTemplate.queryForObject(sql, new MapSqlParameterSource(),Integer.class);
	    	Map<String, Object> retorno = new HashMap<String, Object>();
	    	retorno.put("lista", lista);
	    	retorno.put("total", total);
	        return retorno;
	    } catch (EmptyResultDataAccessException e) {
	        logger.error(e.getMessage());
	        e.printStackTrace();
	        throw new EmptyResultDataAccessException("Sem items retornados", 500);
	    } catch (DataAccessException e) {
	        logger.error(e.getMessage());
	        e.printStackTrace();
	        throw new DefaultErrorException("Erro ao localizar os dados na base", HttpStatus.INTERNAL_SERVER_ERROR);
	    }
	}
	
	public void excluirLogin(Integer id) {
		String sql = "DELETE FROM usuarios WHERE id = :id";
		MapSqlParameterSource params = new MapSqlParameterSource().addValue("id", id);
		try {
			namedParameterJdbcTemplate.update(sql, params);
		} catch (DataAccessException e) {
			logger.error(e.getMessage());
			throw new DefaultErrorException("Erro ao excluir o dado na base", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

}
