"use server";
import PlayersPage from "./_components/jogadores";
import { fetchPlayers } from "../../../services/jogadores/jogadoresService";
import { fetchTeams } from "../../../services/times/timesService";

interface Team {
  id: string;
  name: string;
  image: string;
}

interface Player {
  id: string;
  name: string;
  teamId: string;
  position: string;
  image: string;
  team: Team;
}

export default async function PageJogadores() {
  const players = await fetchPlayers();
  const teams = await fetchTeams();

  const playersWithTeams = players.map((player: Player) => ({
    ...player,
    team: teams.find((team: Team) => team.id === player.teamId),
  }));

  return <PlayersPage playersProps={playersWithTeams} />;
}
