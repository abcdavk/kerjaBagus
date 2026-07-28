"use client";

import React, { useEffect, useState } from "react";
import {
  RiAddLine,
  RiCheckLine,
  RiCloseLine,
  RiEditLine,
  RiMailLine,
  RiMapPin2Line,
  RiGithubLine,
  RiLinkedinBoxLine,
  RiGlobalLine,
  RiBriefcaseLine,
  RiBriefcase2Line,
  RiUserFollowLine,
  RiLogoutBoxLine,
} from "@remixicon/react";
import { useRouter } from "next/navigation";
import { logout, me } from "@/services/auth.service";
import { getUser } from "@/services/users.service";
import EditableCard from "../components/editableCard";
import { getProfile, updateProfile } from "@/services/profiles.service";
import { GetUserResponse } from "@/models/user";
import { GetProfileResponse } from "@/models/profile";
import { Loading } from "../components/loading";
import BackButton from "../components/backButton";
import ApplicationHistoryCard from "../components/AppHistoryCard";
import { getDistricts, getProvinces, getRegencies, getVillages, Region } from "@/services/address.service";
import Select from "react-select";

type ProfileFormState = {
  skills: string[];
  website: string;
  github: string;
  linkedin: string;
  portfolio: string;
  isAvailable: boolean;
  province: string;
  city: string;
  district: string;
  village: string;
  postalCode: string;
};

type FeedbackState = {
  type: "success" | "error";
  message: string;
};

export default function ProfilePage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [skillInput, setSkillInput] = useState("");
  const [feedback, setFeedback] = useState<FeedbackState | null>(null);

  const [userData, setUserData] = useState<GetUserResponse | null>(null);
  const [profileData, setProfileData] = useState<GetProfileResponse | null>(null);
  const [formData, setFormData] = useState<ProfileFormState>({
    skills: [],
    website: "",
    github: "",
    linkedin: "",
    portfolio: "",
    isAvailable: true,
    province: "",
    city: "",
    district: "",
    village: "",
    postalCode: "",
  });

  const [provinces, setProvinces] = useState<Region[]>([]);
  const [regencies, setRegencies] = useState<Region[]>([]);
  const [districts, setDistricts] = useState<Region[]>([]);
  const [villages, setVillages] = useState<Region[]>([]);

  const provinceOptions = provinces.map((v) => ({
    value: v.id,
    label: v.name,
  }));

  const regencyOptions = regencies.map((v) => ({
    value: v.id,
    label: v.name,
  }));

  const districtOptions = districts.map((v) => ({
    value: v.id,
    label: v.name,
  }));

  const villageOptions = villages.map((v) => ({
    value: v.id,
    label: v.name,
  }));

  const loadAddressOptions = async (initialForm: ProfileFormState) => {
    try {
      const provinceData = await getProvinces();
      setProvinces(provinceData);

      const selectedProvince = provinceData.find(
        (province) => province.name === initialForm.province,
      );

      if (!selectedProvince) {
        setRegencies([]);
        setDistricts([]);
        setVillages([]);
        return;
      }

      const regencyData = await getRegencies(selectedProvince.id);
      setRegencies(regencyData);

      const selectedRegency = regencyData.find(
        (regency) => regency.name === initialForm.city,
      );

      if (!selectedRegency) {
        setDistricts([]);
        setVillages([]);
        return;
      }

      const districtData = await getDistricts(selectedRegency.id);
      setDistricts(districtData);

      const selectedDistrict = districtData.find(
        (district) => district.name === initialForm.district,
      );

      if (!selectedDistrict) {
        setVillages([]);
        return;
      }

      const villageData = await getVillages(selectedDistrict.id);
      setVillages(villageData);
    } catch (error) {
      console.error(error);
      setRegencies([]);
      setDistricts([]);
      setVillages([]);
    }
  };

  useEffect(() => {
    async function loadUser() {
      try {
        const data = await me();
        const user = await getUser(data.user.id);
        const profile = await getProfile(user.profile.id);

        const initialForm = {
          skills: profile.skills ?? [],
          website: profile.website ?? "",
          github: profile.github ?? "",
          linkedin: profile.linkedin ?? "",
          portfolio: profile.portfolio ?? "",
          isAvailable: profile.isAvailable ?? true,
          province: profile.address?.province ?? "",
          city: profile.address?.city ?? "",
          district: profile.address?.district ?? "",
          village: profile.address?.village ?? "",
          postalCode: profile.address?.postalCode ?? "",
        };

        setUserData(user);
        setProfileData(profile);
        setFormData(initialForm);
        await loadAddressOptions(initialForm);
      } catch (error) {
        console.error(error);

        router.replace("/login");

        setUserData(null);
        setProfileData(null);
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, [router]);

  const handleLogoutButton = async () => {
    await logout();
    router.push("/login");
    router.refresh();
  };

  const getInitials = (name: string) => {
    if (!name) return "UB";

    const parts = name.trim().split(" ");

    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }

    return parts[0].substring(0, 2).toUpperCase();
  };

  const updateField = <K extends keyof ProfileFormState>(
    field: K,
    value: ProfileFormState[K],
  ) => {
    // Guard: field updates should only ever be applied while in edit mode.
    if (!isEditing) return;

    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddSkill = () => {
    if (!isEditing) return;

    const trimmed = skillInput.trim();

    if (!trimmed) return;

    if (formData.skills.includes(trimmed)) {
      setSkillInput("");
      return;
    }

    updateField("skills", [...formData.skills, trimmed]);
    setSkillInput("");
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    if (!isEditing) return;

    updateField(
      "skills",
      formData.skills.filter((skill) => skill !== skillToRemove),
    );
  };

  const handleStartEdit = () => {
    setFeedback(null);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setFeedback(null);
    setIsEditing(false);
    setSkillInput("");

    if (profileData) {
      setFormData({
        skills: profileData.skills ?? [],
        website: profileData.website ?? "",
        github: profileData.github ?? "",
        linkedin: profileData.linkedin ?? "",
        portfolio: profileData.portfolio ?? "",
        isAvailable: profileData.isAvailable ?? true,
        province: profileData.address?.province ?? "",
        city: profileData.address?.city ?? "",
        district: profileData.address?.district ?? "",
        village: profileData.address?.village ?? "",
        postalCode: profileData.address?.postalCode ?? "",
      });
    }
  };

  const handleSaveProfile = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!profileData || !isEditing) return;

    setIsSaving(true);
    setFeedback(null);

    try {
      const payload = {
        skills: formData.skills.filter(Boolean),
        website: formData.website.trim() ? formData.website.trim() : null,
        github: formData.github.trim() ? formData.github.trim() : null,
        linkedin: formData.linkedin.trim() ? formData.linkedin.trim() : null,
        portfolio: formData.portfolio.trim() ? formData.portfolio.trim() : null,
        isAvailable: formData.isAvailable,
        address: {
          province: formData.province.trim(),
          city: formData.city.trim(),
          district: formData.district.trim() ? formData.district.trim() : null,
          village: formData.village.trim() ? formData.village.trim() : null,
          postalCode: formData.postalCode.trim()
            ? formData.postalCode.trim()
            : null,
        },
      };

      const updatedProfile = await updateProfile(profileData.id, payload);

      setProfileData(updatedProfile);
      setFormData({
        skills: updatedProfile.skills ?? [],
        website: updatedProfile.website ?? "",
        github: updatedProfile.github ?? "",
        linkedin: updatedProfile.linkedin ?? "",
        portfolio: updatedProfile.portfolio ?? "",
        isAvailable: updatedProfile.isAvailable ?? true,
        province: updatedProfile.address?.province ?? "",
        city: updatedProfile.address?.city ?? "",
        district: updatedProfile.address?.district ?? "",
        village: updatedProfile.address?.village ?? "",
        postalCode: updatedProfile.address?.postalCode ?? "",
      });
      setIsEditing(false);
      setSkillInput("");
      setFeedback({ type: "success", message: "Profil berhasil diperbarui." });
    } catch (error) {
      console.error(error);
      setFeedback({
        type: "error",
        message: "Gagal menyimpan profil. Silakan coba lagi.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Bio & headline inline-edit handlers only ever get wired to EditableCard
  // when isEditing is true (see render below), so they can't fire while
  // the page is in read-only mode.
  const handleOnChangeBio = async (value: string) => {
    if (!profileData) return;
    if (profileData.bio === value) return;
    await updateProfile(profileData.id, {
      bio: value,
    });
  };

  const handleOnChangeHeadline = async (value: string) => {
    if (!profileData) return;
    if (profileData.headline === value) return;
    await updateProfile(profileData.id, {
      headline: value,
    });
  };

  if (loading) {
    return <Loading />;
  }

  const hasAddress =
    !!profileData?.address?.province ||
    !!profileData?.address?.city ||
    !!profileData?.address?.district ||
    !!profileData?.address?.village ||
    !!profileData?.address?.postalCode;

  const addressParts = [
    profileData?.address?.village,
    profileData?.address?.district,
    profileData?.address?.city,
    profileData?.address?.province,
    profileData?.address?.postalCode,
  ].filter(Boolean);

  const handleOnChangeAddress = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-[#FAF8F0] px-6 py-10">
      <div className="max-w-4xl mx-auto space-y-6">
        <BackButton />

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-start gap-5 w-full">
            <div className="w-20 h-20 rounded-full bg-[#D8E6D3] text-[#386641] flex-shrink-0 flex items-center justify-center font-bold text-2xl border border-[#386641]/20">
              {getInitials(profileData?.displayName ?? "")}
            </div>

            <div className="w-full">
              <section className="flex flex-col sm:flex-row gap-2 items-start sm:items-end justify-between w-full">
                <div className="space-y-1">
                  <h1 className="text-2xl font-bold text-gray-800">
                    {profileData?.displayName || "Nama Pengguna"}
                  </h1>
                  <span className="text-sm text-gray-500">
                    @{profileData?.username ?? ""}
                  </span>
                </div>
              </section>

              {isEditing ? (
                <EditableCard
                  initialBody={profileData?.headline ?? ""}
                  widthType="wrap"
                  maxLength={60}
                  onChange={handleOnChangeHeadline}
                />
              ) : (
                <p className="text-gray-600 mt-1">
                  {profileData?.headline || (
                    <span className="italic text-gray-400">
                      Belum ada headline.
                    </span>
                  )}
                </p>
              )}

              <p className="text-gray-400 mt-2 flex flex-col sm:flex-row sm:items-center gap-2 font-light">
                <span className="flex gap-1 items-center">
                  <RiMapPin2Line className="w-4" />{" "}
                  {profileData?.address?.province ?? ""}
                </span>
                <span className="flex gap-1 items-center">
                  <RiMailLine className="w-4" /> {userData?.email ?? ""}
                </span>
              </p>
            </div>
          </div>

          <div className="inline-flex flex-col items-stretch gap-3 w-full md:w-auto">
            <div className="flex w-full items-center justify-center gap-2 rounded-xl border border-amber-300 bg-amber-50 px-4 py-2.5 text-xs font-semibold text-amber-900 whitespace-nowrap">
              {userData?.isClient ? <RiBriefcase2Line size={16} /> : <RiUserFollowLine size={16} />}              
              <span>
                {userData?.isClient ? "Pemberi Kerja" : "Pencari Kerja"}
              </span>
            </div>

            {!isEditing && (
              <button
                type="button"
                onClick={handleStartEdit}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-2.5 text-xs font-semibold text-amber-900 whitespace-nowrap hover:cursor-pointer"
              >
                <RiEditLine size={16} />
                Edit Profile
              </button>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 p-4 bg-white shadow-sm">
          <h3 className="text-lg font-bold text-gray-800 mb-3">Tentang Saya</h3>
          {isEditing ? (
            <EditableCard
              initialBody={profileData?.bio ?? ""}
              maxLength={500}
              onChange={handleOnChangeBio}
            />
          ) : (
            <p className="text-gray-600 whitespace-pre-line">
              {profileData?.bio || (
                <span className="italic text-gray-400">
                  Belum ada bio.
                </span>
              )}
            </p>
          )}
        </div>

        {feedback ? (
          <div
            className={`rounded-xl border px-4 py-3 text-sm ${
              feedback.type === "success"
                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                : "border-red-200 bg-red-50 text-red-700"
            }`}
          >
            {feedback.message}
          </div>
        ) : null}

        {isEditing ? (
          // ---- EDIT MODE: the only place any profile field is mutable ----
          <form
            onSubmit={handleSaveProfile}
            className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm space-y-5"
          >
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-800">Edit Profil</h3>
                <p className="text-sm text-gray-500">
                  Perbarui keahlian, tautan, ketersediaan, dan alamat Anda.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                >
                  <RiCloseLine size={16} />
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 rounded-lg bg-[#F4991A] px-4 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSaving ? (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : (
                    <RiCheckLine size={16} />
                  )}
                  Save
                </button>
              </div>
            </div>

            <div className="rounded-xl border border-[#F6D39E] bg-[#FBF6F0] p-4">
              <label className="flex items-center justify-between gap-3 rounded-lg border border-transparent bg-white/70 px-3 py-2 text-sm font-medium text-gray-700">
                <span>{userData?.isClient ? "Siap membuka lowongan" : "Bersedia untuk bekerja"}</span>
                <input
                  type="checkbox"
                  checked={formData.isAvailable}
                  onChange={(event) => updateField("isAvailable", event.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-[#F4991A] focus:ring-[#F4991A]"
                />
              </label>
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <label className="space-y-1 text-sm text-gray-600">
                <span className="font-semibold text-gray-700">Website</span>
                <input
                  value={formData.website}
                  onChange={(event) => updateField("website", event.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 outline-none ring-0 focus:border-[#F4991A]"
                  placeholder="https://example.com"
                />
              </label>
              <label className="space-y-1 text-sm text-gray-600">
                <span className="font-semibold text-gray-700">GitHub</span>
                <input
                  value={formData.github}
                  onChange={(event) => updateField("github", event.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 outline-none ring-0 focus:border-[#F4991A]"
                  placeholder="https://github.com/username"
                />
              </label>
              <label className="space-y-1 text-sm text-gray-600">
                <span className="font-semibold text-gray-700">LinkedIn</span>
                <input
                  value={formData.linkedin}
                  onChange={(event) => updateField("linkedin", event.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 outline-none ring-0 focus:border-[#F4991A]"
                  placeholder="https://linkedin.com/in/username"
                />
              </label>
              <label className="space-y-1 text-sm text-gray-600">
                <span className="font-semibold text-gray-700">Portfolio</span>
                <input
                  value={formData.portfolio}
                  onChange={(event) => updateField("portfolio", event.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 outline-none ring-0 focus:border-[#F4991A]"
                  placeholder="https://yourportfolio.com"
                />
              </label>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-base font-bold text-gray-800">Skills</h4>
                <span className="text-sm text-gray-500">
                  Tekan Enter atau tombol tambah untuk menambahkan.
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {formData.skills.map((skill, index) => (
                  <span
                    key={`${skill}-${index}`}
                    className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="text-gray-500 transition hover:text-red-500"
                    >
                      <RiCloseLine size={14} />
                    </button>
                  </span>
                ))}
              </div>

              <div className="flex flex-col gap-2 sm:flex-row">
                <input
                  value={skillInput}
                  onChange={(event) => setSkillInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      handleAddSkill();
                    }
                  }}
                  className="flex-1 rounded-lg border border-gray-200 px-3 py-2 outline-none focus:border-[#F4991A]"
                  placeholder="Tambah skill"
                />
                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#F6D39E] bg-[#FBF6F0] px-4 py-2 text-sm font-semibold text-[#C67C00] transition hover:-translate-y-0.5"
                >
                  <RiAddLine size={16} />
                  Tambah
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-base font-bold text-gray-800">Alamat</h4>
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <Select
                  placeholder="Provinsi*"
                  options={provinceOptions}
                  isSearchable
                  value={
                    provinceOptions.find(
                      (v) => v.label === formData.province
                    ) ?? null
                  }
                  onChange={async (option) => {
                    if (!option) return;

                    setFormData({
                      ...formData,
                      province: option.label,
                      city: "",
                      district: "",
                      village: "",
                    });

                    setRegencies(await getRegencies(option.value));
                    setDistricts([]);
                    setVillages([]);
                  }}
                />

                <Select
                  placeholder="Kabupaten / Kota*"
                  options={regencyOptions}
                  isDisabled={!formData.province}
                  isSearchable
                  value={
                    regencyOptions.find(
                      (v) => v.label === formData.city
                    ) ?? null
                  }
                  onChange={async (option) => {
                    if (!option) return;

                    setFormData({
                      ...formData,
                      city: option.label,
                      district: "",
                      village: "",
                    });

                    setDistricts(await getDistricts(option.value));
                    setVillages([]);
                  }}
                />

                <Select
                  placeholder="Kecamatan*"
                  options={districtOptions}
                  isDisabled={!formData.city}
                  isSearchable
                  value={
                    districtOptions.find(
                      (v) => v.label === formData.district
                    ) ?? null
                  }
                  onChange={async (option) => {
                    if (!option) return;

                    setFormData({
                      ...formData,
                      district: option.label,
                      village: "",
                    });

                    setVillages(await getVillages(option.value));
                  }}
                />

                <Select
                  placeholder="Kelurahan / Desa*"
                  options={villageOptions}
                  isDisabled={!formData.district}
                  isSearchable
                  value={
                    villageOptions.find(
                      (v) => v.label === formData.village
                    ) ?? null
                  }
                  onChange={(option) => {
                    if (!option) return;

                    setFormData({
                      ...formData,
                      village: option.label,
                    });
                  }}
                />

                {/* <div>
                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleOnChangeAddress}
                    placeholder="Kode Pos*"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-[#386641] focus:outline-none transition"
                    required
                  />
                </div>
                <label className="space-y-1 text-sm text-gray-600">
                  <span className="font-semibold text-gray-700">Provinsi</span>
                  <input
                    value={formData.province}
                    onChange={(event) => updateField("province", event.target.value)}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 outline-none focus:border-[#F4991A]"
                    placeholder="Provinsi"
                  />
                </label>
                <label className="space-y-1 text-sm text-gray-600">
                  <span className="font-semibold text-gray-700">Kota</span>
                  <input
                    value={formData.city}
                    onChange={(event) => updateField("city", event.target.value)}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 outline-none focus:border-[#F4991A]"
                    placeholder="Kota"
                  />
                </label>
                <label className="space-y-1 text-sm text-gray-600">
                  <span className="font-semibold text-gray-700">Kecamatan</span>
                  <input
                    value={ }
                    onChange={(event) => updateField("district", event.target.value)}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 outline-none focus:border-[#F4991A]"
                    placeholder="Kecamatan"
                  />
                </label>
                <label className="space-y-1 text-sm text-gray-600">
                  <span className="font-semibold text-gray-700">Kelurahan</span>
                  <input
                    value={formData.village}
                    onChange={(event) => updateField("village", event.target.value)}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 outline-none focus:border-[#F4991A]"
                    placeholder="Kelurahan"
                  />
                </label>
                <label className="space-y-1 text-sm text-gray-600 lg:col-span-2">
                  <span className="font-semibold text-gray-700">Kode Pos</span>
                  <input
                    value={formData.postalCode}
                    onChange={(event) => updateField("postalCode", event.target.value)}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 outline-none focus:border-[#F4991A]"
                    placeholder="Kode Pos"
                  />
                </label> */}
              </div>
            </div>
          </form>
        ) : (
          // ---- VIEW MODE: everything below is strictly read-only ----
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-800">Detail Profil</h3>
              <span
                className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${
                  profileData?.isAvailable
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "bg-gray-100 text-gray-500 border border-gray-200"
                }`}
              >
                <RiBriefcaseLine size={14} />
                {profileData?.isAvailable
                  ? (userData?.isClient ? "Siap membuka lowongan" : "Bersedia untuk bekerja")
                  : "Tidak tersedia"}
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <div className="space-y-1 text-sm">
                <span className="font-semibold text-gray-700 flex items-center gap-1.5">
                  <RiGlobalLine size={15} /> Website
                </span>
                {profileData?.website ? (
                  <a
                    href={profileData.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#386641] break-all hover:underline"
                  >
                    {profileData.website}
                  </a>
                ) : (
                  <p className="italic text-gray-400">Belum diisi.</p>
                )}
              </div>

              <div className="space-y-1 text-sm">
                <span className="font-semibold text-gray-700 flex items-center gap-1.5">
                  <RiGithubLine size={15} /> GitHub
                </span>
                {profileData?.github ? (
                  <a
                    href={profileData.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#386641] break-all hover:underline"
                  >
                    {profileData.github}
                  </a>
                ) : (
                  <p className="italic text-gray-400">Belum diisi.</p>
                )}
              </div>

              <div className="space-y-1 text-sm">
                <span className="font-semibold text-gray-700 flex items-center gap-1.5">
                  <RiLinkedinBoxLine size={15} /> LinkedIn
                </span>
                {profileData?.linkedin ? (
                  <a
                    href={profileData.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#386641] break-all hover:underline"
                  >
                    {profileData.linkedin}
                  </a>
                ) : (
                  <p className="italic text-gray-400">Belum diisi.</p>
                )}
              </div>

              <div className="space-y-1 text-sm">
                <span className="font-semibold text-gray-700 flex items-center gap-1.5">
                  <RiGlobalLine size={15} /> Portfolio
                </span>
                {profileData?.portfolio ? (
                  <a
                    href={profileData.portfolio}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#386641] break-all hover:underline"
                  >
                    {profileData.portfolio}
                  </a>
                ) : (
                  <p className="italic text-gray-400">Belum diisi.</p>
                )}
              </div>
            </div>

            <div className="space-y-1 text-sm">
              <span className="font-semibold text-gray-700 flex items-center gap-1.5">
                <RiMapPin2Line size={15} /> Alamat
              </span>
              {hasAddress ? (
                <p className="text-gray-600">{addressParts.join(", ")}</p>
              ) : (
                <p className="italic text-gray-400">Belum diisi.</p>
              )}
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-3">
                Keahlian (Skills)
              </h3>

              {profileData && profileData?.skills?.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {profileData.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 text-xs px-3 py-1 rounded-full text-gray-600"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-md text-gray-400 italic">
                  Belum ada keahlian ditambahkan.
                </p>
              )}
            </div>
          </div>
        )}

        <div className="flex justify-end">
          <button
            className="flex gap-2 cursor-pointer border border-red-700 bg-red-500 w-auto items-center p-2 rounded-xl text-white text-xl font-bold shadow-sm hover:scale-101 transition-all"
            onClick={handleLogoutButton}
          >
            <RiLogoutBoxLine />
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
}
