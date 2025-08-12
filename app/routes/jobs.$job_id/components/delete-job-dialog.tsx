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

export default function DeleteJobDialog({ job, open, setOpen }: Props) {
  const submit = useSubmit();
  const onDelete = useCallback(() => {
    submit(
      JSON.stringify({
        intent: "delete",
        id: job.id,
      }),
      {
        method: "delete",
        encType: "application/json",
      },
    );
    setOpen(false);
  }, [submit, job.id, setOpen]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Job</DialogTitle>
        </DialogHeader>
        <Button variant="destructive" onClick={onDelete}>
          Delete
        </Button>
      </DialogContent>
    </Dialog>
  );
}
