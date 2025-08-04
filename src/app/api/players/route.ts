// src/app/api/players/route.ts
import { NextResponse } from "next/server";
import { db } from "@/db";
import { players } from "@/db/schema";
import { eq } from "drizzle-orm";

// GET /api/players - Retorna todos os jogadores
export async function GET() {
  try {
    const allPlayers = await db.select().from(players);
    return NextResponse.json(allPlayers);
  } catch (error) {
    console.error("Erro ao buscar jogadores:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

// POST /api/players - Cria um novo jogador
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, teamId, position, image } = body;

    if (!name || !teamId) {
      return NextResponse.json(
        { error: "Nome e ID do time são obrigatórios" },
        { status: 400 }
      );
    }

    const newPlayer = await db
      .insert(players)
      .values({ name, teamId, position, image })
      .returning();
    return NextResponse.json(newPlayer[0], { status: 201 });
  } catch (error) {
    console.error("Erro ao criar jogador:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

// DELETE /api/players/:id - Exclui um jogador (exemplo de rota dinâmica, precisa de ajustes)
export async function DELETE(req: Request) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "ID do jogador é obrigatório" },
        { status: 400 }
      );
    }

    const deletedPlayers = await db
      .delete(players)
      .where(eq(players.id, Number(id)))
      .returning();

    if (deletedPlayers.length === 0) {
      return NextResponse.json(
        { error: "Jogador não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Jogador excluído com sucesso", player: deletedPlayers[0] },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erro ao excluir jogador:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
