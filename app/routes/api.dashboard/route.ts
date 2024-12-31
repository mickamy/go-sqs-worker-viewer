import { scanAllList } from "~/lib/redis";
import { JobRate } from "~/models/job-rate";
import {
  calculateFailureRate,
  calculateSuccessRate,
  JobStatistics,
  JobStatus,
} from "~/models/job-statistics";

export const loader = async () => {
  const messages = await scanAllList({ pattern: "statuses:*" });

  const statistics: JobStatistics = Object.values(messages)
    .flatMap((data: string[]) => data)
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

  const rate: JobRate = {
    timestamp: new Date().toISOString(),
    success: calculateSuccessRate(statistics),
    failure: calculateFailureRate(statistics),
  };

  return Response.json({
    statistics,
    rate,
  });
};
