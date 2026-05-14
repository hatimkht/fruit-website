"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { ResultsPayload } from "@/types/results";
import { formatPercent } from "@/lib/utils";

export function RawDistribution({ data }: { data: ResultsPayload }) {
  const byId = new Map(data.parties.map((p) => [p.id, p]));

  const chartData = data.firstPreferences.map((r) => {
    const p = byId.get(r.partyId);
    return {
      partyId: r.partyId,
      name: p?.shortName ?? r.partyId,
      share: r.share,
      color: p?.color ?? "#1A1A1C",
      eliminated: r.share < data.threshold,
    };
  });

  const yMax = Math.max(0.1, Math.ceil(Math.max(...chartData.map((d) => d.share)) * 10) / 10);

  return (
    <div className="h-[360px] w-full">
      <ResponsiveContainer>
        <BarChart data={chartData} margin={{ top: 16, right: 8, left: -8, bottom: 4 }}>
          <CartesianGrid stroke="#EDEDE5" vertical={false} />
          <XAxis
            dataKey="name"
            tick={{ fill: "#55555C", fontSize: 11 }}
            axisLine={{ stroke: "#E4E4DA" }}
            tickLine={false}
            interval={0}
            angle={-28}
            textAnchor="end"
            height={56}
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
          <ReferenceLine
            y={data.threshold}
            stroke="#A6564A"
            strokeDasharray="4 4"
            label={{
              value: "5%-Hürde",
              position: "right",
              fill: "#A6564A",
              fontSize: 11,
            }}
          />
          <Bar dataKey="share" radius={[6, 6, 0, 0]}>
            {chartData.map((d) => (
              <Cell
                key={d.partyId}
                fill={d.color}
                fillOpacity={d.eliminated ? 0.28 : 1}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
