import { Link } from "@remix-run/react";
import { Menu } from "lucide-react";
import { HTMLAttributes, useCallback, useState } from "react";

import { cn } from "~/lib/utils";

interface Props extends HTMLAttributes<HTMLElement> {}

export default function Header({ className, ...props }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <header
      className={cn(
        "bg-white shadow-md py-4 px-6 z-10 fixed top-0 left-0 w-full",
        className,
      )}
      {...props}
    >
      <div className="flex justify-between items-center">
        <button
          className="block md:hidden"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <Menu color="black" className="h-6 w-6 " />
        </button>
      </div>

      <nav
        className={cn(
          "flex-col gap-4 mt-4 md:flex-row md:gap-4 md:mt-0",
          isOpen ? "flex" : "hidden",
          "md:block md:space-x-2",
        )}
      >
        <Link to="/" className="hover:underline">
          Dashboard
        </Link>
        <Link
          to="/jobs?status=queued"
          onClick={closeMenu}
          className="hover:underline"
        >
          Queued
        </Link>
        <Link
          to="/jobs?status=processing"
          onClick={closeMenu}
          className="hover:underline"
        >
          Processing
        </Link>
        <Link
          to="/jobs?status=retrying"
          onClick={closeMenu}
          className="hover:underline"
        >
          Retrying
        </Link>
        <Link
          to="/jobs?status=success"
          onClick={closeMenu}
          className="hover:underline"
        >
          Success
        </Link>
        <Link
          to="/jobs?status=failed"
          onClick={closeMenu}
          className="hover:underline"
        >
          Failed
        </Link>
      </nav>
    </header>
  );
}
