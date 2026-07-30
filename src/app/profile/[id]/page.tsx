import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import BackButton from "@/app/components/backButton";
import JobCard from "@/app/components/jobCard";
import { getCompanyInitials } from "@/app/utils/company";
import {
  RiBriefcaseLine,
  RiGlobalLine,
  RiGithubFill,
  RiLinkedinBoxFill,
} from "@remixicon/react";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function PublicProfilePage({ params }: Props) {
  const { id } = await params;

  //  Mencari berdasarkan Profile ID atau User ID
  const profile = await prisma.profile.findFirst({
    where: {
      OR: [{ id: id }, { userId: id }],
    },
    include: {
      user: true,
      job: {
        where: { isOpen: true },
        include: { address: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!profile) {
    notFound();
  }

  // Format angka ke rupiah
  const formatCurrency = (value?: number | null) => {
    if (!value) return "0";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-6 md:px-6 md:py-10">
      <BackButton />

      {/* Header Profil Pembuat Lowongan */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-[#E2D2B4] text-2xl font-bold text-[#386641]">
            {getCompanyInitials(profile.displayName || "User")}
          </div>

          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">
              {profile.displayName || "Pembuat Lowongan"}
            </h1>
            <p className="text-sm font-medium text-[#F4991A]">{profile.headline}</p>
            <p className="mt-1 text-sm text-gray-500">
              {profile.user?.email || "Penyedia Pekerjaan"}
            </p>

            {/* Link Sosmed / Portfolio */}
            <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-gray-600">
              {profile.website && (
                <a
                  href={profile.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:text-[#F4991A]"
                >
                  <RiGlobalLine size={16} /> Website
                </a>
              )}
              {profile.github && (
                <a
                  href={profile.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:text-[#F4991A]"
                >
                  <RiGithubFill size={16} /> GitHub
                </a>
              )}
              {profile.linkedin && (
                <a
                  href={profile.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:text-[#F4991A]"
                >
                  <RiLinkedinBoxFill size={16} /> LinkedIn
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Bio jika ada */}
        {profile.bio && (
          <p className="mt-4 text-sm text-gray-600 border-t border-gray-100 pt-3">
            {profile.bio}
          </p>
        )}

        {/* Skills */}
        {profile.skills && profile.skills.length > 0 && (
          <div className="mt-4 border-t border-gray-100 pt-3">
            <p className="text-xs font-semibold text-gray-500">Keahlian / Kategori</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {profile.skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Daftar Lowongan yang Dibuka oleh Profil Ini */}
      <div className="space-y-4">
        <h2 className="flex items-center gap-2 text-xl font-bold text-gray-900">
          <RiBriefcaseLine className="text-[#F4991A]" />
          Lowongan Dibuka ({profile.job.length})
        </h2>

        {profile.job.length > 0 ? (
          <div className="grid gap-4">
            {profile.job.map((item) => {
              const salaryRangeStr = `${formatCurrency(item.budgetMin)} - ${formatCurrency(item.budgetMax)}`;

              return (
                <JobCard
                  key={item.id}
                  id={item.id}
                  title={item.title}
                  company={item.company}
                  logoText={getCompanyInitials(item.company)}
                  logoColor="#386641"
                  province={item.address?.province || "Indonesia"}
                  tags={item.tags}
                  salaryRange={salaryRangeStr}
                  whatsapp={item.whatsapp}
                  verified={item.isVerified}
                />
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-gray-300 p-8 text-center text-gray-500">
            Penyedia kerja ini belum memiliki lowongan aktif saat ini.
          </div>
        )}
      </div>
    </div>
  );
}