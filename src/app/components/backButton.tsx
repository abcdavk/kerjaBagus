"use client";

import { useRouter } from "next/navigation";
import { RiArrowLeftLine } from "@remixicon/react";

export default function BackButton() {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.back()}
      className="flex items-center font-semibold text-lg gap-1 hover:underline cursor-pointer"
    >
      <RiArrowLeftLine size={20} />
      Kembali
    </button>
  );
}
