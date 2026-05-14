"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { ResultsPayload } from "@/types/results";
import { formatPercent } from "@/lib/utils";

export function FinalResult({ data }: { data: ResultsPayload }) {
  const byId = new Map(data.parties.map((p) => [p.id, p]));

  const chartData = data.finalResult.map((r) => {
    const p = byId.get(r.partyId);
    return {
      partyId: r.partyId,
      name: p?.shortName ?? r.partyId,
      share: r.share,
      color: p?.color ?? "#1A1A1C",
    };
  });

  const yMax = Math.max(0.1, Math.ceil(Math.max(...chartData.map((d) => d.share || 0), 0) * 10) / 10);

  if (chartData.length === 0) {
    return (
      <div className="rounded-2xl border border-rule bg-paper-50 p-8 text-center text-sm text-ink-muted">
        Keine Partei erreicht die Hürde — es gibt noch kein finales Ergebnis.
      </div>
    );
  }

  return (
    <div className="h-[360px] w-full">
      <ResponsiveContainer>
        <BarChart data={chartData} margin={{ top: 24, right: 8, left: -8, bottom: 4 }}>
          <CartesianGrid stroke="#EDEDE5" vertical={false} />
          <XAxis
            dataKey="name"
            tick={{ fill: "#55555C", fontSize: 11 }}
            axisLine={{ stroke: "#E4E4DA" }}
            tickLine={false}
            interval={0}
            angle={-20}
            textAnchor="end"
            height={50}
          />
          <YAxis
            tickFormatter={(v: number) => `${Math.round(v * 100)}%`}
            tick={{ fill: "#55555C", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            domain={[0, yMax]}
          />
          <Tooltip
            cursor={{ fill: "rgba(26,26,28,0.04)" }}
            contentStyle={{
              borderRadius: 10,
              border: "1px solid #E4E4DA",
              background: "#FAFAF7",
              fontSize: 12,
            }}
            formatter={(value: number) => [formatPercent(value), "Anteil"]}
          />
          <Bar dataKey="share" radius={[6, 6, 0, 0]}>
            <LabelList
              dataKey="share"
              position="top"
              formatter={(v: number) => formatPercent(v)}
              fill="#1A1A1C"
              fontSize={11}
            />
            {chartData.map((d) => (
              <Cell key={d.partyId} fill={d.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
