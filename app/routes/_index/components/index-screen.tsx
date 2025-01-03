import { useLoaderData } from "@remix-run/react";
import { useCallback, useState } from "react";

import Container from "~/components/container";
import Spacer from "~/components/spacer";
import StatisticsCard from "~/components/statistics-card";
import { cn } from "~/lib/utils";
import { JobRate } from "~/models/job-rate";
import { JobStatistics } from "~/models/job-statistics";
import RateChart from "~/routes/_index/components/rate-chart";

interface LoaderData {
  statistics: JobStatistics;
  rate: JobRate;
}

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

  return (
    <>
      <div className="w-full px-4">
        <StatisticsCard
          statistics={data.statistics}
          className={cn("w-full max-w-7xl mx-auto my-4")}
        />
      </div>
      <Container className="flex justify-center items-center w-full max-w-6xl px-4">
        <Spacer size={12} />
        <RateChart rates={data.rates} poll={poll} className="w-full" />
      </Container>
      ;
    </>
  );
}
