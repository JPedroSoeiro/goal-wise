// src/app/(private)/actions.ts
"use server";
import { revalidateTag } from "next/cache";
import {
  createTeam,
  updateTeam,
  deleteTeam,
} from "../../services/times/timesService";
import {
  createPlayer,
  updatePlayer,
  deletePlayer,
} from "../../services/jogadores/jogadoresService";
import {
  createLiga,
  updateLiga,
  deleteLiga,
} from "../../services/ligas/ligasService";
import { updateUserTeamPreference } from "../../services/users/usersService";

interface TeamData {
  name: string;
  image: string;
}

interface PlayerData {
  name: string;
  teamId: string;
  position?: string;
  image?: string;
}

interface LigaData {
  name: string;
  image?: string;
}

// Actions para Times
export async function createTeamAction(newTeam: TeamData) {
  try {
    const result = await createTeam(newTeam);
    revalidateTag("/times");
    return result;
  } catch (error) {
    console.error("Erro ao criar time:", error);
    throw error;
  }
}

export async function updateTeamAction(
  id: string,
  updatedTeam: Partial<TeamData>
) {
  try {
    const result = await updateTeam(id, updatedTeam);
    revalidateTag("/times");
    return result;
  } catch (error) {
    console.error("Erro ao atualizar o time:", error);
    throw error;
  }
}

export async function deleteTeamAction(id: string) {
  try {
    const result = await deleteTeam(id);
    revalidateTag("/times");
    return result;
  } catch (error) {
    console.error("Erro ao deletar o time:", error);
    throw error;
  }
}

// Actions para Jogadores
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

// Actions para Ligas
export async function createLigaAction(newLiga: LigaData) {
  try {
    const result = await createLiga(newLiga);
    revalidateTag("/ligas");
    return result;
  } catch (error) {
    console.error("Erro ao criar liga:", error);
    throw error;
  }
}

export async function updateLigaAction(
  id: number,
  updatedLiga: Partial<LigaData>
) {
  try {
    const result = await updateLiga(id, updatedLiga);
    revalidateTag("/ligas");
    return result;
  } catch (error) {
    console.error("Erro ao atualizar a liga:", error);
    throw error;
  }
}

export async function deleteLigaAction(id: number) {
  try {
    const result = await deleteLiga(id);
    revalidateTag("/ligas");
    return result;
  } catch (error) {
    console.error("Erro ao deletar a liga:", error);
    throw error;
  }
}

// Action para Preferência de Time do Usuário
export async function updateUserTeamPreferenceAction(
  userId: string,
  teamId: string
) {
  try {
    const result = await updateUserTeamPreference(userId, teamId);
    revalidateTag("/dashboard");
    return result;
  } catch (error) {
    console.error("Erro ao atualizar time de preferência:", error);
    throw error;
  }
}
