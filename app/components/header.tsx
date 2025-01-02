import { Link } from "@remix-run/react";
import { Menu, X } from "lucide-react";
import { HTMLAttributes, useCallback, useState } from "react";

import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { cn } from "~/lib/utils";

interface Props extends HTMLAttributes<HTMLElement> {}

const navItems = [
  { label: "Dashboard", href: "/" },
  { label: "Queued", href: "/jobs?status=queued" },
  { label: "Processing", href: "/jobs?status=processing" },
  { label: "Retrying", href: "/jobs?status=retrying" },
  { label: "Success", href: "/jobs?status=success" },
  { label: "Failed", href: "/jobs?status=failed" },
];

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
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-primary">
          go-sqs-worker-viewer
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className="text-gray-600 hover:text-primary transition-colors duration-200"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                {isOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {navItems.map((item) => (
                <DropdownMenuItem key={item.href} asChild>
                  <Link to={item.href} onClick={closeMenu} className="w-full">
                    {item.label}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
