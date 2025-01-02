import { LoaderFunction } from "@remix-run/node";

import { JobStatuses } from "~/models/job-statistics";
import JobsScreen from "~/routes/jobs/components/jobs-screen";
import { useSearchParams } from "@remix-run/react";

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const params = url.searchParams;
  const status = params.get("status");
  if (!status || !(JobStatuses as string[]).includes(status)) {
    throw new Response(null, { status: 404, statusText: "Not Found" });
  }

  const response = await fetch(
    new URL(`/api/jobs?status=${status}`, request.url).toString(),
    {
      headers: request.headers,
    },
  );

  if (!response.ok) {
    throw new Response(null, { status: response.status });
  }

  return await response.json();
};

export default function Jobs() {
  const [searchParams] = useSearchParams();
  const key = searchParams.toString();
  return <JobsScreen key={key} />;
}
