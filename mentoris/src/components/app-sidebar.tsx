import { Link, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, Search, CalendarCheck, MessageSquare, User, GraduationCap, LogOut } from "lucide-react";
import { useApp } from "@/lib/app-context";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

const mainItems = [
  { to: "/app/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/app/buscar", label: "Buscar Mentores", icon: Search },
  { to: "/app/mentorias", label: "Minhas Mentorias", icon: CalendarCheck },
  { to: "/app/chat", label: "Chat", icon: MessageSquare },
] as const;

export function AppSidebar() {
  const path = useRouterState({ select: (r) => r.location.pathname });
  const { user, setUser } = useApp();
  const navigate = useNavigate();

  const logout = () => {
    setUser(null);
    toast.success("Você saiu da conta.");
    navigate({ to: "/" });
  };

  return (
    <aside className="hidden md:flex w-60 shrink-0 flex-col border-r border-sidebar-border bg-sidebar">
      <div className="px-5 py-5 flex items-center gap-2">
        <div className="size-9 rounded-xl bg-primary/15 grid place-items-center">
          <GraduationCap className="size-5 text-primary" />
        </div>
        <span className="font-bold text-lg tracking-tight">Mentoris</span>
      </div>

      <nav className="px-3 flex flex-col gap-1 mt-2">
        {mainItems.map((item) => {
          const active = path === item.to || path.startsWith(item.to + "/");
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                active
                  ? "bg-sidebar-accent text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/50"
              }`}
            >
              <Icon className="size-4" />
              <span>{item.label}</span>
              {active && <span className="ml-auto size-1.5 rounded-full bg-primary" />}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto p-3 border-t border-sidebar-border space-y-1">
        <Link
          to="/app/perfil"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
            path.startsWith("/app/perfil")
              ? "bg-sidebar-accent text-foreground"
              : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/50"
          }`}
        >
          <div className="size-7 rounded-full bg-primary/15 grid place-items-center text-[11px] font-semibold text-primary">
            {user?.avatar || "ME"}
          </div>
          <div className="flex-1 min-w-0">
            <div className="truncate text-sm font-medium text-foreground">{user?.nome || "Meu Perfil"}</div>
            <div className="truncate text-[11px] capitalize">{user?.tipo}</div>
          </div>
        </Link>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/50 transition-colors"
        >
          <LogOut className="size-4" />
          <span>Sair</span>
        </button>
      </div>
    </aside>
  );
}

export function BottomNav() {
  const path = useRouterState({ select: (r) => r.location.pathname });
  const items = [...mainItems, { to: "/app/perfil", label: "Perfil", icon: User } as const];
  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 border-t border-border bg-background/95 backdrop-blur">
      <div className="grid grid-cols-5">
        {items.map((item) => {
          const active = path === item.to || path.startsWith(item.to + "/");
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex flex-col items-center gap-1 py-2.5 text-[10px] transition-colors ${
                active ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <Icon className="size-5" />
              <span>{item.label.split(" ")[0]}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
