const STRAPI_URL = process.env.STRAPI_URL?.replace(/\/$/, "");

export function getStrapiUrl() {
  return STRAPI_URL;
}

export async function strapiFetch<T>(
  path: string,
  token?: string,
  options: RequestInit = {},
): Promise<T> {
  if (!STRAPI_URL) {
    throw new Error("STRAPI_URL is not configured");
  }

  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");

  if (token) {
    headers.set("Authorization", "Bearer " + token);
  }

  const response = await fetch(STRAPI_URL + path, {
    ...options,
    headers,
    cache: "no-store",
  });

  if (response.status === 401) {
    throw new Error("strapi_token_expired");
  }

  if (!response.ok) {
    throw new Error("Strapi request failed: " + response.status);
  }

  return (await response.json()) as T;
}
