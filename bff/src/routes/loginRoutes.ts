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
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *                    example: "Login e/ou senha inválidos"
 *                  status:
 *                    type: string
 *                    example: "401" 
 *                
 *       500:
 *         description: Erro ao validar o login
 *         content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *                    example: "Erro ao validar o login"
 *                  status:
 *                    type: string
 *                    example: "500" 
 *                
 */
loginRoutes.post("/validar-login", loginController.validarLogin);

/**
 * @swagger
 * /validar-token:
 *   post:
 *     summary: Endpoints de Login
 *     tags:
 *       - Login
 *     parameters:
 *       - in: header
 *         name: authorization
 *         required: true
 *         schema:
 *           type: string
 *         description: Token JWT do usuário
 *     responses:
 *       200:
 *         description: Token testado(pode ser true ou false) 
 *         content:
 *            application/json:
 *              schema:
 *                type: boolean
 *                example: true 
 *                     
 *       500:
 *         description: Erros ao validar o token * 
 *         content:
 *            application/json:
 *              schema:
 *                type: string 
 *                example: "Erro ao validar o token" 
 */
loginRoutes.post("/validar-token", loginController.validarToken);

export default loginRoutes;