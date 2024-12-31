export interface JobStatistics {
  readonly queued: number;
  readonly processing: number;
  readonly retrying: number;
  readonly success: number;
  readonly failed: number;
}

export type JobStatus = keyof JobStatistics;

export const JobStatuses: JobStatus[] = [
  "queued",
  "processing",
  "retrying",
  "success",
  "failed",
];

export function calculateSuccessRate(statistics: JobStatistics): number {
  const total = Object.values(statistics).reduce(
    (sum, count) => sum + count,
    0
  );
  const success = statistics.success;
  return total === 0 ? 0 : success / total;
}

export function calculateFailureRate(statistics: JobStatistics): number {
  const total = Object.values(statistics).reduce(
    (sum, count) => sum + count,
    0
  );
  const failed = statistics.failed;
  return total === 0 ? 0 : failed / total;
}
