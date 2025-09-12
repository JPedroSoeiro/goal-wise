"use server";
import PlayersPage from "./_components/jogadores";
import { fetchPlayers } from "../../../services/jogadores/jogadoresService";
import { fetchTeams } from "../../../services/times/timesService";
import { getSession } from "@/lib/get-session"; // Certifique-se de que este caminho está correto

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
  const session = await getSession();
  const token = session?.accessToken;

  // Passe o token para as funções de fetch
  const players = await fetchPlayers(token);
  const teams = await fetchTeams(token); // Passar o token aqui também é uma boa prática

  const playersWithTeams = players.map((player: Player) => ({
    ...player,
    team: teams.find((team: Team) => team.id === player.teamId),
  }));

  return <PlayersPage playersProps={playersWithTeams} />;
}
