import { useLoaderData, useNavigate, useSearchParams } from "@remix-run/react";
import { LoaderCircle } from "lucide-react";
import { useCallback, useRef, useState } from "react";

import Container from "~/components/container";
import StatisticsCard from "~/components/statistics-card";
import { cn } from "~/lib/utils";
import { Job } from "~/models/job";
import { JobStatistics } from "~/models/job-statistics";
import JobsTable from "~/routes/jobs._index/components/jobs-table";

export interface LoaderData {
  statistics: JobStatistics;
  jobs: Job[];
  nextCursor: number;
}

export default function JobsScreen() {
  const data = useLoaderData<LoaderData>();
  const [jobs, setJobs] = useState(data.jobs);
  const [nextCursor, setNextCursor] = useState(data.nextCursor);
  const [hasMore, setHasMore] = useState(nextCursor > 0 && jobs.length > 0);
  const observer = useRef<IntersectionObserver | null>(null);

  const [params] = useSearchParams();
  const status = params.get("status");
  if (!status) {
    throw new Error("missing status parameter");
  }

  const fetchJobs = useCallback(async () => {
    try {
      const newData = await fetch(
        `/api/jobs?status=${status}&cursor=${nextCursor}`,
      ).then((response) => response.json());
      setJobs((prev) => [...prev, ...newData.jobs]);
      setNextCursor(newData.nextCursor);
      if (newData.nextCursor == 0) {
        setHasMore(false);
      }
    } catch (e) {
      console.error("failed to fetch jobs", e);
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
    <>
      <div className="w-full px-4">
        <StatisticsCard
          statistics={data.statistics}
          className={cn("w-full max-w-7xl mx-auto my-4")}
        />
      </div>
      <Container>
        <div className="mx-auto overflow-x-auto mb-12">
          <div className="relative flex flex-col items-center">
            <JobsTable jobs={jobs} onClickRow={onClickRow} />
            {hasMore && (
              <div
                ref={loaderRef}
                className="relative flex justify-center items-center mt-4"
              >
                <LoaderCircle className="h-8 w-8 animate-spin text-gray-500" />
              </div>
            )}
          </div>
        </div>
      </Container>
    </>
  );
}
