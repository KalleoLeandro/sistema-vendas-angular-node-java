import Router, { NextFunction } from "express";
import * as loginController from "@controllers/loginController";
import * as middleware from "@middlewares/middleware";

const loginRoutes = Router();

/**
 * @swagger
 * /validar-login:
 *   post:
 *     summary: Endpoint de autenticação
 *     tags:
 *       - Login
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               hash:
 *                 type: string
 *                 example: "abc123hash"
 *     responses:
 *       200:
 *         description: Login e/ou senha válidos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR..."
 *                 userName:
 *                   type: string
 *                   example: "User Teste"
 *                 expiration:
 *                   type: string
 *                   example: "01/01/2000"
 *                 status:
 *                   type: string
 *                   example: "200"
 *       401:
 *         description: Login e/ou senha inválidos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Login e/ou senha inválidos"
 *                 status:
 *                   type: string
 *                   example: "401"
 *       500:
 *         description: Erro ao validar o login
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Erro ao validar o login"
 *                 status:
 *                   type: string
 *                   example: "500"
 */
loginRoutes.post("/validar-login", loginController.validarLogin);

/**
 * @swagger
 * /validar-token:
 *   post:
 *     summary: Login de autenticação
 *     tags:
 *       - Login
 *     responses:
 *       200:
 *         description: Token testado (pode ser true ou false)
 *         content:
 *           application/json:
 *             schema:
 *               type: boolean
 *               example: true
 *       500:
 *         description: Erro ao validar o token
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "Erro ao validar o token"
 */
loginRoutes.post("/validar-token", loginController.validarToken);

/**
 * @swagger
 * /cadastrar-login:
 *   post:
 *     summary: Cadastro de Login
 *     tags:
 *       - Login
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *                 example: "José da Silva"
 *               cpf:
 *                 type: string
 *                 example: "222.333.444-05"
 *               login:
 *                 type: string
 *                 example: "jose123"
 *               senha:
 *                 type: string
 *                 example: "jose@123"
 *               perfil:
 *                 type: string
 *                 example: "admin"
 *     responses:
 *       200:
 *         description: Cadastro realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example: {}
 *       500:
 *         description: Erro ao cadastrar o login
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "Erro ao cadastrar o login"
 */
loginRoutes.post("/cadastrar-login", middleware.verificaTokenValido, loginController.cadastrarLogin);

/**
 * @swagger
 * /atualizar-login:
 *   put:
 *     summary: Atualização de Login
 *     tags:
 *       - Login
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: number
 *                 example: 10
 *               nome:
 *                 type: string
 *                 example: "José da Silva"
 *               cpf:
 *                 type: string
 *                 example: "222.333.444-05"
 *               login:
 *                 type: string
 *                 example: "jose123"
 *               senha:
 *                 type: string
 *                 example: "jose@123"
 *               perfil:
 *                 type: string
 *                 example: "admin"
 *     responses:
 *       204:
 *         description: Login atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example: {}
 *       500:
 *         description: Erro ao atualizar o login
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Erro ao atualizar o login"
 */
loginRoutes.put("/atualizar-login", middleware.verificaTokenValido, loginController.atualizarLogin);

/**
 * @swagger
 * /buscar-por-id/{id}:
 *   get:
 *     summary: Buscar Login por ID
 *     tags:
 *       - Login
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do login a ser localizado
 *     responses:
 *       200:
 *         description: Login encontrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: number
 *                   example: 10
 *                 nome:
 *                   type: string
 *                   example: "José da Silva"
 *                 cpf:
 *                   type: string
 *                   example: "222.333.444-05"
 *                 login:
 *                   type: string
 *                   example: "jose123"
 *                 senha:
 *                   type: string
 *                   example: "jose@123"
 *                 perfil:
 *                   type: string
 *                   example: "admin"
 *       204:
 *         description: Login não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Usuário não localizado"
 *       500:
 *         description: Erro ao buscar o login
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Erro ao buscar o login"
 */
loginRoutes.get("/buscar-por-id/:id", middleware.verificaTokenValido, loginController.buscarPorId);

/**
 * @swagger
 * /buscar-por-pagina:
 *   get:
 *     summary: Buscar uma lista paginada de logins
 *     tags:
 *       - Login
 *     parameters:
 *       - in: query
 *         name: page
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Número da página (inicia em 1)
 *       - in: query
 *         name: limit
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Quantidade de registros por página
 *     responses:
 *       200:
 *         description: Lista de logins encontrada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                   example: 50
 *                 lista:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 10
 *                       nome:
 *                         type: string
 *                         example: "José da Silva"
 *                       cpf:
 *                         type: string
 *                         example: "222.333.444-05"
 *                       login:
 *                         type: string
 *                         example: "jose123"
 *                       senha:
 *                         type: string
 *                         example: "jose@123"
 *                       perfil:
 *                         type: string
 *                         example: "admin"
 *       204:
 *         description: Não há itens cadastrados
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Não há itens cadastrados"
 *       500:
 *         description: Erro ao buscar os logins
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Erro ao buscar os logins"
 */
loginRoutes.get("/buscar-por-pagina", middleware.verificaTokenValido, loginController.buscarPorPagina);


export default loginRoutes;
