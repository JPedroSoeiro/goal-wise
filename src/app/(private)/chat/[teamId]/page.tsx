import { fetchTeams } from "@/services/times/timesService";
import ChatRoom from "../_components/ChatRoom";
import { getSession } from "@/lib/get-session";

interface Team {
  id: string;
  name: string;
}

export default async function TeamChatPage({
  params,
}: {
  params: { teamId: string };
}) {
  const { teamId } = params;
  const session = await getSession();
  const token = session?.accessToken;

  const teams: Team[] = await fetchTeams(token);

  const currentTeam = teams.find((team) => team.id === teamId);

  return (
    <ChatRoom
      teamId={teamId}
      teamName={currentTeam?.name || "Chat Desconhecido"}
    />
  );
}
