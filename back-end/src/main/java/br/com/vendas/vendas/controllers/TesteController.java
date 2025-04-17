package br.com.vendas.vendas.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(name = "Teste", description = "Endpoint de teste")
@RestController
@RequestMapping("/teste")
public class TesteController {

	@GetMapping
	@Operation(summary = "Chama endpoint para verificar se há resposta da api")
	@ApiResponses(value = { @ApiResponse(responseCode = "200", description = "Teste ok")})
	public ResponseEntity<String> teste() {
		return ResponseEntity.ok().body("Teste ok");
	}

}
