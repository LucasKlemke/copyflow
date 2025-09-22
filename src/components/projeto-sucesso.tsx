"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface ProjetoSucessoProps {
  projeto: {
    nome: string;
    nicho: string;
    publicoIdeal: string;
    faixaPreco: string;
    promessa: string;
  };
}

const PUBLICO_LABELS: Record<string, string> = {
  "mulher-executiva": "Mulher Executiva (25-40 anos)",
  "mae-ocupada": "Mãe Ocupada (28-42 anos)",
  "homem-sedentario": "Homem Sedentário (25-35 anos)",
  "jovem-adulta": "Jovem Adulta (18-28 anos)",
};

const FAIXA_PRECO_LABELS: Record<string, string> = {
  basico: "Básico (Até R$ 97)",
  intermediario: "Intermediário (R$ 98-497)",
  premium: "Premium (R$ 498-1.997)",
  exclusivo: "Exclusivo (R$ 1.998+)",
};

const NICHO_LABELS: Record<string, string> = {
  fitness: "FITNESS & SAÚDE",
  dinheiro: "DINHEIRO & INVESTIMENTOS",
  educacao: "EDUCAÇÃO & CURSOS",
  business: "BUSINESS & EMPREENDEDORISMO",
};

export default function ProjetoSucesso({ projeto }: ProjetoSucessoProps) {
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);

  const nicho = NICHO_LABELS[projeto.nicho] || projeto.nicho;
  const publico = PUBLICO_LABELS[projeto.publicoIdeal] || projeto.publicoIdeal;
  const preco = FAIXA_PRECO_LABELS[projeto.faixaPreco] || projeto.faixaPreco;

  // Countdown e redirecionamento
  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          router.push("/dashboard");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-2xl px-6">
        <Card className="border-green-200 bg-gradient-to-br from-green-50 to-blue-50">
          <CardContent className="p-8 text-center">
            {/* Ícone de sucesso */}
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
              <div className="text-4xl">🎉</div>
            </div>

            {/* Título */}
            <h1 className="mb-4 text-3xl font-bold text-gray-900">
              PROJETO CRIADO COM SUCESSO!
            </h1>

            {/* Informações do projeto */}
            <div className="mb-8 space-y-4 text-left">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🎯</span>
                <div>
                  <div className="font-bold text-gray-900">{projeto.nome}</div>
                </div>
              </div>

              <div className="ml-8 space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{publico}</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{preco}</Badge>
                </div>
                <div className="text-gray-600">
                  <strong>Promessa:</strong> "{projeto.promessa}"
                </div>
              </div>
            </div>

            {/* Perfil personalizado */}
            <Card className="mb-8 border-blue-200 bg-blue-50">
              <CardContent className="p-6">
                <h3 className="mb-4 text-lg font-bold text-blue-900">
                  ✨ SEU PERFIL PERSONALIZADO:
                </h3>
                <div className="space-y-2 text-left text-sm text-blue-800">
                  <p>• Templates otimizados para {publico.toLowerCase()}</p>
                  <p>• Linguagem focada em praticidade e resultados</p>
                  <p>• Argumentos baseados em necessidades específicas</p>
                  <p>• CTAs direcionados para tomada de decisão rápida</p>
                </div>
              </CardContent>
            </Card>

            {/* Próximos passos */}
            <Card className="mb-8 border-purple-200 bg-purple-50">
              <CardContent className="p-6">
                <h3 className="mb-4 text-lg font-bold text-purple-900">
                  🚀 PRÓXIMOS PASSOS:
                </h3>
                <div className="space-y-2 text-left text-sm text-purple-800">
                  <div className="flex items-center gap-2">
                    <span className="font-bold">1.</span>
                    <span>Explorar seu dashboard personalizado</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold">2.</span>
                    <span>Gerar seu primeiro VSL de vendas</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold">3.</span>
                    <span>Criar sequência de emails de nutrição</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Botão para dashboard com countdown */}
            <div className="space-y-4">
              <Button
                onClick={() => router.push("/dashboard")}
                size="lg"
                className="w-full bg-blue-600 py-6 text-lg text-white hover:bg-blue-700"
              >
                Ir para Dashboard 🎯
              </Button>

              <p className="text-center text-sm text-gray-600">
                Redirecionando automaticamente em {countdown} segundos...
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
