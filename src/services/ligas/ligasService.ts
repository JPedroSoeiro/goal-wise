"use server";
const API_URL = process.env.NEXT_PUBLIC_API_URL;
const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJ0ZXN0ZUBnbWFpbC5jb20iLCJuYW1lIjoiSm9hbyBQZWRybyIsImlhdCI6MTc1NzM1NTY4MCwiZXhwIjoxNzU3MzU5MjgwfQ.v5CjitN8JVwyAwF_GBdWRyoluVYJUgSu20555xTeXNE";

export interface Liga {
  id: number;
  name: string;
  image?: string;
}

export async function fetchLigas(): Promise<Liga[]> {
  try {
    const response = await fetch(`${API_URL}/api/ligas`, {
      headers: { Authorization: `Bearer ${token}` },
      next: { tags: ["/ligas"] },
    });
    if (!response.ok) {
      throw new Error("Falha ao buscar ligas");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erro ao buscar ligas:", error);
    throw error;
  }
}

export async function createLiga(data: Omit<Liga, "id">): Promise<Liga> {
  try {
    const response = await fetch(`${API_URL}/api/ligas`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Falha ao criar liga");
    }
    const createdLiga = await response.json();
    return createdLiga;
  } catch (error) {
    console.error("Erro ao criar liga:", error);
    throw error;
  }
}

export async function updateLiga(
  id: number,
  data: Omit<Partial<Liga>, "id">
): Promise<Liga> {
  try {
    const response = await fetch(`${API_URL}/api/ligas/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Falha ao atualizar liga");
    }
    const updatedLiga = await response.json();
    return updatedLiga;
  } catch (error) {
    console.error("Erro ao atualizar liga:", error);
    throw error;
  }
}

export async function deleteLiga(id: number): Promise<void> {
  try {
    const response = await fetch(`${API_URL}/api/ligas/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Falha ao deletar liga");
    }
  } catch (error) {
    console.error("Erro ao deletar liga:", error);
    throw error;
  }
}
