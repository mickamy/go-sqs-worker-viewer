import { HTMLAttributes } from "react";

import { cn } from "~/lib/utils";

interface Props extends HTMLAttributes<HTMLDivElement> {}

export default function Container({ children, className, ...props }: Props) {
  return (
    <div
      className={cn(
        "container mx-auto -h-full flex w-full flex-col justify-start px-12 py-8 lg:p-8",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
