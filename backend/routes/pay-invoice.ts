import express, { Request, Response, Router } from "express";
import { connectLnd } from "../utils/lightning-rpc";

const router: Router = express.Router();

router.post("/pay", async (req: Request, res: Response) => {
  const pre_image = await connectLnd(req.body.invoice);
  res.status(200).json({ pre_image });
});

export default router;
