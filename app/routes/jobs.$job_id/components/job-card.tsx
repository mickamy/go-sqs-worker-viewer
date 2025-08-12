import { useSubmit } from "@remix-run/react";
import { useCallback, useEffect, useState } from "react";

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
import { ScrollArea, ScrollBar } from "~/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Job } from "~/models/job";
import { getSelectableJobStatuses, JobStatus } from "~/models/job-status";
import DeleteJobDialog from "~/routes/jobs.$job_id/components/delete-job-dialog";
import RetryJobDialog from "~/routes/jobs.$job_id/components/retry-job-dialog";

interface Props {
  job: Job;
}

export default function JobCard({ job }: Props) {
  const [formattedDates, setFormattedDates] = useState({
    createdAt: "",
    updatedAt: "",
  });

  useEffect(() => {
    setFormattedDates({
      createdAt: formatDate(job.created_at),
      updatedAt: formatDate(job.updated_at),
    });
  }, [job]);

  const [payloadOpen, setPayloadOpen] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [retryDialogOpen, setRetryDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<JobStatus | null>(null);

  const handleStatusChange = (status: JobStatus) => {
    setNewStatus(status);
  };

  const submit = useSubmit();
  const onStatusChange = useCallback(
    (data: { id: string; oldStatus: string; newStatus: string }) => {
      submit(JSON.stringify({ ...data, intent: "update" }), {
        method: "put",
        encType: "application/json",
      });
    },
    [submit],
  );

  const handleStatusSubmit = useCallback(() => {
    if (newStatus) {
      onStatusChange({ id: job.id, oldStatus: job.status, newStatus });
      setStatusDialogOpen(false);
      setNewStatus(null);
    }
  }, [onStatusChange, job, newStatus]);

  const selectableJobStatus = getSelectableJobStatuses(job.status);
  const isStatusChangeable = selectableJobStatus.length > 0;

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
            <dd className="mt-2 text-base font-mono break-words">
              {job.caller}
            </dd>
          </div>
          <div className="col-span-3">
            <dt className="text-base text-gray-500">Payload</dt>
            <dd className="mt-2">
              <Dialog open={payloadOpen} onOpenChange={setPayloadOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    View Payload
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-[90vw] sm:max-w-[900px]">
                  <DialogHeader>
                    <DialogTitle>Payload</DialogTitle>
                  </DialogHeader>

                  <ScrollArea className="max-h-[65vh] w-full rounded-md border">
                    <div className="p-4">
                      <pre className="text-sm whitespace-pre inline-block">
                        {JSON.stringify(JSON.parse(job.payload), null, 2)}
                      </pre>
                    </div>
                    <ScrollBar orientation="horizontal" />
                  </ScrollArea>
                </DialogContent>
              </Dialog>
            </dd>
          </div>
          <div className="col-span-3 grid grid-cols-2 gap-x-8">
            <div className="col-span-1">
              <dt className="text-base text-gray-500">Created At</dt>
              <dd className="mt-2 text-base min-w-6">
                {formattedDates.createdAt}
              </dd>
            </div>
            <div className="col-span-1 flex flex-col">
              <dt className="text-base text-gray-500">Updated At</dt>
              <dd className="mt-2 text-base min-w-6">
                {formattedDates.updatedAt}
              </dd>
            </div>
          </div>
        </dl>
      </CardContent>
      <CardFooter className="flex justify-end">
        {isStatusChangeable && (
          <Button variant="default" onClick={() => setStatusDialogOpen(true)}>
            Change Job Status
          </Button>
        )}
        {job.status === "failed" && (
          <div className="flex space-x-3">
            <Button variant="default" onClick={() => setRetryDialogOpen(true)}>
              Retry Job
            </Button>
            <Button
              variant="destructive"
              onClick={() => setDeleteDialogOpen(true)}
            >
              Delete Job
            </Button>
          </div>
        )}
      </CardFooter>
      <Dialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
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
              {selectableJobStatus.map((status) => (
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
      <RetryJobDialog
        job={job}
        open={retryDialogOpen}
        setOpen={setRetryDialogOpen}
      />
      <DeleteJobDialog
        job={job}
        open={deleteDialogOpen}
        setOpen={setDeleteDialogOpen}
      />
    </Card>
  );
}

function formatDate(date: string): string {
  return new Date(date).toLocaleString();
}

function formatStatus(status: JobStatus): string {
  return status.charAt(0).toUpperCase() + status.slice(1);
}
