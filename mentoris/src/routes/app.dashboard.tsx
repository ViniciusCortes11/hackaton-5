import { createFileRoute, Link } from "@tanstack/react-router";
import { useApp } from "@/lib/app-context";
import {
  mentoriasSemana,
  distribuicaoDisciplinas,
  recomendacoes,
  mentors,
} from "@/lib/mock-data";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users, Star, Clock, GraduationCap, TrendingUp, Calendar, Lightbulb, Sparkles, ArrowRight,
} from "lucide-react";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/app/dashboard")({
  component: DashboardPage,
});

function DashboardPage() {
  const { user } = useApp();
  const [periodo, setPeriodo] = useState("30d");

  if (!user) return null;
  const isMentor = user.tipo === "mentor";

  const kpis = isMentor
    ? [
        { label: "Mentorias realizadas", value: 42, icon: GraduationCap, hint: "+8 este mês" },
        { label: "Alunos atendidos", value: 18, icon: Users, hint: "+3 novos" },
        { label: "Avaliação média", value: "4.9", icon: Star, hint: "32 avaliações" },
        { label: "Horas acumuladas", value: "63h", icon: Clock, hint: "+12h no mês" },
      ]
    : [
        { label: "Mentorias realizadas", value: 12, icon: GraduationCap, hint: "+4 este mês" },
        { label: "Horas de mentoria", value: "18h", icon: Clock, hint: "+5h no mês" },
        { label: "Mentores conectados", value: 5, icon: Users, hint: "2 novos" },
        { label: "Meta de aprendizado", value: "72%", icon: TrendingUp, hint: "Quase lá!" },
      ];

  return (
    <div className="mx-auto max-w-7xl px-4 md:px-8 py-6 md:py-10 space-y-8 animate-fade-in">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">
            {isMentor ? "Painel do mentor" : "Painel do mentorado"}
          </p>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
            Olá, {user.nome.split(" ")[0]}.
          </h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <Select value={periodo} onValueChange={(v) => { setPeriodo(v); toast.success("Filtros atualizados"); }}>
            <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Últimos 7 dias</SelectItem>
              <SelectItem value="30d">Últimos 30 dias</SelectItem>
              <SelectItem value="all">Todo período</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="all">
            <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas disciplinas</SelectItem>
              <SelectItem value="calc">Cálculo I</SelectItem>
              <SelectItem value="ed">Estruturas de Dados</SelectItem>
              <SelectItem value="bd">Banco de Dados</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </header>

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((k) => {
          const Icon = k.icon;
          return (
            <Card key={k.label} className="border-border/60 hover:border-primary/40 transition-colors">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="size-9 rounded-lg bg-primary/10 grid place-items-center">
                    <Icon className="size-4 text-primary" />
                  </div>
                  <Badge variant="secondary" className="text-[10px] font-normal">{k.hint}</Badge>
                </div>
                <div className="text-2xl font-semibold tracking-tight">{k.value}</div>
                <div className="text-xs text-muted-foreground mt-1">{k.label}</div>
              </CardContent>
            </Card>
          );
        })}
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">
              {isMentor ? "Mentorias realizadas por semana" : "Evolução das mentorias"}
            </CardTitle>
            <CardDescription>Últimas 6 semanas</CardDescription>
          </CardHeader>
          <CardContent className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mentoriasSemana} margin={{ left: -20, right: 12, top: 8 }}>
                <CartesianGrid stroke="oklch(0.28 0.015 260)" strokeDasharray="3 3" />
                <XAxis dataKey="semana" stroke="oklch(0.68 0.02 260)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="oklch(0.68 0.02 260)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    background: "oklch(0.205 0.015 260)",
                    border: "1px solid oklch(0.28 0.015 260)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="total"
                  stroke="oklch(0.78 0.16 158)"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: "oklch(0.78 0.16 158)" }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              {isMentor ? "Por disciplina" : "Disciplinas acompanhadas"}
            </CardTitle>
            <CardDescription>Distribuição</CardDescription>
          </CardHeader>
          <CardContent className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={distribuicaoDisciplinas} margin={{ left: -20, right: 12, top: 8 }}>
                <CartesianGrid stroke="oklch(0.28 0.015 260)" strokeDasharray="3 3" />
                <XAxis dataKey="disciplina" stroke="oklch(0.68 0.02 260)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="oklch(0.68 0.02 260)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    background: "oklch(0.205 0.015 260)",
                    border: "1px solid oklch(0.28 0.015 260)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="total" fill="oklch(0.7 0.15 230)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base">Recomendações & insights</CardTitle>
              <CardDescription>Sugestões personalizadas para você</CardDescription>
            </div>
            <Sparkles className="size-4 text-primary" />
          </CardHeader>
          <CardContent className="grid sm:grid-cols-2 gap-3">
            {recomendacoes.map((r) => (
              <div key={r.id} className="rounded-xl border border-border/60 bg-background/40 p-4 hover:border-primary/40 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="size-9 rounded-lg bg-primary/10 grid place-items-center shrink-0">
                    {r.tipo === "mentor" && <Users className="size-4 text-primary" />}
                    {r.tipo === "disciplina" && <GraduationCap className="size-4 text-primary" />}
                    {r.tipo === "alerta" && <Calendar className="size-4 text-primary" />}
                    {r.tipo === "insight" && <Lightbulb className="size-4 text-primary" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{r.titulo}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{r.subtitulo}</div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Mentores em destaque</CardTitle>
            <CardDescription>Compatíveis com seu curso</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {mentors.slice(0, 3).map((m) => (
              <Link
                key={m.id}
                to="/app/mentor/$id"
                params={{ id: m.id }}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="size-10 rounded-full bg-primary/15 grid place-items-center text-xs font-semibold text-primary">
                  {m.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{m.nome}</div>
                  <div className="text-xs text-muted-foreground truncate flex items-center gap-1">
                    <Star className="size-3 fill-warning text-warning" /> {m.avaliacao} · {m.disciplinas[0]}
                  </div>
                </div>
                <ArrowRight className="size-4 text-muted-foreground" />
              </Link>
            ))}
            <Link to="/app/buscar">
              <Button variant="outline" size="sm" className="w-full mt-2">Ver todos</Button>
            </Link>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
