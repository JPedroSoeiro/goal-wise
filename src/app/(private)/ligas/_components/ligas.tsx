"use client";

import React from "react";
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
import { AdcLiga } from "./adc-liga";
import { EditLiga } from "./edit-liga";
import { CardsLigas } from "./cards-ligas";

interface Liga {
  id: number;
  name: string;
  image: string;
}

export default function LigasPage({ ligasProps }: { ligasProps: Liga[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingLiga, setEditingLiga] = useState<Liga | null>(null);

  const handleEditClick = (liga: Liga) => {
    setEditingLiga(liga);
    setIsDialogOpen(true);
  };

  const filteredLigas = ligasProps.filter((liga) =>
    liga?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Ligas</h1>
        <p className="text-muted-foreground">Gerencie as ligas de futebol</p>
      </div>

      <div className="flex gap-4">
        <Input
          placeholder="Buscar ligas..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1"
        />

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingLiga(null)}>
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Liga
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingLiga ? "Editar Liga" : "Adicionar Nova Liga"}
              </DialogTitle>
              <DialogDescription>
                {editingLiga
                  ? "Altere os detalhes da liga e salve."
                  : "Digite os detalhes da liga para adicionar uma nova ao seu sistema."}
              </DialogDescription>
            </DialogHeader>
            {editingLiga ? (
              <EditLiga
                onCloseAction={() => setIsDialogOpen(false)}
                editingLiga={editingLiga}
              />
            ) : (
              <AdcLiga onCloseAction={() => setIsDialogOpen(false)} />
            )}
          </DialogContent>
        </Dialog>
      </div>

      <CardsLigas ligas={filteredLigas} onEditClickAction={handleEditClick} />
    </div>
  );
}
