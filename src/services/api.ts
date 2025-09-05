const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

interface ApiOptions extends RequestInit {
  token?: string;
}

export async function apiFetch(endpoint: string, options?: ApiOptions) {
  const url = `${BASE_URL}${endpoint}`;
  const headers = {
    ...options?.headers,
    ...(options?.token && { Authorization: `Bearer ${options.token}` }),
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
