import { useLoaderData } from "@remix-run/react";

import { JobStatistics } from "~/models/job-statistics";

interface LoaderData {
  statistics?: JobStatistics;
}

export default function IndexScreen() {
  const { statistics } = useLoaderData<LoaderData>();
  return (
    <div>
      <h1>Job Statistics</h1>
      <ul>
        <li>Queued: {statistics?.queued}</li>
        <li>Processing: {statistics?.processing}</li>
        <li>Retrying: {statistics?.retrying}</li>
        <li>Success: {statistics?.success}</li>
        <li>Failed: {statistics?.failed}</li>
      </ul>
    </div>
  );
}
