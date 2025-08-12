import { ActionFunction, LoaderFunction, redirect } from "@remix-run/node";

import JobScreen, {
  LoaderData,
} from "~/routes/jobs.$job_id/components/job-screen";
import {
  deleteJob,
  getJob,
  retryJob,
  updateJobStatus,
} from "~/service/job-service";

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
  const { intent, ...rest } = await request.json();
  switch (intent) {
    case "update": {
      const { id, oldStatus, newStatus } = rest;
      if (!id || !oldStatus || !newStatus) {
        throw new Response(null, { status: 400 });
      }
      try {
        await updateJobStatus({
          id,
          fromStatus: oldStatus,
          toStatus: newStatus,
        });
        return redirect(`/jobs/${id}`);
      } catch (error) {
        console.error("failed to update job status", error);
        throw new Response(null, { status: 500 });
      }
    }
    case "retry": {
      const { id } = rest;
      if (!id) {
        throw new Response(null, { status: 400 });
      }
      try {
        await retryJob({ id });
        return redirect(`/jobs/${id}`);
      } catch (error) {
        throw new Response(null, { status: 500 });
      }
    }
    case "delete": {
      const { id } = rest;
      if (!id) {
        throw new Response(null, { status: 400 });
      }
      try {
        await deleteJob({ id });
        return redirect("/");
      } catch (error) {
        console.error("failed to delete job", error);
        throw new Response(null, { status: 500 });
      }
    }
  }
};
