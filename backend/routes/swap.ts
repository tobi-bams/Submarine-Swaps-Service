import express, { Router, Request, Response } from "express";
import { SwapStatus } from "../controller/swapStatus";

const route: Router = express.Router();

route.get("/status", async (req: Request, res: Response) => {
  const status = await SwapStatus(req.body.address);
  res.status(status.status).json(status.body);
});

export default route;
