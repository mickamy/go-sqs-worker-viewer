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

  process.on("SIGINT", async () => {
    await client.quit();
  });

  return client;
}

const redis = await init();

export default redis;

export async function scanAll({
  pattern,
  chunkSize = 1000,
}: {
  pattern: string;
  chunkSize?: number;
}): Promise<Record<string, string>> {
  const response: Record<string, string> = {};
  let cursor = 0;

  try {
    do {
      const { response: pageResponse, nextCursor } = await scan({
        cursor,
        pattern,
        chunkSize,
      });
      cursor = nextCursor;

      Object.assign(response, pageResponse);
    } while (cursor != 0);
  } catch (err) {
    console.error("error during SCAN:", err);
    throw err;
  }

  return response;
}

export async function scan({
  pattern,
  cursor = 0,
  chunkSize = 1000,
}: {
  pattern: string;
  cursor?: number;
  chunkSize?: number;
}): Promise<{
  response: Record<string, string>;
  nextCursor: number;
}> {
  const response: Record<string, string> = {};

  try {
    const [newCursor, keys] = await redis.scan(
      cursor,
      "MATCH",
      pattern,
      "COUNT",
      chunkSize,
    );

    for (const key of keys) {
      response[key] = (await redis.get(key))!;
    }

    return { response: response, nextCursor: parseInt(newCursor, 10) };
  } catch (err) {
    console.error("error during SCAN:", err);
    throw err;
  }
}
