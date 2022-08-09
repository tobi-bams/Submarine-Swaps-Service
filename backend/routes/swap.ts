import express, { Router, Request, Response } from "express";

const route: Router = express.Router();

route.get("/status", (req: Request, res: Response) => {});

export default route;
