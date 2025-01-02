import { useLoaderData } from "@remix-run/react";
import { useCallback, useState } from "react";

import Spacer from "~/components/spacer";
import { JobRate } from "~/models/job-rate";
import RateChart from "~/routes/_index/components/rate-chart";

interface LoaderData {
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
    <div className="flex justify-center items-center">
      <div className="w-full max-w-6xl px-4">
        <Spacer size={12} />
        <RateChart rates={data.rates} poll={poll} className="w-full" />
      </div>
    </div>
  );
}
