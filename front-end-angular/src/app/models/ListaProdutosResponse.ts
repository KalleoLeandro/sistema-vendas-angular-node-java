import { CadastroProdutoResponse } from "./CadastroProdutoResponse";

export interface ListaProdutosResponse {
    lista: CadastroProdutoResponse[];
    total: number;
}