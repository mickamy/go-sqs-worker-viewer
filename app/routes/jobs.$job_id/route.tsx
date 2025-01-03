import { ActionFunction, LoaderFunction, redirect } from "@remix-run/node";

import JobScreen, {
  LoaderData,
} from "~/routes/jobs.$job_id/components/job-screen";
import { getJob, updateJobStatus } from "~/service/job-service";

export const loader: LoaderFunction = async ({ params }) => {
  const { job_id } = params;
  if (!job_id) {
    throw new Response(null, { status: 404 });
  }
  try {
    const job = await getJob({ id: job_id });
    return { job } as LoaderData;
  } catch (error) {
    throw new Response(null, { status: 404 });
  }
};

export default function Job() {
  return <JobScreen />;
}

export const action: ActionFunction = async ({ request }) => {
  if (request.method != "PUT") {
    throw new Response(null, { status: 405 });
  }

  const { id, oldStatus, newStatus } = await request.json();
  if (!id || !oldStatus || !newStatus) {
    throw new Response(null, { status: 400 });
  }
  try {
    await updateJobStatus({ id, fromStatus: oldStatus, toStatus: newStatus });
    return redirect(`/jobs/${id}`);
  } catch (error) {
    console.error("error during updateJobStatus:", error);
    throw new Response(null, { status: 400 });
  }
};
