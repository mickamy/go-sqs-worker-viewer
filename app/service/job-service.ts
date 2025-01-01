import redis, { scan } from "~/lib/redis";
import { convertMapToJob, Job } from "~/models/job";
import { JobStatus } from "~/models/job-statistics";

export async function getJobs({
  index,
  count,
  status,
}: {
  index: number;
  count: number;
  status: JobStatus;
}): Promise<{ jobs: Job[]; total: number }> {
  const { response: idToStatus } = await scan({
    pattern: `statuses:*:${status}`,
    cursor: index,
    chunkSize: count,
  });

  const ids = Object.keys(idToStatus).map((key) => key.split(":")[1]);

  const pipeline = redis.pipeline();
  ids.forEach((id) => pipeline.hgetall(`messages:${id}`));
  const responses = await pipeline.exec();

  if (!responses) {
    return { jobs: [], total: 0 };
  }

  const jobs = ids.reduce((acc, key, index) => {
    const [err, value] = responses[index];
    if (err) {
      console.error("error during HGETALL:", err);
      return acc;
    }
    if (value && Object.keys(value).length > 0) {
      acc.push(
        convertMapToJob({ id: key, message: value as Record<string, string> })
      );
    }
    return acc;
  }, [] as Job[]);

  const total = await redis.llen(`statuses:*:${status}`);
  return { jobs, total };
}
