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
  distric: string;
}

export type RegisterFormDataProps = {
  formData: RegisterFormData;
  setFormData: React.Dispatch<SetStateAction<RegisterFormData>>;
};