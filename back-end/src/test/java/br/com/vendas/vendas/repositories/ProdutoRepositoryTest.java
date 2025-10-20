package br.com.vendas.vendas.repositories;

import java.sql.ResultSet;
import java.util.Collections;
import java.util.List;
import java.util.Map;

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
import org.springframework.dao.DataAccessResourceFailureException;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.test.context.ActiveProfiles;

import br.com.vendas.vendas.exceptions.DefaultErrorException;
import br.com.vendas.vendas.models.requests.AtualizacaoProdutoRequest;
import br.com.vendas.vendas.models.requests.CadastroProdutoRequest;
import br.com.vendas.vendas.models.responses.LoginCadastroResponse;
import br.com.vendas.vendas.models.responses.ProdutoCadastroResponse;

@SpringBootTest
@ActiveProfiles("test")
@ExtendWith(MockitoExtension.class)
public class ProdutoRepositoryTest {

	@InjectMocks
	private ProdutoRepository produtoRepository;

	@Mock
	private DataSource dataSource;

	@Mock
	private NamedParameterJdbcTemplate namedParameterJdbcTemplate;

	private CadastroProdutoRequest cadastroProdutoRequest;

	private AtualizacaoProdutoRequest atualizacaoProdutoRequest;

	@BeforeEach
	void setup() {
		MockitoAnnotations.openMocks(this);

		cadastroProdutoRequest = new CadastroProdutoRequest();
		cadastroProdutoRequest.setNome("Teste");
		cadastroProdutoRequest.setPrecoCusto(1.0);
		cadastroProdutoRequest.setPrecoVenda(2.0);
		cadastroProdutoRequest.setQuantidade(1);
		cadastroProdutoRequest.setMedida(1);
		cadastroProdutoRequest.setCategoria(1);

		atualizacaoProdutoRequest = new AtualizacaoProdutoRequest();
		atualizacaoProdutoRequest.setId(1);
		atualizacaoProdutoRequest.setPrecoCusto(1.0);
		atualizacaoProdutoRequest.setPrecoVenda(2.0);
		atualizacaoProdutoRequest.setQuantidade(1);
		atualizacaoProdutoRequest.setMedida(1);
		atualizacaoProdutoRequest.setCategoria(1);
		
		produtoRepository = new ProdutoRepository(namedParameterJdbcTemplate);
	}
	
	@Test
	void testCadastrarProduto_Success() throws Exception {
		Mockito.when(namedParameterJdbcTemplate.update(Mockito.anyString(), Mockito.any(MapSqlParameterSource.class)))
				.thenReturn(1);

		produtoRepository.cadastrarProduto(cadastroProdutoRequest);

		Mockito.verify(namedParameterJdbcTemplate).update(Mockito.anyString(),
				Mockito.any(MapSqlParameterSource.class));
	}

	@SuppressWarnings("serial")
	@Test
	void testCadastrarProduto_Exception() {

		Mockito.when(namedParameterJdbcTemplate.update(Mockito.anyString(), Mockito.any(MapSqlParameterSource.class)))
				.thenThrow(new DataAccessException("...") {
				});

		DefaultErrorException ex = Assertions.assertThrows(DefaultErrorException.class, () -> {
			produtoRepository.cadastrarProduto(cadastroProdutoRequest);
		});

		Assertions.assertEquals("Erro ao gravar os dados na base", ex.getMessage());
		Assertions.assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, ex.getStatus());
	}

	@Test
	void testAtualizarProduto_Success() throws Exception {

		Mockito.when(namedParameterJdbcTemplate.update(Mockito.anyString(), Mockito.any(MapSqlParameterSource.class)))
				.thenReturn(1);

		produtoRepository.atualizarProduto(atualizacaoProdutoRequest);

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
			produtoRepository.atualizarProduto(atualizacaoProdutoRequest);
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
			Mockito.when(rs.getDouble("preco_custo")).thenReturn(12.0);
			Mockito.when(rs.getDouble("preco_venda")).thenReturn(15.0);
			Mockito.when(rs.getInt("quantidade")).thenReturn(1);
			Mockito.when(rs.getInt("medida")).thenReturn(1);
			Mockito.when(rs.getInt("categoria")).thenReturn(1);
			

			return rowMapper.mapRow(rs, 1);
		}).when(namedParameterJdbcTemplate).queryForObject(Mockito.anyString(),
				Mockito.any(MapSqlParameterSource.class), Mockito.any(RowMapper.class));

		ProdutoCadastroResponse result = produtoRepository.buscarPorId(2);

		Assertions.assertNotNull(result);
		Assertions.assertEquals(2, result.getId());
		Assertions.assertEquals("Nome Teste", result.getNome());
		Assertions.assertEquals(12.0, result.getPrecoCusto());
		Assertions.assertEquals(15.0, result.getPrecoVenda());		
		Assertions.assertEquals(1, result.getQuantidade());
		Assertions.assertEquals(1, result.getQuantidade());
		Assertions.assertEquals(1, result.getQuantidade());
	}
	
	@SuppressWarnings({ "unchecked", "serial" })
	@Test
	void testBuscarLoginPorId_NotFound() {
		Mockito.when(namedParameterJdbcTemplate.<LoginCadastroResponse>queryForObject(Mockito.anyString(), 
				Mockito.any(MapSqlParameterSource.class),
				Mockito.any(RowMapper.class))).thenThrow(new EmptyResultDataAccessException("...", 404) {}) ;
				
		EmptyResultDataAccessException ex = Assertions.assertThrows(EmptyResultDataAccessException.class, () -> {
			produtoRepository.buscarPorId(2);
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
			produtoRepository.buscarPorId(2);
		});

		Assertions.assertEquals("Erro ao localizar os dados na base", ex.getMessage());
		Assertions.assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, ex.getStatus());
	}
	
	@SuppressWarnings("unchecked")
	@Test
	void testListaPorPagina_Success() throws Exception {
		ProdutoCadastroResponse loginMock = ProdutoCadastroResponse.builder()
				.id(2)
				.nome("Nome Teste")
				.precoCusto(10.0)
				.precoVenda(12.0)				
				.quantidade(1)
				.medida(1)
				.categoria(1)
				.build();

	    List<ProdutoCadastroResponse> mockList = List.of(loginMock);

	    Mockito.when(namedParameterJdbcTemplate.query(
	        Mockito.anyString(),
	        Mockito.any(MapSqlParameterSource.class),
	        Mockito.any(RowMapper.class)
	    )).thenReturn(mockList);
	    
	    Mockito.when(namedParameterJdbcTemplate.queryForObject(
		        Mockito.anyString(),
		        Mockito.any(MapSqlParameterSource.class),
		        Mockito.eq(Integer.class)
		    )).thenReturn(5);

	    Map<String, Object> result = produtoRepository.listarPorPagina(10, 1);

	    Assertions.assertNotNull(result);
	    List<ProdutoCadastroResponse> lista = (List<ProdutoCadastroResponse>) result.get("lista");
	    Assertions.assertEquals(2, lista.get(0).getId());	    
	}
	
	@SuppressWarnings("unchecked")
	@Test
	void testListaPorPagina_EmptyResult() {
	    Mockito.when(namedParameterJdbcTemplate.query(
	        Mockito.anyString(),
	        Mockito.any(MapSqlParameterSource.class),
	        Mockito.any(RowMapper.class)
	    )).thenReturn(Collections.emptyList());

	    Map<String, Object> result = produtoRepository.listarPorPagina(10, 1);

	    Assertions.assertNotNull(result);
	    Assertions.assertTrue(((List<?>) result.get("lista")).isEmpty(), "A lista deve estar vazia");
	}
	
	@SuppressWarnings("unchecked")
	@Test
	void testListaPorPagina_DataAccessException() {
	    Mockito.when(namedParameterJdbcTemplate.query(
	        Mockito.anyString(),
	        Mockito.any(MapSqlParameterSource.class),
	        Mockito.any(RowMapper.class)
	    )).thenThrow(new DataAccessResourceFailureException("Erro simulado"));

	    DefaultErrorException exception = Assertions.assertThrows(DefaultErrorException.class, () -> {
	        produtoRepository.listarPorPagina(10, 1);
	    });

	    Assertions.assertEquals("Erro ao localizar os dados na base", exception.getMessage());
	}
	
	@SuppressWarnings("unchecked")
	@Test
	void testListaPorPagina_EmptyDataAccessExcepition() {
	    Mockito.when(namedParameterJdbcTemplate.query(
	        Mockito.anyString(),
	        Mockito.any(MapSqlParameterSource.class),
	        Mockito.any(RowMapper.class)
	    )).thenThrow(new EmptyResultDataAccessException("Erro simulado", 1));

	    EmptyResultDataAccessException exception = Assertions.assertThrows(EmptyResultDataAccessException.class, () -> {
	        produtoRepository.listarPorPagina(10, 1);
	    });

	    Assertions.assertEquals("Sem items retornados", exception.getMessage());
	}
	
	@Test
	void testExcluirLogin_Success() throws Exception {
		Mockito.when(namedParameterJdbcTemplate.update(Mockito.anyString(), Mockito.any(MapSqlParameterSource.class)))
		.thenReturn(1);
		produtoRepository.excluirProduto(1);

		Mockito.verify(namedParameterJdbcTemplate).update(Mockito.anyString(),
				Mockito.any(MapSqlParameterSource.class));
	}

	@SuppressWarnings("serial")
	@Test
	void testExcluirLogin_Exception() {

		Mockito.when(namedParameterJdbcTemplate.update(Mockito.anyString(), Mockito.any(MapSqlParameterSource.class)))
				.thenThrow(new DataAccessException("...") {
				});

		DefaultErrorException ex = Assertions.assertThrows(DefaultErrorException.class, () -> {
			produtoRepository.excluirProduto(1);
		});

		Assertions.assertEquals("Erro ao excluir o dado na base", ex.getMessage());
		Assertions.assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, ex.getStatus());
	}

}
