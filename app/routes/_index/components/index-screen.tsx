import { useLoaderData } from "@remix-run/react";
import { useCallback, useEffect, useState } from "react";

import Spacer from "~/components/spacer";
import { Slider } from "~/components/ui/slider";
import { JobRate } from "~/models/job-rate";
import RateChart from "~/routes/_index/components/rate-chart";

interface LoaderData {
  rate: JobRate;
}

const defaultInterval = 5000;

export default function IndexScreen() {
  const _data = useLoaderData<LoaderData>();
  const [data, setData] = useState({
    ..._data,
    rates: [_data.rate],
  });

  const [pollingInterval, setPollingInterval] = useState(defaultInterval);

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
  }, [poll, pollingInterval]);

  return (
    <div className="mx-12">
      <div className="flex flex-row justify-between">
        <h2 className="text-2xl font-bold">Dashboard</h2>
        <div className="space-y-2">
          <div className="flex flex-row space-x-2">
            <span className="text-sm">Polling interval: </span>
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
      </div>
      <Spacer size={36} />
      <RateChart rates={data.rates} />
    </div>
  );
}
