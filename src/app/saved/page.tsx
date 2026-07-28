"use client";

import React, { useEffect, useState } from "react";
import JobCard from "@/app/components/jobCard";
import { getSavedJobs } from "@/app/utils/savedJobs"; 
import { RiBookmarkLine } from "@remixicon/react";
import Link from "next/link";

export default function SavedJobsPage() {
  const [savedJobs, setSavedJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Ambil data yang tersimpan dari localStorage
    const jobs = getSavedJobs();
    setSavedJobs(jobs);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 text-center text-gray-500">
        Memuat pekerjaan tersimpan...
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 md:px-6 py-10">
      {/* HEADER */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900">
          Pekerjaan Tersimpan ({savedJobs.length})
        </h1>
        <p className="mt-2 text-gray-500">
          Daftar lowongan yang kamu tandai untuk dilamar nanti.
        </p>
      </div>

      {/* JIKA BELUM ADA JOB YANG DISIMPAN */}
      {savedJobs.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 space-y-4 max-w-md mx-auto my-8 shadow-sm">
          <div className="w-16 h-16 bg-amber-50 text-[#F4991A] rounded-full flex items-center justify-center mx-auto">
            <RiBookmarkLine size={32} />
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-800">
              Belum Ada Pekerjaan Tersimpan
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Klik ikon bookmark pada kartu lowongan untuk menyimpannya di sini.
            </p>
          </div>
          <Link
            href="/jobs"
            className="inline-block bg-[#F4991A] hover:bg-amber-600 text-white font-semibold text-xs px-5 py-2.5 rounded-xl transition"
          >
            Cari Lowongan
          </Link>
        </div>
      ) : (
        /* RENDER DAFTAR CARD YANG DISIMPAN */
        <div className="grid grid-cols-1 gap-6 mb-7 md:grid-cols-2 xl:grid-cols-3">
          {savedJobs.map((job) => (
            <JobCard
              key={job.id}
              id={job.id}
              logoText={job.logoText}
              logoColor={job.logoColor}
              title={job.title}
              company={job.company}
              province={job.province}
              tags={job.tags || []}
              salaryRange={job.salaryRange}
              whatsapp={job.whatsapp}
              verified={job.verified}
            />
          ))}
        </div>
      )}
    </div>
  );
}