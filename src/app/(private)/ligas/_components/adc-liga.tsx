"use client";

import type React from "react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { createLigaAction } from "../../actions";
import { Liga } from "@/services/ligas/ligasService";

export function AdcLiga({ onCloseAction }: { onCloseAction: () => void }) {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [ligaData, setLigaData] = useState<Omit<Liga, "id">>({
    name: "",
    image: "",
  });

  const handleAction = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      await createLigaAction(ligaData);
      setMessage({
        type: "success",
        text: `Liga adicionada com sucesso!`,
      });
      setTimeout(() => {
        onCloseAction();
        setMessage(null);
      }, 1500);
    } catch (error: any) {
      setMessage({
        type: "error",
        text: error.message || "Ocorreu um erro na ação da liga.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleAction} className="space-y-4 mt-6">
      <div className="space-y-2 p-4">
        <Label htmlFor="ligaName">Nome da Liga</Label>
        <Input
          id="ligaName"
          placeholder="Digite o nome da liga"
          value={ligaData.name}
          onChange={(e) =>
            setLigaData((prev) => ({ ...prev, name: e.target.value }))
          }
          required
        />
        <Label htmlFor="ligaImage">URL do Emblema</Label>
        <Input
          id="ligaImage"
          placeholder="Digite a URL do emblema"
          value={ligaData.image}
          onChange={(e) =>
            setLigaData((prev) => ({ ...prev, image: e.target.value }))
          }
        />
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Adicionando Liga...
          </>
        ) : (
          "Adicionar Liga"
        )}
      </Button>
      {message && (
        <div
          className={`text-sm font-medium ${
            message.type === "success" ? "text-green-600" : "text-red-600"
          }`}
        >
          {message.text}
        </div>
      )}
    </form>
  );
}
