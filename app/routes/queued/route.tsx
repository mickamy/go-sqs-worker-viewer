import { LoaderFunction } from "@remix-run/node";

import QueuedScreen from "~/routes/queued/components/queued-screen";
import { getJobs } from "~/service/job-service";

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const params = url.searchParams;
  const index = parseInt(params.get("index") || "0", 10);

  const jobs = await getJobs({ index, status: "queued" });
  return { jobs };
};

export default function Queued() {
  return <QueuedScreen />;
}
