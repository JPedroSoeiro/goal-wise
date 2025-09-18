// src/app/(private)/dashboard/page.tsx
import Dashboard from "./_components/dashboard";
import { fetchTeams } from "../../../services/times/timesService";
import { fetchPlayers } from "../../../services/jogadores/jogadoresService";
import { fetchLigas } from "../../../services/ligas/ligasService";

export default async function DashboardPage() {
  const teams = await fetchTeams();
  const players = await fetchPlayers();
  const ligas = await fetchLigas();

  return <Dashboard teams={teams} players={players} ligas={ligas} />;
}
