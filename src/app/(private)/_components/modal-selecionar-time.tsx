// src/app/(private)/_components/modal-selecionar-time.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateUserTeamPreferenceAction } from "../actions";
import { fetchTeams } from "@/services/times/timesService";

interface Team {
  id: string;
  name: string;
}

export function ModalSelecionarTime({
  isOpen,
  onCloseAction,
  userId,
  onTeamSelectedAction,
}: {
  isOpen: boolean;
  onCloseAction: () => void;
  userId: string;
  // A função agora espera receber o ID do time como argumento
  onTeamSelectedAction: (teamId: string) => void;
}) {
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadTeams = async () => {
      try {
        const allTeams = await fetchTeams();
        setTeams(allTeams);
      } catch (error) {
        console.error("Erro ao carregar times:", error);
      }
    };
    loadTeams();
  }, []);

  const handleSelectTeam = async () => {
    if (!selectedTeamId || !userId) return;

    setIsLoading(true);
    try {
      await updateUserTeamPreferenceAction(userId, selectedTeamId);
      // Passa o ID do time selecionado para a função do layout
      onTeamSelectedAction(selectedTeamId);
      onCloseAction();
    } catch (error) {
      console.error("Erro ao salvar time de preferência:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // O restante do seu JSX continua o mesmo...
    <Dialog open={isOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Selecione seu Time de Interesse</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p>
            Para personalizar sua experiência, escolha seu time de futebol
            favorito.
          </p>
          <Select onValueChange={(value) => setSelectedTeamId(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Escolha um time" />
            </SelectTrigger>
            <SelectContent>
              {teams.map((team) => (
                <SelectItem key={team.id} value={team.id}>
                  {team.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            onClick={handleSelectTeam}
            disabled={!selectedTeamId || isLoading}
          >
            {isLoading ? "Salvando..." : "Salvar e Continuar"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
