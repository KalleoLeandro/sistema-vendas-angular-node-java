import { CadastroLoginResponse } from "./CadastroLoginResponse";

export interface ListaUsuariosResponse {
    lista: CadastroLoginResponse[];
    total: number;
}