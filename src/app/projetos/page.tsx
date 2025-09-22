"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import {
  Calendar,
  Edit,
  FileText,
  MoreHorizontal,
  Plus,
  Settings,
  Trash2,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Project } from "@/types/project";

// Using Project type from types/project.ts

const STATUS_CONFIG = {
  ATIVO: { label: "Ativo", color: "bg-green-100 text-green-700" },
  PAUSADO: { label: "Pausado", color: "bg-yellow-100 text-yellow-700" },
  CONCLUIDO: { label: "Concluído", color: "bg-blue-100 text-blue-700" },
  ARQUIVADO: { label: "Arquivado", color: "bg-gray-100 text-gray-700" },
};

const MODELO_NEGOCIO_LABELS = {
  infoproduto: "Infoprodutos",
  ecommerce: "E-commerce",
  saas: "SaaS/Software",
  servicos: "Serviços",
  afiliados: "Afiliados",
  agencia: "Agência",
};

export default function ProjetosPage() {
  const router = useRouter();
  const [projetos, setProjetos] = useState<Project[]>([]);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filtroStatus, setFiltroStatus] = useState<string>("todos");
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Check authentication
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      router.push("/auth/login");
      return;
    }

    const userData = JSON.parse(userStr);
    setUser(userData);

    // Load current project
    const current = localStorage.getItem("currentProject");
    if (current) {
      setCurrentProject(JSON.parse(current));
    }

    // Load all projects from API
    loadProjects(userData.id);
  }, [router]);

  const loadProjects = async (userId: string) => {
    setIsLoading(true);
    try {
      // For now, load all projects and filter by user
      // In a real app, you'd have an endpoint like /api/users/[userId]/projects
      const response = await fetch("/api/projects");
      if (response.ok) {
        const allProjects = await response.json();
        // Filter projects by user (for now we'll show all since we don't have user filtering in API yet)
        setProjetos(allProjects);
      }
    } catch (error) {
      console.error("Error loading projects:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredProjetos = projetos.filter(projeto => {
    const matchesSearch = projeto.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      filtroStatus === "todos" || projeto.status === filtroStatus;
    return matchesSearch && matchesStatus;
  });

  const handleCreateProject = () => {
    router.push("/projetos/create");
  };

  const handleEditProject = (projeto: Project) => {
    router.push(`/projetos/edit/${projeto.id}`);
  };

  const handleSelectProject = (projeto: Project) => {
    // Map the Project to the format expected by localStorage
    const projectForStorage = {
      id: projeto.id,
      name: projeto.name,
      description: projeto.description,
      createdAt: projeto.createdAt,
      updatedAt: projeto.updatedAt,
      criativos: projeto._count.creatives,
      status: "ativo" as const,
      modeloNegocio: projeto.modeloNegocio,
      metaFaturamento: projeto.faturamentoAtual,
    };

    localStorage.setItem("currentProject", JSON.stringify(projectForStorage));
    setCurrentProject(projeto);
    router.push("/dashboard");
  };

  const handleDeleteProject = async (projeto: Project) => {
    if (
      confirm(`Tem certeza que deseja excluir o projeto "${projeto.name}"?`)
    ) {
      try {
        const response = await fetch(`/api/projects/${projeto.id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          setProjetos(prev => prev.filter(p => p.id !== projeto.id));

          // If deleting current project, clear it
          if (currentProject?.id === projeto.id) {
            localStorage.removeItem("currentProject");
            setCurrentProject(null);
          }
        } else {
          alert("Erro ao excluir projeto");
        }
      } catch (error) {
        console.error("Error deleting project:", error);
        alert("Erro ao excluir projeto");
      }
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Meus Projetos</h1>
          <p className="mt-2 text-gray-600">
            Gerencie todos os seus projetos de marketing
          </p>
        </div>
        <Button
          onClick={handleCreateProject}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Novo Projeto
        </Button>
      </div>

      {/* Current Project Alert */}
      {currentProject && (
        <Card className="mb-6 border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600">
                  <FileText className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="font-medium text-blue-900">Projeto Atual</p>
                  <p className="text-sm text-blue-700">{currentProject.name}</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push("/dashboard")}
                className="border-blue-200 text-blue-700 hover:bg-blue-100"
              >
                Ir para Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Input
            placeholder="Buscar projetos..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="sm:w-64"
          />
          <Select value={filtroStatus} onValueChange={setFiltroStatus}>
            <SelectTrigger className="sm:w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="ativo">Ativo</SelectItem>
              <SelectItem value="pausado">Pausado</SelectItem>
              <SelectItem value="arquivado">Arquivado</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="text-sm text-gray-600">
          {filteredProjetos.length} projeto(s) encontrado(s)
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjetos.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <FileText className="mx-auto mb-4 h-12 w-12 text-gray-400" />
            <h3 className="mb-2 text-lg font-medium text-gray-900">
              {projetos.length === 0
                ? "Nenhum projeto criado ainda"
                : "Nenhum projeto encontrado"}
            </h3>
            <p className="mb-6 text-gray-600">
              {projetos.length === 0
                ? "Comece criando seu primeiro projeto para organizar seus criativos."
                : "Tente ajustar os filtros ou termo de busca."}
            </p>
            {projetos.length === 0 && (
              <Button
                onClick={handleCreateProject}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Criar Primeiro Projeto
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredProjetos.map(projeto => {
            const statusConfig =
              STATUS_CONFIG[projeto.status as keyof typeof STATUS_CONFIG];
            const isCurrentProject = currentProject?.id === projeto.id;

            return (
              <Card
                key={projeto.id}
                className={`group transition-all hover:shadow-md ${
                  isCurrentProject ? "ring-2 ring-blue-500" : ""
                }`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="line-clamp-1 text-lg">
                        {projeto.name}
                        {isCurrentProject && (
                          <Badge className="ml-2 bg-blue-100 text-blue-700">
                            Atual
                          </Badge>
                        )}
                      </CardTitle>
                      <div className="mt-2 flex items-center gap-2">
                        <Badge className={statusConfig.color}>
                          {statusConfig.label}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {MODELO_NEGOCIO_LABELS[
                            projeto.modeloNegocio as keyof typeof MODELO_NEGOCIO_LABELS
                          ] || projeto.modeloNegocio}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => handleEditProject(projeto)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-red-600 hover:bg-red-50"
                        onClick={() => handleDeleteProject(projeto)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  {projeto.description && (
                    <p className="mb-4 line-clamp-2 text-sm text-gray-600">
                      {projeto.description}
                    </p>
                  )}

                  <div className="mb-4 space-y-2 text-xs text-gray-500">
                    <div className="flex items-center gap-2">
                      <FileText className="h-3 w-3" />
                      <span>{projeto._count.creatives} criativo(s)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3 w-3" />
                      <span>
                        Criado em{" "}
                        {new Date(projeto.createdAt).toLocaleDateString(
                          "pt-BR"
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="flex-1"
                      onClick={() => handleSelectProject(projeto)}
                    >
                      {isCurrentProject ? "Ir para Dashboard" : "Selecionar"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditProject(projeto)}
                    >
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
