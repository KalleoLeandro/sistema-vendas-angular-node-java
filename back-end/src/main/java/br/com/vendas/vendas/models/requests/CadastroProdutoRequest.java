package br.com.vendas.vendas.models.requests;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
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
public class CadastroProdutoRequest {

	@Schema(description = "Nome de produto", example = "arroz", requiredMode = Schema.RequiredMode.REQUIRED)
	@NotEmpty(message = "O nome não pode estar vazio")
	@NotBlank(message = "O nome não pode estar vazio")
	private String nome;

	@Schema(description = "Preço de custo de produto", example = "10.50", requiredMode = Schema.RequiredMode.REQUIRED)	
	@Min(0)
	@Max(999999)
	private double precoCusto;

	@Schema(description = "Preço de venda de produto", example = "15.00", requiredMode = Schema.RequiredMode.REQUIRED)	
	private double precoVenda;

	@Schema(description = "Quantidade do produto", example = "10", requiredMode = Schema.RequiredMode.REQUIRED)
	@Min(0)
	private double quantidade;

	@Schema(description = "Tipo de medida", example = "1", requiredMode = Schema.RequiredMode.REQUIRED)
	@Min(0)	
	private int medida;

	@Schema(description = "Tipo de categoria", example = "1", requiredMode = Schema.RequiredMode.REQUIRED)
	@Min(0)	
	private int categoria;

}
