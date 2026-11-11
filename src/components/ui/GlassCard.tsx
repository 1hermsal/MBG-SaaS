import { HTMLAttributes } from "react";

export default function GlassCard({ className = "", ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`rounded-2xl border border-white bg-white/60 p-6 shadow-[0_8px_30px_rgba(15,23,42,0.06)] backdrop-blur-xl dark:border-white/10 dark:bg-white/5 dark:shadow-none ${className}`}
      {...rest}
    />
  );
}
