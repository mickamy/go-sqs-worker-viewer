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
