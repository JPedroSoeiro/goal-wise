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
import { deletePlayerAction } from "../actions";

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
  team: Team;
}

export function TabelaJogadores({
  players,
  onEditClickAction,
}: {
  players: Player[];
  onEditClickAction: (player: Player) => void;
}) {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [playerToDelete, setPlayerToDelete] = React.useState<Player | null>(
    null
  );
  const playersPerPage = 4;

  const totalPages = Math.ceil(players.length / playersPerPage);
  const currentPlayers = players.slice(
    (currentPage - 1) * playersPerPage,
    currentPage * playersPerPage
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
    if (!playerToDelete) return;

    setIsDeleting(true);
    try {
      await deletePlayerAction(playerToDelete.id);
      setPlayerToDelete(null);
    } catch (error) {
      console.error("Erro ao deletar jogador:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome do Jogador</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>Posição</TableHead>
            <TableHead className="w-[100px]">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentPlayers.map((player) => (
            <TableRow key={player.id}>
              <TableCell className="font-medium">{player.name}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <div className="aspect-square relative size-8">
                    <Image
                      src={player.team?.image || "/nao-ha-fotos.png"} // Corrigido aqui
                      width={50}
                      height={50}
                      alt={player.team?.name || "Sem time"}
                      className="object-contain rounded-md"
                    />
                  </div>
                  <span>{player.team?.name || "Sem time"}</span>
                </div>
              </TableCell>
              <TableCell>{player.position}</TableCell>
              <TableCell className="flex space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onEditClickAction(player)}
                >
                  <Pencil className="size-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => setPlayerToDelete(player)}
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
        open={!!playerToDelete}
        onOpenChange={(open) => !open && setPlayerToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmação de Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja deletar o jogador **{playerToDelete?.name}
              **? Essa ação não pode ser desfeita.
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
