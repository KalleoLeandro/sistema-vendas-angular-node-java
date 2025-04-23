import Router from "express";
import * as middleware from "@middlewares/middleware";
import * as utilsController from "@controllers/utilsController";

const utilsRoutes = Router();

/**
 * @swagger
 * /validar-cpf:
 *   post:
 *     summary: Validação de CPF
 *     tags:
 *       - Utils
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties: 
 *               cpf:
 *                 type: string
 *                 example: "222.333.444-05"                
 *     responses:
 *       200:
 *         description: Cpf validado, pode ser true ou false
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties: 
 *                 valido:
 *                   type: boolean
 *                   example: true  
 *       500:
 *         description: Erros ao validar o cpf
 *         content:
 *           application/json:
 *              schema:
 *                type: object
 *                properties: 
 *                  message:
 *                    type: string
 *                    example: "Erro ao validar o cpf"
 */
utilsRoutes.post('/validar-cpf', middleware.verificaTokenValido, utilsController.validarCpf);

export default utilsRoutes;