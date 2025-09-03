"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updatePlayerAction } from "../actions";
import { fetchTeams } from "@/services/times/timesService";
import { POSICOES } from "./posicoes";

interface Team {
  id: string;
  name: string;
  image: string;
}

interface Player {
  id: string;
  name: string;
  teamId: string;
  position: string;
  image: string;
}

export function EditJogador({
  onCloseAction,
  editingPlayer,
}: {
  onCloseAction: () => void;
  editingPlayer: Player;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [playerData, setPlayerData] = useState({
    name: "",
    teamId: "",
    position: "",
    image: "",
  });

  useEffect(() => {
    setPlayerData({
      name: editingPlayer.name,
      teamId: editingPlayer.teamId,
      position: editingPlayer.position,
      image: editingPlayer.image,
    });

    const loadTeams = async () => {
      try {
        const allTeams = await fetchTeams();
        setTeams(allTeams);
      } catch (error) {
        console.error("Erro ao carregar times:", error);
      }
    };
    loadTeams();
  }, [editingPlayer]);

  const handleAction = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      await updatePlayerAction(editingPlayer.id, playerData);
      setMessage({
        type: "success",
        text: `Jogador atualizado com sucesso!`,
      });
      setTimeout(() => {
        onCloseAction();
        setMessage(null);
      }, 1500);
    } catch (error: any) {
      setMessage({
        type: "error",
        text: error.message || "Ocorreu um erro na ação do jogador.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleAction} className="space-y-4 mt-6">
      <div className="space-y-2 p-4">
        <Label htmlFor="playerName">Nome do Jogador</Label>
        <Input
          id="playerName"
          placeholder="Digite o nome do jogador"
          value={playerData.name}
          onChange={(e) =>
            setPlayerData((prev) => ({ ...prev, name: e.target.value }))
          }
          required
        />
        <Label htmlFor="playerTeam">Time</Label>
        <Select
          value={playerData.teamId}
          onValueChange={(value: string) =>
            setPlayerData((prev) => ({ ...prev, teamId: value }))
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione um time" />
          </SelectTrigger>
          <SelectContent>
            {teams.map((team) => (
              <SelectItem key={team.id} value={team.id}>
                {team.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Label htmlFor="playerPosition">Posição</Label>
        <Select
          value={playerData.position}
          onValueChange={(value: string) =>
            setPlayerData((prev) => ({ ...prev, position: value }))
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione a posição" />
          </SelectTrigger>
          <SelectContent>
            {POSICOES.map((posicao) => (
              <SelectItem key={posicao} value={posicao}>
                {posicao}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Label htmlFor="playerImage">URL da Foto</Label>
        <Input
          id="playerImage"
          placeholder="Digite a URL da foto do jogador"
          value={playerData.image}
          onChange={(e) =>
            setPlayerData((prev) => ({ ...prev, image: e.target.value }))
          }
        />
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Salvando...
          </>
        ) : (
          "Salvar Alterações"
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
