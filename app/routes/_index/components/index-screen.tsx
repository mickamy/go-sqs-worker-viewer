import { useLoaderData } from "@remix-run/react";

import Container from "~/components/container";
import Spacer from "~/components/spacer";
import { JobStatistics } from "~/models/job-statistics";
import RateChart from "~/routes/_index/components/rate-chart";
import StatisticsSummaryCard from "~/routes/_index/components/statistics-summary-card";

interface LoaderData {
  statistics: JobStatistics;
  successRate: number;
  failureRate: number;
}

const minWidthStyle = "min-w-[900px]";

export default function IndexScreen() {
  const { statistics } = useLoaderData<LoaderData>();
  return (
    <Container className="overflow-x-auto">
      <StatisticsSummaryCard
        statistics={statistics}
        className={minWidthStyle}
      />
      <Spacer size={24} />
      <h2 className="text-2xl font-bold">Dashboard</h2>
      <Spacer size={36} />
      <RateChart className={minWidthStyle} />
    </Container>
  );
}
