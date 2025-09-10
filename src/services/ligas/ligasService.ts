"use server";
import { apiFetch } from "../api";

export interface Liga {
  id: number;
  name: string;
  image?: string;
}

export async function fetchLigas(): Promise<Liga[]> {
  return apiFetch("/api/ligas", {
    next: { tags: ["/ligas"] },
  });
}

export async function createLiga(data: Omit<Liga, "id">): Promise<Liga> {
  return apiFetch("/api/ligas", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateLiga(
  id: number,
  data: Omit<Partial<Liga>, "id">
): Promise<Liga> {
  return apiFetch(`/api/ligas/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteLiga(id: number): Promise<void> {
  await apiFetch(`/api/ligas/${id}`, {
    method: "DELETE",
  });
}
