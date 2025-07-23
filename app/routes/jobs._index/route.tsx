import { LoaderFunction } from "@remix-run/node";
import { useSearchParams } from "@remix-run/react";

import { JobStatuses } from "~/models/job-status";
import JobsScreen, {
  LoaderData,
} from "~/routes/jobs._index/components/jobs-screen";
import { getJobStatistics } from "~/service/job-statistics-service";

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const params = url.searchParams;
  const status = params.get("status");
  if (!status || !(JobStatuses as string[]).includes(status)) {
    throw new Response(null, { status: 404, statusText: "Not Found" });
  }

  const response = await fetch(
    new URL(
      `/api/jobs?status=${status}`,
      `http://localhost:${process.env.PORT}`,
    ).toString(),
    {
      headers: request.headers,
    },
  );

  if (!response.ok) {
    throw new Response(null, { status: response.status });
  }

  const statistics = await getJobStatistics();

  const { jobs, nextCursor } = await response.json();
  return { statistics, jobs, nextCursor } as LoaderData;
};

export default function Jobs() {
  const [searchParams] = useSearchParams();
  const key = searchParams.toString();
  return <JobsScreen key={key} />;
}
