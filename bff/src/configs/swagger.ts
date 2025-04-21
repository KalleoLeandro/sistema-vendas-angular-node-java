import { environments } from "environments/environments";

export const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'API Vendas',
    version: '1.0.0',
    description: 'Documentação da API',
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
  tags: [
    {
      name: 'Teste',
      description: 'Operação de Teste de endpoint',
    },
    {
      name: 'Login',
      description: 'Operações relacionadas a login e token',
    },
  ],
  servers: [
    {
      url: `http://localhost:${environments.PORT}`,
    },
  ],
};

export const options = {
  swaggerDefinition,
  apis: [  './src/routes/**/*.ts',
    './src/controllers/**/*.ts'], // ou seus controllers
};