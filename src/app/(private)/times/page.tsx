"use server";
import TeamsPage from "./_components/times";
import { fetchTeams } from "../../../services/times/timesService";
import { fetchPlayers } from "../../../services/jogadores/jogadoresService"; // Importe o serviço de jogadores

export default async function PageTimes() {
  const teams = await fetchTeams();
  const players = await fetchPlayers();

  return <TeamsPage teamsProps={teams} playersProps={players} />;
}
