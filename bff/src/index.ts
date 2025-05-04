import { environments } from "environments/environments";
import express, { Request, Response } from "express";
import { logger } from "utils/utils";
import { Logger } from "winston";
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { options } from "configs/swagger";
import testeRoutes from "@routes/testeRoutes";
import cors from "cors";
import loginRoutes from "@routes/loginRoutes";
import utilsRoutes from "@routes/utilsRoutes";
import client from 'prom-client';

const server = express();

const log: Logger = logger;

server.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"]
}));

server.use(express.json());

server.use(express.urlencoded({ extended: true }));

const swaggerSpec = swaggerJSDoc(options);

server.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const register = new client.Registry();

client.collectDefaultMetrics({ register });

server.use(testeRoutes);
server.use(loginRoutes);
server.use(utilsRoutes);

server.get('/metrics', async (req: Request, res: Response) => {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
});

server.use((req: Request, res: Response) => {
    res.status(404).json('Recurso não encontrado!');
});

server.listen(environments.PORT, () => {
    log.info(`Servidor rodando na porta ${environments.PORT}`);
});