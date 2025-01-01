import type { LinksFunction, LoaderFunction } from "@remix-run/node";
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import { ReactNode } from "react";

import Container from "~/components/container";
import Header from "~/components/header";
import StatisticsCard from "~/components/statistics-card";
import { cn } from "~/lib/utils";
import { JobStatistics } from "~/models/job-statistics";
import { getJobStatistics } from "~/service/job-statistics-service";
import tailwindStyles from "~/tailwind.css?url";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: tailwindStyles },
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export const loader: LoaderFunction = async () => {
  return {
    statistics: await getJobStatistics(),
  };
};

export function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>go-sqs-worker-viewer</title>
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const { statistics } = useLoaderData<{ statistics: JobStatistics }>();
  return (
    <div>
      <Header />
      <main className="pt-16">
        <Container>
          <StatisticsCard
            statistics={statistics}
            className={cn("mx-2 my-4", "md:mx-12")}
          />
          <Outlet />
        </Container>
      </main>
    </div>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  return (
    <div className="flex items-center justify-center w-full min-h-screen">
      <h1 className="text-xl">
        {isRouteErrorResponse(error)
          ? `${error.status} ${error.statusText}`
          : error instanceof Error
            ? error.message
            : "Unknown Error"}
      </h1>
    </div>
  );
}
