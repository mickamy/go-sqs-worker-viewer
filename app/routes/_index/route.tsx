import { LoaderFunction } from "@remix-run/node";

import { scanAllList } from "~/lib/redis";
import {
  calculateFailureRate,
  calculateSuccessRate,
  JobStatistics,
  JobStatus,
} from "~/models/job-statistics";
import IndexScreen from "~/routes/_index/components/index-screen";

export const loader: LoaderFunction = async () => {
  const messages = await scanAllList({ pattern: "statuses:*" });

  const statistics: JobStatistics = Object.values(messages)
    .flatMap((data: string[]) => data) // 各リストの要素を展開
    .reduce<JobStatistics>(
      (statistics, status) => {
        if (status in statistics) {
          return {
            ...statistics,
            [status]: statistics[status as JobStatus] + 1,
          };
        }
        return statistics;
      },
      {
        queued: 0,
        processing: 0,
        retrying: 0,
        success: 0,
        failed: 0,
      }
    );

  return {
    statistics,
    successRate: calculateSuccessRate(statistics),
    failureRate: calculateFailureRate(statistics),
  };
};

export default function Index() {
  return <IndexScreen />;
}
