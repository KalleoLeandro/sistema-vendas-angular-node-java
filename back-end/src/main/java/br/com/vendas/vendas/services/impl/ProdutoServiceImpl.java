package br.com.vendas.vendas.services.impl;

import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import br.com.vendas.vendas.exceptions.DefaultErrorException;
import br.com.vendas.vendas.models.requests.AtualizacaoProdutoRequest;
import br.com.vendas.vendas.models.requests.CadastroProdutoRequest;
import br.com.vendas.vendas.models.responses.ProdutoCadastroResponse;
import br.com.vendas.vendas.repositories.ProdutoRepository;
import br.com.vendas.vendas.services.ProdutoService;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProdutoServiceImpl implements ProdutoService {

	private static final Logger logger = LoggerFactory.getLogger(ProdutoServiceImpl.class);

	private final ProdutoRepository produtoRepository;

	@Override
	public void cadastrarProduto(CadastroProdutoRequest cadastroProdutoRequest) {

		try {
			logger.info("Executando o ProdutoRepository.cadastrarProduto");
			produtoRepository.cadastrarProduto(cadastroProdutoRequest);
		} catch (Exception e) {
			throw new DefaultErrorException(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@Override
	public Map<String, Object> listarPorPagina(Integer limit, Integer page) {
		try {
			logger.info("Executando o ProdutoRepository.listarPorPagina");
			return produtoRepository.listarPorPagina(limit, page);
		} catch (EmptyResultDataAccessException e) {
			logger.warn("Sem itens retornado", limit, page);
			throw new DefaultErrorException("Sem itens retornado", HttpStatus.NO_CONTENT);
		} catch (Exception e) {
			throw new DefaultErrorException(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@Override
	public void excluirProduto(Integer id) {
		try {
			logger.info("Executando o ProdutoRepository.excluirProduto");
			produtoRepository.excluirProduto(id);
		} catch (Exception e) {
			throw new DefaultErrorException(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@Override
	public void atualizarProduto(AtualizacaoProdutoRequest atualizacaoProdutoRequest) {
		try {
			logger.info("Executando o ProdutoRepository.atualizarProduto");
			produtoRepository.atualizarProduto(atualizacaoProdutoRequest);
		} catch (Exception e) {
			throw new DefaultErrorException(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
		}

	}

	@Override
	public ProdutoCadastroResponse buscarPorId(Integer id) {
		try {
			logger.info("Executando o ProdutoRepository.buscarPorId");
			return produtoRepository.buscarPorId(id);
		} catch (EmptyResultDataAccessException e) {
			logger.warn("Nenhum produto encontrado com o id informado", id);
			throw new DefaultErrorException("Produto não encontrado", HttpStatus.NO_CONTENT);
		} catch (Exception e) {
			throw new DefaultErrorException(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

}
