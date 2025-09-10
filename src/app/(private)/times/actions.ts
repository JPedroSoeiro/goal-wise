// src/app/(private)/times/actions.ts
"use server";
import { revalidateTag } from "next/cache";
import {
  createTeam,
  updateTeam,
  deleteTeam,
} from "../../../services/times/timesService";

interface TeamData {
  name: string;
  image: string;
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
