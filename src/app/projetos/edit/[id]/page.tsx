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

    // Load project data (mock data)
    const mockProjetos: Projeto[] = [
      {
        id: "1",
        name: "Curso de Inglês Online",
        description: "Curso completo de inglês para iniciantes",
        createdAt: "2024-01-15",
        updatedAt: "2024-01-20",
        criativos: 5,
        status: "ativo",
        modeloNegocio: "infoprodutos",
        metaFaturamento: "10k-50k",
      },
      {
        id: "2",
        name: "E-commerce de Roupas",
        description: "Loja virtual de moda feminina",
        createdAt: "2024-01-10",
        updatedAt: "2024-01-18",
        criativos: 3,
        status: "ativo",
        modeloNegocio: "ecommerce",
        metaFaturamento: "50k-100k",
      },
      {
        id: "3",
        name: "Consultoria Empresarial",
        description: "Serviços de consultoria para PMEs",
        createdAt: "2024-01-05",
        updatedAt: "2024-01-12",
        criativos: 2,
        status: "pausado",
        modeloNegocio: "servicos",
        metaFaturamento: "100k-300k",
      },
    ];

    const foundProject = mockProjetos.find(p => p.id === projectId);
    if (!foundProject) {
      router.push("/projetos");
      return;
    }

    setProjeto(foundProject);

    // Convert project data to form format
    if (foundProject.onboardingData) {
      setInitialData(foundProject.onboardingData);
    } else {
      // Map basic project data to new form structure
      setInitialData({
        nomeProjeto: foundProject.name,
        modeloNegocio: foundProject.modeloNegocio,
        faturamentoAtual: foundProject.metaFaturamento,
        promessaPrincipal: foundProject.description || "",
        // Set some defaults for missing fields
        nicho: "educacao", // default based on the example
        publicoIdeal: "adulto-profissional",
        faixaPreco: "intermediario",
        diferencialCompetitivo: ["metodo"],
        nivelMarketingDigital: "intermediario",
        nivelCopywriting: "basico",
        principalDesafio: "trafego",
      });
    }
  }, [projectId, router]);

  const handleSubmit = async (data: ProjetoFormData) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Update project
      const updatedProject = {
        ...projeto!,
        name: data.nomeProjeto,
        description: data.promessaPrincipal,
        modeloNegocio: data.modeloNegocio,
        metaFaturamento: data.faturamentoAtual,
        updatedAt: new Date().toISOString(),
        onboardingData: data,
      };

      // Update current project if it's the one being edited
      const currentProject = localStorage.getItem("currentProject");
      if (currentProject) {
        const current = JSON.parse(currentProject);
        if (current.id === projectId) {
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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

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
