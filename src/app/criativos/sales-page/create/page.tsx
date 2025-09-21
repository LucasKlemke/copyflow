"use client";

import { useRouter } from "next/navigation";

import { ArrowLeft, FileText } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CreateSalesPagePage() {
  const router = useRouter();

  return (
    <div className="mx-auto max-w-4xl px-6 py-8">
      {/* Header */}
      <div className="mb-8 flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/criativos")}
          className="h-8 w-8 p-0"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-medium text-gray-900">
            Criar Sales Page
          </h1>
          <p className="text-sm text-gray-600">
            Funcionalidade em desenvolvimento
          </p>
        </div>
      </div>

      <Card className="p-12 text-center">
        <CardHeader>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <FileText className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle className="text-xl text-gray-900">
            Sales Page em Breve
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-6 text-gray-600">
            Estamos criando um sistema completo para gerar páginas de vendas de
            alta conversão, otimizadas para seu público e produto.
          </p>
          <div className="flex justify-center gap-3">
            <Button variant="outline" onClick={() => router.push("/criativos")}>
              Voltar aos Criativos
            </Button>
            <Button onClick={() => router.push("/criativos/vsl/create")}>
              Criar VSL Enquanto Isso
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
