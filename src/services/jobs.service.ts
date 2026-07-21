import { GetJobsParams, GetJobsResponse } from "@/models/job";
import { api } from "./api";

/**
 * Fetches a paginated list of jobs from the API.
 *
 * Supports filtering, searching, sorting, and pagination through query
 * parameters. Any undefined parameter will be omitted from the request URL.
 *
 * @param params - Optional query parameters used to filter, sort, and paginate
 * the job listings.
 *
 * @returns A promise that resolves to a {@link GetJobsResponse} containing
 * the matching job listings.
 *
 * @example
 * // Fetch the first page of jobs
 * const jobs = await getJobs();
 *
 * @example
 * // Search for frontend jobs
 * const jobs = await getJobs({
 *   search: "Frontend",
 * });
 *
 * @example
 * // Get remote jobs in Yogyakarta
 * const jobs = await getJobs({
 *   location: "REMOTE",
 *   province: "DI Yogyakarta",
 * });
 *
 * @example
 * // Fetch open jobs with a budget between 2M and 5M
 * const jobs = await getJobs({
 *   minBudget: 2_000_000,
 *   maxBudget: 5_000_000,
 *   isOpen: true,
 * });
 *
 * @example
 * // Get the second page, sorted by newest
 * const jobs = await getJobs({
 *   page: 2,
 *   limit: 10,
 *   sort: "newest",
 * });
 */
export async function getJobs(params?: GetJobsParams) {
  const query = new URLSearchParams();

  if (params?.page) query.set("page", params.page.toString());
  if (params?.limit) query.set("limit", params.limit.toString());
  if (params?.search) query.set("search", params.search);
  if (params?.city) query.set("city", params.city);
  if (params?.province) query.set("province", params.province);
  if (params?.location) query.set("location", params.location);
  if (params?.minBudget) query.set("minBudget", params.minBudget.toString());
  if (params?.maxBudget) query.set("maxBudget", params.maxBudget.toString());

  if (params?.isOpen !== undefined) {
    query.set("isOpen", String(params.isOpen));
  }

  if (params?.sort) query.set("sort", params.sort);

  return api<GetJobsResponse>(`/api/jobs?${query.toString()}`);
}