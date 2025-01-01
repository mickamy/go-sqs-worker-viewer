import { JobStatus } from "~/models/job-statistics";

export interface Message {
  readonly type: string;
  readonly payload: string;
  readonly status: JobStatus;
  readonly retry_count: number;
  readonly caller: string;
  readonly created_at: string;
  readonly updated_at: string;
}

export function convertMapToMessage({
  message,
  status,
}: {
  message: Record<string, string>;
  status: JobStatus;
}): Message {
  return {
    type: message.type,
    payload: message.payload,
    status: status,
    retry_count: Number(message.retry_count),
    caller: message.caller,
    created_at: message.created_at,
    updated_at: message.updated_at,
  };
}
