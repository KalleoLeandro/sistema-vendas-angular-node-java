import Router from "express";
import * as testeController from "@controllers/testeController";

const testeRoutes = Router();

/**
 * @swagger
 * /teste:
 *   get:
 *     summary: Teste de endpoint
 *     tags:
 *       - Teste
 *     responses:
 *       200:
 *         description: Teste Ok
 */
testeRoutes.get("/teste", testeController.teste);

export default testeRoutes;