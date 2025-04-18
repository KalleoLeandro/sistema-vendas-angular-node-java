import Router from "express";
import * as loginController from "@controllers/loginController";

const loginRoutes = Router();

/**
 * @swagger
 * /validar-login:
 *   post:
 *     summary: Endpoint de autenticação
 *     tags:
 *       - Login
 *     responses:
 *       200:
 *         description: Login e/ou senha válidos
 *       401:
 *         description: Login e/ou senha inválidos
 *       500:
 *         description: Erros ao validar o login
 */
loginRoutes.post("/validar-login", loginController.validarLogin);

/**
 * @swagger
 * //validar-token:
 *   post:
 *     summary: Endpoints de Login
 *     tags:
 *       - Login
 *     responses:
 *       200:
 *         description: Token testado(pode ser true ou false)       
 *       500:
 *         description: Erros ao validar o token
 */
loginRoutes.post("/validar-token", loginController.validarToken);

export default loginRoutes;