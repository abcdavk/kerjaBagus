export interface ProfileAddress {
  id: string;

  country: string;
  province: string;
  city: string;

  district?: string | null;
  village?: string | null;
  postalCode?: string | null;

  latitude?: number | null;
  longitude?: number | null;
}

export interface ProfileUser {
  id: string;

  email: string;

  isClient: boolean;
  isFreelancer: boolean;
  isAdmin: boolean;
}

export type GetProfileResponse = {
  id: string;

  displayName: string;
  username: string;

  avatar?: string;

  headline: string;
  bio?: string;

  skills: string[];

  website?: string;
  github?: string;
  linkedin?: string;
  portfolio?: string;

  hourlyRate?: number;
  currency?: string;

  isAvailable: boolean;

  createdAt: string;
  updatedAt: string;

  address?: ProfileAddress;
}

export interface UpdateProfileRequest {
  displayName?: string;
  username?: string;

  avatar?: string | null;

  headline?: string;
  bio?: string | null;

  skills?: string[];

  website?: string | null;
  github?: string | null;
  linkedin?: string | null;
  portfolio?: string | null;

  hourlyRate?: number | null;
  currency?: string | null;

  isAvailable?: boolean;
}

export interface DeleteProfileResponse {
  message: string;
}