import Router from "express";
import * as testeController from "@controllers/testeController";

const routes = Router();


routes.get("/teste", testeController.teste);

export default routes;