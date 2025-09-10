"use server";
import { apiFetch } from "../api";

interface RegisterUserData {
  name: string;
  email: string;
  password: string;
}

// CORREÇÃO APLICADA AQUI
export async function registerUser(data: RegisterUserData): Promise<any> {
  // Define a URL base da API, lendo da variável de ambiente
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  // Usa a URL correta para a requisição
  const response = await fetch(`${API_URL}/api/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => ({ error: "Falha ao registrar." }));
    throw new Error(errorData.error || "Falha ao registrar.");
  }

  return response.json();
}

export async function updateUserTeamPreference(
  userId: string,
  teamId: string
): Promise<any> {
  return apiFetch(`/api/users/${userId}`, {
    method: "PUT",
    body: JSON.stringify({ teamId }),
  });
}
