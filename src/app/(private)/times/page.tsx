// src/app/(private)/times/page.tsx
"use client";

import type React from "react";
import { useState, useEffect } from "react"; // Adicionado useEffect
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Label } from "@/components/ui/label";
import { Loader2, Plus } from "lucide-react";
import Image from "next/image";

interface Team {
  id: string;
  name: string;
  image: string;
}

export default function TimesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [teams, setTeams] = useState<Team[]>([]); // Inicie com um array vazio
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [newTeam, setNewTeam] = useState({ name: "", image: "" });

  // Função para buscar times
  const fetchTeams = async () => {
    try {
      const response = await fetch("/api/teams");
      if (!response.ok) {
        throw new Error("Falha ao buscar times");
      }
      const data: Team[] = await response.json();
      setTeams(data);
    } catch (error) {
      console.error("Erro ao buscar times:", error);
      setMessage({ type: "error", text: "Erro ao carregar times." });
    }
  };

  useEffect(() => {
    fetchTeams(); // Carrega os times quando o componente é montado
  }, []);

  const filteredTeams = teams.filter((team) =>
    team.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/teams", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTeam),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Falha ao adicionar time.");
      }

      const addedTeam: Team = await response.json();
      setTeams((prev) => [...prev, addedTeam]);
      setMessage({ type: "success", text: "Time adicionado com sucesso!" });
      setNewTeam({ name: "", image: "" });

      setTimeout(() => {
        setIsSheetOpen(false);
        setMessage(null);
      }, 1500);
    } catch (error: any) {
      setMessage({
        type: "error",
        text: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

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
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Time
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Adicionar Novo Time</SheetTitle>
              <SheetDescription>
                Insira os detalhes do time para adicionar um novo time ao seu
                sistema.
              </SheetDescription>
            </SheetHeader>
            <form onSubmit={handleAddTeam} className="space-y-4 mt-6">
              <div className="space-y-2">
                <Label htmlFor="teamImage">Link da Imagem</Label>
                <Input
                  id="teamImage"
                  placeholder="Insira a URL da imagem"
                  value={newTeam.image}
                  onChange={(e) =>
                    setNewTeam((prev) => ({ ...prev, image: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="teamName">Nome do Time</Label>
                <Input
                  id="teamName"
                  placeholder="Insira o nome do time"
                  value={newTeam.name}
                  onChange={(e) =>
                    setNewTeam((prev) => ({ ...prev, name: e.target.value }))
                  }
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adicionando Time...
                  </>
                ) : (
                  "Adicionar Time"
                )}
              </Button>
              {message && (
                <div
                  className={`text-sm font-medium ${
                    message.type === "success"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {message.text}
                </div>
              )}
            </form>
          </SheetContent>
        </Sheet>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {filteredTeams.map((team) => (
          <HoverCard key={team.id}>
            <HoverCardTrigger asChild>
              <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="aspect-square relative mb-2">
                    <Image
                      src={team.image || "/placeholder.svg"}
                      alt={team.name}
                      fill
                      className="object-cover rounded-md"
                    />
                  </div>
                  <h3 className="font-semibold text-center truncate">
                    {team.name}
                  </h3>
                </CardContent>
              </Card>
            </HoverCardTrigger>
            <HoverCardContent>
              <div className="space-y-2">
                <h4 className="font-semibold">{team.name}</h4>
                <p className="text-sm text-muted-foreground">
                  Informações do Time
                </p>
              </div>
            </HoverCardContent>
          </HoverCard>
        ))}
      </div>
    </div>
  );
}
