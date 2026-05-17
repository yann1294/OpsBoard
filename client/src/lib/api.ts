type ApiFetchOptions = RequestInit & {
  token?: string;
};

export async function apiFetch<T>(
  path: string,
  options: ApiFetchOptions = {},
): Promise<T> {
  const { token, headers, ...rest } = options;
  const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
  const url = `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`;

  const response = await fetch(url, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!response.ok) {
    const responseText = await response.text();
    const message = responseText || response.statusText || "Request failed";
    throw new Error(`API ${response.status} ${response.statusText}: ${message}`);
  }

  return (await response.json()) as T;
}
