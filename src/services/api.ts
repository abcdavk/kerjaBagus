export async function api<T>(
  path: string,
  init?: RequestInit
): Promise<T> {
  const response = await fetch(path, init);

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      data?.message ??
      `Request failed (${response.status})`
    );
  }

  return data;
}