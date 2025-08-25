"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { createTeam, updateTeam } from "@/services/times/timesService";

interface Team {
  id: string;
  name: string;
  image: string;
}

export function AdcTime({
  onTeamAction,
  setIsSheetOpenAction,
  token,
  editingTeam,
}: {
  onTeamAction: (team: Team, isEdit: boolean) => void;
  setIsSheetOpenAction: (open: boolean) => void;
  token: string | undefined;
  editingTeam?: Team | null;
}) {
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
    if (editingTeam) {
      setTeamData({ name: editingTeam.name, image: editingTeam.image });
    } else {
      setTeamData({ name: "", image: "" });
    }
  }, [editingTeam]);

  const handleAction = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    if (!token) {
      setMessage({ type: "error", text: "Você não está autenticado." });
      setIsLoading(false);
      return;
    }

    try {
      let result;
      let actionType: "Adicionado" | "Atualizado";

      if (editingTeam) {
        console.log("Tentando atualizar time com ID:", editingTeam.id);
        console.log("Dados do time:", teamData);
        result = await updateTeam(token, editingTeam.id, teamData);
        actionType = "Atualizado";
      } else {
        console.log("Tentando criar novo time com dados:", teamData);
        result = await createTeam(token, teamData);
        actionType = "Adicionado";
      }

      onTeamAction(result, !!editingTeam);
      setMessage({ type: "success", text: `Time ${actionType} com sucesso!` });

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

  const formTitle = editingTeam ? "Editar Time" : "Adicionar Novo Time";
  const buttonText = editingTeam ? "Salvar Alterações" : "Adicionar Time";
  const loadingText = editingTeam ? "Salvando..." : "Adicionando Time...";

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
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {loadingText}
          </>
        ) : (
          buttonText
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
