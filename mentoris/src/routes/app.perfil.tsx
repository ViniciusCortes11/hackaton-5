import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useApp } from "@/lib/app-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { LogOut, KeyRound, Save, Star, Repeat2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { avaliacoes } from "@/lib/mock-data";

export const Route = createFileRoute("/app/perfil")({
  component: PerfilPage,
});

function PerfilPage() {
  const { user, setUser, toggleTipo } = useApp();
  const navigate = useNavigate();
  const [nome, setNome] = useState("");
  const [curso, setCurso] = useState("");
  const [periodo, setPeriodo] = useState("");
  const [disciplinas, setDisciplinas] = useState("");
  const [disponibilidade, setDisponibilidade] = useState("");
  const [descricao, setDescricao] = useState("");

  useEffect(() => {
    if (user) {
      setNome(user.nome);
      setCurso(user.curso);
      setPeriodo(String(user.periodo));
      setDisciplinas(user.disciplinas.join(", "));
      setDisponibilidade((user.disponibilidade || []).join(", "));
      setDescricao(user.descricao || user.objetivos || "");
    }
  }, [user]);

  if (!user) return null;

  const save = () => {
    setUser({
      ...user,
      nome,
      curso,
      periodo: Number(periodo) || 1,
      disciplinas: disciplinas.split(",").map((d) => d.trim()).filter(Boolean),
      disponibilidade: disponibilidade.split(",").map((d) => d.trim()).filter(Boolean),
      descricao,
    });
    toast.success("Perfil atualizado!");
  };

  const logout = () => {
    setUser(null);
    toast.success("Você saiu da conta.");
    navigate({ to: "/" });
  };

  return (
    <div className="mx-auto max-w-5xl px-4 md:px-8 py-6 md:py-10 space-y-6 animate-fade-in">
      <header className="space-y-1">
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Meu perfil</h1>
        <p className="text-sm text-muted-foreground">Gerencie seus dados, preferências e disponibilidade.</p>
      </header>

      <Card>
        <CardContent className="p-6 flex items-center gap-5">
          <div className="size-16 rounded-2xl bg-primary/15 grid place-items-center text-xl font-bold text-primary">
            {user.avatar}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold truncate">{user.nome}</div>
            <div className="text-xs text-muted-foreground">Matrícula {user.matricula}</div>
            <div className="mt-1.5 flex gap-2">
              <Badge variant="secondary" className="capitalize">{user.tipo}</Badge>
              <Badge variant="outline" className="font-normal">{user.curso}</Badge>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={() => { toggleTipo(); toast.success("Tipo de perfil alterado."); }}>
            <Repeat2 className="size-4 mr-1.5" /> Alternar tipo
          </Button>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-3 gap-4">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Informações pessoais</CardTitle>
            <CardDescription>Atualize seus dados acadêmicos.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nome</Label>
                <Input value={nome} onChange={(e) => setNome(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Matrícula</Label>
                <Input value={user.matricula} disabled />
              </div>
              <div className="space-y-2">
                <Label>Curso</Label>
                <Input value={curso} onChange={(e) => setCurso(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Período</Label>
                <Input type="number" value={periodo} onChange={(e) => setPeriodo(e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Disciplinas {user.tipo === "mentor" ? "que você mentora" : "de interesse"}</Label>
              <Input value={disciplinas} onChange={(e) => setDisciplinas(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Disponibilidade</Label>
              <Input value={disponibilidade} onChange={(e) => setDisponibilidade(e.target.value)} placeholder="Seg 18h-20h, Qua 19h-21h" />
            </div>
            <div className="space-y-2">
              <Label>{user.tipo === "mentor" ? "Descrição" : "Objetivos"}</Label>
              <Textarea value={descricao} onChange={(e) => setDescricao(e.target.value)} rows={3} />
            </div>
            <Button onClick={save}>
              <Save className="size-4 mr-1.5" /> Salvar alterações
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Configurações rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start" onClick={() => toast("Em breve.")}>
                <KeyRound className="size-4 mr-2" /> Alterar senha
              </Button>
              <Button variant="outline" className="w-full justify-start text-destructive hover:text-destructive" onClick={logout}>
                <LogOut className="size-4 mr-2" /> Sair da conta
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Avaliações recentes</CardTitle>
              <CardDescription>O que dizem sobre suas mentorias</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {avaliacoes.slice(0, 3).map((a) => (
                <div key={a.id} className="rounded-lg border border-border/60 p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">{a.autor}</span>
                    <span className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`size-3 ${i < a.nota ? "fill-warning text-warning" : "text-muted"}`} />
                      ))}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">{a.comentario}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
