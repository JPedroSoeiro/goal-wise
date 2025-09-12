import { fetchTeams } from "@/services/times/timesService";
import { getSession } from "@/lib/get-session";
import ChatRoom from "./ChatRoom"; // O seu componente de cliente existente

interface Team {
  id: string;
  name: string;
}

// Este é um Server Component async que busca os dados
export default async function ChatRoomLoader({ teamId }: { teamId: string }) {
  const session = await getSession();
  const token = session?.accessToken;

  // Busca os times no servidor
  const teams: Team[] = await fetchTeams(token);

  // Encontra o nome do time
  const currentTeam = teams.find((team) => team.id === teamId);

  // Renderiza o componente de chat final com todas as props necessárias
  return (
    <ChatRoom
      teamId={teamId}
      teamName={currentTeam?.name || "Chat Desconhecido"}
    />
  );
}
