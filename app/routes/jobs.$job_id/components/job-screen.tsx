import { useLoaderData, useSubmit } from "@remix-run/react";
import { useCallback } from "react";

import Container from "~/components/container";
import { Job } from "~/models/job";
import JobCard from "~/routes/jobs.$job_id/components/job-card";

export interface LoaderData {
  job: Job;
}

export default function JobScreen() {
  const { job } = useLoaderData<LoaderData>();

  const submit = useSubmit();
  const onStatusChange = useCallback(
    (data: { id: string; oldStatus: string; newStatus: string }) => {
      submit(JSON.stringify(data), {
        method: "put",
        encType: "application/json",
      });
    },
    [submit],
  );
  return (
    <Container className="mx-auto mt-8">
      <JobCard job={job} onStatusChange={onStatusChange} />
    </Container>
  );
}
