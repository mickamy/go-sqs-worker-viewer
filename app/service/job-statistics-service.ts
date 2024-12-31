import { scanAllList } from "~/lib/redis";
import { JobStatistics, JobStatus } from "~/models/job-statistics";

export async function getJobStatistics(): Promise<JobStatistics> {
  const messages = await scanAllList({ pattern: "statuses:*" });
  return Object.values(messages)
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
}
