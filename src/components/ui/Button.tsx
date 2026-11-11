import { ButtonHTMLAttributes } from "react";

export default function Button({ className = "", ...rest }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`inline-flex min-h-14 w-full items-center justify-center rounded-2xl bg-brand-600 px-6 text-lg font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500 dark:disabled:bg-white/10 ${className}`}
      {...rest}
    />
  );
}
