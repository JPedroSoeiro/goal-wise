"use client";

import type React from "react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

// A URL do seu back-end, configurada no .env.local
const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface Team {
  id: string;
  name: string;
  teamId: number;
  position: string;
  image: string;
}

// O componente AdcJogador agora recebe a função onTeamAddedAction e o estado da Sheet
export function AdcJogador({
  onPlayerAddedAction,
  setIsSheetOpenAction,
}: {
  onPlayerAddedAction: (team: Team) => void;
  setIsSheetOpenAction: (open: boolean) => void; // Renomeado para setIsSheetOpenAction
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [newTeam, setNewTeam] = useState({
    name: "",
    teamId: "",
    position: "",
    image: "",
  });

  const handleAddTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const response = await fetch(`${API_URL}/api/teams`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTeam),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Falha ao adicionar time.");
      }

      const addedTeam: Team = await response.json();
      onPlayerAddedAction(addedTeam); // Chama a função renomeada
      setMessage({ type: "success", text: "Time adicionado com sucesso!" });
      setNewTeam({ name: "", teamId: "", position: "", image: "" });

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
    <form onSubmit={handleAddTeam} className="space-y-4 mt-6">
      <div className="space-y-2">
        <Label htmlFor="teamImage">Image Link</Label>
        <Input
          id="teamImage"
          placeholder="Enter image URL"
          value={newTeam.image}
          onChange={(e) =>
            setNewTeam((prev) => ({ ...prev, image: e.target.value }))
          }
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="teamName">Team Name</Label>
        <Input
          id="teamName"
          placeholder="Enter team name"
          value={newTeam.name}
          onChange={(e) =>
            setNewTeam((prev) => ({ ...prev, name: e.target.value }))
          }
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="teamTeamId">Team ID</Label>
        <Input
          id="teamTeamId"
          type="number"
          placeholder="Enter team ID"
          value={newTeam.teamId}
          onChange={(e) =>
            setNewTeam((prev) => ({
              ...prev,
              teamId: e.target.value,
            }))
          }
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="teamPosition">Team Position</Label>
        <Input
          id="teamPosition"
          placeholder="Enter team position"
          value={newTeam.position}
          onChange={(e) =>
            setNewTeam((prev) => ({
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
            Adicionando Time...
          </>
        ) : (
          "Adicionar Time"
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
