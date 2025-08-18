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
import { AdcJogador } from "./_components/adc-jogador";

// A URL do seu back-end, configurada no .env.local
const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface Player {
  id: string;
  name: string;
  teamId: number;
  position: string;
  image: string;
}

export default function JogadoresPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [players, setPlayers] = useState<Player[]>([]);
  const [isSheetOpen, setIsSheetOpen] = useState(false); // Estado para controlar a Sheet

  // Função para buscar jogadores da API
  const fetchPlayers = async () => {
    try {
      const response = await fetch(`${API_URL}/api/players`);
      if (!response.ok) {
        throw new Error("Falha ao buscar jogadores");
      }
      const data: Player[] = await response.json();
      setPlayers(data);
    } catch (error) {
      console.error("Erro ao buscar jogadores:", error);
      // Aqui você pode adicionar um setMessage para a página se quiser exibir um erro
    }
  };

  useEffect(() => {
    fetchPlayers(); // Chama a API assim que o componente é montado
  }, []);

  // Callback para AdcJogador adicionar um novo jogador à lista
  const handlePlayerAdded = (newPlayer: Player) => {
    setPlayers((prev) => [...prev, newPlayer]);
    fetchPlayers(); // Opcional: refetch para garantir dados atualizados (ex: se o backend adicionar um ID)
  };

  const filteredPlayers = players.filter(
    (player) =>
      player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      player.position.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Jogadores</h1>
        <p className="text-muted-foreground">
          Gerencie seus jogadores de futebol
        </p>
      </div>

      <div className="flex gap-4">
        <Input
          placeholder="Buscar jogadores..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1"
        />
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Jogador
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Add New Player</SheetTitle>
              <SheetDescription>
                Enter the player details to add a new player to your system.
              </SheetDescription>
            </SheetHeader>
            {/* Passa as funções para as props renomeadas */}
            <AdcJogador
              onPlayerAddedAction={handlePlayerAdded}
              setIsSheetOpenAction={setIsSheetOpen}
            />
          </SheetContent>
        </Sheet>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {filteredPlayers.map((player) => (
          <HoverCard key={player.id}>
            <HoverCardTrigger asChild>
              <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="aspect-square relative mb-2">
                    <Image
                      src={player.image || "/placeholder.svg"}
                      alt={player.name}
                      fill
                      className="object-cover rounded-md"
                    />
                  </div>
                  <h3 className="font-semibold text-center truncate">
                    {player.name}
                  </h3>
                </CardContent>
              </Card>
            </HoverCardTrigger>
            <HoverCardContent>
              <div className="space-y-2">
                <h4 className="font-semibold">{player.name}</h4>
                <p className="text-sm text-muted-foreground">
                  Team ID: {player.teamId}
                </p>
                <p className="text-sm text-muted-foreground">
                  Position: {player.position}
                </p>
              </div>
            </HoverCardContent>
          </HoverCard>
        ))}
      </div>
    </div>
  );
}
