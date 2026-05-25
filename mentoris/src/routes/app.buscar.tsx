import { createFileRoute, Link } from "@tanstack/react-router";
import { mentors } from "@/lib/mock-data";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Star, Heart, MessageSquare, Filter, Clock } from "lucide-react";
import { useApp } from "@/lib/app-context";
import { useMemo, useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/app/buscar")({
  component: BuscarPage,
});

function BuscarPage() {
  const { favoritos, toggleFavorito } = useApp();
  const [q, setQ] = useState("");
  const [disciplina, setDisciplina] = useState("all");
  const [order, setOrder] = useState<"avaliacao" | "alunos">("avaliacao");

  const todasDisciplinas = useMemo(() => {
    const set = new Set<string>();
    mentors.forEach((m) => m.disciplinas.forEach((d) => set.add(d)));
    return Array.from(set);
  }, []);

  const filtered = useMemo(() => {
    let list = mentors.filter((m) => {
      const matchQ = q
        ? m.nome.toLowerCase().includes(q.toLowerCase()) ||
          m.curso.toLowerCase().includes(q.toLowerCase()) ||
          m.disciplinas.some((d) => d.toLowerCase().includes(q.toLowerCase()))
        : true;
      const matchD = disciplina === "all" || m.disciplinas.includes(disciplina);
      return matchQ && matchD;
    });
    list = [...list].sort((a, b) =>
      order === "avaliacao" ? b.avaliacao - a.avaliacao : b.alunos - a.alunos
    );
    return list;
  }, [q, disciplina, order]);

  return (
    <div className="mx-auto max-w-7xl px-4 md:px-8 py-6 md:py-10 space-y-6 animate-fade-in">
      <header className="space-y-1">
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Buscar mentores</h1>
        <p className="text-sm text-muted-foreground">
          Encontre alunos experientes compatíveis com seu curso e disciplinas.
        </p>
      </header>

      <Card>
        <CardContent className="p-4 flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar por nome, curso ou disciplina..."
              className="pl-9"
            />
          </div>
          <Select value={disciplina} onValueChange={setDisciplina}>
            <SelectTrigger className="md:w-[200px]">
              <Filter className="size-3.5 mr-1" />
              <SelectValue placeholder="Disciplina" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas disciplinas</SelectItem>
              {todasDisciplinas.map((d) => (
                <SelectItem key={d} value={d}>{d}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={order} onValueChange={(v) => setOrder(v as any)}>
            <SelectTrigger className="md:w-[180px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="avaliacao">Melhor avaliação</SelectItem>
              <SelectItem value="alunos">Mais alunos atendidos</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {filtered.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center space-y-2">
            <div className="size-12 rounded-full bg-muted mx-auto grid place-items-center">
              <Search className="size-5 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium">Nenhum mentor encontrado</p>
            <p className="text-xs text-muted-foreground">Tente ajustar os filtros.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((m) => {
            const isFav = favoritos.includes(m.id);
            return (
              <Card key={m.id} className="hover:border-primary/40 transition-colors group">
                <CardContent className="p-5 space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="size-12 rounded-full bg-primary/15 grid place-items-center text-sm font-semibold text-primary">
                      {m.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="font-semibold truncate">{m.nome}</div>
                          <div className="text-xs text-muted-foreground truncate">
                            {m.curso} · {m.periodo}º período
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            toggleFavorito(m.id);
                            toast.success(isFav ? "Removido dos favoritos" : "Adicionado aos favoritos");
                          }}
                          className="text-muted-foreground hover:text-destructive transition-colors"
                          aria-label="Favoritar"
                        >
                          <Heart className={`size-4 ${isFav ? "fill-destructive text-destructive" : ""}`} />
                        </button>
                      </div>
                      <div className="flex items-center gap-1 text-xs mt-1.5">
                        <Star className="size-3.5 fill-warning text-warning" />
                        <span className="font-medium">{m.avaliacao}</span>
                        <span className="text-muted-foreground">· {m.alunos} alunos</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {m.disciplinas.slice(0, 3).map((d) => (
                      <Badge key={d} variant="secondary" className="font-normal text-[11px]">{d}</Badge>
                    ))}
                  </div>

                  <div className="text-xs text-muted-foreground flex items-center gap-1.5">
                    <Clock className="size-3.5" /> {m.disponibilidade[0]}
                  </div>

                  <div className="flex gap-2">
                    <Link to="/app/mentor/$id" params={{ id: m.id }} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full">Ver perfil</Button>
                    </Link>
                    <Button
                      size="sm"
                      onClick={() => toast.success(`Solicitação enviada para ${m.nome.split(" ")[0]}.`)}
                    >
                      Solicitar
                    </Button>
                    <Link to="/app/chat" search={{ mentor: m.id }}>
                      <Button size="sm" variant="ghost" aria-label="Conversar">
                        <MessageSquare className="size-4" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
