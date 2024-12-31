import { HTMLAttributes } from "react";

import { cn } from "~/lib/utils";

interface Props extends HTMLAttributes<HTMLDivElement> {}

export default function Container({ children, className, ...props }: Props) {
  return (
    <div
      className={cn(
        "mx-auto h-screen flex w-full flex-col justify-start px-12 lg:px-8",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
