import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { mentors, avaliacoes } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Heart, MessageSquare, ArrowLeft, Clock, GraduationCap, Users, CheckCircle2 } from "lucide-react";
import { useApp } from "@/lib/app-context";
import { toast } from "sonner";
import { getReviews, saveReview } from "@/lib/storage";
import { useState } from "react";

export const Route = createFileRoute("/app/mentor/$id")({
  component: MentorProfile,
  notFoundComponent: () => <div className="p-10 text-center text-muted-foreground">Mentor não encontrado.</div>,
});

function MentorProfile() {
  const { id } = useParams({ from: "/app/mentor/$id" });
  const mentor = mentors.find((m) => m.id === id);
  const { favoritos, toggleFavorito } = useApp();
  if (!mentor) return null;
  const isFav = favoritos.includes(mentor.id);
  const [reviews, setReviews] = useState(
    getReviews().filter((a) => a.mentorId === mentor.id)
  );

  const [nota, setNota] = useState(5);
  const [comentario, setComentario] = useState("");

  return (
    <div className="mx-auto max-w-5xl px-4 md:px-8 py-6 md:py-10 space-y-6 animate-fade-in">
      <Link to="/app/buscar" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5">
        <ArrowLeft className="size-4" /> Voltar para busca
      </Link>

      <Card>
        <CardContent className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="size-20 md:size-24 rounded-2xl bg-primary/15 grid place-items-center text-2xl font-bold text-primary shrink-0">
              {mentor.avatar}
            </div>
            <div className="flex-1 min-w-0 space-y-3">
              <div>
                <h1 className="text-2xl font-semibold tracking-tight">{mentor.nome}</h1>
                <p className="text-sm text-muted-foreground">
                  {mentor.curso} · {mentor.periodo}º período
                </p>
              </div>
              <div className="flex flex-wrap gap-4 text-sm">
                <span className="flex items-center gap-1.5">
                  <Star className="size-4 fill-warning text-warning" />
                  <span className="font-semibold">{mentor.avaliacao}</span>
                  <span className="text-muted-foreground">({reviews.length} avaliações)</span>
                </span>
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <Users className="size-4" /> {mentor.alunos} alunos
                </span>
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <GraduationCap className="size-4" /> {mentor.mentorias} mentorias
                </span>
              </div>
              <div className="flex flex-wrap gap-2 pt-2">
                <Button onClick={() => toast.success("Solicitação de mentoria enviada!")}>
                  Solicitar mentoria
                </Button>
                <Link to="/app/chat">
                  <Button variant="outline">
                    <MessageSquare className="size-4 mr-1.5" /> Conversar
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  onClick={() => {
                    toggleFavorito(mentor.id);
                    toast.success(isFav ? "Removido dos favoritos" : "Salvo em favoritos");
                  }}
                >
                  <Heart className={`size-4 ${isFav ? "fill-destructive text-destructive" : ""}`} />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>


      <Card>
        <CardHeader>
          <CardTitle className="text-base">Avaliar mentor</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Nota</label>

            <select
              className="w-full border rounded-md p-2 bg-background"
              value={nota}
              onChange={(e) => setNota(Number(e.target.value))}
            >
              <option value={5}>5 estrelas</option>
              <option value={4}>4 estrelas</option>
              <option value={3}>3 estrelas</option>
              <option value={2}>2 estrelas</option>
              <option value={1}>1 estrela</option>
            </select>
          </div>

          <textarea
            placeholder="Escreva sua avaliação..."
            className="w-full border rounded-md p-3 min-h-[100px] bg-background"
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
          />

          <Button
            onClick={() => {
              if (!comentario.trim()) {
                toast.error("Digite um comentário");
                return;
              }

              const novaReview = {
                id: String(Date.now()),
                mentorId: mentor.id,
                autor: "Você",
                nota,
                comentario,
                data: new Date().toISOString(),
              };

              saveReview(novaReview);
              setReviews(getReviews().filter((a) => a.mentorId === mentor.id));
              setComentario("");
              setNota(5);

              toast.success("Avaliação enviada!");
            }}
          >
            Enviar avaliação
          </Button>
        </CardContent>
      </Card>


      <div className="grid md:grid-cols-3 gap-4">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Sobre</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground leading-relaxed">{mentor.descricao}</p>
            <div className="pt-2">
              <h4 className="text-sm font-medium mb-2">Experiência acadêmica</h4>
              <p className="text-sm text-muted-foreground">{mentor.experiencia}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Disponibilidade</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {mentor.disponibilidade.map((d) => (
              <div key={d} className="flex items-center gap-2 text-sm">
                <Clock className="size-4 text-primary" />
                <span>{d}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Disciplinas atendidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {mentor.disciplinas.map((d) => (
              <Badge key={d} variant="secondary" className="font-normal">
                <CheckCircle2 className="size-3 mr-1 text-primary" />
                {d}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Avaliações recebidas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {reviews.length === 0 ? (
            <p className="text-sm text-muted-foreground">Ainda sem avaliações.</p>
          ) : (
            reviews.map((r) => (
              <div key={r.id} className="rounded-lg border border-border/60 p-4 space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">{r.autor}</div>
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`size-3.5 ${i < r.nota ? "fill-warning text-warning" : "text-muted"}`} />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{r.comentario}</p>
                <p className="text-xs text-muted-foreground">{r.data}</p>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
