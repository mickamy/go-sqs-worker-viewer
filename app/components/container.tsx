import { HTMLAttributes } from "react";

import { cn } from "~/lib/utils";

interface Props extends HTMLAttributes<HTMLDivElement> {}

export default function Container({ children, className, ...props }: Props) {
  return (
    <div
      className={cn("mx-auto flex w-full flex-col justify-start", className)}
      {...props}
    >
      {children}
    </div>
  );
}
