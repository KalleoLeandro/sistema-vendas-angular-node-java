import routes from "@routes/routes";
import { environments } from "environments/environments";
import express, { Request, Response } from "express";
import path from "path";
import { logger } from "utils/utils";
import { Logger } from "winston";

const server = express();

const log:Logger = logger;

server.use(express.json());

server.use(express.static(path.join(__dirname, '../public')));

server.use(express.urlencoded({ extended: true }));

server.use(routes);

server.use((req:Request, res:Response)=>{
    res.status(404).json('Recurso não encontrado!');
});

server.listen(environments.PORT, ()=>{
    log.info(`Servidor rodando na porta ${environments.PORT}`);
});