import { LoaderFunction } from "@remix-run/node";

import JobScreen, {
  LoaderData,
} from "~/routes/jobs.$job_id/components/job-screen";
import { getJob } from "~/service/job-service";

export const loader: LoaderFunction = async ({ params }) => {
  const { job_id } = params;
  if (!job_id) {
    throw new Response(null, { status: 404 });
  }
  const job = await getJob({ id: job_id });
  return { job } as LoaderData;
};

export default function Job() {
  return <JobScreen />;
}
