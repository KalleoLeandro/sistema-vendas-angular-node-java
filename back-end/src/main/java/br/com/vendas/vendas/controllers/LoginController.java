package br.com.vendas.vendas.controllers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.vendas.vendas.exceptions.schemas.DefaultErrorResponse;
import br.com.vendas.vendas.models.requests.CadastroLoginRequest;
import br.com.vendas.vendas.models.requests.LoginRequest;
import br.com.vendas.vendas.models.responses.LoginResponse;
import br.com.vendas.vendas.services.LoginService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@Tag(name = "Login", description = "Endpoints de login e token")
@RestController
@RequestMapping("/login")
public class LoginController {

	private static final Logger logger = LoggerFactory.getLogger(LoginController.class);

	@Autowired
	private LoginService loginService;

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
			@ApiResponse(responseCode = "400", description = "Requisição inválida", content = @Content(mediaType = "application/json", schema = @Schema(implementation = DefaultErrorResponse.class), examples = @ExampleObject(name = "Token ausente", summary = "Exemplo de token ausente", value = "{\"timestamp\": \"2025-04-19T15:30:00\", \"message\": \"Token JWT não encontrado no header\", \"status\": 400}"))),
			@ApiResponse(responseCode = "500", description = "Erro interno", content = @Content(mediaType = "application/json", schema = @Schema(implementation = DefaultErrorResponse.class))) })
	@PostMapping("/validar-token")
	public ResponseEntity<Boolean> validarToken(@RequestHeader("Authorization") String token) {
		logger.info("Executando a LoginService.validarToken");
		return ResponseEntity.ok(loginService.validarToken(token));
	}

	@Operation(summary = "Faz o cadastro de um login", description = "Valida dados e cadastra o login")
	@ApiResponses(value = {
			@ApiResponse(responseCode = "200", description = "Cadastro bem-sucedido", content = @Content(mediaType = "application/json", schema = @Schema(implementation = CadastroLoginRequest.class))),
			@ApiResponse(responseCode = "400", description = "Requisição inválida", content = @Content(mediaType = "application/json", schema = @Schema(implementation = DefaultErrorResponse.class))),			
			@ApiResponse(responseCode = "500", description = "Erro interno", content = @Content(mediaType = "application/json", schema = @Schema(implementation = DefaultErrorResponse.class))) })
	@PostMapping("/cadastrar-login")
	public ResponseEntity<Void> cadastrarLogin(@RequestBody @Valid CadastroLoginRequest cadastroLoginRequest) {
		logger.info("Executando a LoginService.validarToken");
		loginService.cadastrarLogin(cadastroLoginRequest);
		return ResponseEntity.status(HttpStatus.CREATED).build();
	}

}
