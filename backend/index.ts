import express, { Application } from "express";
import cors from "cors";
import { testRPC } from "./psbt-test";
import Lightning from "./routes/lightning";
import Invoice from "./routes/pay-invoice";
const { sequelize } = require("./models");
import { connectLnd } from "./utils/lightning-rpc";
import { ClaimFundsController } from "./controller/claimFunds";
import { RefundFundsController } from "./controller/refundToCustomer";

const app: Application = express();
app.use(cors());
app.use(express.json());

app.use("/lightning", Lightning);
app.use("/invoice", Invoice);

app.get("/", (req, res) => {
  res.status(200).json({ msg: "Express server is running" });
});

// testRPC();
const invoice =
  "lnbcrt1u1p3vs2t3pp5xfrgypr7hyxammgyv30xgg04zqcmkt32xjts44wjnmfm3hf8v0fqdqqcqzpgxqyz5vqsp5ul965n67wca0ree6agdevh77y8k4lf6vy64w8aer92suvm3fvfvq9qyyssq43saa5gf7w68d2l66kclgaxjjjhjyleq0yxnmzh4e3ucwegjqtx9myfh7trynr624yfkttkwy7nrtgydrwjyyvgz07n3ve0glmfu0fqqzzzq7q";
ClaimFundsController(invoice);
RefundFundsController(invoice);

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
