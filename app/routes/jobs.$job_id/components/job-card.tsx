import { useState } from "react";

import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Job } from "~/models/job";
import { JobStatus } from "~/models/job-statistics";

interface Props {
  job: Job;
}

export default function JobCard({ job }: Props) {
  const [isPayloadOpen, setIsPayloadOpen] = useState(false);

  return (
    <Card className="w-full max-w-3xl mx-auto mt-8">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          Message Details
          <span className="ml-2 text-lg font-normal text-gray-500">
            ID: {job.id}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="grid grid-cols-3 gap-4">
          <div className="col-span-1 flex flex-col">
            <dt className="text-sm font-medium text-gray-500">Type</dt>
            <dd className="mt-1 text-sm text-gray-900">{job.type}</dd>
          </div>
          <div className="col-span-1 flex flex-col">
            <dt className="text-sm font-medium text-gray-500">Status</dt>
            <dd className="mt-1 text-sm text-gray-900">
              <Badge
                variant={job.status === "success" ? "default" : "secondary"}
              >
                {formatStatus(job.status)}
              </Badge>
            </dd>
          </div>
          <div className="col-span-1 flex flex-col">
            <dt className="text-sm font-medium text-gray-500">Retry Count</dt>
            <dd className="mt-1 text-sm text-gray-900">{job.retry_count}</dd>
          </div>
          <div className="col-span-3 flex flex-col">
            <dt className="text-sm font-medium text-gray-500">Caller</dt>
            <dd className="mt-1 text-sm text-gray-900">{job.caller}</dd>
          </div>
          <div className="col-span-3 flex flex-col">
            <dt className="text-sm font-medium text-gray-500">Payload</dt>
            <dd className="mt-1 text-sm text-gray-900">
              <Dialog open={isPayloadOpen} onOpenChange={setIsPayloadOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">View Payload</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Payload</DialogTitle>
                  </DialogHeader>
                  <ScrollArea className="h-[200px] w-full rounded-md border p-4">
                    <pre className="text-sm">{job.payload}</pre>
                  </ScrollArea>
                </DialogContent>
              </Dialog>
            </dd>
          </div>
          <div className="col-span-3 sm:col-span-1 flex flex-col">
            <dt className="text-sm font-medium text-gray-500">Created At</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {formatDate(job.created_at)}
            </dd>
          </div>
          <div className="col-span-3 sm:col-span-1 flex flex-col">
            <dt className="text-sm font-medium text-gray-500">Updated At</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {formatDate(job.updated_at)}
            </dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  );
}

function formatDate(date: string): string {
  return new Date(date).toLocaleString();
}

function formatStatus(status: JobStatus): string {
  return status.charAt(0).toUpperCase() + status.slice(1);
}
