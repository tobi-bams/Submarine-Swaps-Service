import express, { Application } from "express";
import cors from "cors";
import { testRPC } from "./psbt-test";
import Lightning from "./routes/lightning";
import Invoice from "./routes/pay-invoice";
const { sequelize } = require("./models");
import { connectLnd } from "./utils/lightning-rpc";

const app: Application = express();
app.use(cors());
app.use(express.json());

app.use("/lightning", Lightning);
app.use("/invoice", Invoice);

app.get("/", (req, res) => {
  res.status(200).json({ msg: "Express server is running" });
});

testRPC();

const PORT = process.env.port || 5000;

app.listen(PORT, async () => {
  try {
    await sequelize.authenticate();
    console.log("Database Connected Successfully");
    console.log("Server up and running");
  } catch (error) {
    console.log(error);
  }
});
