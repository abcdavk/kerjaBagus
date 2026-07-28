import Link from "next/link";
import { redirect } from "next/navigation";
import BackButton from "@/app/components/backButton";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { RiMapPin2Line, RiMoneyDollarCircleLine, RiTimeLine } from "@remixicon/react";

const formatCurrency = (value?: number | null) => {
  if (value === null || value === undefined) return "-";

  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
};

export default async function ManageJobsPage() {
  const currentUser = await getCurrentUser();

  if (!currentUser?.profile?.id) {
    redirect("/login");
  }

  const jobs = await prisma.job.findMany({
    where: {
      profileId: currentUser.profile.id,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      address: true,
    },
  });

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 md:px-6">
      <div className="mb-6">
        <BackButton />
      </div>

      <div className="mb-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Kelola Lowongan</h1>
            <p className="mt-1 text-sm text-gray-500">
              Lihat dan edit lowongan yang sudah Anda posting.
            </p>
          </div>

          <Link
            href="/jobs/create"
            className="inline-flex items-center justify-center rounded-xl bg-[#F4991A] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-amber-600"
          >
            + Buat Lowongan Baru
          </Link>
        </div>
      </div>

      {jobs.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-10 text-center shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800">Belum ada lowongan</h2>
          <p className="mt-2 text-sm text-gray-500">
            Lowongan yang Anda posting akan muncul di sini.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {jobs.map((job) => {
            const location = [job.address?.city, job.address?.province].filter(Boolean).join(", ") || "Lokasi tidak tersedia";
            const logoText = (job.company || job.title || "JB")
              .split(" ")
              .slice(0, 2)
              .map((word) => word[0])
              .join("")
              .toUpperCase();

            return (
              <Link
                key={job.id}
                href={`/jobs/${job.id}/edit`}
                className="flex flex-col gap-3 rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-300 ease-in-out hover:-translate-y-1 hover:scale-[1.01] hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#386641] text-sm font-semibold text-white">
                    {logoText}
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      job.isOpen ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {job.isOpen ? "Dibuka" : "Ditutup"}
                  </span>
                </div>

                <div>
                  <h2 className="font-semibold text-gray-900">{job.title}</h2>
                  <p className="text-sm text-gray-500">{job.company}</p>
                </div>

                <div className="flex items-center gap-1.5 text-gray-600">
                  <RiMapPin2Line size={16} className="shrink-0 text-gray-400" />
                  <p className="text-sm font-medium text-gray-700">{location}</p>
                </div>

                {job.tags.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {job.tags.slice(0, 4).map((tag) => (
                      <span key={tag} className="rounded-sm bg-gray-100 px-2.5 py-1 text-xs text-gray-600">
                        {tag}
                      </span>
                    ))}
                  </div>
                ) : null}

                <div className="mt-1 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] tracking-wide text-gray-400">GAJI/BULAN</p>
                    <p className="font-semibold tracking-wider text-gray-900">
                      {formatCurrency(job.budgetMin)} - {formatCurrency(job.budgetMax)}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <RiTimeLine size={16} />
                    <span>Diposting {new Date(job.createdAt).toLocaleDateString("id-ID")}</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
