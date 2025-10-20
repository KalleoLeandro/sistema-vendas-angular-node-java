package br.com.vendas.vendas.models.requests;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
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
public class AtualizacaoProdutoRequest {
	

	@Schema(description = "Id do produto", example = "10", requiredMode = Schema.RequiredMode.REQUIRED)
	@NotNull(message = "O id não pode estar vazio")	
	private int id;
	
	@Schema(description = "Nome completo do produto", example = "João da Silva", requiredMode = Schema.RequiredMode.REQUIRED)
	@NotEmpty(message = "O nome não pode estar vazio")
	@NotBlank(message = "O nome não pode estar vazio")
	private String nome;

	@Schema(description = "Preço de Custo", example = "12.50", requiredMode = Schema.RequiredMode.REQUIRED)
	@Min(value = 0,message = "O precoCusto não pode ser menor que 0")
	private double precoCusto;

	@Schema(description = "Preço de Venda", example = "15.00", requiredMode = Schema.RequiredMode.REQUIRED)
	@Min(value = 0,message = "O precoVenda não pode ser menor que 0")
	private double precoVenda;

	@Schema(description = "Quantidade", example = "1", requiredMode = Schema.RequiredMode.REQUIRED)
	@Min(value = 0,message = "A quantidade não pode ser menor que 0")
	private int quantidade;
	
	@Schema(description = "Medida", example = "1", requiredMode = Schema.RequiredMode.REQUIRED)
	@Min(value = 0,message = "A medida não pode ser menor que 0")
	private int medida;
	
	@Schema(description = "Categoria", example = "1", requiredMode = Schema.RequiredMode.REQUIRED)
	@Min(value = 0,message = "A categoria não pode ser menor que 0")
	private int categoria;

}
