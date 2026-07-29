"use client";

import { RegisterFormData } from "@/models/register";
import { useState } from "react";
import StepAccount from "../components/register/StepAccount";
import StepAddress from "../components/register/StepAddress";
import StepRoleAndConfirm from "../components/register/StepRoleAndConfirm";
import Image from "next/image";
import Link from "next/link";
import { ApiError } from "@/services/api";
import { register } from "@/services/auth.service";
import { updateProfile } from "@/services/profiles.service";
import { getUser, updateUser } from "@/services/users.service";
import { useRouter } from "next/navigation";

export enum RegisterStep {
  ACCOUNT,
  ADDRESS,
  CONFIRM,
}

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(RegisterStep.ACCOUNT);

  const [formData, setFormData] = useState<RegisterFormData>({
    name: "",
    username: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    province: "",
    city: "",
    district: "",
    village: "",
    postalCode: "",
    isFreelancer: true,
    isClient: false
  });

  const handleRegister = async () => {
    const {
      name, email, password, phone, username, 
      isClient, isFreelancer,
      province, city, district, village, postalCode
    } = formData;
      

    //   setLoading(true);
  
    try {
      const { user: registerUser } = await register({
        email,
        username,
        displayName: name,
        password,
        phone,
        isFreelancer,
        isClient
      });

      const user = await getUser(registerUser.id);

      const profile = await updateProfile(user.profile.id, {
        address: {
          country: "Indonesia",
          province,
          city,
          district,
          village,
          postalCode
        }
      });

      router.push("/profile")
    } catch (err) {
      // if (err instanceof ApiError) {
      //   console.error(err.message);
      // }
      //  else {
      //   setError("Terjadi kesalahan.");
      // }
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-start bg-gradient-to-b from-[#FAF8F0] via-[#FAF8F0] to-[#E2E8DD] px-4 pt-12 pb-16">
      <div className="mb-6 text-center flex flex-col items-center justify-center">
        <Link href="/" className="flex flex-col items-center gap-2">
          <Image
            src="/logo/kerjabagus_icon.svg"
            alt="KerjaBagus Logo"
            width={140}
            height={40}
            className="h-10 w-auto"
          />
        </Link>
      </div>
      {/* <div> */}
        {step === RegisterStep.ACCOUNT && (
          <StepAccount
            formData={formData}
            setFormData={setFormData}
            next={() => setStep(RegisterStep.ADDRESS)}
          />
        )}

        {step === RegisterStep.ADDRESS && (
          <StepAddress
            formData={formData}
            setFormData={setFormData}
            next={() => setStep(RegisterStep.CONFIRM)}
            back={() => setStep(RegisterStep.ACCOUNT)}
          />
        )}

        {step === RegisterStep.CONFIRM && (
          <StepRoleAndConfirm
            formData={formData}
            setFormData={setFormData}
            back={() => setStep(RegisterStep.ADDRESS)}
            next={() => handleRegister()}
          />
        )}
      {/* </div> */}
    </div>
  );
}