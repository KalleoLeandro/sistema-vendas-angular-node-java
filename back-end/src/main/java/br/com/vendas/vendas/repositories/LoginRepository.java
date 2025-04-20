package br.com.vendas.vendas.repositories;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
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

@Repository
public class LoginRepository {

	private static final Logger logger = LoggerFactory.getLogger(LoginRepository.class);

	@Autowired
	private NamedParameterJdbcTemplate namedParameterJdbcTemplate;

	final RowMapper<LoginDTO> loginRowMapper = (rs, rowNum) -> LoginDTO.builder().nome(rs.getString("nome"))
			.cpf(rs.getString("cpf")).perfil(rs.getString("perfil")).build();

	public LoginDTO buscarPorLoginESenha(String login, String senha) {

		String sql = "SELECT nome, cpf, perfil FROM usuarios WHERE login = :login AND senha = :senha";

		MapSqlParameterSource params = new MapSqlParameterSource().addValue("login", login).addValue("senha", senha);

		try {
			return namedParameterJdbcTemplate.<LoginDTO>queryForObject(sql, params, loginRowMapper);
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
			logger.error(e.getMessage());
			throw new DefaultErrorException("Erro ao gravar os dados na base", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	public void atualizarLogin(AtualizacaoLoginRequest atualizacaoLoginRequest) {
		String sql = "UPDATE usuarios set nome = :nome,cpf = :cpf, login = :login, senha = :senha, perfil = :perfil where id = :id";
		MapSqlParameterSource params = new MapSqlParameterSource()
				.addValue("id", atualizacaoLoginRequest.getId())
				.addValue("nome", atualizacaoLoginRequest.getNome())
				.addValue("cpf", atualizacaoLoginRequest.getCpf()).addValue("login", atualizacaoLoginRequest.getLogin())
				.addValue("senha", atualizacaoLoginRequest.getSenha())
				.addValue("perfil", atualizacaoLoginRequest.getPerfil());

		try {
			namedParameterJdbcTemplate.update(sql, params);
		} catch (DataAccessException e) {
			logger.error(e.getMessage());
			throw new DefaultErrorException("Erro ao gravar os dados na base", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
}
