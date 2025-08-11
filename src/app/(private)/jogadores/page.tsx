"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Label } from "@/components/ui/label";
import { Loader2, Plus } from "lucide-react";
import Image from "next/image";

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
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [newPlayer, setNewPlayer] = useState({
    name: "",
    teamId: "",
    position: "",
    image: "",
  });

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
      setMessage({ type: "error", text: "Erro ao carregar jogadores." });
    }
  };

  useEffect(() => {
    fetchPlayers();
  }, []);

  const filteredPlayers = players.filter(
    (player) =>
      player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      player.position.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddPlayer = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const response = await fetch(`${API_URL}/api/players`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newPlayer),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Falha ao adicionar jogador.");
      }

      const addedPlayer: Player = await response.json();
      setPlayers((prev) => [...prev, addedPlayer]);
      setMessage({ type: "success", text: "Jogador adicionado com sucesso!" });
      setNewPlayer({ name: "", teamId: "", position: "", image: "" });

      setTimeout(() => {
        setIsSheetOpen(false);
        setMessage(null);
      }, 1500);
    } catch (error: any) {
      setMessage({
        type: "error",
        text: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

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
            <form onSubmit={handleAddPlayer} className="space-y-4 mt-6">
              <div className="space-y-2">
                <Label htmlFor="playerImage">Image Link</Label>
                <Input
                  id="playerImage"
                  placeholder="Enter image URL"
                  value={newPlayer.image}
                  onChange={(e) =>
                    setNewPlayer((prev) => ({ ...prev, image: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="playerName">Player Name</Label>
                <Input
                  id="playerName"
                  placeholder="Enter player name"
                  value={newPlayer.name}
                  onChange={(e) =>
                    setNewPlayer((prev) => ({ ...prev, name: e.target.value }))
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="playerTeam">Player Team ID</Label>
                <Input
                  id="playerTeam"
                  type="number"
                  placeholder="Enter player team ID"
                  value={newPlayer.teamId}
                  onChange={(e) =>
                    setNewPlayer((prev) => ({
                      ...prev,
                      teamId: e.target.value,
                    }))
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="playerPosition">Player Position</Label>
                <Input
                  id="playerPosition"
                  placeholder="Enter player position"
                  value={newPlayer.position}
                  onChange={(e) =>
                    setNewPlayer((prev) => ({
                      ...prev,
                      position: e.target.value,
                    }))
                  }
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding Player...
                  </>
                ) : (
                  "Adicionar Jogador"
                )}
              </Button>
              {message && (
                <div
                  className={`text-sm font-medium ${
                    message.type === "success"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {message.text}
                </div>
              )}
            </form>
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
