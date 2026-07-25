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

export function getProvinces() {
  return api<Province[]>(`${BASE_URL}/provinces.json`);
}

export function getRegencies(provinceId: string) {
  return api<Regency[]>(`${BASE_URL}/regencies/${provinceId}.json`);
}

export function getDistricts(regencyId: string) {
  return api<District[]>(`${BASE_URL}/districts/${regencyId}.json`);
}

export function getVillages(districtId: string) {
  return api<Village[]>(`${BASE_URL}/villages/${districtId}.json`);
}