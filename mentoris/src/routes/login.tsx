import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GraduationCap } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { authenticate } from "@/lib/storage";
import { useApp } from "@/lib/app-context";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const { user, setUser } = useApp();
  const [matricula, setMatricula] = useState("");
  const [senha, setSenha] = useState("");

  

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!matricula || !senha) {
      toast.error("Preencha matrícula e senha.");
      return;
    }

    const usuarioEncontrado = authenticate(
      matricula,
      senha,
    );

    if (!usuarioEncontrado) {
      toast.error("Perfil não encontrado");
      return;
    }

    setUser({
      nome: usuarioEncontrado.nome,
      matricula: usuarioEncontrado.matricula,
      curso: usuarioEncontrado.curso,
      periodo: usuarioEncontrado.periodo,
      tipo: usuarioEncontrado.tipo,
      avatar: usuarioEncontrado.nome
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2),
      disciplinas: ["Cálculo I"],
    });

    toast.success("Bem-vindo de volta!");
    navigate({ to: "/app/dashboard" });
  };

  return (
    <div className="min-h-screen grid place-items-center px-4">
      <div className="w-full max-w-sm space-y-6 animate-fade-in">
        <Link to="/" className="flex items-center gap-2 justify-center">
          <div className="size-9 rounded-xl bg-primary/15 grid place-items-center">
            <GraduationCap className="size-5 text-primary" />
          </div>
          <span className="font-bold text-lg">Mentoris</span>
        </Link>
        <div className="rounded-2xl border border-border bg-card p-6 space-y-5">
          <div className="space-y-1">
            <h1 className="text-xl font-semibold">Entrar</h1>
            <p className="text-sm text-muted-foreground">Acesse sua conta para continuar.</p>
          </div>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="matricula">Matrícula</Label>
              <Input id="matricula" placeholder="2024001" value={matricula} onChange={(e) => setMatricula(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="senha">Senha</Label>
              <Input id="senha" type="password" placeholder="••••••••" value={senha} onChange={(e) => setSenha(e.target.value)} />
            </div>
            <Button type="submit" className="w-full">Entrar</Button>
          </form>
          <p className="text-sm text-muted-foreground text-center">
            Não tem conta?{" "}
            <Link to="/signup" className="text-primary hover:underline">Cadastre-se</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
