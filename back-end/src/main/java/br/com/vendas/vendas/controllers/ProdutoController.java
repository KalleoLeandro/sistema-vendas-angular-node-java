package br.com.vendas.vendas.controllers;

import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import br.com.vendas.vendas.exceptions.schemas.DefaultErrorResponse;
import br.com.vendas.vendas.models.requests.AtualizacaoProdutoRequest;
import br.com.vendas.vendas.models.requests.CadastroProdutoRequest;
import br.com.vendas.vendas.models.responses.ProdutoCadastroResponse;
import br.com.vendas.vendas.services.ProdutoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@Tag(name = "Produto", description = "Endpoints de produto")
@RestController
@RequestMapping("/produto")
@RequiredArgsConstructor
public class ProdutoController {

	private static final Logger logger = LoggerFactory.getLogger(LoginController.class);
	
	private final ProdutoService produtoService;
	
	@Operation(summary = "Faz o cadastro de um produto", description = "Valida dados e cadastra o produto", security = @SecurityRequirement(name = "bearerAuth"))
	@ApiResponses(value = {
			@ApiResponse(responseCode = "201", description = "Cadastro bem-sucedido", content = @Content(mediaType = "application/json")),
			@ApiResponse(responseCode = "400", description = "Requisição inválida", content = @Content(mediaType = "application/json", schema = @Schema(implementation = DefaultErrorResponse.class))),
			@ApiResponse(responseCode = "500", description = "Erro interno", content = @Content(mediaType = "application/json", schema = @Schema(implementation = DefaultErrorResponse.class))) })
	@PostMapping("/cadastrar-produto")
	public ResponseEntity<Void> cadastrarLogin(@RequestBody @Valid CadastroProdutoRequest cadastroProdutoRequest) {
		logger.info("Executando o ProdutoService.cadastrarProduto");
		produtoService.cadastrarProduto(cadastroProdutoRequest);
		return ResponseEntity.status(HttpStatus.CREATED).build();
	}
	
	@Operation(summary = "Faz a atualização de um produto", description = "Valida dados e atualiza o produto", security = @SecurityRequirement(name = "bearerAuth"))
	@ApiResponses(value = {
			@ApiResponse(responseCode = "200", description = "Atualização bem-sucedida", content = @Content(mediaType = "application/json", schema = @Schema(implementation = AtualizacaoProdutoRequest.class))),
			@ApiResponse(responseCode = "400", description = "Requisição inválida", content = @Content(mediaType = "application/json", schema = @Schema(implementation = DefaultErrorResponse.class))),
			@ApiResponse(responseCode = "500", description = "Erro interno", content = @Content(mediaType = "application/json", schema = @Schema(implementation = DefaultErrorResponse.class))) })
	@PutMapping("/atualizar-produto")
	public ResponseEntity<Void> atualizarProduto(@RequestBody @Valid AtualizacaoProdutoRequest atualizacaoProdutoRequest) {
		logger.info("Executando a ProdutoService.atualizacaoProdutoRequest");
		produtoService.atualizarProduto(atualizacaoProdutoRequest);
		return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
	}

	@Operation(summary = "Buscar um produto com base em um id", description = "Buscar um produto com base em um id fornecido", security = @SecurityRequirement(name = "bearerAuth"))
	@ApiResponses(value = {
			@ApiResponse(responseCode = "200", description = "Login localizado", content = @Content(mediaType = "application/json", schema = @Schema(implementation = CadastroProdutoRequest.class))),
			@ApiResponse(responseCode = "204", description = "Produto não encontrado", content = @Content(mediaType = "application/json", schema = @Schema(implementation = DefaultErrorResponse.class), examples = @ExampleObject(summary = "Exemplo de usuário não localizado", value = "{\"timestamp\": \"2025-04-19T15:30:00\", \"message\": \"Usuário não localizado\", \"status\": 204}"))),
			@ApiResponse(responseCode = "400", description = "Requisição inválida", content = @Content(mediaType = "application/json", schema = @Schema(implementation = DefaultErrorResponse.class))),
			@ApiResponse(responseCode = "500", description = "Erro interno", content = @Content(mediaType = "application/json", schema = @Schema(implementation = DefaultErrorResponse.class))) })
	@GetMapping("/buscar-por-id/{id}")
	public ResponseEntity<ProdutoCadastroResponse> buscarPorId(@PathVariable Integer id) {
		logger.info("Executando a ProdutoService.buscarPorId");
		produtoService.buscarPorId(id);
		return ResponseEntity.status(HttpStatus.OK).body(produtoService.buscarPorId(id));
	}
	
	@Operation(summary = "Buscar uma página de produtos com base na pagina fornecida", description = "Buscar uma lista de produtos paginada", security = @SecurityRequirement(name = "bearerAuth"))
	@ApiResponses(value = {
			@ApiResponse(
				    responseCode = "200",
				    description = "Produto localizado",
				    content = @Content(
				        mediaType = "application/json",
				        schema = @Schema(
				            type = "object",
				            example = """
				            {
				                "total": 50,
				                "lista": [
				                    {
				                        "id": 1,
				                        "nome": "Arroz",
				                        "precoCusto": 10.50,
				                        "precoVenda": 15.00 ,
				                        "quantidade": 10,
				                        "medida": 1, 
				                        "categoria": 1
				                    }
				                ]
				            }
				            """
				        )
				    )
				),
			@ApiResponse(responseCode = "204", description = "Sem itens retornado", content = @Content(mediaType = "application/json", schema = @Schema(implementation = DefaultErrorResponse.class), examples = @ExampleObject(summary = "Exemplo de usuário não localizado", value = "{\"timestamp\": \"2025-04-19T15:30:00\", \"message\": \"Sem itens retornado\", \"status\": 204}"))),
			@ApiResponse(responseCode = "400", description = "Requisição inválida", content = @Content(mediaType = "application/json", schema = @Schema(implementation = DefaultErrorResponse.class))),
			@ApiResponse(responseCode = "500", description = "Erro interno", content = @Content(mediaType = "application/json", schema = @Schema(implementation = DefaultErrorResponse.class)))}
	)
	@GetMapping("/listar-todos-por-pagina")
	public ResponseEntity<Map<String, Object>> listarPorPagina(@RequestParam Integer limit, @RequestParam Integer page) {
		logger.info("Executando a ProdutoService.listarPorPagina");
		return ResponseEntity.status(HttpStatus.OK).body(produtoService.listarPorPagina(limit, page));
	}
	
	@Operation(summary = "Faz a exclusão de um produto", description = "Valida dados e exclui o produto", security = @SecurityRequirement(name = "bearerAuth"))
	@ApiResponses(value = {
			@ApiResponse(responseCode = "204", description = "Exclusão bem-sucedida", content = @Content),
			@ApiResponse(responseCode = "400", description = "Requisição inválida", content = @Content(mediaType = "application/json", schema = @Schema(implementation = DefaultErrorResponse.class))),
			@ApiResponse(responseCode = "500", description = "Erro interno", content = @Content(mediaType = "application/json", schema = @Schema(implementation = DefaultErrorResponse.class))) })
	@DeleteMapping("/excluir-produto/{id}")
	public ResponseEntity<Void> excluirProduto(@PathVariable @Valid Integer id) {
		logger.info("Executando a ProdutoService.excluirLogin");
		produtoService.excluirProduto(id);
		return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
	}

	
	
}
