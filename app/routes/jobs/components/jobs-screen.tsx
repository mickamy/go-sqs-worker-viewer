import { useLoaderData, useSearchParams } from "@remix-run/react";
import { LoaderCircle } from "lucide-react";
import { useCallback, useRef, useState } from "react";

import JobsTable from "~/components/jobs-table";
import { Job } from "~/models/job";

interface LoaderData {
  jobs: Job[];
  nextCursor: number;
}

export default function JobsScreen() {
  const loaderData = useLoaderData<LoaderData>();
  const [jobs, setJobs] = useState(loaderData.jobs);
  const [nextCursor, setNextCursor] = useState(loaderData.nextCursor);
  const [hasMore, setHasMore] = useState(nextCursor > 0 && jobs.length > 0);
  const observer = useRef<IntersectionObserver | null>(null);

  const [params] = useSearchParams();
  const status = params.get("status");
  if (!status) {
    throw new Error("missing status parameter");
  }

  const fetchJobs = useCallback(async () => {
    try {
      const data = await fetch(
        `/api/jobs?status=${status}&cursor=${nextCursor}`,
      ).then((response) => response.json());
      setJobs((prev) => [...prev, ...data.jobs]);
      setNextCursor(data.nextCursor);
      if (data.nextCursor == 0) {
        setHasMore(false);
      }
    } catch (e) {
      console.error("failed to fetch jobs", e);
      throw new Error("failed to fetch jobs");
    }
  }, [status, nextCursor]);

  const loaderRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(async (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          await fetchJobs();
        }
      });

      if (node) observer.current.observe(node);
    },
    [observer, hasMore, fetchJobs],
  );

  return (
    <div className="mx-auto overflow-x-auto mb-12">
      <div className="relative flex flex-col items-center">
        <JobsTable jobs={jobs} />
        {hasMore && (
          <div
            ref={loaderRef}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          >
            <LoaderCircle className="h-8 w-8 animate-spin text-gray-500" />
          </div>
        )}
      </div>
    </div>
  );
}
