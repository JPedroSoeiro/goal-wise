// src/app/api/teams/route.ts
import { NextResponse } from "next/server";
import { db } from "@/db";
import { teams } from "@/db/schema";
import { eq } from "drizzle-orm";

// GET /api/teams - Retorna todos os times
export async function GET() {
  try {
    const allTeams = await db.select().from(teams);
    return NextResponse.json(allTeams);
  } catch (error) {
    console.error("Erro ao buscar times:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

// POST /api/teams - Cria um novo time
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, image } = body;

    if (!name) {
      return NextResponse.json(
        { error: "O nome do time é obrigatório" },
        { status: 400 }
      );
    }

    const newTeam = await db.insert(teams).values({ name, image }).returning();
    return NextResponse.json(newTeam[0], { status: 201 });
  } catch (error) {
    console.error("Erro ao criar time:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

// DELETE /api/teams/:id - Exclui um time (exemplo de rota dinâmica, precisa de ajustes)
// Para DELETE, PUT, PATCH você geralmente usaria rotas dinâmicas como /api/teams/[id]/route.ts
// Este é um exemplo simplificado de como seria a lógica.
export async function DELETE(req: Request) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "ID do time é obrigatório" },
        { status: 400 }
      );
    }

    const deletedTeams = await db
      .delete(teams)
      .where(eq(teams.id, Number(id)))
      .returning();

    if (deletedTeams.length === 0) {
      return NextResponse.json(
        { error: "Time não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Time excluído com sucesso", team: deletedTeams[0] },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erro ao excluir time:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
