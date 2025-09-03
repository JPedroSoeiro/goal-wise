// src/app/(private)/dashboard/page.tsx
import Dashboard from "./_components/dashboard";
import { fetchTeams } from "../../../services/times/timesService";
import { fetchPlayers } from "../../../services/jogadores/jogadoresService";

export default async function DashboardPage() {
  const teams = await fetchTeams();
  const players = await fetchPlayers();

  return <Dashboard teams={teams} players={players} />;
}