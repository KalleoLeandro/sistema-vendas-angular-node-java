package br.com.vendas.vendas.repositories;

import java.sql.ResultSet;

import javax.sql.DataSource;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.dao.DataAccessException;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.test.context.ActiveProfiles;

import br.com.vendas.vendas.exceptions.DefaultErrorException;
import br.com.vendas.vendas.models.dto.LoginDTO;
import br.com.vendas.vendas.models.requests.AtualizacaoLoginRequest;
import br.com.vendas.vendas.models.requests.CadastroLoginRequest;
import br.com.vendas.vendas.models.responses.LoginCadastroResponse;

@SpringBootTest
@ActiveProfiles("test")
@ExtendWith(MockitoExtension.class)
class LoginRepositoryTest {

	@InjectMocks
	private LoginRepository loginRepository;

	@Mock
	private DataSource dataSource;

	@Mock
	private NamedParameterJdbcTemplate namedParameterJdbcTemplate;

	private CadastroLoginRequest cadastroLoginRequest = new CadastroLoginRequest("teste", "222.333.444-05",
			"teste_user", "123456", "dev");

	private AtualizacaoLoginRequest atualizacaoLoginRequest = new AtualizacaoLoginRequest(1, "teste", "123.456.789-00",
			"teste_user", "123456", "dev");

	@BeforeEach
	void setUp() {
		MockitoAnnotations.openMocks(this);
	}

	@SuppressWarnings("unchecked")
	@Test
	void testBuscarPorLoginESenha_Success() throws Exception {
		String login = "usuario-teste";
		String senha = "123";

		Mockito.doAnswer(invocation -> {
			RowMapper<LoginDTO> rowMapper = invocation.getArgument(2);

			ResultSet rs = Mockito.mock(ResultSet.class);
			Mockito.when(rs.getString("nome")).thenReturn("Nome Teste");
			Mockito.when(rs.getString("cpf")).thenReturn("12345678901");
			Mockito.when(rs.getString("perfil")).thenReturn("user");

			return rowMapper.mapRow(rs, 1);
		}).when(namedParameterJdbcTemplate).queryForObject(Mockito.anyString(),
				Mockito.any(MapSqlParameterSource.class), Mockito.any(RowMapper.class));

		LoginDTO result = loginRepository.buscarPorLoginESenha(login, senha);

		Assertions.assertNotNull(result);
		Assertions.assertEquals("Nome Teste", result.getNome());
		Assertions.assertEquals("12345678901", result.getCpf());
		Assertions.assertEquals("user", result.getPerfil());
	}

	@SuppressWarnings("unchecked")
	@Test
	void testBuscarPorLoginESenha_NotFound() {
		String login = "usuario-invalido";
		String senha = "senha-invalida";

		Mockito.when(namedParameterJdbcTemplate.queryForObject(Mockito.anyString(),
				Mockito.any(MapSqlParameterSource.class), Mockito.any(RowMapper.class)))
				.thenThrow(EmptyResultDataAccessException.class);

		LoginDTO result = loginRepository.buscarPorLoginESenha(login, senha);

		Assertions.assertNull(result);

		Mockito.verify(namedParameterJdbcTemplate).queryForObject(Mockito.anyString(),
				Mockito.any(MapSqlParameterSource.class), Mockito.any(RowMapper.class));
	}

	@SuppressWarnings({ "unchecked", "serial" })
	@Test
	void testBuscarPorLoginESenha_Exception() {
		String login = "usuario-teste";
		String senha = "123";
		String sql = "SELECT nome, cpf, perfil FROM usuarios WHERE login = :login AND senha = :senha";

		Mockito.when(namedParameterJdbcTemplate.queryForObject(Mockito.eq(sql),
				Mockito.any(MapSqlParameterSource.class), Mockito.any(RowMapper.class)))
				.thenThrow(new DataAccessException("...") {
				});

		DefaultErrorException ex = Assertions.assertThrows(DefaultErrorException.class, () -> {
			loginRepository.buscarPorLoginESenha(login, senha);
		});

		Assertions.assertEquals("Erro ao consultar os dados na base", ex.getMessage());
		Assertions.assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, ex.getStatus());
	}

	@Test
	void testCadastrarLogin_Success() throws Exception {
		Mockito.when(namedParameterJdbcTemplate.update(Mockito.anyString(), Mockito.any(MapSqlParameterSource.class)))
				.thenReturn(1);

		loginRepository.cadastrarLogin(cadastroLoginRequest);

		Mockito.verify(namedParameterJdbcTemplate).update(Mockito.anyString(),
				Mockito.any(MapSqlParameterSource.class));
	}

	@SuppressWarnings("serial")
	@Test
	void testCadastrarLogin_Exception() {

		Mockito.when(namedParameterJdbcTemplate.update(Mockito.anyString(), Mockito.any(MapSqlParameterSource.class)))
				.thenThrow(new DataAccessException("...") {
				});

		DefaultErrorException ex = Assertions.assertThrows(DefaultErrorException.class, () -> {
			loginRepository.cadastrarLogin(cadastroLoginRequest);
		});

		Assertions.assertEquals("Erro ao gravar os dados na base", ex.getMessage());
		Assertions.assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, ex.getStatus());
	}

	@Test
	void testAtualizarLogin_Success() throws Exception {

		Mockito.when(namedParameterJdbcTemplate.update(Mockito.anyString(), Mockito.any(MapSqlParameterSource.class)))
				.thenReturn(1);

		loginRepository.atualizarLogin(atualizacaoLoginRequest);

		Mockito.verify(namedParameterJdbcTemplate).update(Mockito.anyString(),
				Mockito.any(MapSqlParameterSource.class));
	}

	@SuppressWarnings("serial")
	@Test
	void testAtualizar_Exception() {

		Mockito.when(namedParameterJdbcTemplate.update(Mockito.anyString(), Mockito.any(MapSqlParameterSource.class)))
				.thenThrow(new DataAccessException("...") {
				});

		DefaultErrorException ex = Assertions.assertThrows(DefaultErrorException.class, () -> {
			loginRepository.atualizarLogin(atualizacaoLoginRequest);
		});

		Assertions.assertEquals("Erro ao gravar os dados na base", ex.getMessage());
		Assertions.assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, ex.getStatus());
	}

	@SuppressWarnings("unchecked")
	@Test
	void testBuscarLoginPorId_Success() throws Exception {
		Mockito.doAnswer(invocation -> {
			RowMapper<LoginCadastroResponse> rowMapper = invocation.getArgument(2);

			ResultSet rs = Mockito.mock(ResultSet.class);
			Mockito.when(rs.getInt("id")).thenReturn(2);
			Mockito.when(rs.getString("nome")).thenReturn("Nome Teste");
			Mockito.when(rs.getString("cpf")).thenReturn("12345678901");
			Mockito.when(rs.getString("login")).thenReturn("teste");
			Mockito.when(rs.getString("senha")).thenReturn("teste123");
			Mockito.when(rs.getString("perfil")).thenReturn("user");

			return rowMapper.mapRow(rs, 1);
		}).when(namedParameterJdbcTemplate).queryForObject(Mockito.anyString(),
				Mockito.any(MapSqlParameterSource.class), Mockito.any(RowMapper.class));

		LoginCadastroResponse result = loginRepository.buscarPorId(2);

		Assertions.assertNotNull(result);
		Assertions.assertEquals(2, result.getId());
		Assertions.assertEquals("Nome Teste", result.getNome());
		Assertions.assertEquals("12345678901", result.getCpf());
		Assertions.assertEquals("teste", result.getLogin());
		Assertions.assertEquals("teste123", result.getSenha());
		Assertions.assertEquals("user", result.getPerfil());
	}
	
	@SuppressWarnings({ "unchecked", "serial" })
	@Test
	void testBuscarLoginPorId_NotFound() {
		Mockito.when(namedParameterJdbcTemplate.<LoginCadastroResponse>queryForObject(Mockito.anyString(), 
				Mockito.any(MapSqlParameterSource.class),
				Mockito.any(RowMapper.class))).thenThrow(new EmptyResultDataAccessException("...", 404) {}) ;
				
		EmptyResultDataAccessException ex = Assertions.assertThrows(EmptyResultDataAccessException.class, () -> {
			loginRepository.buscarPorId(2);
		});

		Assertions.assertEquals("Erro ao localizar os dados na base", ex.getMessage());
		Assertions.assertEquals(1, ex.getExpectedSize());
	}

	@SuppressWarnings({ "unchecked", "serial" })
	@Test
	void testBuscarLoginPorId_Falha() {
		Mockito.when(namedParameterJdbcTemplate.<LoginCadastroResponse>queryForObject(Mockito.anyString(), 
				Mockito.any(MapSqlParameterSource.class),
				Mockito.any(RowMapper.class))).thenThrow(new DataAccessException("...") {}) ;
				
		DefaultErrorException ex = Assertions.assertThrows(DefaultErrorException.class, () -> {
			loginRepository.buscarPorId(2);
		});

		Assertions.assertEquals("Erro ao localizar os dados na base", ex.getMessage());
		Assertions.assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, ex.getStatus());
	}
}
