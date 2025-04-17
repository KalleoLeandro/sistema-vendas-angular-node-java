import { environments } from "environments/environments";
import { createLogger, format, transports } from "winston";

export const decriptografia = (hash: string) => {
    const privateKeyPem = environments.PRIVATE_KEY;

    const privateKey = forge.pki.privateKeyFromPem(privateKeyPem);

    //const buffer = Buffer.from(hash, 'base64').toString();

    const mensagem = privateKey.decrypt(forge.util.decode64(hash));

    return mensagem;
}

const customFormat = format.printf(({ level, message, timestamp }) => {
    return `${timestamp} [${level}]: ${message}`;
});

export const logger: any = createLogger({
    level: 'info',
    format: format.combine(
        format.timestamp({ format: 'DD/MM/YYYY HH:mm:ss' }),
        customFormat
    ),
    transports: [
       
        new transports.Console({
            format: format.combine(
                format.colorize(),
                format.timestamp({ format: 'DD/MM/YYYY HH:mm:ss' }),
                customFormat
            )
        }),
       
        new transports.File({ 
            filename: 'logs/application.log',
            format: format.combine(
                format.timestamp({ format: 'DD/MM/YYYY HH:mm:ss' }),
                customFormat
            )
        })
    ]
});