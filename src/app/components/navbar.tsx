"use client";

import Image from "next/image";
import Link from "next/link";
import { RiAddLine } from "@remixicon/react";

export default function Navbar() {
  return (
    <nav className="sticky top-0 left-0 right-0 z-50 flex items-center bg-white justify-between px-15 py-4 shadow-md">
      <div id="logo">
        <Image
          src="/logo/kerjabagus_icon.svg"
          alt="Kerjabagus logo"
          width={32}
          height={32}
          className="h-8 w-auto"
        />
      </div>
      <ul id="nav-links" className="flex gap-7">
        <li className="py-4 md:py-0">
          <Link href="/" className="hover:font-semibold text-xl">
            Beranda
          </Link>
        </li>
        <li className="py-4 md:py-0">
          <Link href="" className="hover:font-semibold text-xl">
            Profil
          </Link>
        </li>
        <li className="py-4 md:py-0">
          <Link href="/jobs" className="hover:font-semibold text-xl">
            Lowongan
          </Link>
        </li>
        <li className="py-4 md:py-0">
          <Link href="" className="hover:font-semibold text-xl">
            CV Generator
          </Link>
        </li>
        <li className="py-4 md:py-0">
          <Link href="" className="hover:font-semibold text-xl">
            Panduan
          </Link>
        </li>
      </ul>

      <div className="flex gap-4">
        <Link
          href="/login"
          className="text-[#77746E] border border-[#F6D39E] bg-[#FBF6F0] py-2 px-9 rounded-lg transition-all duration-300 ease-in-out hover:-translate-y-1 hover:scale-103 cursor-pointer"
        >
          Masuk
        </Link>

        <Link
          href="/"
          className="bg-[#F4991A] text-white py-2 px-4 rounded-md transition-all duration-300 ease-in-out hover:-translate-y-1 hover:scale-103 cursor-pointer"
        >
          <RiAddLine size={20} className="inline mr-2" />
          Post Pekerjaan
        </Link>
      </div>
    </nav>
  );
}
