import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GraduationCap, Users, BookOpen, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useApp } from "@/lib/app-context";
import { saveUser } from "@/lib/storage";
import type { ProfileType } from "@/lib/mock-data";

export const Route = createFileRoute("/signup")({
  component: SignupPage,
});

function SignupPage() {
  const navigate = useNavigate();
  const { setUser } = useApp();
  const [step, setStep] = useState<1 | 2>(1);
  const [nome, setNome] = useState("");
  const [matricula, setMatricula] = useState("");
  const [senha, setSenha] = useState("");
  const [tipo, setTipo] = useState<ProfileType | null>(null);

  const onContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome || !matricula || !senha) {
      toast.error("Preencha todos os campos.");
      return;
    }
    setStep(2);
  };

  const onConfirm = () => {
    if (!tipo) {
      toast.error("Selecione um tipo de perfil.");
      return;
    }
    const initials = nome
      .split(" ")
      .map((p) => p[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
    saveUser({
      nome,
      matricula,
      senha,
      curso: "Engenharia de Software",
      periodo: 3,
      tipo,
    });

    setUser({
      nome,
      matricula,
      curso: "Engenharia de Software",
      periodo: 3,
      tipo,
      avatar: initials || "ME",
      disciplinas: [],
    });
    toast.success("Conta criada! Vamos completar seu perfil.");
    navigate({ to: "/onboarding" });
  };

  return (
    <div className="min-h-screen grid place-items-center px-4 py-10">
      <div className="w-full max-w-md space-y-6 animate-fade-in">
        <Link to="/" className="flex items-center gap-2 justify-center">
          <div className="size-9 rounded-xl bg-primary/15 grid place-items-center">
            <GraduationCap className="size-5 text-primary" />
          </div>
          <span className="font-bold text-lg">Mentoris</span>
        </Link>
        <div className="rounded-2xl border border-border bg-card p-6 space-y-5">
          {step === 1 ? (
            <>
              <div className="space-y-1">
                <h1 className="text-xl font-semibold">Criar conta</h1>
                <p className="text-sm text-muted-foreground">Comece sua jornada de mentorias.</p>
              </div>
              <form onSubmit={onContinue} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome completo</Label>
                  <Input id="nome" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Maria Silva" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mat">Matrícula</Label>
                  <Input id="mat" value={matricula} onChange={(e) => setMatricula(e.target.value)} placeholder="2024001" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="senha">Senha</Label>
                  <Input id="senha" type="password" value={senha} onChange={(e) => setSenha(e.target.value)} placeholder="••••••••" />
                </div>
                <Button type="submit" className="w-full">Continuar</Button>
              </form>
              <p className="text-sm text-muted-foreground text-center">
                Já tem conta?{" "}
                <Link to="/login" className="text-primary hover:underline">Entrar</Link>
              </p>
            </>
          ) : (
            <>
              <div className="space-y-1">
                <h1 className="text-xl font-semibold">Como você quer participar?</h1>
                <p className="text-sm text-muted-foreground">Você pode mudar depois nas configurações.</p>
              </div>
              <div className="grid gap-3">
                <ProfileOption
                  selected={tipo === "mentorado"}
                  onClick={() => setTipo("mentorado")}
                  icon={BookOpen}
                  title="Sou Mentorado"
                  desc="Quero apoio acadêmico de alunos experientes."
                />
                <ProfileOption
                  selected={tipo === "mentor"}
                  onClick={() => setTipo("mentor")}
                  icon={Users}
                  title="Sou Mentor"
                  desc="Quero orientar outros alunos."
                />
              </div>
              <Button onClick={onConfirm} className="w-full">Continuar</Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function ProfileOption({
  selected,
  onClick,
  icon: Icon,
  title,
  desc,
}: {
  selected: boolean;
  onClick: () => void;
  icon: any;
  title: string;
  desc: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-left rounded-xl border p-4 transition-all flex items-start gap-3 ${
        selected ? "border-primary bg-primary/5" : "border-border bg-card hover:border-primary/50"
      }`}
    >
      <div className={`size-10 rounded-lg grid place-items-center ${selected ? "bg-primary/15" : "bg-muted"}`}>
        <Icon className={`size-5 ${selected ? "text-primary" : "text-muted-foreground"}`} />
      </div>
      <div className="flex-1">
        <div className="font-medium text-sm">{title}</div>
        <div className="text-xs text-muted-foreground mt-0.5">{desc}</div>
      </div>
      {selected && <Check className="size-5 text-primary shrink-0" />}
    </button>
  );
}
