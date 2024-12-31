import { LoaderFunction } from "@remix-run/node";

import { JobStatistics } from "~/models/job-statistics";
import IndexScreen from "~/routes/_index/components/index-screen";

export const loader: LoaderFunction = async () => {
  const statistics: JobStatistics = {
    queued: 1,
    processing: 2,
    retrying: 3,
    success: 4,
    failed: 5,
  };
  return { statistics };
};

export default function Index() {
  return <IndexScreen />;
}
