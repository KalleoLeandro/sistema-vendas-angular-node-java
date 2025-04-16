package br.com.vendas.vendas.models.requests;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter 
@Setter
public class LoginRequest {	
	
	@NotEmpty(message = "O login não pode estar vazio")
	@NotBlank(message = "O login não pode estar vazio")
	private String login;
	
	@NotEmpty(message = "A senha não pode estar vazia")
	@NotBlank(message = "A senha não pode estar vazia")
	private String senha;
}