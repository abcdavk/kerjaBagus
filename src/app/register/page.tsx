"use client";

import { RegisterFormData } from "@/models/register";
import { useState } from "react";
import StepAccount from "../components/register/StepAccount";
import StepProfile from "../components/register/StepProfile";
import StepConfirm from "../components/register/StepConfirm";

export enum RegisterStep {
  ACCOUNT,
  PROFILE,
  ADDRESS,
  CONFIRM,
}

export default function RegisterPage() {
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
    distric: "",
  });

  return (
    <>
      {step === RegisterStep.ACCOUNT && (
        <StepAccount
          formData={formData}
          setFormData={setFormData}
          next={() => setStep(RegisterStep.PROFILE)}
        />
      )}

      {step === RegisterStep.PROFILE && (
        <StepProfile
          formData={formData}
          setFormData={setFormData}
          next={() => setStep(RegisterStep.ADDRESS)}
          back={() => setStep(RegisterStep.ACCOUNT)}
        />
      )}

      {/* {step === RegisterStep.ADDRESS && (
        <StepAddress
          formData={formData}
          setFormData={setFormData}
          next={() => setStep(RegisterStep.CONFIRM)}
          back={() => setStep(RegisterStep.PROFILE)}
        />
      )} */}

      {step === RegisterStep.CONFIRM && (
        <StepConfirm
          formData={formData}
          back={() => setStep(RegisterStep.ADDRESS)}
        />
      )}
    </>
  );
}