import React, { SetStateAction } from "react";

export type RegisterFormData = {
  name: string;
  username: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;

  province: string;
  city: string;
  district: string;
  village: string;
  postalCode: string;

  isClient: boolean;
  isFreelancer: boolean;
}

export type RegisterFormDataProps = {
  formData: RegisterFormData;
  setFormData: React.Dispatch<SetStateAction<RegisterFormData>>;
};