import { RegisterFormData } from "@/models/register";

type Props = {
  formData: RegisterFormData;
  back: () => void;
};

export default function StepConfirm({
  formData,
  back,
}: Props) {

  async function handleSubmit() {

    console.log(formData);

    // POST /api/auth/register
  }

  return (
    <>
      <pre>
        {JSON.stringify(formData, null, 2)}
      </pre>

      <button onClick={back}>
        Back
      </button>

      <button onClick={handleSubmit}>
        Register
      </button>
    </>
  );
}