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
  image: string;
}

export function AdcTime({
  onTeamAddedAction,
  setIsSheetOpenAction,
  token,
}: {
  onTeamAddedAction: (team: Team) => void;
  setIsSheetOpenAction: (open: boolean) => void;
  token: string | undefined; // Adicionado token para autenticação
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [newTeam, setNewTeam] = useState({
    name: "",
    image: "",
  });

  const handleAddTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    if (!token) {
      setMessage({ type: "error", text: "Você não está autenticado." });
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/teams`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Enviando o token no cabeçalho
        },
        body: JSON.stringify(newTeam),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Falha ao adicionar time.");
      }

      const addedTeam: Team = await response.json();
      onTeamAddedAction(addedTeam);
      setMessage({ type: "success", text: "Time adicionado com sucesso!" });
      setNewTeam({ name: "", image: "" });

      setTimeout(() => {
        setIsSheetOpenAction(false);
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
      <div className="space-y-2 p-4">
        <Label htmlFor="teamName">Nome do Time</Label>
        <Input
          id="teamName"
          placeholder="Digite o nome do time"
          value={newTeam.name}
          onChange={(e) =>
            setNewTeam((prev) => ({ ...prev, name: e.target.value }))
          }
          required
        />
        <Label htmlFor="teamImage">URL do Escudo</Label>
        <Input
          id="teamImage"
          placeholder="Digite a URL do escudo"
          value={newTeam.image}
          onChange={(e) =>
            setNewTeam((prev) => ({ ...prev, image: e.target.value }))
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
