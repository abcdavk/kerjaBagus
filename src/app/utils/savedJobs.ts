// Helper untuk mengelola bookmark di LocalStorage

const SAVED_JOBS_KEY = "kb_saved_jobs";

export const getSavedJobs = (): any[] => {
  if (typeof window === "undefined") return [];
  const saved = localStorage.getItem(SAVED_JOBS_KEY);
  return saved ? JSON.parse(saved) : [];
};

export const isJobSaved = (jobId: string): boolean => {
  const savedJobs = getSavedJobs();
  return savedJobs.some((job) => job.id === jobId);
};

export const toggleSaveJob = (job: any): boolean => {
  const savedJobs = getSavedJobs();
  const exists = savedJobs.some((item) => item.id === job.id);

  let updatedJobs: any[];
  if (exists) {
    // Hapus dari bookmark
    updatedJobs = savedJobs.filter((item) => item.id !== job.id);
  } else {
    // Tambahkan ke bookmark
    updatedJobs = [...savedJobs, job];
  }

  localStorage.setItem(SAVED_JOBS_KEY, JSON.stringify(updatedJobs));
  return !exists; // Menyerahkan status baru: true (tersimpan) / false (dihapus)
};