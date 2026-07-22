import { api } from "./api";
import {
  GetProfileResponse,
  UpdateProfileRequest,
  DeleteProfileResponse,
} from "@/models/profile";

/**
 * GET /api/profiles/:id
 */
export async function getProfile(id: string) {
  return api<GetProfileResponse>(`/api/profiles/${id}`);
}

/**
 * PATCH /api/profiles/:id
 */
export async function updateProfile(
  id: string,
  body: UpdateProfileRequest
) {
  return api<GetProfileResponse>(`/api/profiles/${id}`, {
    method: "PATCH",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify(body),
  });
}

/**
 * DELETE /api/profiles/:id
 */
export async function deleteProfile(id: string) {
  return api<DeleteProfileResponse>(`/api/profiles/${id}`, {
    method: "DELETE",
  });
}