import express, { Router, Request, Response } from "express";
import { GenerateAddress } from "../controller/generateAddress";

const route: Router = express.Router();

route.post("/generate", async (req: Request, res: Response) => {
  const response = await GenerateAddress(req.body.invoice, req.body.network);
  return res.status(response.status).json(response.body);
});

export default route;
