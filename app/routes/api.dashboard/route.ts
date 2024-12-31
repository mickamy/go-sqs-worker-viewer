import { JobRate } from "~/models/job-rate";
import {
  calculateFailureRate,
  calculateSuccessRate,
} from "~/models/job-statistics";
import { getJobStatistics } from "~/service/job-statistics-service";

export const loader = async () => {
  const statistics = await getJobStatistics();

  const rate: JobRate = {
    timestamp: new Date().toISOString(),
    success: calculateSuccessRate(statistics),
    failure: calculateFailureRate(statistics),
  };

  return Response.json({
    statistics,
    rate,
  });
};
