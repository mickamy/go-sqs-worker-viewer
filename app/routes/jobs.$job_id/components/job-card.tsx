import { useState } from "react";

import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { ScrollArea } from "~/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { cn } from "~/lib/utils";
import { Job } from "~/models/job";
import { JobStatus } from "~/models/job-statistics";

interface Props {
  job: Job;
  onStatusChange: ({
    id,
    newStatus,
  }: {
    id: string;
    newStatus: JobStatus;
  }) => void;
}

export default function JobCard({ job, onStatusChange }: Props) {
  const [isPayloadOpen, setIsPayloadOpen] = useState(false);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<JobStatus | null>(null);

  const handleStatusChange = (status: JobStatus) => {
    setNewStatus(status);
  };

  const handleStatusSubmit = () => {
    if (newStatus) {
      onStatusChange({ id: job.id, newStatus });
      setIsStatusDialogOpen(false);
      setNewStatus(null);
    }
  };

  const isStatusChangeable = selectableStatuses(job.status).length > 0;

  return (
    <Card className="w-full max-w-3xl mx-auto min-w-[400px] relative">
      <CardHeader>
        <CardTitle className="text-2xl">
          <div className="flex flex-row items-center space-x-4">
            <div>Job Details</div>
            <span className="text-base font-normal text-gray-500">
              ID: {job.id}
            </span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="grid grid-cols-3 gap-y-8">
          <div className="col-span-1">
            <dt className="text-base text-gray-500">Type</dt>
            <dd className="mt-2 text-base">{job.type}</dd>
          </div>
          <div className="col-span-1">
            <dt className="text-base text-gray-500">Status</dt>
            <dd className="mt-2">
              <Badge
                variant={
                  job.status === "failed"
                    ? "destructive"
                    : job.status === "success"
                      ? "default"
                      : "secondary"
                }
              >
                {formatStatus(job.status)}
              </Badge>
            </dd>
          </div>
          <div className="col-span-1">
            <dt className="text-base text-gray-500">Retry Count</dt>
            <dd className="mt-2 text-base">{job.retry_count}</dd>
          </div>
          <div className="col-span-3">
            <dt className="text-base text-gray-500">Caller</dt>
            <dd className="mt-2 text-base font-mono">{job.caller}</dd>
          </div>
          <div className="col-span-3">
            <dt className="text-base text-gray-500">Payload</dt>
            <dd className="mt-2">
              <Dialog open={isPayloadOpen} onOpenChange={setIsPayloadOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    View Payload
                  </Button>
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
          <div className="col-span-3 grid grid-cols-2 gap-x-8">
            <div className="col-span-1">
              <dt className="text-base text-gray-500">Created At</dt>
              <dd className="mt-2 text-base">{formatDate(job.created_at)}</dd>
            </div>
            <div className="col-span-1 flex flex-col">
              <dt className="text-base text-gray-500">Updated At</dt>
              <dd className="mt-2 text-base">{formatDate(job.updated_at)}</dd>
            </div>
          </div>
        </dl>
      </CardContent>
      <CardFooter
        className={cn("flex justify-end", !isStatusChangeable && "hidden")}
      >
        <Button variant="default" onClick={() => setIsStatusDialogOpen(true)}>
          Change Job Status
        </Button>
      </CardFooter>
      <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Job Status</DialogTitle>
          </DialogHeader>
          <Select
            onValueChange={handleStatusChange}
            value={newStatus || undefined}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select new status" />
            </SelectTrigger>
            <SelectContent>
              {selectableStatuses(job.status).map((status) => (
                <SelectItem key={status} value={status}>
                  {formatStatus(status)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={handleStatusSubmit} disabled={!newStatus}>
            Submit
          </Button>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

function selectableStatuses(status: JobStatus): JobStatus[] {
  switch (status) {
    case "queued":
      return ["success", "failed"];
    case "processing":
      return [];
    case "retrying":
      return ["success", "failed"];
    case "success":
      return [];
    case "failed":
      return [];
    default:
      return [];
  }
}

function formatDate(date: string): string {
  return new Date(date).toLocaleString();
}

function formatStatus(status: JobStatus): string {
  return status.charAt(0).toUpperCase() + status.slice(1);
}
