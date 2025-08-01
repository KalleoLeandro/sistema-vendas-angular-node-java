package br.com.vendas.vendas.models.responses;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter 
@Setter
@Builder
public class LoginCadastroResponse {
	
	private int id;
	private String nome;	
	private String cpf;
	private String login;
	private String perfil;
	private Boolean active;
}
