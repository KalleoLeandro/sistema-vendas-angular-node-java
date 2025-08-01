import { LoginReponse } from "@models/LoginReponse";
import { LoginRequest } from "@models/LoginRequest";
import { environment } from "environments/environment";
import * as forge from "node-forge";

export const criptografia = (login: LoginRequest) =>{    
    const publicKeyForge = forge.pki.publicKeyFromPem(environment.PUBLIC_KEY);
    const encryptedData = forge.util.encode64(publicKeyForge.encrypt(JSON.stringify(login)));
    return encryptedData;
}