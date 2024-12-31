import type { LinksFunction, LoaderFunction } from "@remix-run/node";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import { ReactNode } from "react";

import Container from "~/components/container";
import Header from "~/components/header";
import StatisticsCard from "~/components/statistics-card";
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
  const { statistics } = useLoaderData<{ statistics: JobStatistics }>();
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
        <div>
          <Header />
          <main className="pt-16">
            <Container className="min-w-[900px]">
              <StatisticsCard statistics={statistics} className="my-6" />
              {children}
            </Container>
          </main>
        </div>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
