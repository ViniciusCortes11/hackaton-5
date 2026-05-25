import { createFileRoute, useSearch } from "@tanstack/react-router";
import { conversas as mockConversas, type Mensagem } from "@/lib/mock-data";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Paperclip, Link as LinkIcon, FileText, CalendarPlus } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/app/chat")({
  validateSearch: (search: Record<string, unknown>) => ({
    mentor: (search.mentor as string) || "",
  }),
  component: ChatPage,
});

function ChatPage() {
  const search = useSearch({ from: "/app/chat" });

  const [conversas, setConversas] = useState(mockConversas);

  const mentorMap: Record<string, string> = {
    m1: "c1",
    m2: "c2",
    m3: "c3",
    m4: "c4",
    m5: "c5",
    m6: "c6",
  };

  const initialConversation =
    mentorMap[search.mentor] || mockConversas[0]?.id || "";

  const [activeId, setActiveId] = useState<string>(initialConversation);
  const [text, setText] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  const active = conversas.find((c) => c.id === activeId);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [active?.mensagens.length, activeId]);

  const send = () => {
    if (!text.trim() || !active) return;
    const novaMsg: Mensagem = {
      id: String(Date.now()),
      de: "eu",
      texto: text.trim(),
      hora: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
    };
    setConversas((prev) =>
      prev.map((c) =>
        c.id === active.id ? { ...c, mensagens: [...c.mensagens, novaMsg], ultima: novaMsg.texto } : c
      )
    );
    setText("");
  };

  return (
    <div className="h-[calc(100vh-0px)] md:h-screen flex flex-col">
      <div className="px-4 md:px-8 pt-6 md:pt-10 pb-4">
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Chat</h1>
        <p className="text-sm text-muted-foreground">Converse com seus mentores e mentorados.</p>
      </div>

      <div className="flex-1 min-h-0 px-4 md:px-8 pb-6 md:pb-10">
        <Card className="h-full overflow-hidden grid grid-cols-1 md:grid-cols-[280px_1fr]">
          {/* Lista de conversas */}
          <aside className="border-r border-border overflow-y-auto hidden md:block">
            {conversas.map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveId(c.id)}
                className={`w-full text-left px-4 py-3 flex items-center gap-3 border-b border-border/50 transition-colors ${
                  c.id === activeId ? "bg-muted/60" : "hover:bg-muted/30"
                }`}
              >
                <div className="size-10 rounded-full bg-primary/15 grid place-items-center text-xs font-semibold text-primary shrink-0">
                  {c.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{c.nome}</div>
                  <div className="text-xs text-muted-foreground truncate">{c.ultima}</div>
                </div>
                {c.naoLidas > 0 && (
                  <span className="size-5 rounded-full bg-primary text-primary-foreground text-[10px] font-semibold grid place-items-center">
                    {c.naoLidas}
                  </span>
                )}
              </button>
            ))}
          </aside>

          {/* Mobile: selector */}
          <div className="md:hidden border-b border-border p-2 flex gap-2 overflow-x-auto">
            {conversas.map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveId(c.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs shrink-0 ${
                  c.id === activeId ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"
                }`}
              >
                <div className="size-6 rounded-full bg-primary/20 grid place-items-center text-[9px] font-semibold">
                  {c.avatar}
                </div>
                {c.nome.split(" ")[0]}
              </button>
            ))}
          </div>

          {/* Conversa ativa */}
          <section className="flex flex-col min-h-0">
            {active ? (
              <>
                <header className="px-5 py-3 border-b border-border flex items-center gap-3">
                  <div className="size-9 rounded-full bg-primary/15 grid place-items-center text-xs font-semibold text-primary">
                    {active.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold truncate">{active.nome}</div>
                    <div className="text-xs text-muted-foreground truncate">{active.curso}</div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toast.success("Sugestão de encontro enviada!")}
                  >
                    <CalendarPlus className="size-4 mr-1.5" /> Agendar
                  </Button>
                </header>

                <div className="flex-1 overflow-y-auto p-5 space-y-3 bg-background/40">
                  {active.mensagens.map((m) => (
                    <MessageBubble key={m.id} msg={m} />
                  ))}
                  <div ref={endRef} />
                </div>

                <footer className="border-t border-border p-3 flex items-end gap-2 bg-card">
                  <Button variant="ghost" size="icon" onClick={() => toast("Material anexado (mock)")}>
                    <Paperclip className="size-4" />
                  </Button>
                  <Input
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && send()}
                    placeholder="Escreva uma mensagem..."
                  />
                  <Button onClick={send} disabled={!text.trim()}>
                    <Send className="size-4" />
                  </Button>
                </footer>
              </>
            ) : (
              <div className="h-full grid place-items-center text-sm text-muted-foreground">
                Selecione uma conversa
              </div>
            )}
          </section>
        </Card>
      </div>
    </div>
  );
}

function MessageBubble({ msg }: { msg: Mensagem }) {
  const mine = msg.de === "eu";
  if (msg.tipo === "material") {
    return (
      <div className={`flex ${mine ? "justify-end" : "justify-start"}`}>
        <div className="max-w-[75%] rounded-2xl border border-border bg-card p-3 flex items-center gap-3">
          <div className="size-9 rounded-lg bg-primary/15 grid place-items-center">
            <FileText className="size-4 text-primary" />
          </div>
          <div className="min-w-0">
            <div className="text-sm font-medium">Apostila de Cálculo I.pdf</div>
            <div className="text-xs text-muted-foreground flex items-center gap-1">
              <LinkIcon className="size-3" /> Material de apoio
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className={`flex ${mine ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm ${
          mine ? "bg-primary text-primary-foreground" : "bg-card border border-border"
        }`}
      >
        <p>{msg.texto}</p>
        <div className={`text-[10px] mt-1 ${mine ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
          {msg.hora}
        </div>
      </div>
    </div>
  );
}
