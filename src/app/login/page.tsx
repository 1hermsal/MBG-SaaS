import { redirect } from "next/navigation";
import { getSession, ROLE_HOME } from "@/lib/auth";
import ThemeToggle from "@/components/ThemeToggle";
import LoginForm from "./LoginForm";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const s = await getSession();
  if (s) redirect(ROLE_HOME[s.role]);
  return (
    <main className="relative flex min-h-screen items-center justify-center px-6">
      <div className="absolute right-6 top-6">
        <ThemeToggle />
      </div>
      <LoginForm />
    </main>
  );
}
