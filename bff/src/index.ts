import { environments } from "environments/environments";
import express, { Request, Response } from "express";
import { logger } from "utils/utils";
import { Logger } from "winston";
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { options } from "configs/swagger";
import testeRoutes from "@routes/testeRoutes";

const server = express();

const log:Logger = logger;

server.use(express.json());

server.use(express.urlencoded({ extended: true }));

const swaggerSpec = swaggerJSDoc(options);

server.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

server.use(testeRoutes);

server.use((req:Request, res:Response)=>{
    res.status(404).json('Recurso não encontrado!');
});

server.listen(environments.PORT, ()=>{
    log.info(`Servidor rodando na porta ${environments.PORT}`);
});