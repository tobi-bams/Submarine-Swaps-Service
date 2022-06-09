import express, { Application } from "express";
import cors from "cors";
import { testRPC } from "./psbt-test";

const app: Application = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({ msg: "Express server is running" });
});

testRPC();

const PORT = process.env.port || 5000;

app.listen(PORT, () => {
  console.log("Server up and running");
});
