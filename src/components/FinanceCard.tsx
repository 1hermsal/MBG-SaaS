import GlassCard from "@/components/ui/GlassCard";
import { rupiah, type Finance, type Money } from "@/lib/finance";

function Col({ title, m }: { title: string; m: Money }) {
  const rows: [string, number][] = [
    ["Omset", m.omset],
    ["Biaya bahan", m.biaya],
    ["Biaya operasional", m.ops],
  ];
  return (
    <div className="space-y-3">
      <p className="muted">{title}</p>
      {rows.map(([l, v]) => (
        <div key={l}>
          <p className="muted text-sm">{l}</p>
          <p className="text-2xl font-bold">{rupiah(v)}</p>
        </div>
      ))}
      <div>
        <p className="muted text-sm">Laba bersih</p>
        <p className={`text-2xl font-bold ${m.laba < 0 ? "bad" : "ok"}`}>{rupiah(m.laba)}</p>
      </div>
    </div>
  );
}

export default function FinanceCard({ fin }: { fin: Finance }) {
  return (
    <GlassCard>
      <div className="grid gap-6 sm:grid-cols-2">
        <Col title="Hari ini" m={fin.today} />
        <Col title="Bulan ini" m={fin.month} />
      </div>
    </GlassCard>
  );
}
