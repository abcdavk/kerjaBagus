"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  RiBookmarkLine,
  RiBookmarkFill,
  RiVerifiedBadgeFill,
  RiMapPinLine,
} from "@remixicon/react";

import { isJobSaved, toggleSaveJob } from "@/app/utils/savedJobs";

type JobCardProps = {
  id: string;
  logoText: string;
  logoColor: string;
  title: string;
  company: string;
  province: string;
  tags: string[];
  salaryRange: string;
  whatsapp?: string | null;
  verified?: boolean;
};

function formatWhatsappNumber(raw: string) {
  let digits = raw.replace(/\D/g, "");
  if (digits.startsWith("0")) {
    digits = "62" + digits.slice(1);
  }
  return digits;
}

export default function JobCard({
  id,
  logoText,
  logoColor,
  title,
  company,
  province,
  tags,
  salaryRange,
  whatsapp,
  verified = true,
}: JobCardProps) {
  const router = useRouter();
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSaved(isJobSaved(id));
  }, [id]);

  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();

    const isSavedNow = toggleSaveJob({
      id,
      logoText,
      logoColor,
      title,
      company,
      province,
      tags,
      salaryRange,
      whatsapp,
      verified,
    });

    setSaved(isSavedNow);
  };

  const whatsappLink = whatsapp
    ? `https://wa.me/${formatWhatsappNumber(whatsapp)}?text=${encodeURIComponent(
        `Halo, saya tertarik melamar posisi ${title} di ${company}`,
      )}`
    : null;

  return (
    <div
      onClick={() => router.push(`/jobs/${id}`)}
      role="link"
      tabIndex={0}
      className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex flex-col gap-3 cursor-pointer transition-all duration-300 ease-in-out hover:-translate-y-1 hover:scale-[1.01]"
    >
      {/* HEADER */}
      <div className="flex items-start justify-between">
        <div
          className="h-10 w-10 rounded-lg flex items-center justify-center text-white text-sm font-semibold"
          style={{ backgroundColor: logoColor }}
        >
          {logoText}
        </div>

        {verified && (
          <span className="flex items-center gap-1 text-xs font-medium text-[#386641] bg-green-50 px-2 py-1 rounded-full">
            <RiVerifiedBadgeFill size={14} />
            Terverifikasi
          </span>
        )}
      </div>

      {/* TITLE + COMPANY */}
      <div>
        <h3 className="font-semibold text-gray-900">{title}</h3>
        <p className="text-sm text-gray-500">{company}</p>
      </div>

      {/* LOCATION */}
      <div className="flex items-center gap-1.5 text-gray-600">
        <RiMapPinLine size={16} className="text-gray-400 shrink-0" />
        <p className="text-sm font-medium text-gray-700">{province}</p>
      </div>

      {/* TAGS */}
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-sm"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* GAJI + SIMPAN */}
      <div className="flex items-center justify-between mt-1">
        <div>
          <p className="text-[10px] text-gray-400 tracking-wide">GAJI/BULAN</p>
          <p className="font-semibold text-gray-900 tracking-wider">
            {salaryRange}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* TOMBOL BOOKMARK */}
          <button
            type="button"
            onClick={handleBookmark}
            className={`h-9 w-9 flex items-center justify-center rounded-lg border transition-all duration-300 ease-in-out hover:-translate-y-1 hover:scale-[1.01] ${
              saved
                ? "bg-green-50 border-[#386641]/30 text-[#386641]"
                : "border-gray-200 hover:bg-gray-50 text-gray-500"
            }`}
            title={saved ? "Hapus dari tersimpan" : "Simpan pekerjaan"}
          >
            {saved ? (
              <RiBookmarkFill size={16} className="text-[#386641]" />
            ) : (
              <RiBookmarkLine size={16} />
            )}
          </button>

          {whatsappLink ? (
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-gray-900 text-sm font-semibold px-5 py-2 transition-all duration-300 ease-in-out hover:-translate-y-1 hover:scale-[1.01] rounded-lg border border-gray-200 hover:bg-gray-50 inline-flex items-center"
            >
              Lamar
            </a>
          ) : (
            <button
              type="button"
              disabled
              onClick={(e) => e.stopPropagation()}
              className="rounded-lg bg-gray-300 px-4 py-2 text-sm font-semibold text-gray-500 cursor-not-allowed"
            >
              WA Tidak Tersedia
            </button>
          )}
        </div>
      </div>
    </div>
  );
}