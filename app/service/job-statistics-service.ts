import { scanAllList } from "~/lib/redis";
import { JobStatistics, JobStatus } from "~/models/job-statistics";

export async function getJobStatistics(): Promise<JobStatistics> {
  const messages = await scanAllList({ pattern: "statuses:*" });
  return Object.keys(messages).reduce<JobStatistics>(
    (acc, key) => {
      const status = key.split(":")[2] as JobStatus;
      return {
        ...acc,
        [status]: acc[status] + 1,
      };
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
