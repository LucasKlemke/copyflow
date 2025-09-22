"use client";

import { useEffect, useState } from "react";

import { useParams, useRouter } from "next/navigation";

import { Trash2 } from "lucide-react";

import ProjetoFormOtimizado from "@/components/projeto-form-otimizado";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface Projeto {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  criativos: number;
  status: "ativo" | "pausado" | "arquivado";
  modeloNegocio: string;
  metaFaturamento: string;
  onboardingData?: any;
}

interface ProjetoFormData {
  nomeProjeto: string;
  nicho: string;
  modeloNegocio: string;
  publicoIdeal: string;
  faixaPreco: string;
  promessaPrincipal: string;
  diferencialCompetitivo: string[];
  nivelMarketingDigital: string;
  nivelCopywriting: string;
  faturamentoAtual: string;
  principalDesafio: string;
}

export default function EditProjectPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;

  const [isDeleting, setIsDeleting] = useState(false);
  const [projeto, setProjeto] = useState<Projeto | null>(null);
  const [initialData, setInitialData] = useState<Partial<ProjetoFormData>>({});

  useEffect(() => {
    // Check authentication
    const user = localStorage.getItem("user");
    if (!user) {
      router.push("/auth/login");
      return;
    }

    // Load project data from API
    const loadProject = async () => {
      try {
        const response = await fetch(`/api/projects/${projectId}`);
        if (!response.ok) {
          if (response.status === 404) {
            router.push("/projetos");
            return;
          }
          throw new Error("Failed to load project");
        }

        const projectData = await response.json();

        const mappedProject: Projeto = {
          id: projectData.id,
          name: projectData.name,
          description: projectData.description,
          createdAt: projectData.createdAt,
          updatedAt: projectData.updatedAt,
          criativos: projectData._count.creatives,
          status: projectData.status.toLowerCase() as
            | "ativo"
            | "pausado"
            | "arquivado",
          modeloNegocio: projectData.modeloNegocio,
          metaFaturamento: projectData.faturamentoAtual,
        };

        setProjeto(mappedProject);

        // Map project data to form format
        const formData: Partial<ProjetoFormData> = {
          nomeProjeto: projectData.name,
          nicho: projectData.nicho,
          modeloNegocio: projectData.modeloNegocio,
          publicoIdeal: projectData.publicoIdeal,
          faixaPreco: projectData.faixaPreco,
          promessaPrincipal: projectData.promessaPrincipal,
          diferencialCompetitivo: projectData.diferencialCompetitivo
            ? JSON.parse(projectData.diferencialCompetitivo)
            : [],
          nivelMarketingDigital: projectData.nivelMarketingDigital,
          nivelCopywriting: projectData.nivelCopywriting,
          faturamentoAtual: projectData.faturamentoAtual,
          principalDesafio: projectData.principalDesafio,
        };

        setInitialData(formData);
      } catch (error) {
        console.error("Error loading project:", error);
        router.push("/projetos");
      }
    };

    loadProject();
  }, [projectId, router]);

  const handleSubmit = async (data: ProjetoFormData) => {
    try {
      // Update project via API
      const response = await fetch(`/api/projects/${projectId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update project");
      }

      const updatedProjectData = await response.json();

      // Update current project if it's the one being edited
      const currentProject = localStorage.getItem("currentProject");
      if (currentProject) {
        const current = JSON.parse(currentProject);
        if (current.id === projectId) {
          const updatedProject = {
            id: updatedProjectData.id,
            name: updatedProjectData.name,
            description: updatedProjectData.description,
            createdAt: updatedProjectData.createdAt,
            updatedAt: updatedProjectData.updatedAt,
            criativos: updatedProjectData._count.creatives,
            status: "ativo" as const,
            modeloNegocio: updatedProjectData.modeloNegocio,
            metaFaturamento: updatedProjectData.faturamentoAtual,
            onboardingData: data,
          };
          localStorage.setItem(
            "currentProject",
            JSON.stringify(updatedProject)
          );
        }
      }

      router.push("/projetos");
    } catch (error) {
      console.error("Erro ao atualizar projeto:", error);
      throw error;
    }
  };

  const handleDelete = async () => {
    if (
      !confirm(`Tem certeza que deseja excluir o projeto "${projeto?.name}"?`)
    ) {
      return;
    }

    if (
      !confirm(
        "Esta ação não pode ser desfeita. Todos os criativos associados também serão excluídos."
      )
    ) {
      return;
    }

    setIsDeleting(true);

    try {
      // Delete project via API
      const response = await fetch(`/api/projects/${projectId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete project");
      }

      // Clear current project if it's the one being deleted
      const currentProject = localStorage.getItem("currentProject");
      if (currentProject) {
        const current = JSON.parse(currentProject);
        if (current.id === projectId) {
          localStorage.removeItem("currentProject");
        }
      }

      router.push("/projetos");
    } catch (error) {
      console.error("Erro ao excluir projeto:", error);
      alert("Erro ao excluir projeto. Tente novamente.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancel = () => {
    router.push("/projetos");
  };

  if (!projeto) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-8">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Carregando projeto...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Project Info */}
      <Card className="border-gray-200 bg-gray-50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div>
              <strong>Criado em:</strong>{" "}
              {new Date(projeto.createdAt).toLocaleDateString("pt-BR")}
            </div>
            <div>
              <strong>{projeto.criativos}</strong> criativo(s)
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Form otimizado */}
      <ProjetoFormOtimizado
        mode="edit"
        initialData={initialData}
        projectId={projectId}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />

      {/* Delete Button */}
      <div className="flex justify-center">
        <Button
          variant="destructive"
          onClick={handleDelete}
          disabled={isDeleting}
          className="flex items-center gap-2"
        >
          {isDeleting ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Excluindo...
            </>
          ) : (
            <>
              <Trash2 className="h-4 w-4" />
              Excluir Projeto
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
