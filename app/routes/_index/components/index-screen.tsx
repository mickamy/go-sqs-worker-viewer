import { useLoaderData } from "@remix-run/react";
import { useCallback, useEffect, useState } from "react";

import Container from "~/components/container";
import Spacer from "~/components/spacer";
import { JobRate } from "~/models/job-rate";
import { JobStatistics } from "~/models/job-statistics";
import RateChart from "~/routes/_index/components/rate-chart";
import StatisticsSummaryCard from "~/routes/_index/components/statistics-summary-card";

interface LoaderData {
  statistics: JobStatistics;
  rate: JobRate;
}

const minWidthStyle = "min-w-[900px]";

const pollingInterval = 5000;

export default function IndexScreen() {
  const _data = useLoaderData<LoaderData>();
  const [data, setData] = useState({
    ..._data,
    rates: [_data.rate],
  });

  const poll = useCallback(async () => {
    try {
      const response = await fetch("/api/dashboard");
      const newData = await response.json();
      setData((prevState) => ({
        ...newData,
        rates: [newData.rate, ...prevState.rates],
      }));
    } catch (e) {
      console.error("failed to poll", e);
    }
  }, []);

  useEffect(() => {
    const intervalId = setInterval(poll, pollingInterval);
    return () => clearInterval(intervalId);
  }, [poll]);

  return (
    <Container className="overflow-x-auto">
      <StatisticsSummaryCard
        statistics={data.statistics}
        className={minWidthStyle}
      />
      <Spacer size={24} />
      <h2 className="text-2xl font-bold">Dashboard</h2>
      <Spacer size={36} />
      <RateChart rates={data.rates} className={minWidthStyle} />
    </Container>
  );
}
