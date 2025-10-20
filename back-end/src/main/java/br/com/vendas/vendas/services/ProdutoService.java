package br.com.vendas.vendas.services;

import java.util.Map;

import br.com.vendas.vendas.models.requests.AtualizacaoProdutoRequest;
import br.com.vendas.vendas.models.requests.CadastroProdutoRequest;
import br.com.vendas.vendas.models.responses.ProdutoCadastroResponse;


public interface ProdutoService {
	
	public void cadastrarProduto(CadastroProdutoRequest cadastroProdutoRequest);

	public void atualizarProduto(AtualizacaoProdutoRequest atualizacaoProdutoRequest);

	public ProdutoCadastroResponse buscarPorId(Integer id);

	public Map<String, Object> listarPorPagina(Integer limit, Integer page);
	
	public void excluirProduto(Integer id);

}
