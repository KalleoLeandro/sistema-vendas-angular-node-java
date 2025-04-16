import { Request, Response } from "express";

export const teste = (req: Request, res: Response) => {
    res.status(200).json({ message: "Teste ok" });
}