package br.com.vendas.vendas.models.requests;

import io.swagger.v3.oas.annotations.media.Schema;
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
public class CadastroLoginRequest {

	@Schema(description = "Nome completo do usuário", example = "João da Silva", requiredMode = Schema.RequiredMode.REQUIRED)
	@NotEmpty(message = "O nome não pode estar vazio")
	@NotBlank(message = "O nome não pode estar vazio")
	private String nome;

	@Schema(description = "CPF no formato 000.000.000-00", example = "123.456.789-00", requiredMode = Schema.RequiredMode.REQUIRED)
	@NotEmpty(message = "O cpf não pode estar vazio")
	@NotBlank(message = "O cpf não pode estar vazio")
	private String cpf;

	@Schema(description = "Nome de login do usuário", example = "joaosilva", requiredMode = Schema.RequiredMode.REQUIRED)
	@NotEmpty(message = "O login não pode estar vazio")
	@NotBlank(message = "O login não pode estar vazio")
	private String login;

	@Schema(description = "Senha do usuário", example = "Senha@123", requiredMode = Schema.RequiredMode.REQUIRED)

	@NotEmpty(message = "A senha não pode estar vazio")
	@NotBlank(message = "A senha não pode estar vazio")
	private String senha;

	@Schema(description = "Perfil do usuário (ex: admin, dev, user)", example = "dev", requiredMode = Schema.RequiredMode.REQUIRED)
	@NotEmpty(message = "O perfil não pode estar vazio")
	@NotBlank(message = "O perfil não pode estar vazio")
	private String perfil;

}
