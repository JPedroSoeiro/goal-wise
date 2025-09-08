"use client";

import React from "react";
import Image from "next/image";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { deleteLigaAction } from "../../actions";

interface Liga {
  id: number;
  name: string;
  image: string;
}

export function CardsLigas({
  ligas,
  onEditClickAction,
}: {
  ligas: Liga[];
  onEditClickAction: (liga: Liga) => void;
}) {
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [ligaToDelete, setLigaToDelete] = React.useState<Liga | null>(null);

  const handleDelete = async () => {
    if (!ligaToDelete) return;

    setIsDeleting(true);
    try {
      await deleteLigaAction(ligaToDelete.id);
      setLigaToDelete(null);
    } catch (error) {
      console.error("Erro ao deletar liga:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {ligas.map((liga) => (
        <Card key={liga.id}>
          <CardHeader className="p-4">
            <CardTitle>{liga.name}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center p-4">
            <div className="aspect-square relative size-24 mb-4">
              <Image
                src={liga.image || "/nao-ha-fotos.png"}
                width={96}
                height={96}
                alt={liga.name}
                className="object-contain rounded-md"
              />
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => onEditClickAction(liga)}
              >
                <Pencil className="size-4" />
              </Button>
              <Button
                variant="destructive"
                size="icon"
                onClick={() => setLigaToDelete(liga)}
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}

      <AlertDialog
        open={!!ligaToDelete}
        onOpenChange={(open) => !open && setLigaToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmação de Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja deletar a liga **{ligaToDelete?.name}**?
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
