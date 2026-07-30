import { api } from "./api";

const BASE_URL = "https://www.emsifa.com/api-wilayah-indonesia/api";

export interface Province {
  id: string;
  name: string;
}

export interface Regency {
  id: string;
  province_id: string;
  name: string;
}

export interface District {
  id: string;
  regency_id: string;
  name: string;
}

export interface Village {
  id: string;
  district_id: string;
  name: string;
}

export interface Region {
  id: string;
  name: string;
}

function toTitleCase(text: string): string {
  return text
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export async function getProvinces() {
  const provinces = await api<Province[]>(`${BASE_URL}/provinces.json`);
  return provinces.map((province) => ({
    ...province,
    name: toTitleCase(province.name),
  }));
}

export async function getRegencies(provinceId: string) {
  const regencies = await api<Regency[]>(
    `${BASE_URL}/regencies/${provinceId}.json`
  );

  return regencies.map((regency) => ({
    ...regency,
    name: toTitleCase(regency.name),
  }));
}

export async function getDistricts(regencyId: string) {
  const districts = await api<District[]>(
    `${BASE_URL}/districts/${regencyId}.json`
  );

  return districts.map((district) => ({
    ...district,
    name: toTitleCase(district.name),
  }));
}

export async function getVillages(districtId: string) {
  const villages = await api<Village[]>(
    `${BASE_URL}/villages/${districtId}.json`
  );

  return villages.map((village) => ({
    ...village,
    name: toTitleCase(village.name),
  }));
}