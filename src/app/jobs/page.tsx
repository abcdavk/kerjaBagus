import { Suspense } from "react";
import JobsContent from "./JobsContent";
import { Loading } from "../components/loading";

export default function JobsPage() {
  return (
    <Suspense fallback={<Loading />}>
      <JobsContent />
    </Suspense>
  );
}
