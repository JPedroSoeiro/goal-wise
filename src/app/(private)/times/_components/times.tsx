"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Loader2, Plus } from "lucide-react";
import Image from "next/image";
import { AdcJogador } from "./adc-time";

// A URL do seu back-end, configurada no .env.local
const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface Teams {
  id: string;
  name: string;
  image: string;
}

export default function TeamsPage({ teamsProps }: { teamsProps: Teams[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [teams, setTeams] = useState<Teams[]>(teamsProps);
  const [isSheetOpen, setIsSheetOpen] = useState(false); // Estado para controlar a Sheet

  // Callback para AdcJogador adicionar um novo team à lista
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
            <AdcJogador
              onPlayerAddedAction={handleTeamAdded}
              setIsSheetOpenAction={setIsSheetOpen}
            />
          </SheetContent>
        </Sheet>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {filteredTeams.map((team) => (
          <HoverCard key={team.id}>
            <HoverCardTrigger asChild>
              <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="aspect-square relative mb-2">
                    <Image
                      src={team.image || "/placeholder.svg"}
                      alt={team.name}
                      fill
                      className="object-cover rounded-md"
                    />
                  </div>
                </CardContent>
              </Card>
            </HoverCardTrigger>
            <HoverCardContent>
              <div className="space-y-2">
                <h4 className="font-semibold">{team.name}</h4>
              </div>
            </HoverCardContent>
          </HoverCard>
        ))}
      </div>
    </div>
  );
}
