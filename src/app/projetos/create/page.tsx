"use client";

import { useRouter } from "next/navigation";

import ProjetoFormOtimizado from "@/components/projeto-form-otimizado";

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

export default function CreateProjectPage() {
  const router = useRouter();

  const handleSubmit = async (data: ProjetoFormData) => {
    try {
      // Get authenticated user
      const userStr = localStorage.getItem("user");
      if (!userStr) {
        router.push("/auth/login");
        return;
      }

      const user = JSON.parse(userStr);

      // Create project via API
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          userId: user.id,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create project");
      }

      const newProject = await response.json();

      // Save as current project in localStorage for compatibility
      const projectForStorage = {
        id: newProject.id,
        name: newProject.name,
        description: newProject.description,
        createdAt: newProject.createdAt,
        updatedAt: newProject.updatedAt,
        criativos: newProject._count.creatives,
        status: "ativo" as const,
        modeloNegocio: newProject.modeloNegocio,
        metaFaturamento: newProject.faturamentoAtual,
        onboardingData: data,
      };

      localStorage.setItem("currentProject", JSON.stringify(projectForStorage));

      // Tela de sucesso será exibida pelo componente
      // Após 3 segundos, será redirecionado automaticamente
    } catch (error) {
      console.error("Erro ao criar projeto:", error);
      throw error;
    }
  };

  const handleCancel = () => {
    router.push("/projetos");
  };

  return (
    <ProjetoFormOtimizado
      mode="create"
      onSubmit={handleSubmit}
      onCancel={handleCancel}
    />
  );
}
