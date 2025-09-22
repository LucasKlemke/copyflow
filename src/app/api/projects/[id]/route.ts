import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;

    const project = await prisma.project.findUnique({
      where: { id },
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
            updatedAt: true,
          },
        },
        _count: {
          select: {
            creatives: true,
          },
        },
      },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error("Error fetching project:", error);
    return NextResponse.json(
      { error: "Failed to fetch project" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;
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
      status,
    } = body;

    // Check if project exists
    const existingProject = await prisma.project.findUnique({
      where: { id },
    });

    if (!existingProject) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const project = await prisma.project.update({
      where: { id },
      data: {
        ...(nomeProjeto && { name: nomeProjeto }),
        ...(promessaPrincipal && { description: promessaPrincipal }),
        ...(nicho && { nicho }),
        ...(modeloNegocio && { modeloNegocio }),
        ...(publicoIdeal !== undefined && { publicoIdeal }),
        ...(faixaPreco !== undefined && { faixaPreco }),
        ...(promessaPrincipal !== undefined && { promessaPrincipal }),
        ...(diferencialCompetitivo && {
          diferencialCompetitivo: JSON.stringify(diferencialCompetitivo),
        }),
        ...(nivelMarketingDigital !== undefined && { nivelMarketingDigital }),
        ...(nivelCopywriting !== undefined && { nivelCopywriting }),
        ...(faturamentoAtual !== undefined && { faturamentoAtual }),
        ...(principalDesafio !== undefined && { principalDesafio }),
        ...(status && { status }),
        updatedAt: new Date(),
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

    return NextResponse.json(project);
  } catch (error) {
    console.error("Error updating project:", error);
    return NextResponse.json(
      { error: "Failed to update project" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;

    // Check if project exists
    const existingProject = await prisma.project.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            creatives: true,
          },
        },
      },
    });

    if (!existingProject) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Delete the project (this will cascade delete creatives due to the schema)
    await prisma.project.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "Project deleted successfully",
      deletedCreatives: existingProject._count.creatives,
    });
  } catch (error) {
    console.error("Error deleting project:", error);
    return NextResponse.json(
      { error: "Failed to delete project" },
      { status: 500 }
    );
  }
}
