"use client";

import type React from "react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

// A URL do seu back-end, configurada no .env.local
const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface Player {
  id: string;
  name: string;
  teamId: number;
  position: string;
  image: string;
}

// O componente AdcJogador agora recebe a função onPlayerAddedAction e o estado da Sheet
export function AdcJogador({
  onPlayerAddedAction,
  setIsSheetOpenAction,
}: {
  onPlayerAddedAction: (player: Player) => void;
  setIsSheetOpenAction: (open: boolean) => void; // Renomeado para setIsSheetOpenAction
}) {
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
      onPlayerAddedAction(addedPlayer); // Chama a função renomeada
      setMessage({ type: "success", text: "Jogador adicionado com sucesso!" });
      setNewPlayer({ name: "", teamId: "", position: "", image: "" });

      setTimeout(() => {
        setIsSheetOpenAction(false); // Chama a função renomeada para fechar a Sheet
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
    <form onSubmit={handleAddPlayer} className="space-y-4 mt-6">
      <div className="space-y-2 p-4">
        <Label htmlFor="playerImage">Image Link</Label>
        <Input
          id="playerImage"
          placeholder="Enter image URL"
          value={newPlayer.image}
          onChange={(e) =>
            setNewPlayer((prev) => ({ ...prev, image: e.target.value }))
          }
        />
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
      <Button type="submit" className="w-80 " disabled={isLoading}>
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
            message.type === "success" ? "text-green-600" : "text-red-600"
          }`}
        >
          {message.text}
        </div>
      )}
    </form>
  );
}
