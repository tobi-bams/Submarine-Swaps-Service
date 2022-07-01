import express, { Request, Response, Router } from "express";
import { verifyLightningInvoice } from "../controller/verify-lightning";

const route: Router = express.Router();

route.post("/verify", async (req: Request, response: Response) => {
  const invoice = await verifyLightningInvoice(
    req.body.invoice,
    req.body.network
  );
  response.status(invoice.status).json(invoice.body);
});

export default route;
