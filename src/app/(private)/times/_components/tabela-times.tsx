"use client";

import * as React from "react";
import Image from "next/image";
import { MoreHorizontal } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { deleteTeam } from "@/services/times/timesService";

interface Team {
  // Corrigido de 'Teams' para 'Team'
  id: string;
  name: string;
  image: string;
}

export function TableTimes({
  teams,
  onTeamUpdatedAction, // Renomeado para seguir a convenção
  onTeamDeletedAction, // Renomeado para seguir a convenção
  onEditClickAction, // Renomeado para seguir a convenção
  token,
}: {
  teams: Team[]; // Corrigido de 'Teams[]' para 'Team[]'
  onTeamUpdatedAction: (team: Team, isEdit: boolean) => void; // Ajustado para 2 argumentos
  onTeamDeletedAction: (teamId: string) => void;
  onEditClickAction: (team: Team) => void;
  token: string | undefined;
}) {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [teamToDelete, setTeamToDelete] = React.useState<Team | null>(null); // Corrigido de 'Teams' para 'Team'
  const teamsPerPage = 5;

  const totalPages = Math.ceil(teams.length / teamsPerPage);
  const currentTeams = teams.slice(
    (currentPage - 1) * teamsPerPage,
    currentPage * teamsPerPage
  );

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleDelete = async () => {
    if (!teamToDelete || !token) return;

    setIsDeleting(true);
    try {
      await deleteTeam(token, teamToDelete.id);
      onTeamDeletedAction(teamToDelete.id); // Chamando a prop renomeada
      setTeamToDelete(null);
    } catch (error) {
      console.error("Erro ao deletar time:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome do Time</TableHead>
            <TableHead>Escudo</TableHead>
            <TableHead className="w-[50px]">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentTeams.map((team) => (
            <TableRow key={team.id}>
              <TableCell className="font-medium">{team.name}</TableCell>
              <TableCell>
                <div className="aspect-square relative size-10">
                  <Image
                    src={team.image || "/placeholder.svg"}
                    alt={team.name}
                    fill
                    className="object-contain rounded-md"
                  />
                </div>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="size-8 p-0">
                      <span className="sr-only">Abrir menu</span>
                      <MoreHorizontal className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onSelect={() => onEditClickAction(team)}>
                      Editar
                    </DropdownMenuItem>{" "}
                    {/* Chamando a prop renomeada */}
                    <DropdownMenuItem onSelect={() => setTeamToDelete(team)}>
                      Deletar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex justify-end space-x-2">
        <Button onClick={handlePreviousPage} disabled={currentPage === 1}>
          Anterior
        </Button>
        <Button onClick={handleNextPage} disabled={currentPage === totalPages}>
          Próximo
        </Button>
      </div>

      <AlertDialog
        open={!!teamToDelete}
        onOpenChange={(open) => !open && setTeamToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmação de Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja deletar o time **{teamToDelete?.name}**?
              Essa ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? "Deletando..." : "Deletar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
