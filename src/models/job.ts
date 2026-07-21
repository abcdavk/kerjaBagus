import { Job } from "@/generated/prisma/client";

export interface GetJobsParams {
  page?: number;
  limit?: number;

  search?: string;

  city?: string;
  province?: string;

  location?: "ONSITE" | "REMOTE" | "HYBRID";

  minBudget?: number;
  maxBudget?: number;

  isOpen?: boolean;

  sort?: "newest" | "oldest" | "budget";
}

export interface GetJobsResponse {
  data: Job[];

  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}