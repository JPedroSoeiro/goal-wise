"use server";
import { apiFetch } from "../api";

interface TeamData {
  name: string;
  image: string;
}

export const fetchTeams = async (token?: string) => {
  return apiFetch("/api/teams", {
    next: { tags: ["/times"] },
    token: token,
  });
};

export const createTeam = async (newTeam: TeamData) => {
  return apiFetch("/api/teams", {
    method: "POST",
    body: JSON.stringify(newTeam),
  });
};

export async function updateTeam(id: string, updatedTeam: Partial<TeamData>) {
  return apiFetch(`/api/teams/${id}`, {
    method: "PUT",
    body: JSON.stringify(updatedTeam),
  });
}

export const deleteTeam = async (id: string) => {
  const response = await apiFetch(`/api/teams/${id}`, {
    method: "DELETE",
  });
  return response.ok;
};
