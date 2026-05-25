import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import type { ProfileType } from "./mock-data";

type User = {
  nome: string;
  matricula: string;
  curso: string;
  periodo: number;
  tipo: ProfileType;
  avatar: string;
  disciplinas: string[];
  descricao?: string;
  disponibilidade?: string[];
  objetivos?: string;
};

type Ctx = {
  user: User | null;
  setUser: (u: User | null) => void;
  toggleTipo: () => void;
  favoritos: string[];
  toggleFavorito: (id: string) => void;
};

const AppContext = createContext<Ctx | null>(null);

const DEFAULT_USER: User = {
  nome: "Estudante Demo",
  matricula: "2024001",
  curso: "Engenharia de Software",
  periodo: 3,
  tipo: "mentorado",
  avatar: "ED",
  disciplinas: ["Cálculo I", "Programação OO"],
  objetivos: "Melhorar em cálculo e estruturas de dados.",
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(null);
  const [favoritos, setFavoritos] = useState<string[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("mentoris:user");
      if (raw) setUserState(JSON.parse(raw));
      const fav = localStorage.getItem("mentoris:fav");
      if (fav) setFavoritos(JSON.parse(fav));
    } catch {
      setUserState(null);
    }
  }, []);

  const setUser = (u: User | null) => {
    setUserState(u);
    if (u) localStorage.setItem("mentoris:user", JSON.stringify(u));
    else localStorage.removeItem("mentoris:user");
  };

  const toggleTipo = () => {
    if (!user) return;
    const novo: User = { ...user, tipo: user.tipo === "mentor" ? "mentorado" : "mentor" };
    setUser(novo);
  };

  const toggleFavorito = (id: string) => {
    setFavoritos((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      localStorage.setItem("mentoris:fav", JSON.stringify(next));
      return next;
    });
  };

  return (
    <AppContext.Provider value={{ user, setUser, toggleTipo, favoritos, toggleFavorito }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
