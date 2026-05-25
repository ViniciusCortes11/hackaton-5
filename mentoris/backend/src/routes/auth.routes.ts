import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma";

const router = Router();

router.post("/register", async (req, res) => {
  const { nome, matricula, senha, curso, periodo, tipo } = req.body;

  const userExists = await prisma.user.findUnique({
    where: { matricula }
  });

  if (userExists) {
    return res.status(400).json({ error: "Usuário já existe" });
  }

  const senhaHash = await bcrypt.hash(senha, 10);

  const user = await prisma.user.create({
    data: {
      nome,
      matricula,
      senha: senhaHash,
      curso,
      periodo,
      tipo
    }
  });

  return res.json(user);
});

router.post("/login", async (req, res) => {
  const { matricula, senha } = req.body;

  const user = await prisma.user.findUnique({
    where: { matricula }
  });

  if (!user) {
    return res.status(401).json({ error: "Usuário inválido" });
  }

  const senhaCorreta = await bcrypt.compare(senha, user.senha);

  if (!senhaCorreta) {
    return res.status(401).json({ error: "Senha inválida" });
  }

  const token = jwt.sign(
    { id: user.id },
    process.env.JWT_SECRET as string,
    { expiresIn: "7d" }
  );

  return res.json({
    token,
    user
  });
});

export default router;
