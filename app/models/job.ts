import { convertMapToMessage, Message } from "~/models/message";

export interface Job extends Message {
  readonly id: string;
}

export function convertMapToJob({
  id,
  message,
}: {
  id: string;
  message: Record<string, string>;
}): Job {
  return {
    ...convertMapToMessage({ message }),
    id,
  };
}
