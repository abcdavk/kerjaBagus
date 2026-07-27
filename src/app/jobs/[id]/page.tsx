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
    <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-6 md:gap-6 md:px-6 md:py-10">
      <BackButton />
      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm md:p-6">
        <div className="flex flex-col-reverse gap-4 md:flex-row md:items-start md:justify-between md:gap-6">
          {/* DETAIL */}
          <div className="flex-1">
            <p className="text-xs font-medium tracking-wide text-gray-500 md:text-sm">
              Detail Pekerjaan
            </p>
            <h1 className="mt-2 text-xl font-bold text-gray-900 md:text-3xl">
              {job.title}
            </h1>
            <p className="mt-2 text-base text-gray-700 md:text-lg">
              {job.company}
            </p>
            <p className="mt-4 flex items-center gap-2 text-sm text-gray-600">
              <RiMapPin2Line className="w-4 shrink-0" />
              {location}
            </p>

            <div className="mt-4 flex gap-3 sm:flex-row sm:items-center">
              {job.whatsapp ? (
                <Link
                  href={`https://wa.me/${job.whatsapp}?text=Halo,%20saya%20tertarik%20melamar%20posisi%20${encodeURIComponent(job.title)}%20di%20${encodeURIComponent(job.company)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#F4991A] px-6 py-3 text-base font-semibold text-white transition-all duration-300 ease-in-out hover:-translate-y-1 hover:scale-[1.01] sm:w-auto"
                >
                  <RiWhatsappFill size={20} />
                  Lamar via WhatsApp
                </Link>
              ) : (
                <button
                  type="button"
                  disabled
                  className="w-full rounded-lg bg-gray-300 px-6 py-3 text-base font-semibold text-gray-500 cursor-not-allowed sm:w-auto"
                >
                  Nomor WhatsApp Tidak Tersedia
                </button>
              )}

              <button
                type="button"
                className="flex h-11 w-11 shrink-0 items-center justify-center self-start rounded-lg border border-gray-200 hover:bg-gray-50 transition-all duration-300 ease-in-out hover:-translate-y-1 hover:scale-[1.01] sm:self-auto"
              >
                <RiBookmarkLine size={18} className="text-gray-500" />
              </button>
            </div>
          </div>

          {/* LOGO */}
          <div className="shrink-0">
            <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-linear-to-br from-[#F4991A] to-[#E8860F] text-xl font-bold text-white shadow-md md:h-30 md:w-30 md:text-2xl">
              {getCompanyInitials(job.company)}
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm md:p-6">
        <h2 className="text-lg font-semibold text-gray-900 md:text-xl">
          Deskripsi
        </h2>
        <p className="mt-3 whitespace-pre-line text-sm text-gray-700 md:text-base">
          {job.description}
        </p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm md:p-6">
        <h2 className="text-lg font-semibold text-gray-900 md:text-xl">
          Persyaratan
        </h2>
        <p className="mt-3 whitespace-pre-line text-sm text-gray-700 md:text-base">
          {job.description}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm md:grid-cols-3 md:p-6">
        <div>
          <p className="text-xs font-medium text-gray-500 md:text-sm">
            Jenis Lokasi
          </p>
          <p className="mt-1 text-md font-semibold text-gray-900 md:text-base">
            {job.locationType}
          </p>
        </div>
        <div>
          <p className="text-xs font-medium text-gray-500 md:text-sm">Gaji</p>
          <p className="mt-1 text-md font-semibold text-gray-900 md:text-base">
            {formatCurrency(job.budgetMin)} - {formatCurrency(job.budgetMax)}
          </p>
        </div>
        <div className="col-span-2 md:col-span-1">
          <p className="text-xs font-medium text-gray-500 md:text-sm">Status</p>
          <p className="mt-1 text-md font-semibold text-gray-900 md:text-base">
            {job.isOpen ? "Dibuka" : "Ditutup"}
          </p>
        </div>
      </div>
    </div>
  );
}
