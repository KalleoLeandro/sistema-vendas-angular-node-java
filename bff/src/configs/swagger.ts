import { environments } from "environments/environments";

export const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'API Vendas',
    version: '1.0.0',
    description: 'Documentação da API',
  },
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
      url: environments.PORT,
    },
  ],
};

export const options = {
  swaggerDefinition,
  apis: [  './src/routes/**/*.ts',
    './src/controllers/**/*.ts'], // ou seus controllers
};