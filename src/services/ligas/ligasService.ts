import { apiFetch } from "../api";

export interface Liga {
  id: number;
  name: string;
  image?: string;
}

const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJ0ZXN0ZUBnbWFpbC5jb20iLCJuYW1lIjoidGVzdGUiLCJpYXQiOjE3NTY3MzM5NTksImV4cCI6MTc1NjczNzU1OX0.zkBNfAzgk3goKEjkYKfzIZ2liKU5SBJkjvKA0zCDOzE";

export async function fetchLigas(): Promise<Liga[]> {
  return apiFetch("/ligas", { token });
}

export async function createLiga(data: Omit<Liga, "id">): Promise<Liga> {
  return apiFetch("/ligas", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    token,
  });
}

export async function updateLiga(
  id: number,
  data: Omit<Partial<Liga>, "id">
): Promise<Liga> {
  return apiFetch(`/ligas/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    token,
  });
}

export async function deleteLiga(id: number): Promise<void> {
  await apiFetch(`/ligas/${id}`, {
    method: "DELETE",
    token,
  });
}
