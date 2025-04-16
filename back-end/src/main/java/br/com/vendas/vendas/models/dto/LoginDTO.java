package br.com.vendas.vendas.models.dto;

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
public class LoginDTO {
	
	private String nome;
	private String cpf;
	private String perfil;

}
