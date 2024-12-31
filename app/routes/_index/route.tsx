import { LoaderFunction } from "@remix-run/node";

import { scanAllList } from "~/lib/redis";
import IndexScreen from "~/routes/_index/components/index-screen";

export const loader: LoaderFunction = async () => {
  const messages = await scanAllList({ pattern: "statuses:*" });

  const counts = Object.values(messages)
    .flatMap((data) => data) // 各リストの要素を展開
    .reduce<Record<string, number>>(
      (counts, status) => {
        counts[status] = (counts[status] || 0) + 1;
        return counts;
      },
      {
        queued: 0,
        processing: 0,
        retrying: 0,
        success: 0,
        failed: 0,
      }
    );

  return {
    statistics: counts,
  };
};

export default function Index() {
  return <IndexScreen />;
}
