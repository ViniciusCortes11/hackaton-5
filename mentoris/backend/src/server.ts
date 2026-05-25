import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (_, res) => {
  res.json({ status: "API online" });
});

app.use("/auth", authRoutes);

app.listen(3333, () => {
  console.log("Servidor rodando na porta 3333");
});
