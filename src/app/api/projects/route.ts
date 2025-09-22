import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const projects = await prisma.project.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        creatives: {
          select: {
            id: true,
            title: true,
            type: true,
            status: true,
            createdAt: true,
          },
        },
        _count: {
          select: {
            creatives: true,
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    return NextResponse.json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      nomeProjeto,
      nicho,
      modeloNegocio,
      publicoIdeal,
      faixaPreco,
      promessaPrincipal,
      diferencialCompetitivo,
      nivelMarketingDigital,
      nivelCopywriting,
      faturamentoAtual,
      principalDesafio,
      userId,
    } = body;

    if (!nomeProjeto || !userId || !nicho || !modeloNegocio) {
      return NextResponse.json(
        {
          error:
            "Nome do projeto, userId, nicho e modelo de negócio são obrigatórios",
        },
        { status: 400 }
      );
    }

    const project = await prisma.project.create({
      data: {
        name: nomeProjeto,
        description: promessaPrincipal,
        userId,
        nicho,
        modeloNegocio,
        publicoIdeal: publicoIdeal || "",
        faixaPreco: faixaPreco || "",
        promessaPrincipal: promessaPrincipal || "",
        diferencialCompetitivo: JSON.stringify(diferencialCompetitivo || []),
        nivelMarketingDigital: nivelMarketingDigital || "",
        nivelCopywriting: nivelCopywriting || "",
        faturamentoAtual: faturamentoAtual || "",
        principalDesafio: principalDesafio || "",
        status: "ATIVO",
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        _count: {
          select: {
            creatives: true,
          },
        },
      },
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    );
  }
}
