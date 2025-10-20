package br.com.vendas.vendas.models.responses;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class ProdutoCadastroResponse {

	private int id;
	private String nome;
	private double precoCusto;
	private double precoVenda;
	private int quantidade;
	private int medida;
	private int categoria;
}
