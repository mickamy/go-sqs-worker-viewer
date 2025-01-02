import { HTMLAttributes } from "react";

import { cn } from "~/lib/utils";

interface Props extends HTMLAttributes<HTMLParagraphElement> {
  message: string | undefined;
}

export default function ErrorMessage({ message, className, ...props }: Props) {
  if (!message) {
    return null;
  }
  return (
    <p
      className={cn("text-sm font-medium text-destructive", className)}
      {...props}
    >
      {message}
    </p>
  );
}
