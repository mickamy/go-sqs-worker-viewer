import { scanAll } from "~/lib/redis";
import { JobStatistics, JobStatus } from "~/models/job-statistics";

export async function getJobStatistics(): Promise<JobStatistics> {
  const keys = await scanAll({ pattern: "gsw:statuses:*" });
  return Object.keys(keys).reduce<JobStatistics>(
    (acc, key) => {
      const status = key.split(":")[3] as JobStatus;
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
    },
  );
}
