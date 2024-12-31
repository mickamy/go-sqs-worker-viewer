export interface JobStatistics {
  readonly queued: number;
  readonly processing: number;
  readonly retrying: number;
  readonly success: number;
  readonly failed: number;
}
