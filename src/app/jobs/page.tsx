import JobCard from "@/app/components/jobCard";
import { jobs } from "./data";

export default function JobsPage() {
  return (
    <div className="p-6 flex items-center justify-center flex-col gap-6">
      <h1 className="text-xl font-bold mb-4">
        {jobs.length} Lowongan Tersedia
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        {jobs.map((job) => (
          <JobCard key={job.id} {...job} />
        ))}
      </div>
    </div>
  );
}
