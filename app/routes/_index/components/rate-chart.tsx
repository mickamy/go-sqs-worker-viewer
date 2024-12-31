import * as React from "react";
import { HTMLAttributes } from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import colors from "tailwindcss/colors";

import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "~/components/ui/chart";
import { cn } from "~/lib/utils";

export interface Rate {
  timestamp: string;
  success: number;
  failure: number;
  total: number;
}

const data: Rate[] = [
  { timestamp: "2024-04-01", success: 0.46, failure: 0.54, total: 1.0 },
  { timestamp: "2024-04-02", success: 0.25, failure: 0.75, total: 1.0 },
  { timestamp: "2024-04-03", success: 0.17, failure: 0.83, total: 1.0 },
  { timestamp: "2024-04-04", success: 0.71, failure: 0.29, total: 1.0 },
  { timestamp: "2024-04-05", success: 0.66, failure: 0.34, total: 1.0 },
  { timestamp: "2024-04-06", success: 0.02, failure: 0.98, total: 1.0 },
  { timestamp: "2024-04-07", success: 0.85, failure: 0.15, total: 1.0 },
  { timestamp: "2024-04-08", success: 0.83, failure: 0.17, total: 1.0 },
  { timestamp: "2024-04-09", success: 0.91, failure: 0.09, total: 1.0 },
  { timestamp: "2024-04-10", success: 0.26, failure: 0.74, total: 1.0 },
  { timestamp: "2024-04-11", success: 0.19, failure: 0.81, total: 1.0 },
];

const chartConfig = {
  success: {
    label: "Success",
    color: colors.green[500],
  },
  failure: {
    label: "Failure",
    color: colors.red[500],
  },
} satisfies ChartConfig;

interface Props extends HTMLAttributes<HTMLDivElement> {}

export default function RateChart({ className, ...props }: Props) {
  return (
    <ChartContainer
      config={chartConfig}
      className={cn("aspect-auto h-[350px]", className)}
      {...props}
    >
      <AreaChart data={data}>
        <defs>
          <linearGradient id="fillSuccess" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={colors.green[500]} stopOpacity={0.8} />
            <stop
              offset="95%"
              stopColor={colors.green[500]}
              stopOpacity={0.1}
            />
          </linearGradient>
          <linearGradient id="fillFailure" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={colors.red[500]} stopOpacity={0.8} />
            <stop offset="95%" stopColor={colors.red[500]} stopOpacity={0.1} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="timestamp"
          tickLine={false}
          axisLine={false}
          tickFormatter={() => {
            return "";
          }}
        />
        <YAxis
          dataKey="total"
          tickLine={false}
          axisLine={false}
          scale="auto"
          domain={[0, 1]}
          ticks={[0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0]}
        />
        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent
              labelFormatter={(value) => {
                return new Date(value).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
              indicator="dot"
            />
          }
        />
        <Area
          dataKey="success"
          type="natural"
          fill="url(#fillSuccess)"
          stroke={colors.green[500]}
        />
        <Area
          dataKey="failure"
          type="natural"
          fill="url(#fillFailure)"
          stroke={colors.red[500]}
        />
        <ChartLegend content={<ChartLegendContent />} />
      </AreaChart>
    </ChartContainer>
  );
}
