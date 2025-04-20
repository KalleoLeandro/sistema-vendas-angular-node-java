package br.com.vendas.vendas.controllers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestBody;

import br.com.vendas.vendas.exceptions.schemas.DefaultErrorResponse;
import br.com.vendas.vendas.services.UtilsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@Tag(name = "Utils", description = "Endpoints de validações e utilitários")
@RestController
@RequestMapping("/utils")
public class UtilsController {

	private static final Logger logger = LoggerFactory.getLogger(UtilsController.class);

	@Autowired
	private UtilsService utilsService;

	@Operation(summary = "Valida o cpf", description = "Verifica se o cpf é valido e retorna true ou false")
	@ApiResponses(value = {
			@ApiResponse(responseCode = "200", description = "True ou False", content = @Content(mediaType = "application/json", schema = @Schema(implementation = Boolean.class))),
			@ApiResponse(responseCode = "400", description = "Requisição inválida", content = @Content(mediaType = "application/json", schema = @Schema(implementation = DefaultErrorResponse.class))),
			@ApiResponse(responseCode = "500", description = "Erro interno", content = @Content(mediaType = "application/json", schema = @Schema(implementation = DefaultErrorResponse.class))) })
	@PostMapping("/validar-cpf")
	public ResponseEntity<Boolean> validarCpf(@RequestBody @Valid String cpf) {	
		logger.info("Executando a service validarCpf");		
		return ResponseEntity.ok(utilsService.validarCpf(cpf));
	}
}
