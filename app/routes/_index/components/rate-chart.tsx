import { HTMLAttributes, useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import colors from "tailwindcss/colors";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "~/components/ui/chart";
import { Slider } from "~/components/ui/slider";
import { cn } from "~/lib/utils";
import { JobRate } from "~/models/job-rate";

const defaultInterval = 5000;

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
  poll: () => void;
}

export default function RateChart({ rates, poll, className, ...props }: Props) {
  const [pollingInterval, setPollingInterval] = useState(defaultInterval);

  useEffect(() => {
    const intervalId = setInterval(poll, pollingInterval);
    return () => clearInterval(intervalId);
  }, [pollingInterval, poll]);

  return (
    <Card className={cn("w-full", className)} {...props}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex-1">
          <CardTitle className="text-2xl font-bold">Job Success Rate</CardTitle>
          <CardDescription>
            Overview of job success and failure rates over time
          </CardDescription>
        </div>
        <div className="flex flex-col items-center space-y-2">
          <div className="flex flex-row items-end space-x-2">
            <span className="text-sm text-muted-foreground">
              Polling interval:
            </span>
            <span className="text-sm font-bold">{pollingInterval / 1000}s</span>
          </div>
          <Slider
            defaultValue={[defaultInterval / 1000]}
            min={1}
            max={20}
            step={1}
            onValueChange={(val) => setPollingInterval(val[0] * 1000)}
            className="w-40"
          />
        </div>
      </CardHeader>
      <CardContent className="pb-4">
        <ChartContainer
          config={chartConfig}
          className={cn("aspect-auto h-[350px]", className)}
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={rates}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="fillSuccess" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor={chartConfig.success.color}
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor={chartConfig.success.color}
                    stopOpacity={0.1}
                  />
                </linearGradient>
                <linearGradient id="fillFailure" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor={chartConfig.failure.color}
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor={chartConfig.failure.color}
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#e5e7eb"
              />
              <XAxis
                dataKey="timestamp"
                tickLine={false}
                axisLine={false}
                tickFormatter={() => ""}
                stroke="#9ca3af"
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                scale="auto"
                domain={[0, 1]}
                ticks={[0, 0.2, 0.4, 0.6, 0.8, 1.0]}
                stroke="#9ca3af"
              />
              <ChartTooltip
                cursor={{ stroke: "#6b7280", strokeWidth: 1 }}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value: string) => {
                      return new Date(value).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute: "numeric",
                      });
                    }}
                  />
                }
              />
              <Area
                dataKey="success"
                type="monotone"
                fill="url(#fillSuccess)"
                stroke={chartConfig.success.color}
                strokeWidth={2}
              />
              <Area
                dataKey="failure"
                type="monotone"
                fill="url(#fillFailure)"
                stroke={chartConfig.failure.color}
                strokeWidth={2}
              />
              <ChartLegend content={<ChartLegendContent />} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
