import { redis, scan, withLock } from "~/lib/redis";
import { convertMapToJob, Job } from "~/models/job";
import { getSelectableJobStatuses, JobStatus } from "~/models/job-status";

export async function getJobs({
  status,
  cursor,
  chunkSize,
}: {
  status: JobStatus;
  cursor: number;
  chunkSize: number;
}): Promise<{ jobs: Job[]; nextCursor: number }> {
  const { response: idToStatus, nextCursor } = await scan({
    pattern: `gsw:statuses:*:${status}`,
    cursor,
    chunkSize: chunkSize,
  });

  const ids = Object.keys(idToStatus).map((key) => key.split(":")[2]);

  const pipeline = redis.pipeline();
  ids.forEach((id) => pipeline.hgetall(`gsw:messages:${id}`));
  const responses = await pipeline.exec();

  if (!responses) {
    return { jobs: [], nextCursor };
  }

  const jobs = ids.reduce((acc, key, index) => {
    const [err, value] = responses[index];
    if (err) {
      console.error("error during HGETALL:", err);
      return acc;
    }
    if (value && Object.keys(value).length > 0) {
      acc.push(
        convertMapToJob({
          id: key,
          message: value as Record<string, string>,
        }),
      );
    }
    return acc;
  }, [] as Job[]);

  return { jobs, nextCursor };
}

export async function getJob({ id }: { id: string }): Promise<Job> {
  const message = await redis.hgetall(`gsw:messages:${id}`);
  if (!message || Object.keys(message).length === 0) {
    throw new Error("job not found");
  }
  return convertMapToJob({ id, message });
}

export async function updateJobStatus({
  id,
  fromStatus,
  toStatus,
}: {
  id: string;
  fromStatus: JobStatus;
  toStatus: JobStatus;
}): Promise<void> {
  const selectable = getSelectableJobStatuses(fromStatus);
  if (!selectable.includes(toStatus)) {
    throw new Error("invalid status transition");
  }

  return withLock({
    key: `gsw:locks:${id}`,
    execution: async () => {
      const tx = redis.multi();
      tx.set(`gsw:statuses:${toStatus}:${id}`, "");
      tx.del(`gsw:statuses:${fromStatus}:${id}`);
      tx.hset(`gsw:messages:${id}`, "status", toStatus);

      const result = await tx.exec();
      if (!result) {
        throw new Error("error during transaction execution");
      }

      const hasError = result.some(([err]) => err !== null);
      if (hasError) {
        throw new Error("error during transaction execution");
      }
    },
  });
}
