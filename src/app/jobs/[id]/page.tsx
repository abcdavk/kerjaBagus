import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import BackButton from "@/app/components/backButton";
import {
  RiBankCard2Line,
  RiBookmarkLine,
  RiBuildingLine,
  RiCalendarLine,
  RiMapPin2Line,
  RiMoneyDollarCircleLine,
  RiShieldCheckLine,
  RiTimeLine,
  RiUserLine,
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
      profile: true,
      address: true,
    },
  });

  if (!job) {
    notFound();
  }

  const locationParts = [
    job.address?.district,
    job.address?.city,
    job.address?.province,
  ].filter(Boolean);

  const location =
    locationParts.length > 0
      ? locationParts.join(", ")
      : "Lokasi tidak tersedia";

  const formatCurrency = (value?: number | null) => {
    if (value === null || value === undefined) return "-";

    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (value?: Date | string | null) => {
    if (!value) return "-";

    return new Date(value).toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const locationTypeLabel = {
    ONSITE: "On-site",
    REMOTE: "Remote",
    HYBRID: "Hybrid",
  }[job.locationType] ?? job.locationType;

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

          <div className="shrink-0">
            <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-linear-to-br from-[#F4991A] to-[#E8860F] text-xl font-bold text-white shadow-md md:h-30 md:w-30 md:text-2xl">
              {getCompanyInitials(job.company)}
            </div>
          </div>
        </div>
      </div>

      {job.banner ? (
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <img
            src={job.banner}
            alt={`Banner ${job.title}`}
            className="h-56 w-full object-cover"
          />
        </div>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-[1.7fr_0.9fr]">
        <div className="flex flex-col gap-4">
          <section className="flex-1 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm overflow-hidden">
            <h2 className="text-xl font-semibold text-gray-900">Deskripsi</h2>

            <p className="mt-3 whitespace-pre-line text-gray-700">
              {job.description || "Deskripsi belum tersedia untuk lowongan ini."}
            </p>
          </section>

          {job.tags.length > 0 && (
            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="mb-3 text-xl font-semibold text-gray-900">
                Keahlian yang dicari
              </h2>

              <div className="flex flex-wrap gap-2">
                {job.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-gray-100 px-3 py-1.5 text-sm text-gray-700"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </section>
          )}
        </div>

        <div className="space-y-4">
          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">Informasi Utama</h2>
            <div className="mt-4 space-y-4 text-sm text-gray-700">
              <div className="flex items-start gap-3">
                <RiMoneyDollarCircleLine className="mt-0.5 w-5 shrink-0 text-[#F4991A]" />
                <div>
                  <p className="font-semibold text-gray-900">Rentang Gaji</p>
                  <p>
                    {formatCurrency(job.budgetMin)} - {formatCurrency(job.budgetMax)}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <RiCalendarLine className="mt-0.5 w-5 shrink-0 text-[#F4991A]" />
                <div>
                  <p className="font-semibold text-gray-900">Deadline</p>
                  <p>{formatDate(job.deadline)}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <RiTimeLine className="mt-0.5 w-5 shrink-0 text-[#F4991A]" />
                <div>
                  <p className="font-semibold text-gray-900">Dibuat</p>
                  <p>{formatDate(job.createdAt)}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <RiShieldCheckLine className="mt-0.5 w-5 shrink-0 text-[#F4991A]" />
                <div>
                  <p className="font-semibold text-gray-900">Status Verifikasi</p>
                  <p>{job.isVerified ? "Terverifikasi" : "Belum diverifikasi"}</p>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">Detail Lokasi</h2>
            <div className="mt-4 space-y-3 text-sm text-gray-700">
              <div className="flex items-start gap-3">
                <RiMapPin2Line className="mt-0.5 w-5 shrink-0 text-[#F4991A]" />
                <div>
                  <p className="font-semibold text-gray-900">Alamat</p>
                  <p>{location}</p>
                  {job.address?.postalCode ? (
                    <p className="mt-1 text-gray-500">Kode Pos: {job.address.postalCode}</p>
                  ) : null}
                </div>
              </div>

              <div className="flex items-start gap-3">
                <RiBankCard2Line className="mt-0.5 w-5 shrink-0 text-[#F4991A]" />
                <div>
                  <p className="font-semibold text-gray-900">Jenis Kerja</p>
                  <p>{locationTypeLabel}</p>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">Diposting oleh</h2>
            <div className="mt-4 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F4991A]/10 text-sm font-semibold text-[#C67C00]">
                {getCompanyInitials(job.profile?.displayName || job.company)}
              </div>
              <div>
                <p className="font-semibold text-gray-900">
                  {job.profile?.displayName || "Pemilik Lowongan"}
                </p>
                <p className="text-sm text-gray-500">{job.company}</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
