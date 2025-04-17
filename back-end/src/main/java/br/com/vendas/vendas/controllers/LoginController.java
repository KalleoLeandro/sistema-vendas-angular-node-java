package br.com.vendas.vendas.controllers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.vendas.vendas.models.requests.LoginRequest;
import br.com.vendas.vendas.models.responses.LoginResponse;
import br.com.vendas.vendas.services.LoginService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@Tag(name = "Login", description = "Endpoints de login e token")
@RestController
@RequestMapping("/login")
public class LoginController {	
	
	private static final Logger logger = LoggerFactory.getLogger(LoginController.class);

	@Autowired
	private LoginService loginService;

	@PostMapping("/validar-login")
	public ResponseEntity<LoginResponse> validarLogin(@RequestBody @Valid LoginRequest login) {
		logger.info("Executando a LoginService/validarLogin");
		LoginResponse response = loginService.validarLogin(login);
		return ResponseEntity.status(response.getStatus()).body(response);
	}

	@PostMapping("/validar-token")
	public ResponseEntity<Boolean> validarToken(@RequestHeader("Authorization") String token) {
		logger.info("Executando a LoginService/validarToken");
		return ResponseEntity.ok(loginService.validarToken(token));
	}
	

}
