"use client";

import * as React from "react";
import Image from "next/image";
import { Pencil, Trash2 } from "lucide-react";
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { deleteTeamAction } from "../actions";

interface Team {
  id: string;
  name: string;
  image: string;
}

export function TableTimes({
  teams,
  onEditClickAction,
  onTeamClickAction,
}: {
  teams: Team[];
  onEditClickAction: (team: Team) => void;
  onTeamClickAction: (team: Team) => void;
}) {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [teamToDelete, setTeamToDelete] = React.useState<Team | null>(null);
  const teamsPerPage = 4;

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
    if (!teamToDelete) return;

    setIsDeleting(true);
    try {
      await deleteTeamAction(teamToDelete.id);
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
            <TableHead className="w-[100px]">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentTeams.map((team) => (
            <TableRow
              key={team.id}
              onClick={() => onTeamClickAction(team)}
              className="cursor-pointer"
            >
              <TableCell className="font-medium">{team.name}</TableCell>
              <TableCell>
                <div className="aspect-square relative size-8">
                  <Image
                    src={team.image || "/nao-ha-fotos.png"}
                    width={50}
                    height={50}
                    alt={team.name}
                    className="object-contain rounded-md"
                  />
                </div>
              </TableCell>
              <TableCell className="flex space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditClickAction(team);
                  }}
                >
                  <Pencil className="size-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    setTeamToDelete(team);
                  }}
                >
                  <Trash2 className="size-4" />
                </Button>
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
