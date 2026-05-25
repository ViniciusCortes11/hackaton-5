import { createFileRoute } from "@tanstack/react-router";
import { mentorias as mockMentorias, type Mentoria } from "@/lib/mock-data";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MoreHorizontal, CheckCircle2, XCircle, CalendarPlus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Route = createFileRoute("/app/mentorias")({
  component: MentoriasPage,
});

const statusColor: Record<Mentoria["status"], string> = {
  Pendente: "bg-warning/15 text-warning border-warning/30",
  Confirmada: "bg-primary/15 text-primary border-primary/30",
  Concluída: "bg-muted text-muted-foreground border-border",
  Cancelada: "bg-destructive/10 text-destructive border-destructive/30",
};

function MentoriasPage() {
  const [items, setItems] = useState<Mentoria[]>(mockMentorias);
  const [tab, setTab] = useState<"todas" | Mentoria["status"]>("todas");

  const update = (id: string, status: Mentoria["status"]) => {
    setItems((prev) => prev.map((m) => (m.id === id ? { ...m, status } : m)));
    toast.success(`Mentoria marcada como ${status.toLowerCase()}.`);
  };

  const filtered = tab === "todas" ? items : items.filter((m) => m.status === tab);

  return (
    <div className="mx-auto max-w-6xl px-4 md:px-8 py-6 md:py-10 space-y-6 animate-fade-in">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Minhas mentorias</h1>
          <p className="text-sm text-muted-foreground">Acompanhe agendamentos e histórico.</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <CalendarPlus className="size-4 mr-1.5" /> Agendar nova
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nova mentoria</DialogTitle>
              <DialogDescription>
                Selecione um mentor pela busca para iniciar uma nova mentoria.
              </DialogDescription>
            </DialogHeader>
            <div className="text-sm text-muted-foreground">
              Em breve: agendamento direto a partir desta tela.
            </div>
          </DialogContent>
        </Dialog>
      </header>

      <Tabs value={tab} onValueChange={(v) => setTab(v as any)}>
        <TabsList className="grid grid-cols-5 w-full max-w-2xl">
          <TabsTrigger value="todas">Todas</TabsTrigger>
          <TabsTrigger value="Pendente">Pendentes</TabsTrigger>
          <TabsTrigger value="Confirmada">Confirmadas</TabsTrigger>
          <TabsTrigger value="Concluída">Concluídas</TabsTrigger>
          <TabsTrigger value="Cancelada">Canceladas</TabsTrigger>
        </TabsList>

        <TabsContent value={tab} className="mt-5">
          {filtered.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center space-y-2">
                <div className="size-12 rounded-full bg-muted mx-auto grid place-items-center">
                  <Calendar className="size-5 text-muted-foreground" />
                </div>
                <p className="text-sm font-medium">Nenhuma mentoria nesta categoria</p>
                <p className="text-xs text-muted-foreground">Suas mentorias aparecerão aqui.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2.5">
              {filtered.map((m) => (
                <Card key={m.id} className="hover:border-primary/30 transition-colors">
                  <CardContent className="p-4 flex flex-wrap md:flex-nowrap items-center gap-4">
                    <div className="size-11 rounded-full bg-primary/15 grid place-items-center text-xs font-semibold text-primary shrink-0">
                      {m.mentorNome.split(" ").map((p) => p[0]).slice(0, 2).join("")}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{m.mentorNome}</div>
                      <div className="text-xs text-muted-foreground truncate">{m.disciplina}</div>
                    </div>
                    <div className="hidden sm:flex items-center gap-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="size-3.5" />
                        {new Date(m.data).toLocaleDateString("pt-BR")}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="size-3.5" />
                        {m.horario}
                      </span>
                    </div>
                    <Badge variant="outline" className={statusColor[m.status]}>{m.status}</Badge>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => update(m.id, "Confirmada")}>
                          <CheckCircle2 className="size-4 mr-2" /> Confirmar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => update(m.id, "Concluída")}>
                          <CheckCircle2 className="size-4 mr-2" /> Marcar como concluída
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => update(m.id, "Cancelada")}>
                          <XCircle className="size-4 mr-2" /> Cancelar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
