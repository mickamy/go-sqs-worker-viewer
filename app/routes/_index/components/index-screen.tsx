import { useLoaderData } from "@remix-run/react";

import Container from "~/components/container";
import { JobStatistics } from "~/models/job-statistics";
import StatisticsSummaryCard from "~/routes/_index/components/statistics-summary-card";

interface LoaderData {
  statistics: JobStatistics;
}

export default function IndexScreen() {
  const { statistics } = useLoaderData<LoaderData>();
  return (
    <Container className="overflow-x-auto min-w-[750px]">
      <StatisticsSummaryCard statistics={statistics} />
    </Container>
  );
}
