"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import BackButton from "@/app/components/backButton";
import TagPopover from "@/app/components/tagPopover"; // 1. Impor komponen TagPopover
// import { createJob } from "@/services/jobs.service"; // API BACKEND DISINI

export default function CreateJobPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  // 2. State khusus untuk menyimpan array tags yang dipilih dari popover
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "ONSITE" as "ONSITE" | "REMOTE" | "HYBRID",
    province: "",
    city: "",
    budgetMin: "",
    budgetMax: "",
    description: "",
    requirements: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const payload = {
      title: formData.title,
      company: formData.company,
      location: formData.location,
      address: {
        province: formData.province,
        city: formData.city,
      },
      budgetMin: Number(formData.budgetMin) || 0,
      budgetMax: Number(formData.budgetMax) || 0,
      tags: selectedTags, // 3. Pakai selectedTags langsung (Array)
      description: formData.description,
      requirements: formData.requirements,
    };

    try {
      console.log("Payload dikirim ke API:", payload);

      // UNCOMMENT SAAT API E WES CONNECT:
      // await createJob(payload);

      alert("Lowongan pekerjaan berhasil diterbitkan!");
      router.push("/jobs");
    } catch (error) {
      console.error("Gagal membuat lowongan:", error);
      alert("Terjadi kesalahan saat memposting pekerjaan.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-4xl px-4 md:px-6 py-10">
      <div className="mb-6">
        <BackButton />
      </div>

      <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Pasang Lowongan Pekerjaan
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Isi detail lowongan kerja dengan jelas untuk mendapatkan calon pekerja yang sesuai.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Judul & Nama Perusahaan */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Judul Pekerjaan <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="misal: Staff Kasir / Tukang Bangunan"
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Nama Usaha / Perusahaan <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="misal: Toko Serba Ada / Personal"
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                value={formData.company}
                onChange={(e) =>
                  setFormData({ ...formData, company: e.target.value })
                }
              />
            </div>
          </div>

          {/* Sistem Kerja & Lokasi */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Sistem Kerja
              </label>
              <select
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white"
                value={formData.location}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    location: e.target.value as "ONSITE" | "REMOTE" | "HYBRID",
                  })
                }
              >
                <option value="ONSITE">Onsite (Di Lokasi)</option>
                <option value="REMOTE">Remote (Jarak Jauh)</option>
                <option value="HYBRID">Hybrid</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Kota / Kabupaten <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="misal: Sleman"
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                value={formData.city}
                onChange={(e) =>
                  setFormData({ ...formData, city: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Provinsi <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="misal: DI Yogyakarta"
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                value={formData.province}
                onChange={(e) =>
                  setFormData({ ...formData, province: e.target.value })
                }
              />
            </div>
          </div>

          {/* Budget / Gaji Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Budget Minimal (Rp) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                required
                placeholder="misal: 1500000"
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                value={formData.budgetMin}
                onChange={(e) =>
                  setFormData({ ...formData, budgetMin: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Budget Maksimal (Rp) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                required
                placeholder="misal: 3000000"
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                value={formData.budgetMax}
                onChange={(e) =>
                  setFormData({ ...formData, budgetMax: e.target.value })
                }
              />
            </div>
          </div>

          {/* 4. POPOVER TAG SELECTOR DITAMBAHKAN DI SINI */}
          <TagPopover
            selectedTags={selectedTags}
            setSelectedTags={setSelectedTags}
          />

          {/* Deskripsi Pekerjaan */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Deskripsi Pekerjaan <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={4}
              required
              placeholder="Tuliskan tugas harian dan rincian pekerjaan..."
              className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>

          {/* Persyaratan */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Persyaratan Pelamar
            </label>
            <textarea
              rows={3}
              placeholder="misal: Minimal lulusan SMA/SMK, memiliki kendaraan sendiri..."
              className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
              value={formData.requirements}
              onChange={(e) =>
                setFormData({ ...formData, requirements: e.target.value })
              }
            />
          </div>

          {/* Submit Button */}
          <div className="pt-3 flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="bg-[#F4991A] hover:bg-amber-600 text-white font-semibold px-6 py-3 rounded-xl text-sm transition shadow-md active:scale-98 disabled:opacity-50 cursor-pointer"
            >
              {submitting ? "Menerbitkan..." : "Terbitkan Lowongan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}