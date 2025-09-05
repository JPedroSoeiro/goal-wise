"use server";
import { revalidateTag } from "next/cache";
import { createTeam, updateTeam, deleteTeam } from "../../services/times/timesService";
import { createPlayer, updatePlayer, deletePlayer } from "../../services/jogadores/jogadoresService";
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

export async function updateTeamAction(id: string, updatedTeam: Partial<TeamData>) {
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

export async function updatePlayerAction(id: string, updatedPlayer: Partial<PlayerData>) {
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

export async function updateTeamPreferenceAction(userId: string, teamId: string, token: string) {
  try {
    const result = await updateUserTeamPreference(userId, teamId);
    revalidateTag("/dashboard");
    return result;
  } catch (error) {
    console.error("Erro ao atualizar