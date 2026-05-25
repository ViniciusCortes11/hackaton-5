import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { GraduationCap, Sparkles, Users, MessageSquare } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Welcome,
});

function Welcome() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 20% 0%, oklch(0.78 0.16 158 / 0.18), transparent 60%), radial-gradient(ellipse 50% 40% at 90% 100%, oklch(0.7 0.15 230 / 0.18), transparent 60%)",
        }}
      />
      <header className="relative z-10 mx-auto max-w-6xl px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="size-9 rounded-xl bg-primary/15 grid place-items-center">
            <GraduationCap className="size-5 text-primary" />
          </div>
          <span className="font-bold text-lg tracking-tight">Mentoris</span>
        </div>
        <Link to="/login">
          <Button variant="ghost" size="sm">Entrar</Button>
        </Link>
      </header>

      <main className="relative z-10 mx-auto max-w-6xl px-6 pt-12 pb-20">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div className="space-y-6 animate-fade-in">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs text-muted-foreground">
              <Sparkles className="size-3.5 text-primary" />
              Mentoria acadêmica simples e direta
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-[1.05]">
              Aprenda com quem<br />
              já passou por aí.
            </h1>
            <p className="text-lg text-muted-foreground max-w-md">
              Conecte-se com alunos experientes do seu curso, tire dúvidas e
              avance nas disciplinas com mentorias personalizadas.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link to="/signup">
                <Button size="lg" className="font-medium">Começar agora</Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline">Já tenho conta</Button>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FeatureCard icon={Users} title="Mentores compatíveis" desc="Filtro por curso, período e disciplinas." />
            <FeatureCard icon={MessageSquare} title="Chat direto" desc="Converse e marque encontros." />
            <FeatureCard icon={GraduationCap} title="Acompanhe sua evolução" desc="Dashboards com KPIs e insights." />
            <FeatureCard icon={Sparkles} title="Avaliações reais" desc="Feedback após cada mentoria." />
          </div>
        </div>
      </main>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, desc }: { icon: any; title: string; desc: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card/60 p-5 hover:border-primary/40 transition-colors">
      <div className="size-9 rounded-lg bg-primary/10 grid place-items-center mb-3">
        <Icon className="size-4 text-primary" />
      </div>
      <h3 className="font-semibold text-sm">{title}</h3>
      <p className="text-xs text-muted-foreground mt-1">{desc}</p>
    </div>
  );
}
