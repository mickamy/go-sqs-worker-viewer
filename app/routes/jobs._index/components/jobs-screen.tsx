import { useLoaderData, useNavigate, useSearchParams } from "@remix-run/react";
import { LoaderCircle } from "lucide-react";
import { useCallback, useRef, useState } from "react";

import { Job } from "~/models/job";
import JobsTable from "~/routes/jobs._index/components/jobs-table";

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

      observer.current = new IntersectionObserver(
        async (entries) => {
          if (entries[0].isIntersecting && hasMore) {
            await fetchJobs();
          }
        },
        { rootMargin: "200px" },
      );

      if (node) observer.current.observe(node);
    },
    [fetchJobs, hasMore],
  );

  const navigate = useNavigate();
  const onClickRow = useCallback(
    (item: Job) => {
      navigate(`/jobs/${item.id}`);
    },
    [navigate],
  );

  return (
    <div className="mx-auto overflow-x-auto mb-12">
      <div className="relative flex flex-col items-center">
        <JobsTable jobs={jobs} onClickRow={onClickRow} />
        {hasMore && (
          <div
            ref={loaderRef}
            className="relative flex justify-center items-center"
          >
            <LoaderCircle className="h-8 w-8 animate-spin text-gray-500" />
          </div>
        )}
      </div>
    </div>
  );
}
