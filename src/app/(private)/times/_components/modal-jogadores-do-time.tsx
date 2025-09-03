"use client";

import type React from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
}

export function ModalJogadoresDoTime({
  isOpen,
  onCloseAction,
  team,
  allPlayers,
}: {
  isOpen: boolean;
  onCloseAction: () => void;
  team: Team | null;
  allPlayers: Player[];
}) {
  if (!team) return null;

  const playersDoTime = allPlayers.filter(
    (player) => player.teamId === team.id
  );

  return (
    <Dialog open={isOpen} onOpenChange={onCloseAction}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Jogadores do {team.name}</DialogTitle>
          <DialogDescription>
            Confira a lista de jogadores do time.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4">
          <div className="aspect-square relative size-16">
            <Image
              src={team.image || "/nao-ha-fotos.png"}
              width={64}
              height={64}
              alt={team.name}
              className="object-contain rounded-md"
            />
          </div>
          <h3 className="text-xl font-semibold">{team.name}</h3>
        </div>
        <div className="overflow-auto max-h-[400px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Posição</TableHead>
                <TableHead>Foto</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {playersDoTime.length > 0 ? (
                playersDoTime.map((player) => (
                  <TableRow key={player.id}>
                    <TableCell>{player.name}</TableCell>
                    <TableCell>{player.position || "Não informado"}</TableCell>
                    <TableCell>
                      <div className="aspect-square relative size-12">
                        <Image
                          src={player.image || "/nao-ha-fotos.png"}
                          width={48}
                          height={48}
                          alt={player.name}
                          className="object-contain rounded-md"
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="text-center">
                    Nenhum jogador encontrado para este time.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  );
}
