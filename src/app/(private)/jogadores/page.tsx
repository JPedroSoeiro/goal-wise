"use client";

import type React from "react";

import { useState } from "react";
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

interface Player {
  id: string;
  name: string;
  team: string;
  position: string;
  image: string;
}

export default function JogadoresPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [players, setPlayers] = useState<Player[]>([
    {
      id: "1",
      name: "Lionel Messi",
      team: "Barcelona FC",
      position: "Forward",
      image: "/placeholder.svg?height=200&width=200",
    },
    {
      id: "2",
      name: "Cristiano Ronaldo",
      team: "Real Madrid",
      position: "Forward",
      image: "/placeholder.svg?height=200&width=200",
    },
    {
      id: "3",
      name: "Marcus Rashford",
      team: "Manchester United",
      position: "Forward",
      image: "/placeholder.svg?height=200&width=200",
    },
  ]);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [newPlayer, setNewPlayer] = useState({
    name: "",
    team: "",
    position: "",
    image: "",
  });

  const filteredPlayers = players.filter(
    (player) =>
      player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      player.team.toLowerCase().includes(searchTerm.toLowerCase()) ||
      player.position.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddPlayer = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const player: Player = {
        id: Date.now().toString(),
        name: newPlayer.name,
        team: newPlayer.team,
        position: newPlayer.position,
        image: newPlayer.image || "/placeholder.svg?height=200&width=200",
      };

      setPlayers((prev) => [...prev, player]);
      setMessage({ type: "success", text: "Player added successfully!" });
      setNewPlayer({ name: "", team: "", position: "", image: "" });

      setTimeout(() => {
        setIsSheetOpen(false);
        setMessage(null);
      }, 1500);
    } catch (error) {
      setMessage({
        type: "error",
        text: "Failed to add player. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Jogadores</h1>
        <p className="text-muted-foreground">Manage your football players</p>
      </div>

      <div className="flex gap-4">
        <Input
          placeholder="Search players..."
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
                <Label htmlFor="playerTeam">Player Team</Label>
                <Input
                  id="playerTeam"
                  placeholder="Enter player team"
                  value={newPlayer.team}
                  onChange={(e) =>
                    setNewPlayer((prev) => ({ ...prev, team: e.target.value }))
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
                  Team: {player.team}
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
