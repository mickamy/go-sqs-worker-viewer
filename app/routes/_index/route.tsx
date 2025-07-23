import { LoaderFunction } from "@remix-run/node";

import IndexScreen from "~/routes/_index/components/index-screen";

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL("/api/dashboard", `http://localhost:${process.env.PORT}`);
  const response = await fetch(url.toString(), { headers: request.headers });

  if (!response.ok) {
    throw new Response(null, { status: response.status });
  }

  return await response.json();
};

export default function Index() {
  return <IndexScreen />;
}
