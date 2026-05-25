import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { AppSidebar, BottomNav } from "@/components/app-sidebar";

export const Route = createFileRoute("/app")({
  component: AppLayout,
  beforeLoad: ({ location }) => {
    if (location.pathname === "/app" || location.pathname === "/app/") {
      throw redirect({ to: "/app/dashboard" });
    }
  },
});

function AppLayout() {
  return (
    <div className="flex min-h-screen w-full bg-background">
      <AppSidebar />
      <main className="flex-1 min-w-0 pb-20 md:pb-0">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
