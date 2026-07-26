"use client";

import React, { useState, useRef, useEffect } from "react";
import { RiAddLine, RiCloseLine, RiCheckLine } from "@remixicon/react";

// Tag preset yang dikelompokkan per kategori
const TAG_CATEGORIES = [
  {
    category: "Desain & Konten Sosial Media",
    tags: [
      "Desain Logo",
      "Foto Produk",
      "Desain Spanduk / Banner",
      "Video Reels / TikTok",
      "Pengelola Medsos",
    ],
  },
  {
    category: "Admin & Customer Service",
    tags: [
      "Rekap Penjualan",
      "Admin Chat WhatsApp",
      "Input Stok Barang",
      "Customer Service",
      "Microsoft Excel / Admin",
    ],
  },
  {
    category: "Teknis & Jasa Perbaikan",
    tags: [
      "Servis AC",
      "Kelistrikan",
      "Cat Rumah / Toko",
      "Pengelasan",
      "Perbaikan Perabotan",
    ],
  },
  {
    category: "Kuliner & Staf Resto/Kafe",
    tags: [
      "Barista",
      "Asisten Dapur",
      "Waiters Harian",
      "Tenaga Pembantu Event",
      "Staf Catering",
    ],
  },
  {
    category: "Logistik & Tenaga Lepas",
    tags: [
      "Kurir Antar Barang",
      "Driver Harian",
      "Bongkar Muat Stok",
      "Tenaga Lepas / Helper",
    ],
  },
  {
    category: "Project & Jasa Lainnya",
    tags: [
      "Jasa Foto Produk",
      "Desain Kemasan",
      "Penulisan Artikel",
      "Jasa Khusus UMKM",
    ],
  },
];

interface TagPopoverProps {
  selectedTags: string[];
  setSelectedTags: (tags: string[]) => void;
}

export default function TagPopover({
  selectedTags,
  setSelectedTags,
}: TagPopoverProps) {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Toggle pilihan tag
  const handleToggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  // Close popover saat klik di luar area
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={popoverRef}>
      <label className="block text-xs font-semibold text-gray-700 mb-2">
        Keahlian / Tag Pekerjaan
      </label>

      {/* Area Badge Tag yang Terpilih + Tombol Trigger */}
      <div className="flex flex-wrap items-center gap-2">
        {selectedTags.map((tag) => (
          <span
            key={tag}
            className="flex items-center gap-1 bg-[#FBF6F0] text-[#F4991A] border border-[#F6D39E] text-xs font-medium px-3 py-1.5 rounded-full"
          >
            {tag}
            <button
              type="button"
              onClick={() => handleToggleTag(tag)}
              className="hover:text-red-500 transition"
            >
              <RiCloseLine size={14} />
            </button>
          </span>
        ))}

        {/* Tombol Utama Pembuka Popover */}
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="flex items-center gap-1 bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-300 text-xs font-semibold px-3 py-1.5 rounded-full transition cursor-pointer"
        >
          <RiAddLine size={16} />
          {selectedTags.length > 0 ? "Tambah Keahlian" : "Pilih Keahlian"}
        </button>
      </div>

      {/* POPOVER PANEL */}
      {isOpen && (
        <div className="absolute left-0 z-30 mt-2 w-full md:w-[480px] bg-white border border-gray-200 rounded-2xl shadow-xl p-4 space-y-4 animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between border-b border-gray-100 pb-2">
            <div>
              <h4 className="text-sm font-bold text-gray-800">
                Pilih Keahlian
              </h4>
              <p className="text-xs text-gray-400">
                Klik keahlian yang sesuai dengan lowongan ini.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1 text-gray-400 hover:text-gray-600 rounded-lg"
            >
              <RiCloseLine size={18} />
            </button>
          </div>

          {/* List Per Kategori */}
          <div className="max-h-64 overflow-y-auto space-y-3 pr-1">
            {TAG_CATEGORIES.map((cat) => (
              <div key={cat.category}>
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">
                  {cat.category}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {cat.tags.map((tag) => {
                    const isSelected = selectedTags.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => handleToggleTag(tag)}
                        className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg border transition ${
                          isSelected
                            ? "bg-[#F4991A] text-white border-[#F4991A] font-semibold"
                            : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
                        }`}
                      >
                        {isSelected && <RiCheckLine size={14} />}
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Footer Popover */}
          <div className="pt-2 border-t border-gray-100 flex justify-end">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="bg-[#386641] hover:bg-[#2c5234] text-white text-xs font-semibold px-4 py-1.5 rounded-lg transition"
            >
              Selesai
            </button>
          </div>
        </div>
      )}
    </div>
  );
}