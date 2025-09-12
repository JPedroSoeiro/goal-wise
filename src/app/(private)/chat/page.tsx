import { fetchTeams } from "@/services/times/timesService";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Team {
  id: string;
  name: string;
  image: string;
}

export default async function SelectChatRoomPage() {
  const teams: Team[] = await fetchTeams();

  return (
    <div className="container mx-auto p-4">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold">Canais de Chat</h1>
        <p className="text-muted-foreground">
          Selecione um time para entrar na sala de chat.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {teams.map((team) => (
          <Link key={team.id} href={`/chat/${team.id}`} passHref>
            <Card className="flex h-full transform flex-col items-center justify-center p-4 transition-transform hover:scale-105 hover:bg-accent">
              <CardHeader className="p-2">
                <div className="relative h-20 w-20">
                  <Image
                    src={team.image || "/nao-ha-fotos.png"}
                    alt={`Escudo do ${team.name}`}
                    layout="fill"
                    objectFit="contain"
                  />
                </div>
              </CardHeader>
              <CardContent className="p-2 text-center">
                <CardTitle className="text-lg">{team.name}</CardTitle>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
