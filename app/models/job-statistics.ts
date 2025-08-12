import { JobStatus } from "~/models/job-status";

export type JobStatistics = Record<JobStatus, number>;

export function calculateFailureRate(statistics: JobStatistics): number {
  const total = Object.values(statistics).reduce(
    (sum, count) => sum + count,
    0,
  );
  const failed = statistics.failed;
  return total === 0 ? 0 : failed / total;
}
