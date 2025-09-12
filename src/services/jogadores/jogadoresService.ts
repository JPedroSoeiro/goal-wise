"use server";
import { apiFetch } from "../api";

interface PlayerData {
  name: string;
  teamId: string;
  position?: string;
  image?: string;
}

export const fetchPlayers = async (token?: string) => {
  return apiFetch("/api/players", {
    next: { tags: ["/jogadores"] },
    token: token,
  });
};
export const createPlayer = async (newPlayer: PlayerData) => {
  return apiFetch("/api/players", {
    method: "POST",
    body: JSON.stringify(newPlayer),
  });
};

export async function updatePlayer(
  id: string,
  updatedPlayer: Partial<PlayerData>
) {
  return apiFetch(`/api/players/${id}`, {
    method: "PUT",
    body: JSON.stringify(updatedPlayer),
  });
}

export const deletePlayer = async (id: string) => {
  const response = await apiFetch(`/api/players/${id}`, {
    method: "DELETE",
  });
  return response.ok;
};
