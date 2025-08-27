"use server";
const API_URL = process.env.NEXT_PUBLIC_API_URL;
import { revalidatePath } from "next/cache"; // Next 13+ App Router

export const fetchTeams = async (token: string) => {
  try {
    const response = await fetch(`${API_URL}/api/teams`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });
    if (!response.ok) {
      throw new Error("Falha ao buscar teams");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erro ao buscar teams:", error);
    throw error;
  }
};

export const createTeam = async (newTeam: { name: string; image: string }) => {
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJoZW5kcmlvX29AbGl2ZS5jb20iLCJuYW1lIjoiUGVkcm8gaCIsImlhdCI6MTc1NjE1MTcxMywiZXhwIjoxNzU2MTU1MzEzfQ.g6UO7urMfBRWE1OU1juRGe9WE4jDRxjo21HtZW5WLL0";
  try {
    const response = await fetch(`${API_URL}/api/teams`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newTeam),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Falha ao adicionar time.");
    }

    const addedTeam = await response.json();
    return addedTeam;
  } catch (error) {
    console.error("Erro ao criar time:", error);
    throw error;
  }
};

export const updateTeam = async (
  id: string,
  updatedTeam: { name: string; image: string }
) => {
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJoZW5kcmlvX29AbGl2ZS5jb20iLCJuYW1lIjoiUGVkcm8gaCIsImlhdCI6MTc1NjE1MTcxMywiZXhwIjoxNzU2MTU1MzEzfQ.g6UO7urMfBRWE1OU1juRGe9WE4jDRxjo21HtZW5WLL0";

  try {
    const response = await fetch(`${API_URL}/api/teams/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatedTeam),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Falha ao atualizar o time");
    }
    // Revalida a rota que lista os times
    revalidatePath("/times"); // coloque o caminho da página que precisa atualizar
    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Erro ao atualizar o time:", error);
    throw error;
  }
};

export const deleteTeam = async (token: string, id: string) => {
  try {
    const response = await fetch(`${API_URL}/api/teams/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Falha ao deletar o time");
    }
    return response.ok;
  } catch (error) {
    console.error("Erro ao deletar o time:", error);
    throw error;
  }
};
