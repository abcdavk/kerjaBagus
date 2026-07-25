import { RegisterFormDataProps } from "@/models/register";
import { RiArrowLeftLine } from "@remixicon/react";
import { useEffect, useState } from "react";
import Select from "react-select";
import {
  getDistricts,
  getProvinces,
  getRegencies,
  getVillages,
  Region,
} from "@/services/address.service";
import { validateAddress } from "@/services/auth.service";
import { ApiError } from "@/services/api";

type Props = RegisterFormDataProps & {
  next: () => void;
  back: () => void;
};

export default function StepProfile({
  formData,
  setFormData,
  next,
  back,
}: Props) {
  const [error, setError] = useState<string[]>([]);

  const [provinces, setProvinces] = useState<Region[]>([]);
  const [regencies, setRegencies] = useState<Region[]>([]);
  const [districts, setDistricts] = useState<Region[]>([]);
  const [villages, setVillages] = useState<Region[]>([]);

  useEffect(() => {
    getProvinces().then(setProvinces);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setError([]);

    try {
      await validateAddress({
        province: formData.province,
        city: formData.city,
        district: formData.district,
        village: formData.village,
        postalCode: formData.postalCode,
      });

      next();
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.errors as string[]);
      }
    }
  };

  const isFormValid = 
    formData.province && 
    formData.city &&
    formData.district &&
    formData.postalCode
  return (
    <div className="w-full max-w-lg rounded-xl bg-white p-8 shadow-lg border border-gray-100">
      <button
        onClick={back}
        className="flex items-center gap-1 hover:underline text-xs text-[#386641] mb-4 cursor-pointer"
      >
        <RiArrowLeftLine size={15} />
        Kembali
      </button>
      <h2 className="text-center text-xl font-bold text-gray-800 mb-5">
        Lengkapi Alamat
      </h2>
      <form className="space-y-4" onSubmit={handleSubmit}>

        {
          error.length > 0 && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-lg">
              {(error as string[]).map((message, id) => (
                <p key={id}>* {message}</p>
              ))}
            </div>
          )
        }

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

        <div>
          <input
            type="text"
            name="postalCode"
            value={formData.postalCode}
            onChange={handleChange}
            placeholder="Kode Pos*"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-[#386641] focus:outline-none transition"
            required
          />
        </div>

        <button
          type="submit"
          disabled={!isFormValid}
          className={`w-full rounded-lg py-3 text-sm font-semibold transition mt-4 ${
            isFormValid
              ? "bg-[#386641] text-white cursor-pointer hover:bg-[#2d5234]"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          Lanjutkan
        </button>
        {/* <button
          type="submit"
          // disabled={!isFormValid}
          className="w-full rounded-lg py-3 text-sm font-semibold transition mt-4 bg-[#386641] text-white cursor-pointer hover:bg-[#2d5234]"
        >
          Lanjutkan
        </button> */}
      </form>
    </div>
  );
}