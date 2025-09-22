"use client";

import { useEffect, useState } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  ArrowLeft,
  Edit,
  Eye,
  MoreVertical,
  Play,
  Plus,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Creative, Project } from "@/types/project";

export default function VSLListPage() {
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [vsls, setVsls] = useState<Creative[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check authentication and project
    const user = localStorage.getItem("user");
    const currentProject = localStorage.getItem("currentProject");

    if (!user) {
      router.push("/auth/login");
      return;
    }

    if (!currentProject) {
      router.push("/onboarding");
      return;
    }

    const projectData = JSON.parse(currentProject);
    setProject(projectData);
    loadVSLs(projectData.id);
  }, [router]);

  const loadVSLs = async (projectId: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `/api/creatives?projectId=${projectId}&type=VSL`
      );

      if (!response.ok) {
        throw new Error("Failed to load VSLs");
      }

      const data = await response.json();
      setVsls(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load VSLs");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteVSL = async (vslId: string) => {
    if (!confirm("Tem certeza que deseja excluir esta VSL?")) {
      return;
    }

    try {
      const response = await fetch(`/api/creatives/${vslId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete VSL");
      }

      // Reload VSLs after deletion
      if (project) {
        loadVSLs(project.id);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete VSL");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PUBLISHED":
        return "bg-green-100 text-green-800";
      case "DRAFT":
        return "bg-yellow-100 text-yellow-800";
      case "ARCHIVED":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "PUBLISHED":
        return "Publicado";
      case "DRAFT":
        return "Rascunho";
      case "ARCHIVED":
        return "Arquivado";
      default:
        return status;
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/dashboard")}
            className="h-8 w-8 p-0"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-medium text-gray-900">
              VSLs do Projeto
            </h1>
            <p className="text-sm text-gray-600">
              {project?.name} • {vsls.length} VSL{vsls.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
        <Link href="/criativos/vsl/create">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="mr-2 h-4 w-4" />
            Nova VSL
          </Button>
        </Link>
      </div>

      {/* Error Display */}
      {error && (
        <Card className="mb-6 border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="text-red-700">
              <p className="font-medium">Erro:</p>
              <p className="text-sm">{error}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
            <p className="mt-2 text-sm text-gray-600">Carregando VSLs...</p>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && vsls.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center">
            <Play className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              Nenhuma VSL criada
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              Crie sua primeira VSL para começar a gerar vendas com vídeos
              persuasivos.
            </p>
            <Link href="/criativos/vsl/create">
              <Button className="mt-4 bg-blue-600 hover:bg-blue-700">
                <Plus className="mr-2 h-4 w-4" />
                Criar Primeira VSL
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* VSL Grid */}
      {!isLoading && vsls.length > 0 && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {vsls.map(vsl => (
            <Card key={vsl.id} className="transition-shadow hover:shadow-md">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="min-w-0 flex-1">
                    <CardTitle className="truncate text-lg">
                      {vsl.title}
                    </CardTitle>
                    <div className="mt-1 flex items-center gap-2">
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(
                          vsl.status
                        )}`}
                      >
                        {getStatusLabel(vsl.status)}
                      </span>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/criativos/vsl/edit/${vsl.id}`}>
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/criativos/vsl/view/${vsl.id}`}>
                          <Eye className="mr-2 h-4 w-4" />
                          Visualizar
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => deleteVSL(vsl.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {/* Content Preview */}
                  {vsl.content && (
                    <div className="text-sm text-gray-600">
                      <p className="line-clamp-3">
                        {vsl.content.substring(0, 150)}
                        {vsl.content.length > 150 ? "..." : ""}
                      </p>
                    </div>
                  )}

                  {/* VSL Parameters */}
                  {vsl.vslParameters && (
                    <div className="flex flex-wrap gap-1">
                      <span className="inline-flex rounded bg-blue-50 px-2 py-1 text-xs text-blue-700">
                        {vsl.vslParameters.tipo}
                      </span>
                      <span className="inline-flex rounded bg-green-50 px-2 py-1 text-xs text-green-700">
                        {vsl.vslParameters.duracao}
                      </span>
                      <span className="inline-flex rounded bg-purple-50 px-2 py-1 text-xs text-purple-700">
                        {vsl.vslParameters.abordagem}
                      </span>
                    </div>
                  )}

                  {/* Metadata */}
                  <div className="text-xs text-gray-500">
                    <p>Criado em {formatDate(vsl.createdAt)}</p>
                    {vsl.updatedAt !== vsl.createdAt && (
                      <p>Atualizado em {formatDate(vsl.updatedAt)}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
