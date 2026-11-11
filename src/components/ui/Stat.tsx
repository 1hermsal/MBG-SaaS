import GlassCard from "./GlassCard";

export default function Stat({ label, value, bad }: { label: string; value: string | number; bad?: boolean }) {
  return (
    <GlassCard className="!p-5">
      <p className="muted">{label}</p>
      <p className={`mt-1 text-4xl font-bold ${bad ? "bad" : ""}`}>{value}</p>
    </GlassCard>
  );
}
