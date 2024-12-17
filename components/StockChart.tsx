"use client";

import { Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { Line, LineChart, XAxis, YAxis } from "recharts";

export function StockChart({
  loading,
  data,
}: {
  loading: boolean;
  data: { date: string; profitLoss: string; closePrice: number }[];
}) {

  const [minClosePrice, setMinClosePrice] = useState<number>(0);
  const [maxClosePrice, setMaxClosePrice] = useState<number>(0);
  const [lineColor, setLineColor] = useState<string>("hsl(var(--chart-1))");

  useEffect(() => {
    if (data.length === 0) return;

    const min = Math.min(...data.map((d) => d.closePrice));
    const max = Math.max(...data.map((d) => d.closePrice));
    const first = data[0].closePrice;
    const last = data[data.length - 1].closePrice;

    setMinClosePrice(min);
    setMaxClosePrice(max);

    const color =
      last > first ? "hsl(var(--success))" : "hsl(var(--destructive))";
    setLineColor(color);
  }, [data]);

  return (
    <div>
      {loading ? (
        <Loader className="animate-spin" />
      ) : (
        <LineChart
          width={60}
          height={40}
          data={data}
          margin={{ top: 5, right: 5, bottom: 5, left: 5 }}
        >
          <XAxis dataKey="date" hide={true} />
          <YAxis hide={true} domain={[minClosePrice, maxClosePrice]} />
          <Line
            type="monotone"
            dataKey="closePrice"
            stroke={lineColor}
            strokeWidth={1.5}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      )}
    </div>
  );
}
