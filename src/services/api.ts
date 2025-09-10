// src/services/api.ts
import { getSession } from "@/lib/get-session";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

interface ApiOptions extends RequestInit {
  token?: string;
}

export async function apiFetch(endpoint: string, options?: ApiOptions) {
  const session = await getSession();
  const token = session?.accessToken || options?.token;

  const url = `${BASE_URL}${endpoint}`;
  const headers = {
    "Content-Type": "application/json",
    ...options?.headers,
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  const response = await fetch(url, { ...options, headers });

  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => ({ message: "Erro na requisição" }));
    throw new Error(errorData.message || "Erro na requisição");
  }

  return response.json();
}
