import Redis from "ioredis";

async function init() {
  const client = new Redis(process.env.REDIS_URL);

  client.on("error", (err: Error) => {
    console.error("redis connection error:", err);
  });

  try {
    await client.ping();
  } catch (err) {
    console.error("failed to connect to Redis:", err);
    throw err;
  }

  return client;
}

const redis = await init();

export default redis;

export async function scanAllList({
  pattern,
  chunkSize = 1000,
}: {
  pattern: string;
  chunkSize?: number;
}): Promise<Record<string, string[]>> {
  const results: Record<string, string[]> = {};
  let cursor = "0";

  try {
    do {
      const [newCursor, keys] = await redis.scan(
        cursor,
        "MATCH",
        pattern,
        "COUNT",
        chunkSize
      );
      cursor = newCursor;

      for (const key of keys) {
        results[key] = await redis.lrange(key, 0, -1);
      }
    } while (cursor !== "0");
  } catch (err) {
    console.error("error during SCAN:", err);
    throw err;
  }

  return results;
}
