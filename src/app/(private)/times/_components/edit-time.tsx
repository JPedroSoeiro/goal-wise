"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { updateTeamAction } from "../actions";

interface Team {
  id: string;
  name: string;
  image: string;
}

export function EditTime({
  onCloseAction,
  editingTeam,
}: {
  onCloseAction: () => void;
  editingTeam: Team;
}) {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [teamData, setTeamData] = useState({
    name: "",
    image: "",
  });

  useEffect(() => {
    setTeamData({ name: editingTeam.name, image: editingTeam.image });
  }, [editingTeam]);

  const handleAction = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    const token = session?.accessToken;

    if (!token) {
      setMessage({ type: "error", text: "Você não está autenticado." });
      setIsLoading(false);
      return;
    }

    try {
      await updateTeamAction(editingTeam.id, teamData); // Removido o token daqui
      setMessage({
        type: "success",
        text: `Time atualizado com sucesso!`,
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
      <Button type="submit" className="w-full" disabled={isLoading || !session}>
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
