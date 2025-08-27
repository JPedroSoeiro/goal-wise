"use client";

import type React from "react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { AdcTime } from "./adc-time";
import { EditTime } from "./edit-time";
import { TableTimes } from "./tabela-times";
import { useSession } from "next-auth/react";

interface Team {
  id: string;
  name: string;
  image: string;
}

export default function TeamsPage({ teamsProps }: { teamsProps: Team[] }) {
  const { data: session } = useSession();
  const [searchTerm, setSearchTerm] = useState("");
  const [teams, setTeams] = useState<Team[]>(teamsProps);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);

  const handleTeamAction = (team: Team, isEdit: boolean) => {
    if (isEdit) {
      setTeams((prev) => prev.map((t) => (t.id === team.id ? team : t)));
    } else {
      setTeams((prev) => [...prev, team]);
    }
    setEditingTeam(null);
    setIsDialogOpen(false);
  };

  const handleEditClick = (team: Team) => {
    setEditingTeam(team);
    setIsDialogOpen(true);
  };

  const handleTeamDeleted = (teamId: string) => {
    setTeams((prev) => prev.filter((team) => team.id !== teamId));
  };

  const filteredTeams = teams.filter((team) =>
    team?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Times</h1>
        <p className="text-muted-foreground">Gerencie seus times de futebol</p>
      </div>

      <div className="flex gap-4">
        <Input
          placeholder="Buscar times..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1"
        />

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingTeam(null)}>
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Time
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingTeam ? "Editar Time" : "Adicionar Novo Time"}
              </DialogTitle>
              <DialogDescription>
                {editingTeam
                  ? "Altere os detalhes do time e salve."
                  : "Digite os detalhes do time para adicionar um novo time ao seu sistema."}
              </DialogDescription>
            </DialogHeader>
            {editingTeam ? (
              <EditTime
                onTeamAction={handleTeamAction}
                onCloseAction={() => setIsDialogOpen(false)}
                token={session?.accessToken}
                editingTeam={editingTeam}
              />
            ) : (
              <AdcTime
                onTeamAction={handleTeamAction}
                onCloseAction={() => setIsDialogOpen(false)}
                token={session?.accessToken}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>

      <TableTimes
        teams={filteredTeams}
        onTeamUpdatedAction={handleTeamAction}
        onTeamDeletedAction={handleTeamDeleted}
        onEditClickAction={handleEditClick}
        token={session?.accessToken}
      />
    </div>
  );
}
