import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import BackButton from "@/app/components/backButton";
import {
  RiBookmarkLine,
  RiMapPin2Line,
  RiWhatsappFill,
} from "@remixicon/react";
import { getCompanyInitials } from "@/app/utils/company";
import Link from "next/link";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function JobDetailPage({ params }: Props) {
  const { id } = await params;

  const job = await prisma.job.findUnique({
    where: { id },
    include: {
      address: true,
    },
  });

  if (!job) {
    notFound();
  }

  const location =
    [job.address?.city, job.address?.province].filter(Boolean).join(", ") ||
    "Lokasi tidak tersedia";

  const formatCurrency = (value?: number | null) => {
    if (value === null || value === undefined) return "-";

    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-10 md:px-6">
      <BackButton />
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between gap-6">
          {/* DETAIL */}
          <div className="flex-1">
            <p className="text-sm font-medium tracking-wide text-gray-500">
              Detail Pekerjaan
            </p>
            <h1 className="mt-2 text-3xl font-bold text-gray-900">
              {job.title}
            </h1>
            <p className="mt-2 text-lg text-gray-700">{job.company}</p>
            <p className="mt-4 text-sm text-gray-600 flex items-center gap-2">
              <RiMapPin2Line className="w-4 shrink-0" />
              {location}
            </p>

            <div className="mt-4 flex items-center gap-3">
              {job.whatsapp ? (
                <Link
                  href={`https://wa.me/${job.whatsapp}?text=Halo,%20saya%20tertarik%20melamar%20posisi%20${encodeURIComponent(job.title)}%20di%20${encodeURIComponent(job.company)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg bg-[#F4991A] px-6 py-3 text-base font-semibold text-white transition-all duration-300 ease-in-out hover:-translate-y-1 hover:scale-[1.01] flex items-center gap-2 justify-center"
                >
                  <RiWhatsappFill size={20} />
                  Lamar via WhatsApp
                </Link>
              ) : (
                <button
                  type="button"
                  disabled
                  className="rounded-lg bg-gray-300 px-6 py-3 text-base font-semibold text-gray-500 cursor-not-allowed"
                >
                  Nomor WhatsApp Tidak Tersedia
                </button>
              )}

              <button
                type="button"
                className="h-11 w-11 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 transition-all duration-300 ease-in-out hover:-translate-y-1 hover:scale-[1.01]"
              >
                <RiBookmarkLine size={18} className="text-gray-500" />
              </button>
            </div>
          </div>

          {/* LOGO */}
          <div className="shrink-0">
            <div className="h-30 w-30 rounded-xl bg-linear-to-br from-[#F4991A] to-[#E8860F] flex items-center justify-center text-white font-bold text-2xl shadow-md">
              {getCompanyInitials(job.company)}
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900">Deskripsi</h2>
        <p className="mt-3 whitespace-pre-line text-gray-700">
          {job.description}
        </p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900">Persyaratan</h2>
        <p className="mt-3 whitespace-pre-line text-gray-700">
          {job.description}
        </p>
      </div>

      <div className="grid gap-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:grid-cols-3">
        <div>
          <p className="text-sm font-medium text-gray-500">Jenis Lokasi</p>
          <p className="mt-1 font-semibold text-gray-900">{job.locationType}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Gaji</p>
          <p className="mt-1 font-semibold text-gray-900">
            {formatCurrency(job.budgetMin)} - {formatCurrency(job.budgetMax)}
          </p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Status</p>
          <p className="mt-1 font-semibold text-gray-900">
            {job.isOpen ? "Dibuka" : "Ditutup"}
          </p>
        </div>
      </div>
    </div>
  );
}
