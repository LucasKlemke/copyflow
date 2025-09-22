"use client";

import { useEffect, useState } from "react";

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

export default function OnboardingPage() {
  const router = useRouter();
  const [initialData, setInitialData] = useState<Partial<ProjetoFormData>>({});

  // Load existing project data if coming from project creation
  useEffect(() => {
    const currentProject = localStorage.getItem("currentProject");
    if (currentProject) {
      try {
        const project = JSON.parse(currentProject);
        if (project.onboardingData) {
          setInitialData(project.onboardingData);
        } else {
          // Convert basic project data to form format
          setInitialData({
            nomeProjeto: project.name || "",
            modeloNegocio: project.modeloNegocio || "",
            faturamentoAtual: project.metaFaturamento || "",
          });
        }
      } catch (error) {
        console.error("Erro ao carregar dados do projeto:", error);
      }
    }
  }, []);

  const handleSubmit = async (data: ProjetoFormData) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Update or create project with complete onboarding data
      const existingProject = localStorage.getItem("currentProject");
      let projectData;

      if (existingProject) {
        // Update existing project
        const project = JSON.parse(existingProject);
        projectData = {
          ...project,
          name: data.nomeProjeto,
          description: data.promessaPrincipal,
          modeloNegocio: data.modeloNegocio,
          metaFaturamento: data.faturamentoAtual,
          updatedAt: new Date().toISOString(),
          onboardingData: data,
        };
      } else {
        // Create new project
        projectData = {
          id: Date.now().toString(),
          name: data.nomeProjeto,
          description: data.promessaPrincipal,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          criativos: 0,
          status: "ativo",
          modeloNegocio: data.modeloNegocio,
          metaFaturamento: data.faturamentoAtual,
          onboardingData: data,
        };
      }

      localStorage.setItem("currentProject", JSON.stringify(projectData));

      // Redirect to dashboard
      router.push("/dashboard");
    } catch (error) {
      console.error("Erro ao salvar projeto:", error);
      throw error;
    }
  };

  const handleCancel = () => {
    router.push("/projetos");
  };

  return (
    <ProjetoFormOtimizado
      mode="onboarding"
      initialData={initialData}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
    />
  );
}
