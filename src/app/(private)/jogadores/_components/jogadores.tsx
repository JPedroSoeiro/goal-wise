"use client";

import React, { useState } from "react";
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
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Plus } from "lucide-react";
import { AdcJogador } from "./adc-jogador";
import { EditJogador } from "./edit-jogador";
import { TabelaJogadores } from "./tabela-jogadores";
import { POSICOES } from "./posicoes";

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

export default function JogadoresPage({
  playersProps,
}: {
  playersProps: Player[];
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [selectedPosition, setSelectedPosition] = useState<string | null>(null);

  const handleEditClick = (player: Player) => {
    setEditingPlayer(player);
    setIsDialogOpen(true);
  };

  const filteredBySearch = playersProps.filter((player) =>
    player?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredByPosition = selectedPosition
    ? filteredBySearch.filter((player) => player.position === selectedPosition)
    : filteredBySearch;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Jogadores</h1>
        <p className="text-muted-foreground">
          Gerencie seus jogadores de futebol
        </p>
      </div>

      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink
              onClick={() => setSelectedPosition(null)}
              className={
                selectedPosition === null
                  ? "text-primary font-bold"
                  : "text-muted-foreground cursor-pointer"
              }
            >
              Todos
            </BreadcrumbLink>
          </BreadcrumbItem>
          {POSICOES.map((posicao) => (
            <React.Fragment key={posicao}>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink
                  onClick={() => setSelectedPosition(posicao)}
                  className={
                    selectedPosition === posicao
                      ? "text-primary font-bold"
                      : "text-muted-foreground cursor-pointer"
                  }
                >
                  {posicao}
                </BreadcrumbLink>
              </BreadcrumbItem>
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex gap-4">
        <Input
          placeholder={`Buscar jogadores...`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1"
        />

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingPlayer(null)}>
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Jogador
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingPlayer ? "Editar Jogador" : "Adicionar Novo Jogador"}
              </DialogTitle>
              <DialogDescription>
                {editingPlayer
                  ? "Altere os detalhes do jogador e salve."
                  : "Digite os detalhes do jogador para adicionar um novo ao seu sistema."}
              </DialogDescription>
            </DialogHeader>
            {editingPlayer ? (
              <EditJogador
                onCloseAction={() => setIsDialogOpen(false)}
                editingPlayer={editingPlayer}
              />
            ) : (
              <AdcJogador onCloseAction={() => setIsDialogOpen(false)} />
            )}
          </DialogContent>
        </Dialog>
      </div>

      <TabelaJogadores
        players={filteredByPosition}
        onEditClickAction={handleEditClick}
      />
    </div>
  );
}
