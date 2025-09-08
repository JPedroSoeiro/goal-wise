"use server";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface PlayerData {
  name: string;
  teamId: string;
  position?: string;
  image?: string;
}

const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJ0ZXN0ZUBnbWFpbC5jb20iLCJuYW1lIjoiSm9hbyBQZWRybyIsImlhdCI6MTc1NzM1NTY4MCwiZXhwIjoxNzU3MzU5MjgwfQ.v5CjitN8JVwyAwF_GBdWRyoluVYJUgSu20555xTeXNE";

export const fetchPlayers = async () => {
  try {
    const response = await fetch(`${API_URL}/api/players`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      next: { tags: ["/jogadores"] },
    });
    if (!response.ok) {
      throw new Error("Falha ao buscar jogadores");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erro ao buscar jogadores:", error);
    throw error;
  }
};

export const createPlayer = async (newPlayer: PlayerData) => {
  try {
    const response = await fetch(`${API_URL}/api/players`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newPlayer),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Falha ao adicionar jogador.");
    }

    const addedPlayer = await response.json();
    return addedPlayer;
  } catch (error) {
    console.error("Erro ao criar jogador:", error);
    throw error;
  }
};

export async function updatePlayer(
  id: string,
  updatedPlayer: Partial<PlayerData>
) {
  try {
    const response = await fetch(`${API_URL}/api/players/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatedPlayer),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Falha ao atualizar o jogador");
    }
    return response.json();
  } catch (error) {
    console.error("Erro ao atualizar o jogador:", error);
    throw error;
  }
}

export const deletePlayer = async (id: string) => {
  try {
    const response = await fetch(`${API_URL}/api/players/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Falha ao deletar o jogador");
    }
    return response.ok;
  } catch (error) {
    console.error("Erro ao deletar o jogador:", error);
    throw error;
  }
};
