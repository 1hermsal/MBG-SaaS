import { logout } from "@/app/login/actions";
import { ROLE_LABEL, type Session } from "@/lib/auth";
import ThemeToggle from "./ThemeToggle";

export default function AppHeader({ session }: { session: Session }) {
  return (
    <header className="flex items-center justify-between">
      <div>
        <p className="text-xl font-bold">{session.name}</p>
        <p className="muted">{ROLE_LABEL[session.role]}</p>
      </div>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <form action={logout}>
          <button className="muted h-11 rounded-xl px-3 hover:underline">Keluar</button>
        </form>
      </div>
    </header>
  );
}
