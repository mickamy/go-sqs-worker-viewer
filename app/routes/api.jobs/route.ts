import { LoaderFunction } from "@remix-run/node";

import { Job } from "~/models/job";
import { JobStatus, JobStatuses } from "~/models/job-status";
import { getJobs } from "~/service/job-service";

const chunkSize = 100;

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const params = url.searchParams;
  const status = params.get("status");
  let cursor = parseInt(params.get("cursor") || "0", 10);
  if (!status || !(JobStatuses as string[]).includes(status)) {
    throw new Response(null, { status: 404, statusText: "Not Found" });
  }

  const jobs: Job[] = [];
  do {
    const { jobs: pageJobs, nextCursor } = await getJobs({
      status: status as JobStatus,
      cursor,
      chunkSize,
    });
    jobs.push(...pageJobs);
    cursor = nextCursor;
  } while (cursor > 0 && jobs.length < chunkSize);

  return Response.json({ jobs, nextCursor: cursor });
};
