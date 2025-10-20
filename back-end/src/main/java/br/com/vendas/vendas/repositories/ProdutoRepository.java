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
import br.com.vendas.vendas.models.requests.AtualizacaoProdutoRequest;
import br.com.vendas.vendas.models.requests.CadastroProdutoRequest;
import br.com.vendas.vendas.models.responses.ProdutoCadastroResponse;
import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class ProdutoRepository {
	
	private static final Logger logger = LoggerFactory.getLogger(ProdutoRepository.class);	
	
	private final NamedParameterJdbcTemplate namedParameterJdbcTemplate;	
	
	final RowMapper<ProdutoCadastroResponse> produtoCadastroMapper = (rs, rowNum) -> ProdutoCadastroResponse.builder()
			.id(rs.getInt("id")).nome(rs.getString("nome")).precoCusto(rs.getDouble("preco_custo")).precoVenda(rs.getDouble("preco_venda"))
			.quantidade(rs.getInt("quantidade")).medida(rs.getInt("medida")).categoria(rs.getInt("categoria")).build();

	public void cadastrarProduto(CadastroProdutoRequest cadastroProdutoRequest) {
		String sql = "INSERT INTO produtos(nome, preco_custo, preco_venda, quantidade, medida, categoria) values(:nome, :preco_custo, :preco_venda, :quantidade, :medida, :categoria)";
		MapSqlParameterSource params = new MapSqlParameterSource().addValue("nome", cadastroProdutoRequest.getNome())
				.addValue("preco_custo", cadastroProdutoRequest.getPrecoCusto()).addValue("preco_venda", cadastroProdutoRequest.getPrecoVenda())
				.addValue("quantidade", cadastroProdutoRequest.getQuantidade())
				.addValue("medida", cadastroProdutoRequest.getMedida())
				.addValue("categoria", cadastroProdutoRequest.getCategoria());
		try {
			namedParameterJdbcTemplate.update(sql, params);
		} catch (DataAccessException e) {
			e.printStackTrace();
			logger.error(e.getMessage());
			throw new DefaultErrorException("Erro ao gravar os dados na base", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	public void atualizarProduto(AtualizacaoProdutoRequest atualizacaoProdutoRequest) {
		String sql = "UPDATE produtos set nome = :nome, preco_custo = :preco_custo, preco_venda = :preco_venda, quantidade = :quantidade, medida = :medida,"
				+ "categoria = :categoria where id = :id";
		MapSqlParameterSource params = new MapSqlParameterSource().addValue("id", atualizacaoProdutoRequest.getId())
				.addValue("nome", atualizacaoProdutoRequest.getNome())
				.addValue("preco_custo", atualizacaoProdutoRequest.getPrecoCusto())
				.addValue("preco_venda", atualizacaoProdutoRequest.getPrecoVenda())
				.addValue("quantidade", atualizacaoProdutoRequest.getQuantidade())
				.addValue("medida", atualizacaoProdutoRequest.getMedida())
				.addValue("categoria", atualizacaoProdutoRequest.getCategoria())
				.addValue("id", atualizacaoProdutoRequest.getId());

		try {
			namedParameterJdbcTemplate.update(sql, params);
		} catch (DataAccessException e) {
			logger.error(e.getMessage());
			throw new DefaultErrorException("Erro ao gravar os dados na base", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	public ProdutoCadastroResponse buscarPorId(Integer id) {
		String sql = "SELECT * FROM produtos where id = :id";
		MapSqlParameterSource params = new MapSqlParameterSource().addValue("id", id);
		try {
			return namedParameterJdbcTemplate.<ProdutoCadastroResponse>queryForObject(sql, params, produtoCadastroMapper);
		} catch (EmptyResultDataAccessException e) {
			logger.error(e.getMessage());
			throw new EmptyResultDataAccessException("Erro ao localizar os dados na base", 1);
		} catch (DataAccessException e) {
			logger.error(e.getMessage());
			throw new DefaultErrorException("Erro ao localizar os dados na base", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	public Map<String, Object> listarPorPagina(Integer limit, Integer page) {
		String sql = "SELECT * FROM produtos where id != 1 ORDER BY id ASC LIMIT :limit OFFSET :page";		
	    MapSqlParameterSource params = new MapSqlParameterSource().addValue("limit", limit).addValue("page", ((page - 1) * limit));
	    
	    try {
	    	List<ProdutoCadastroResponse> lista = namedParameterJdbcTemplate.query(sql, params, produtoCadastroMapper);
	    	sql = "SELECT COUNT(id) FROM produtos where id != 1";
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
	
	public void excluirProduto(Integer id) {
		String sql = "DELETE FROM produtos WHERE id = :id";
		MapSqlParameterSource params = new MapSqlParameterSource().addValue("id", id);
		try {
			namedParameterJdbcTemplate.update(sql, params);
		} catch (DataAccessException e) {
			logger.error(e.getMessage());
			throw new DefaultErrorException("Erro ao excluir o dado na base", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

}
