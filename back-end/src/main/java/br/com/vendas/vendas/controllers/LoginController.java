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
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import br.com.vendas.vendas.exceptions.schemas.DefaultErrorResponse;
import br.com.vendas.vendas.models.requests.AtualizacaoLoginRequest;
import br.com.vendas.vendas.models.requests.CadastroLoginRequest;
import br.com.vendas.vendas.models.requests.LoginRequest;
import br.com.vendas.vendas.models.responses.LoginCadastroResponse;
import br.com.vendas.vendas.models.responses.LoginResponse;
import br.com.vendas.vendas.services.LoginService;
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

@Tag(name = "Login", description = "Endpoints de login e token")
@RestController
@RequestMapping("/login")
@RequiredArgsConstructor
public class LoginController {

	private static final Logger logger = LoggerFactory.getLogger(LoginController.class);
	
	private final LoginService loginService;

	@Operation(summary = "Faz login do usuário", description = "Verifica login e senha e retorna o token JWT se for válido")
	@ApiResponses(value = {
			@ApiResponse(responseCode = "200", description = "Login bem-sucedido", content = @Content(mediaType = "application/json", schema = @Schema(implementation = LoginResponse.class))),
			@ApiResponse(responseCode = "400", description = "Requisição inválida", content = @Content(mediaType = "application/json", schema = @Schema(implementation = DefaultErrorResponse.class))),
			@ApiResponse(responseCode = "401", description = "Login ou senha inválidos", content = @Content),
			@ApiResponse(responseCode = "500", description = "Erro interno", content = @Content(mediaType = "application/json", schema = @Schema(implementation = DefaultErrorResponse.class))) })
	@PostMapping("/validar-login")
	public ResponseEntity<LoginResponse> validarLogin(@RequestBody @Valid LoginRequest login) {
		logger.info("Executando a LoginService.validarLogin");
		LoginResponse response = loginService.validarLogin(login);
		return ResponseEntity.status(response.getStatus()).body(response);
	}

	@Operation(summary = "Faz a validação do token", description = "Verifica se o token JWT é válido")
	@ApiResponses(value = {
			@ApiResponse(responseCode = "200", description = "Retorna true ou false", content = @Content(mediaType = "application/json", schema = @Schema(type = "boolean", example = "true"))),
			@ApiResponse(responseCode = "400", description = "Requisição inválida", content = @Content(mediaType = "application/json", schema = @Schema(implementation = DefaultErrorResponse.class), examples = @ExampleObject(value = "{\"timestamp\": \"2025-04-19T15:30:00\", \"message\": \"Token JWT não encontrado no header\", \"status\": 400}"))),
			@ApiResponse(responseCode = "500", description = "Erro interno", content = @Content(mediaType = "application/json", schema = @Schema(implementation = DefaultErrorResponse.class))) })
	@PostMapping("/validar-token")
	public ResponseEntity<Boolean> validarToken(@RequestHeader("Authorization") String token) {
		logger.info("Executando a LoginService.validarToken");
		return ResponseEntity.ok(loginService.validarToken(token));
	}

	@Operation(summary = "Faz o cadastro de um login", description = "Valida dados e cadastra o login", security = @SecurityRequirement(name = "bearerAuth"))
	@ApiResponses(value = {
			@ApiResponse(responseCode = "200", description = "Cadastro bem-sucedido", content = @Content(mediaType = "application/json")),
			@ApiResponse(responseCode = "400", description = "Requisição inválida", content = @Content(mediaType = "application/json", schema = @Schema(implementation = DefaultErrorResponse.class))),
			@ApiResponse(responseCode = "500", description = "Erro interno", content = @Content(mediaType = "application/json", schema = @Schema(implementation = DefaultErrorResponse.class))) })
	@PostMapping("/cadastrar-login")
	public ResponseEntity<Void> cadastrarLogin(@RequestBody @Valid CadastroLoginRequest cadastroLoginRequest) {
		logger.info("Executando a LoginService.cadastrarLogin");
		loginService.cadastrarLogin(cadastroLoginRequest);
		return ResponseEntity.status(HttpStatus.CREATED).build();
	}

	@Operation(summary = "Faz a atualização de um login", description = "Valida dados e atualiza o login", security = @SecurityRequirement(name = "bearerAuth"))
	@ApiResponses(value = {
			@ApiResponse(responseCode = "200", description = "Atualização bem-sucedida", content = @Content(mediaType = "application/json", schema = @Schema(implementation = AtualizacaoLoginRequest.class))),
			@ApiResponse(responseCode = "400", description = "Requisição inválida", content = @Content(mediaType = "application/json", schema = @Schema(implementation = DefaultErrorResponse.class))),
			@ApiResponse(responseCode = "500", description = "Erro interno", content = @Content(mediaType = "application/json", schema = @Schema(implementation = DefaultErrorResponse.class))) })
	@PutMapping("/atualizar-login")
	public ResponseEntity<Void> atualizarLogin(@RequestBody @Valid AtualizacaoLoginRequest atualizacaoLoginRequest) {
		logger.info("Executando a LoginService.atualizarLogin");
		loginService.atualizarLogin(atualizacaoLoginRequest);
		return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
	}

	@Operation(summary = "Buscar um login com base em um id", description = "Buscar um login com base em um id fornecido", security = @SecurityRequirement(name = "bearerAuth"))
	@ApiResponses(value = {
			@ApiResponse(responseCode = "200", description = "Login localizado", content = @Content(mediaType = "application/json", schema = @Schema(implementation = CadastroLoginRequest.class))),
			@ApiResponse(responseCode = "204", description = "Usuário não encontrado", content = @Content(mediaType = "application/json", schema = @Schema(implementation = DefaultErrorResponse.class), examples = @ExampleObject(summary = "Exemplo de usuário não localizado", value = "{\"timestamp\": \"2025-04-19T15:30:00\", \"message\": \"Usuário não localizado\", \"status\": 204}"))),
			@ApiResponse(responseCode = "400", description = "Requisição inválida", content = @Content(mediaType = "application/json", schema = @Schema(implementation = DefaultErrorResponse.class))),
			@ApiResponse(responseCode = "500", description = "Erro interno", content = @Content(mediaType = "application/json", schema = @Schema(implementation = DefaultErrorResponse.class))) })
	@GetMapping("/buscar-por-id/{id}")
	public ResponseEntity<LoginCadastroResponse> buscarPorId(@PathVariable Integer id) {
		logger.info("Executando a LoginService.buscarPorId");
		return ResponseEntity.status(HttpStatus.OK).body(loginService.buscarPorId(id));
	}
	
	@Operation(summary = "Buscar uma página de logins com base na pagina fornecida", description = "Buscar uma lista de logins paginada", security = @SecurityRequirement(name = "bearerAuth"))
	@ApiResponses(value = {
			@ApiResponse(
				    responseCode = "200",
				    description = "Login localizado",
				    content = @Content(
				        mediaType = "application/json",
				        schema = @Schema(
				            type = "object",
				            example = """
				            {
				                "total": 50,
				                "lista": [
				                    {
				                        "id": 10,
				                        "nome": "José da Silva",
				                        "cpf": "222.333.444-05",
				                        "login": "jose123",
				                        "senha": "jose@123",
				                        "perfil": "admin"
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
		logger.info("Executando a LoginService.listarPorPagina");
		return ResponseEntity.status(HttpStatus.OK).body(loginService.listarPorPagina(limit, page));
	}
	
	@Operation(summary = "Faz a exclusão de um login", description = "Valida dados e exclui o login", security = @SecurityRequirement(name = "bearerAuth"))
	@ApiResponses(value = {
			@ApiResponse(responseCode = "204", description = "Exclusão bem-sucedida", content = @Content),
			@ApiResponse(responseCode = "400", description = "Requisição inválida", content = @Content(mediaType = "application/json", schema = @Schema(implementation = DefaultErrorResponse.class))),
			@ApiResponse(responseCode = "500", description = "Erro interno", content = @Content(mediaType = "application/json", schema = @Schema(implementation = DefaultErrorResponse.class))) })
	@DeleteMapping("/excluir-login/{id}")
	public ResponseEntity<Void> excluirLogin(@PathVariable @Valid Integer id) {
		logger.info("Executando a LoginService.excluirLogin");
		loginService.excluirLogin(id);
		return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
	}

}
