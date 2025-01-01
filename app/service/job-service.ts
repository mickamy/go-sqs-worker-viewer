import redis, { scanList } from "~/lib/redis";
import { convertMapToJob, Job } from "~/models/job";
import { JobStatus } from "~/models/job-statistics";

export async function getJobs({
  index,
  status,
}: {
  index: number;
  status: JobStatus;
}): Promise<Job[]> {
  const { response: idToStatus } = await scanList({
    pattern: `statuses:*:${status}`,
    cursor: index,
  });

  const ids = Object.keys(idToStatus).map((key) => key.split(":")[1]);

  const pipeline = redis.pipeline();
  ids.forEach((id) => pipeline.hgetall(`messages:${id}`));
  const responses = await pipeline.exec();

  if (!responses) {
    return [];
  }

  return ids.reduce((acc, key, index) => {
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
}
