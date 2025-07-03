import { useSubmit } from "@remix-run/react";
import { useCallback } from "react";

import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Job } from "~/models/job";

interface Props {
  job: Job;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function RetryJobDialog({ job, open, setOpen }: Props) {
  const submit = useSubmit();
  const onRetry = useCallback(() => {
    submit(
      JSON.stringify({
        intent: "retry",
        id: job.id,
      }),
      {
        method: "put",
        encType: "application/json",
      },
    );
    setOpen(false);
  }, [submit, job.id, setOpen]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Retry Job</DialogTitle>
        </DialogHeader>
        <Button onClick={onRetry}>Retry</Button>
      </DialogContent>
    </Dialog>
  );
}
