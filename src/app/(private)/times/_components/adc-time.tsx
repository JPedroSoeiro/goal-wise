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
import { createTeamAction } from "../actions";
import { fetchLigas } from "@/services/ligas/ligasService";

interface Team {
  id: string;
  name: string;
  image: string;
}

interface Liga {
  id: number;
  name: string;
}

export function AdcTime({ onCloseAction }: { onCloseAction: () => void }) {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [ligas, setLigas] = useState<Liga[]>([]);
  const [teamData, setTeamData] = useState({
    name: "",
    image: "",
    ligaId: "",
  });

  useEffect(() => {
    const loadLigas = async () => {
      try {
        const allLigas = await fetchLigas();
        setLigas(allLigas);
      } catch (error) {
        console.error("Erro ao carregar ligas:", error);
      }
    };
    loadLigas();
  }, []);

  const handleAction = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      await createTeamAction(teamData);
      setMessage({
        type: "success",
        text: `Time adicionado com sucesso!`,
      });
      setTimeout(() => {
        onCloseAction();
        setMessage(null);
      }, 1500);
    } catch (error: any) {
      setMessage({
        type: "error",
        text: error.message || "Ocorreu um erro na ação do time.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleAction} className="space-y-4 mt-6">
      <div className="space-y-2 p-4">
        <Label htmlFor="teamName">Nome do Time</Label>
        <Input
          id="teamName"
          placeholder="Digite o nome do time"
          value={teamData.name}
          onChange={(e) =>
            setTeamData((prev) => ({ ...prev, name: e.target.value }))
          }
          required
        />
        <Label htmlFor="teamLiga">Liga</Label>
        <Select
          onValueChange={(value: string) =>
            setTeamData((prev) => ({ ...prev, ligaId: value }))
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione uma liga" />
          </SelectTrigger>
          <SelectContent>
            {ligas.map((liga) => (
              <SelectItem key={liga.id} value={liga.id.toString()}>
                {liga.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Label htmlFor="teamImage">URL do Escudo</Label>
        <Input
          id="teamImage"
          placeholder="Digite a URL do escudo"
          value={teamData.image}
          onChange={(e) =>
            setTeamData((prev) => ({ ...prev, image: e.target.value }))
          }
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
