export async function api<T>(
  path: string,
  init?: RequestInit
): Promise<T> {
  const response = await fetch(path, init);

  if (!response.ok) {
    throw new Error("API Error");
  }

  return response.json();
}