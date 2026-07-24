import { RegisterFormDataProps } from "@/models/register";

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
  return (
    <>
      <input
        placeholder="Phone"
        value={formData.phone}
        onChange={(e) =>
          setFormData((prev) => ({
            ...prev,
            phone: e.target.value,
          }))
        }
      />

      <button onClick={back}>
        Back
      </button>

      <button onClick={next}>
        Next
      </button>
    </>
  );
}