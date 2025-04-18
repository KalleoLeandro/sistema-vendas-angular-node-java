import { environments } from "environments/environments";
import express, { Request, Response } from "express";
import cookieParser from 'cookie-parser';
import { logger } from "utils/utils";
import { Logger } from "winston";
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { options } from "configs/swagger";
import testeRoutes from "@routes/testeRoutes";
import cors from "cors";
import loginRoutes from "@routes/loginRoutes";

const server = express();

const log: Logger = logger;

server.use(cors({
    origin: "http://localhost:4200",
    methods: ["GET", "POST", "PUT", "PATCH","DELETE"]
}));

server.use(express.json());

server.use(express.urlencoded({ extended: true }));

const swaggerSpec = swaggerJSDoc(options);

server.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

server.use(testeRoutes);
server.use(loginRoutes);

server.use((req: Request, res: Response) => {
    res.status(404).json('Recurso não encontrado!');
});

server.listen(environments.PORT, () => {
    log.info(`Servidor rodando na porta ${environments.PORT}`);
});