// src/app/(private)/jogadores/actions.ts
"use server";
import { revalidateTag } from "next/cache";
import {
  createPlayer,
  updatePlayer,
  deletePlayer,
} from "../../../services/jogadores/jogadoresService";

interface PlayerData {
  name: string;
  teamId: string;
  position?: string;
  image?: string;
}

export async function createPlayerAction(newPlayer: PlayerData) {
  try {
    const result = await createPlayer(newPlayer);
    revalidateTag("/jogadores");
    return result;
  } catch (error) {
    console.error("Erro ao criar jogador:", error);
    throw error;
  }
}

export async function updatePlayerAction(
  id: string,
  updatedPlayer: Partial<PlayerData>
) {
  try {
    const result = await updatePlayer(id, updatedPlayer);
    revalidateTag("/jogadores");
    return result;
  } catch (error) {
    console.error("Erro ao atualizar o jogador:", error);
    throw error;
  }
}

export async function deletePlayerAction(id: string) {
  try {
    const result = await deletePlayer(id);
    revalidateTag("/jogadores");
    return result;
  } catch (error) {
    console.error("Erro ao deletar o jogador:", error);
    throw error;
  }
}
