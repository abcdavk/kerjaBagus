"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { RiArrowLeftLine } from "@remixicon/react";

export default function RegisterPage() {
  const router = useRouter();
  return (
    <div className="flex min-h-screen flex-col items-center justify-start bg-gradient-to-b from-[#FAF8F0] via-[#FAF8F0] to-[#E2E8DD] px-4 pt-30 pb-16">
      <div className="mb-6 text-center flex flex-col items-center justify-center">
        <Link href="/" className="flex flex-col items-center gap-2">
          <Image
            src="/logo/kerjabagus_icon.svg"
            alt="KerjaBagus Logo"
            width={140}
            height={40}
            className="h-10 w-auto"
          />
        </Link>
      </div>

      <div className="w-full max-w-lg rounded-xl bg-white p-8 shadow-lg border border-gray-100">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1 hover:underline"
        >
          <RiArrowLeftLine size={15} />
          Kembali
        </button>

        <h2 className="text-center text-xl font-bold text-gray-800">
          Buat Akun
        </h2>
        <p className="text-center text-sm text-gray-500 mb-5">
          Sudah punya akun?{" "}
          <Link href="/login" className="text-blue-500 hover:underline">
            Sign in
          </Link>
        </p>
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <button
            type="button"
            className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-blue-500 px-4 py-2.5 text-sm font-medium text-blue-600 hover:bg-blue-50 transition"
          >
            <span className="font-bold text-red-500">G</span> Daftar dengan
            Google
          </button>
          <button
            type="button"
            className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-blue-500 px-4 py-2.5 text-sm font-medium text-blue-600 hover:bg-blue-50 transition"
          >
            <span className="font-bold text-blue-700">f</span> Daftar dengan
            Facebook
          </button>
        </div>
        <div className="relative mb-6 text-center">
          <hr className="border-gray-200" />
          <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-3 text-xs text-gray-400">
            atau daftar dengan email
          </span>
        </div>
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div>
            <input
              type="text"
              placeholder="Nama Lengkap*"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-[#386641] focus:outline-none transition"
            />
          </div>

          <div className="flex gap-3">
            <input
              type="email"
              placeholder="Email*"
              className="w-1/2 rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-[#386641] focus:outline-none transition"
            />
            <div className="w-1/2">
              <input
                type="tel"
                placeholder="Nomor Ponsel*"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-[#386641] focus:outline-none transition"
              />
              <span className="text-[10px] text-gray-400 mt-1 block px-1">
                Nomor terhubung dengan WhatsApp.
              </span>
            </div>
          </div>

          <div className="relative">
            <input
              type="password"
              placeholder="Password"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-[#386641] focus:outline-none transition"
            />
            <span className="absolute right-3 top-3.5 cursor-pointer text-gray-400 text-xs">
              👁️
            </span>
            <div className="flex justify-between items-center mt-1 px-1">
              <span className="text-[10px] text-gray-400">
                Minimal 8 karakter, huruf kapital, dan angka.
              </span>
              <span className="text-[10px] text-gray-400">
                Too Short{" "}
                <span className="inline-block w-12 h-1 bg-gray-200 rounded-sm"></span>
              </span>
            </div>
          </div>

          <div className="relative">
            <input
              type="password"
              placeholder="Konfirmasi Password"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-[#386641] focus:outline-none transition"
            />
            <span className="absolute right-3 top-3.5 cursor-pointer text-gray-400 text-xs">
              👁️
            </span>
          </div>

          <p className="text-[11px] text-gray-500 leading-relaxed pt-2">
            Dengan mendaftar Anda menyetujui{" "}
            <a href="#" className="text-blue-500 hover:underline">
              Syarat dan Ketentuan
            </a>{" "}
            &{" "}
            <a href="#" className="text-blue-500 hover:underline">
              Kebijakan Privasi
            </a>
            .
          </p>

          <button
            type="button"
            className="w-full rounded-lg bg-gray-200 py-3 text-sm font-semibold text-gray-500 cursor-not-allowed hover:bg-gray-300 transition mt-4"
          >
            Lanjutkan
          </button>
        </form>
      </div>
    </div>
  );
}
