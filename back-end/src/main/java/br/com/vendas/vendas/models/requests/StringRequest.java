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
public class StringRequest {

	@Schema(description = "String a ser testada", example = "teste", requiredMode = Schema.RequiredMode.REQUIRED)
	@NotEmpty(message = "A string não pode estar vazia")
	@NotBlank(message = "A login não pode estar vazia")
	private String cpf;
}
