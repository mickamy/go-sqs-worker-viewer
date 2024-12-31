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
import { JobRate } from "~/models/job-rate";

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

interface Props extends HTMLAttributes<HTMLDivElement> {
  rates: JobRate[];
}

export default function RateChart({ rates, className, ...props }: Props) {
  return (
    <ChartContainer
      config={chartConfig}
      className={cn("aspect-auto h-[350px]", className)}
      {...props}
    >
      <AreaChart data={rates}>
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
                  hour: "numeric",
                  minute: "numeric",
                  second: "numeric",
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
