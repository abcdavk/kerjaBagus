"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import BackButton from "@/app/components/backButton";
import TagPopover from "@/app/components/tagPopover";
import Select from "react-select";
import { api } from "@/services/api";
import { me } from "@/services/auth.service";
import { getProfile } from "@/services/profiles.service";
import { getUser } from "@/services/users.service";
import {
  getDistricts,
  getProvinces,
  getRegencies,
  getVillages,
} from "@/services/address.service";

type JobFormState = {
  title: string;
  company: string;
  whatsapp: string;
  location: "ONSITE" | "REMOTE" | "HYBRID";
  province: string;
  provinceId: string;
  city: string;
  cityId: string;
  district: string;
  village: string;
  postalCode: string;
  budgetMin: string;
  budgetMax: string;
  description: string;
  deadline: string;
  banner: string;
  isVerified: boolean;
  isOpen: boolean;
};

type JobDetail = {
  id: string;
  title: string;
  company: string;
  whatsapp: string;
  locationType: "ONSITE" | "REMOTE" | "HYBRID";
  budgetMin: number | null;
  budgetMax: number | null;
  description: string;
  deadline: string | null;
  banner: string | null;
  isVerified: boolean;
  isOpen: boolean;
  tags: string[];
  profileId: string;
  address?: {
    province?: string | null;
    city?: string | null;
    district?: string | null;
    village?: string | null;
    postalCode?: string | null;
  } | null;
};

export default function EditJobPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const jobId = params?.id;

  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profileId, setProfileId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: "error" | "success"; text: string } | null>(null);

  const [provinces, setProvinces] = useState<Array<{ id: string; name: string }>>([]);
  const [regencies, setRegencies] = useState<Array<{ id: string; name: string }>>([]);
  const [districts, setDistricts] = useState<Array<{ id: string; name: string }>>([]);
  const [villages, setVillages] = useState<Array<{ id: string; name: string }>>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const [formData, setFormData] = useState<JobFormState>({
    title: "",
    company: "",
    whatsapp: "",
    location: "ONSITE",
    province: "",
    provinceId: "",
    city: "",
    cityId: "",
    district: "",
    village: "",
    postalCode: "",
    budgetMin: "",
    budgetMax: "",
    description: "",
    deadline: "",
    banner: "",
    isVerified: false,
    isOpen: true,
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const currentUser = await me();
        const user = await getUser(currentUser.user.id);
        if (user?.profile?.id) {
          setProfileId(user.profile.id);
        } else if (user?.id) {
          const profile = await getProfile(user.id);
          setProfileId(profile.id);
        } else {
          setError("Tidak dapat menemukan profil pengguna. Silakan login ulang.");
        }
      } catch (err) {
        console.error("Gagal memuat profil:", err);
        setError("Gagal memuat profil. Silakan login ulang.");
      }
    };

    fetchProfile();
  }, []);

  useEffect(() => {
    getProvinces()
      .then((data) => setProvinces(data))
      .catch((err) => console.error("Gagal memuat provinsi:", err));
  }, []);

  useEffect(() => {
    if (!jobId) return;

    const loadJob = async () => {
      setLoading(true);
      setError(null);

      try {
        const job = await api<JobDetail>(`/api/jobs/${jobId}`);
        const nextFormData: JobFormState = {
          title: job.title ?? "",
          company: job.company ?? "",
          whatsapp: job.whatsapp ?? "",
          location: job.locationType ?? "ONSITE",
          province: job.address?.province ?? "",
          provinceId: "",
          city: job.address?.city ?? "",
          cityId: "",
          district: job.address?.district ?? "",
          village: job.address?.village ?? "",
          postalCode: job.address?.postalCode ?? "",
          budgetMin: job.budgetMin?.toString() ?? "",
          budgetMax: job.budgetMax?.toString() ?? "",
          description: job.description ?? "",
          deadline: job.deadline ? new Date(job.deadline).toISOString().split("T")[0] : "",
          banner: job.banner ?? "",
          isVerified: job.isVerified ?? false,
          isOpen: job.isOpen ?? true,
        };

        setFormData(nextFormData);
        setSelectedTags(job.tags ?? []);

        const provinceData = await getProvinces();
        setProvinces(provinceData);

        const selectedProvince = provinceData.find((p) => p.name === nextFormData.province);
        if (!selectedProvince) {
          setRegencies([]);
          setDistricts([]);
          setVillages([]);
          return;
        }

        const regencyData = await getRegencies(selectedProvince.id);
        setRegencies(regencyData);

        const selectedRegency = regencyData.find((r) => r.name === nextFormData.city);
        if (!selectedRegency) {
          setDistricts([]);
          setVillages([]);
          return;
        }

        const districtData = await getDistricts(selectedRegency.id);
        setDistricts(districtData);

        const selectedDistrict = districtData.find((d) => d.name === nextFormData.district);
        if (!selectedDistrict) {
          setVillages([]);
          return;
        }

        const villageData = await getVillages(selectedDistrict.id);
        setVillages(villageData);
      } catch (err) {
        console.error("Gagal memuat lowongan:", err);
        setError("Gagal memuat data lowongan.");
      } finally {
        setLoading(false);
      }
    };

    loadJob();
  }, [jobId]);

  useEffect(() => {
    if (!formData.provinceId) {
      setRegencies([]);
      setDistricts([]);
      setVillages([]);
      return;
    }

    getRegencies(formData.provinceId)
      .then((data) => {
        setRegencies(data);
        setDistricts([]);
        setVillages([]);
      })
      .catch((err) => console.error("Gagal memuat kota/kabupaten:", err));
  }, [formData.provinceId]);

  useEffect(() => {
    if (!formData.province || provinces.length === 0) {
      return;
    }

    const matchedProvince = provinces.find((p) => p.name === formData.province);
    if (matchedProvince && formData.provinceId !== matchedProvince.id) {
      setFormData((prev) => ({ ...prev, provinceId: matchedProvince.id }));
    }
  }, [formData.province, provinces]);

  const provinceOptions = provinces.map((item) => ({ value: item.id, label: item.name }));
  const regencyOptions = regencies.map((item) => ({ value: item.id, label: item.name }));
  const districtOptions = districts.map((item) => ({ value: item.id, label: item.name }));
  const villageOptions = villages.map((item) => ({ value: item.id, label: item.name }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!jobId) {
      setError("ID lowongan tidak ditemukan.");
      return;
    }

    if (!profileId) {
      setFeedback({ type: "error", text: "Profil tidak ditemukan. Silakan login ulang." });
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const deadlineValue = formData.deadline ? new Date(formData.deadline) : null;
    if (deadlineValue) {
      deadlineValue.setHours(0, 0, 0, 0);
      if (deadlineValue < today) {
        setFeedback({ type: "error", text: "Deadline lamaran tidak boleh kurang dari hari ini." });
        return;
      }
    }

    const budgetMin = Number(formData.budgetMin);
    const budgetMax = Number(formData.budgetMax);

    if (Number.isNaN(budgetMin) || budgetMin < 100000) {
      setFeedback({ type: "error", text: "Budget minimal harus lebih dari 100000." });
      return;
    }

    if (Number.isNaN(budgetMax) || budgetMax < budgetMin) {
      setFeedback({ type: "error", text: "Budget maksimal tidak boleh kurang dari budget minimal." });
      return;
    }

    if (budgetMin >= budgetMax) {
      setFeedback({ type: "error", text: "Budget minimal harus lebih kecil dari budget maksimal." });
      return;
    }

    setSubmitting(true);
    setError(null);
    setFeedback(null);

    const payload = {
      company: formData.company,
      title: formData.title,
      description: formData.description,
      banner: formData.banner || null,
      budgetMin: Number(formData.budgetMin) || 0,
      budgetMax: Number(formData.budgetMax) || 0,
      deadline: formData.deadline ? new Date(formData.deadline) : null,
      locationType: formData.location,
      isVerified: formData.isVerified,
      isOpen: formData.isOpen,
      tags: selectedTags,
      whatsapp: formData.whatsapp,
      address: {
        country: "Indonesia",
        province: formData.province,
        city: formData.city,
        district: formData.district || null,
        village: formData.village || null,
        postalCode: formData.postalCode || null,
        latitude: 0,
        longitude: 0,
      },
    };

    try {
      await api(`/api/jobs/${jobId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      router.push("/jobs/manage");
    } catch (err) {
      console.error("Gagal memperbarui lowongan:", err);
      const message = err instanceof Error ? err.message : "Terjadi kesalahan saat memperbarui lowongan.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-4xl px-4 md:px-6 py-10">
      <div className="mb-6">
        <BackButton />
      </div>

      {loading && (
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex justify-center py-12">
            <div className="h-10 w-10 animate-spin rounded-full border-3 border-[#F4991A] border-t-transparent" />
          </div>
          <p className="text-center text-gray-500">Memuat lowongan...</p>
        </div>
      )}

      {error && !loading && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-red-700">
          <p>{error}</p>
          <button onClick={() => router.refresh()} className="mt-4 text-sm text-red-600 hover:underline">
            Coba lagi
          </button>
        </div>
      )}

      {!loading && !error && (
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:p-8 space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit Lowongan</h1>
            <p className="mt-1 text-sm text-gray-500">
              Perbarui detail lowongan agar tetap relevan dan mudah ditemukan.
            </p>
            {feedback && (
              <div
                className={`mt-3 rounded-lg border p-3 text-xs ${feedback.type === "error" ? "border-red-200 bg-red-50 text-red-600" : "border-green-200 bg-green-50 text-green-700"}`}
              >
                {feedback.text}
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <label className="mb-1 block text-xs font-semibold text-gray-700">
                  Judul Pekerjaan <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="misal: Staff Kasir / Tukang Bangunan"
                  className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-gray-700">
                  Nama Usaha / Perusahaan <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="misal: Toko Serba Ada / Personal"
                  className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-gray-700">
                  Kontak WhatsApp <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="misal: 6281234567890"
                  className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                  value={formData.whatsapp}
                  onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                />
              </div>
            </div>

            {/* Simpan buat nanti */}
            {/* <div>
              <label className="mb-1 block text-xs font-semibold text-gray-700">
                Banner (URL Gambar)
              </label>
              <input
                type="url"
                placeholder="misal: https://example.com/banner.jpg"
                className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                value={formData.banner}
                onChange={(e) => setFormData({ ...formData, banner: e.target.value })}
              />
            </div> */}

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <label className="mb-1 block text-xs font-semibold text-gray-700">Sistem Kerja</label>
                <select
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value as "ONSITE" | "REMOTE" | "HYBRID" })}
                >
                  <option value="ONSITE">Onsite</option>
                  <option value="REMOTE">Remote</option>
                  <option value="HYBRID">Hybrid</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-gray-700">
                  Provinsi <span className="text-red-500">*</span>
                </label>
                <Select
                  placeholder="Pilih Provinsi*"
                  options={provinceOptions}
                  isSearchable
                  value={provinceOptions.find((item) => item.label === formData.province) ?? null}
                  onChange={async (option) => {
                    if (!option) {
                      setFormData((prev) => ({ ...prev, province: "", provinceId: "", city: "", cityId: "", district: "", village: "" }));
                      setRegencies([]);
                      setDistricts([]);
                      setVillages([]);
                      return;
                    }

                    setFormData((prev) => ({ ...prev, province: option.label, provinceId: option.value, city: "", cityId: "", district: "", village: "" }));
                    setDistricts([]);
                    setVillages([]);
                    const data = await getRegencies(option.value);
                    setRegencies(data);
                  }}
                  className="w-full"
                  classNamePrefix="react-select"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-gray-700">
                  Kota / Kabupaten <span className="text-red-500">*</span>
                </label>
                <Select
                  placeholder="Pilih Kota/Kabupaten*"
                  options={regencyOptions}
                  isSearchable
                  isDisabled={!formData.provinceId}
                  value={regencyOptions.find((item) => item.label === formData.city) ?? null}
                  onChange={async (option) => {
                    if (!option) {
                      setFormData((prev) => ({ ...prev, city: "", cityId: "", district: "", village: "" }));
                      setDistricts([]);
                      setVillages([]);
                      return;
                    }

                    setFormData((prev) => ({ ...prev, city: option.label, cityId: option.value, district: "", village: "" }));
                    setVillages([]);
                    const data = await getDistricts(option.value);
                    setDistricts(data);
                  }}
                  className="w-full"
                  classNamePrefix="react-select"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-semibold text-gray-700">Kecamatan</label>
                <Select
                  placeholder="Pilih Kecamatan"
                  options={districtOptions}
                  isSearchable
                  isDisabled={!formData.city}
                  value={districtOptions.find((item) => item.label === formData.district) ?? null}
                  onChange={async (option) => {
                    if (!option) {
                      setFormData((prev) => ({ ...prev, district: "", village: "" }));
                      setVillages([]);
                      return;
                    }

                    setFormData((prev) => ({ ...prev, district: option.label, village: "" }));
                    const data = await getVillages(option.value);
                    setVillages(data);
                  }}
                  className="w-full"
                  classNamePrefix="react-select"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-gray-700">Kelurahan / Desa</label>
                <Select
                  placeholder="Pilih Kelurahan / Desa"
                  options={villageOptions}
                  isSearchable
                  isDisabled={!formData.district}
                  value={villageOptions.find((item) => item.label === formData.village) ?? null}
                  onChange={(option) => {
                    if (!option) {
                      setFormData((prev) => ({ ...prev, village: "" }));
                      return;
                    }

                    setFormData((prev) => ({ ...prev, village: option.label }));
                  }}
                  className="w-full"
                  classNamePrefix="react-select"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-gray-700">Kode Pos</label>
              <input
                type="text"
                placeholder="Kode Pos"
                className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                value={formData.postalCode}
                onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-semibold text-gray-700">Budget Minimal (Rp) <span className="text-red-500">*</span></label>
                <input
                  type="number"
                  required
                  placeholder="misal: 1500000"
                  className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                  value={formData.budgetMin}
                  onChange={(e) => setFormData({ ...formData, budgetMin: e.target.value })}
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-gray-700">Budget Maksimal (Rp) <span className="text-red-500">*</span></label>
                <input
                  type="number"
                  required
                  placeholder="misal: 3000000"
                  className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                  value={formData.budgetMax}
                  onChange={(e) => setFormData({ ...formData, budgetMax: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-gray-700">Deadline Lamaran</label>
              <input
                type="date"
                className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <label className="flex items-center justify-between rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700">
                <span>Status Terbuka</span>
                <input
                  type="checkbox"
                  checked={formData.isOpen}
                  onChange={(e) => setFormData({ ...formData, isOpen: e.target.checked })}
                  className="h-4 w-4 rounded border-gray-300 text-[#F4991A] focus:ring-[#F4991A]"
                />
              </label>
            </div>

            <TagPopover selectedTags={selectedTags} setSelectedTags={setSelectedTags} />

            <div>
              <label className="mb-1 block text-xs font-semibold text-gray-700">
                Deskripsi Pekerjaan <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={4}
                required
                placeholder="Tuliskan tugas harian dan rincian pekerjaan..."
                className="w-full resize-none rounded-xl border border-gray-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="flex justify-end pt-3">
              <button
                type="submit"
                disabled={submitting}
                className="rounded-xl bg-[#F4991A] px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-amber-600 disabled:opacity-50"
              >
                {submitting ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
