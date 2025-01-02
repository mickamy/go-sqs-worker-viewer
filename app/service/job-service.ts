import { redis, scan } from "~/lib/redis";
import { convertMapToJob, Job } from "~/models/job";
import { JobStatus } from "~/models/job-statistics";

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
    pattern: `statuses:*:${status}`,
    cursor,
    chunkSize: chunkSize,
  });

  const ids = Object.keys(idToStatus).map((key) => key.split(":")[1]);

  const pipeline = redis.pipeline();
  ids.forEach((id) => pipeline.hgetall(`messages:${id}`));
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
  const message = await redis.hgetall(`messages:${id}`);
  return convertMapToJob({ id, message });
}
