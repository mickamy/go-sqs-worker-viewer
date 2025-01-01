import { JobStatus } from "~/models/job-statistics";
import { convertMapToMessage, Message } from "~/models/message";

export interface Job extends Message {
  readonly id: string;
}

export function convertMapToJob({
  id,
  message,
  status,
}: {
  id: string;
  message: Record<string, string>;
  status: JobStatus;
}): Job {
  return {
    ...convertMapToMessage({ message, status }),
    id,
  };
}
