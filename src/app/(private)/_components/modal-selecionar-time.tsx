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
import { updateTeamPreferenceAction } from "../actions";
import { fetchTeams } from "@/services/times/timesService";

interface Team {
  id: string;
  name: string;
}

export function ModalSelecionarTime({
  isOpen,
  onCloseAction,
  userId,
  token,
  onTeamSelectedAction,
}: {
  isOpen: boolean;
  onCloseAction: () => void;
  userId: string;
  token: string;
  onTeamSelectedAction: () => void;
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
    if (!selectedTeamId || !userId || !token) return;

    setIsLoading(true);
    try {
      await updateTeamPreferenceAction(userId, selectedTeamId, token);
      onTeamSelectedAction();
      onCloseAction();
    } catch (error) {
      console.error("Erro ao salvar time de preferência:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
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
