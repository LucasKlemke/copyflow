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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Create new project with complete data
      const newProject = {
        id: Date.now().toString(),
        name: data.nomeProjeto,
        description: data.promessaPrincipal,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        criativos: 0,
        status: "ativo" as const,
        modeloNegocio: data.modeloNegocio,
        metaFaturamento: data.faturamentoAtual,
        onboardingData: data,
      };

      // Save as current project
      localStorage.setItem("currentProject", JSON.stringify(newProject));

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
