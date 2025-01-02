import { LoaderFunction } from "@remix-run/node";

import JobScreen from "~/routes/jobs.$job_id/components/job-screen";

export const loader: LoaderFunction = async () => {
  return null;
};

export default function Job() {
  return <JobScreen />;
}
