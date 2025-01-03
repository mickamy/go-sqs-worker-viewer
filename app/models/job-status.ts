export type JobStatus =
  | "queued"
  | "processing"
  | "retrying"
  | "success"
  | "failed";

export const JobStatuses: JobStatus[] = [
  "queued",
  "processing",
  "retrying",
  "success",
  "failed",
];

export function getSelectableJobStatuses(status: JobStatus): JobStatus[] {
  switch (status) {
    case "queued":
      return ["success", "failed"];
    case "processing":
      return [];
    case "retrying":
      return ["success", "failed"];
    case "success":
      return [];
    case "failed":
      return [];
    default:
      return [];
  }
}
