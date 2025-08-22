"use client";

import type React from "react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Plus } from "lucide-react";
import { AdcTime } from "./adc-time";
import { TableTimes } from "../_components/tabela-times";
import { useSession } from "next-auth/react"; // Importando o hook de sessão

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface Teams {
  id: string;
  name: string;
  image: string;
}

export default function TeamsPage({ teamsProps }: { teamsProps: Teams[] }) {
  const { data: session } = useSession(); // Acessando a sessão do usuário
  const [searchTerm, setSearchTerm] = useState("");
  const [teams, setTeams] = useState<Teams[]>(teamsProps);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleTeamAdded = (newTeam: Teams) => {
    setTeams((prev) => [...prev, newTeam]);
  };

  const filteredTeams = teams.filter((team) =>
    team?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Times</h1>
        <p className="text-muted-foreground">Gerencie seus times de futebol</p>
      </div>

      <div className="flex gap-4">
        <Input
          placeholder="Buscar times..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1"
        />
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Time
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Adicionar Novo Time</SheetTitle>
              <SheetDescription>
                Digite os detalhes do time para adicionar um novo time ao seu
                sistema.
              </SheetDescription>
            </SheetHeader>
            <AdcTime
              onTeamAddedAction={handleTeamAdded}
              setIsSheetOpenAction={setIsSheetOpen}
              token={session?.user.id} // Passando o ID do usuário como token (precisa ser corrigido no backend)
            />
          </SheetContent>
        </Sheet>
      </div>
      <TableTimes teams={filteredTeams} />
    </div>
  );
}
