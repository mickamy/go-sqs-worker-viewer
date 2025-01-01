import { Link } from "@remix-run/react";
import { HTMLAttributes } from "react";

import { cn } from "~/lib/utils";

interface Props extends HTMLAttributes<HTMLElement> {}

export default function Header({ className, ...props }: Props) {
  return (
    <header
      className={cn(
        "bg-white shadow-md py-4 px-6 z-10 fixed top-0 left-0 w-full",
        className
      )}
      {...props}
    >
      <nav className="flex gap-4">
        <Link to="/">Dashboard</Link>
        <Link to="/jobs?status=queued">Queued</Link>
        <Link to="/jobs?status=processing">Processing</Link>
        <Link to="/jobs?status=retrying">Retrying</Link>
        <Link to="/jobs?status=success">Success</Link>
        <Link to="/jobs?status=failed">Failed</Link>
      </nav>
    </header>
  );
}
