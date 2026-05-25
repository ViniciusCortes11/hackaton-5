import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useApp } from "@/lib/app-context";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/onboarding")({
  component: OnboardingPage,
});

function OnboardingPage() {
  const { user, setUser } = useApp();
  const navigate = useNavigate();
  const [curso, setCurso] = useState("");
  const [periodo, setPeriodo] = useState("");
  const [disciplinas, setDisciplinas] = useState("");
  const [descricao, setDescricao] = useState("");
  const [disponibilidade, setDisponibilidade] = useState("");
  const [objetivos, setObjetivos] = useState("");

  useEffect(() => {
    if (user) {
      setCurso(user.curso || "");
      setPeriodo(String(user.periodo || ""));
    }
  }, [user]);

  if (!user) return null;
  const isMentor = user.tipo === "mentor";

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUser({
      ...user,
      curso,
      periodo: Number(periodo) || 1,
      disciplinas: disciplinas
        .split(",")
        .map((d) => d.trim())
        .filter(Boolean),
      descricao,
      disponibilidade: disponibilidade
        .split(",")
        .map((d) => d.trim())
        .filter(Boolean),
      objetivos,
    });
    toast.success("Perfil salvo!");
    navigate({ to: "/app/dashboard" });
  };

  return (
    <div className="min-h-screen px-4 py-10 grid place-items-center">
      <form onSubmit={onSubmit} className="w-full max-w-xl space-y-6 animate-fade-in">
        <div className="space-y-1 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            {isMentor ? "Crie seu perfil de mentor" : "Conte sobre seus estudos"}
          </h1>
          <p className="text-sm text-muted-foreground">
            Isso ajuda a conectar você com {isMentor ? "alunos compatíveis" : "mentores ideais"}.
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Curso</Label>
              <Input value={curso} onChange={(e) => setCurso(e.target.value)} placeholder="Engenharia de Software" />
            </div>
            <div className="space-y-2">
              <Label>Período</Label>
              <Input type="number" min="1" max="12" value={periodo} onChange={(e) => setPeriodo(e.target.value)} />
            </div>
          </div>

          <div className="space-y-2">
            <Label>{isMentor ? "Disciplinas que pode mentorar" : "Disciplinas com dificuldade"}</Label>
            <Input
              value={disciplinas}
              onChange={(e) => setDisciplinas(e.target.value)}
              placeholder="Cálculo I, Estruturas de Dados, ..."
            />
            <p className="text-xs text-muted-foreground">Separe por vírgulas.</p>
          </div>

          {isMentor ? (
            <>
              <div className="space-y-2">
                <Label>Descrição pessoal</Label>
                <Textarea
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  placeholder="Conte um pouco sobre você como mentor."
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>Disponibilidade</Label>
                <Input
                  value={disponibilidade}
                  onChange={(e) => setDisponibilidade(e.target.value)}
                  placeholder="Seg 18h-20h, Qua 19h-21h"
                />
              </div>
              <div className="space-y-2">
                <Label>Experiência acadêmica</Label>
                <Textarea
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  placeholder="Monitorias, iniciações científicas..."
                  rows={2}
                />
              </div>
            </>
          ) : (
            <div className="space-y-2">
              <Label>Objetivos da mentoria</Label>
              <Textarea
                value={objetivos}
                onChange={(e) => setObjetivos(e.target.value)}
                placeholder="O que você espera alcançar?"
                rows={3}
              />
            </div>
          )}
        </div>

        <Button type="submit" className="w-full" size="lg">
          Finalizar e acessar dashboard
        </Button>
      </form>
    </div>
  );
}
