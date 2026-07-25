export class ApiError extends Error {
  public errors: string | string[];
  constructor( 
    errors: string | string[], 
    public status: number
  ) {
    super(Array.isArray(errors) ? errors.join("\n") : errors);

    this.name = "ApiError";
    this.errors = errors;
  } 
}

export async function api<T>(
  path: string,
  init?: RequestInit
): Promise<T> {
  const response = await fetch(path, init);

  const data = await response.json();

  if (!response.ok) {
    throw new ApiError(
      data.message ?? "Terjadi kesalahan.",
      response.status
    );
  }

  return data;
}