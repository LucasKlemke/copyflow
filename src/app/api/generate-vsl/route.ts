import { NextRequest, NextResponse } from "next/server";

interface VSLRequest {
  tipo: string;
  duracao: string;
  abordagem: string;
  cta: string;
  elementos: string[];
}

interface VSLResponse {
  script: string;
  slides: string[];
  tempoEstimado: {
    introducao: string;
    desenvolvimento: string;
    cta: string;
    total: string;
  };
  ctasPositions: string[];
  teleprompter: string;
}

// Mock AI generation - replace with your preferred AI service
async function generateVSLWithAI(formData: VSLRequest): Promise<VSLResponse> {
  // This is where you would integrate with OpenAI, Claude, or another AI service
  // For now, we'll return a structured mock response based on the form data

  const tipoLabels = {
    curta: "VSL Curta (até R$ 497)",
    media: "VSL Média (R$ 497-1.997)",
    longa: "VSL Longa (R$ 1.997+)",
  };

  const abordagemLabels = {
    historia: "História Pessoal (storytelling)",
    dados: "Dados e Estatísticas (autoridade)",
    problema: "Problema Urgente (dor)",
    revelacao: "Revelação/Descoberta (curiosidade)",
  };

  const elementosLabels = {
    "prova-social": "Prova Social (depoimentos)",
    urgencia: "Urgência (tempo limitado)",
    escassez: "Escassez (vagas limitadas)",
    bonus: "Bônus Exclusivos",
    garantia: "Garantia Destacada",
  };

  // Generate script based on form data
  const script = `
# SCRIPT VSL - ${tipoLabels[formData.tipo as keyof typeof tipoLabels]}
**Duração:** ${formData.duracao}
**Abordagem:** ${abordagemLabels[formData.abordagem as keyof typeof abordagemLabels]}

## INTRODUÇÃO (0:00 - 1:30)
${
  formData.abordagem === "historia"
    ? "Olá, meu nome é [SEU NOME] e hoje eu quero compartilhar com você uma história que mudou completamente a minha vida..."
    : formData.abordagem === "dados"
      ? "Você sabia que 97% das pessoas que tentam [PROBLEMA] falham miseravelmente? Mas existe um grupo seleto de 3% que consegue resultados extraordinários..."
      : formData.abordagem === "problema"
        ? "Se você está assistindo este vídeo, provavelmente você está enfrentando [PROBLEMA ESPECÍFICO] e já tentou de tudo, mas nada funcionou até agora..."
        : "Há alguns anos atrás, eu descobri algo que a indústria de [NICHO] não quer que você saiba..."
}

## DESENVOLVIMENTO (1:30 - ${formData.duracao === "5-8" ? "6:00" : formData.duracao === "12-15" ? "12:00" : formData.duracao === "20-25" ? "20:00" : "25:00"})

### Agitação do Problema
- Demonstre como o problema atual está afetando a vida da pessoa
- Mostre as consequências de não resolver isso agora
- Crie urgência emocional

### Apresentação da Solução
- Revele sua metodologia/produto
- Explique como funciona de forma simples
- Demonstre os benefícios únicos

${
  formData.elementos.includes("prova-social")
    ? `
### Prova Social
- Depoimento de [CLIENTE 1]: "Resultado específico em X tempo"
- Depoimento de [CLIENTE 2]: "Transformação completa"
- Estatísticas de sucesso dos seus clientes
`
    : ""
}

${
  formData.elementos.includes("bonus")
    ? `
### Bônus Exclusivos
- Bônus #1: [NOME DO BÔNUS] (Valor: R$ XXX)
- Bônus #2: [NOME DO BÔNUS] (Valor: R$ XXX)
- Bônus #3: [NOME DO BÔNUS] (Valor: R$ XXX)
`
    : ""
}

## CALL TO ACTION FINAL
${
  formData.cta === "botao"
    ? "Agora eu quero que você clique no botão logo abaixo desta tela..."
    : formData.cta === "link"
      ? "O link está aqui na descrição deste vídeo..."
      : formData.cta === "whatsapp"
        ? "Pega o seu celular agora e me envia uma mensagem no WhatsApp..."
        : "Pegue o telefone agora e ligue para o número que está aparecendo na sua tela..."
}

${
  formData.elementos.includes("urgencia")
    ? `
⏰ **ATENÇÃO:** Esta oferta especial expira em 24 horas!
`
    : ""
}

${
  formData.elementos.includes("escassez")
    ? `
💰 **VAGAS LIMITADAS:** Apenas 50 pessoas terão acesso a esta oportunidade!
`
    : ""
}

${
  formData.elementos.includes("garantia")
    ? `
📞 **GARANTIA TOTAL:** 30 dias para testar sem riscos. Não funcionou? Devolvemos 100% do seu dinheiro!
`
    : ""
}
`.trim();

  const slides = [
    "Slide 1: Gancho Inicial",
    `Slide 2: ${formData.abordagem === "historia" ? "Minha História" : formData.abordagem === "dados" ? "Estatísticas Impactantes" : formData.abordagem === "problema" ? "O Grande Problema" : "A Grande Revelação"}`,
    "Slide 3: Agitação do Problema",
    "Slide 4: Consequências de Não Agir",
    "Slide 5: Apresentação da Solução",
    "Slide 6: Como Funciona",
    "Slide 7: Benefícios Únicos",
    ...(formData.elementos.includes("prova-social")
      ? ["Slide 8: Depoimentos de Sucesso"]
      : []),
    ...(formData.elementos.includes("bonus")
      ? ["Slide 9: Bônus Exclusivos"]
      : []),
    "Slide Final: Call to Action",
  ];

  const tempoEstimado = {
    introducao: "0:00 - 1:30",
    desenvolvimento:
      formData.duracao === "5-8"
        ? "1:30 - 6:00"
        : formData.duracao === "12-15"
          ? "1:30 - 12:00"
          : formData.duracao === "20-25"
            ? "1:30 - 20:00"
            : "1:30 - 25:00",
    cta:
      formData.duracao === "5-8"
        ? "6:00 - 8:00"
        : formData.duracao === "12-15"
          ? "12:00 - 15:00"
          : formData.duracao === "20-25"
            ? "20:00 - 25:00"
            : "25:00 - 30:00",
    total: formData.duracao,
  };

  const ctasPositions = [
    "CTA Suave aos 3:00 - 'Continue assistindo para descobrir...'",
    `CTA Principal aos ${formData.duracao === "5-8" ? "6:00" : formData.duracao === "12-15" ? "12:00" : "20:00"} - CTA final completo`,
    ...(formData.elementos.includes("urgencia")
      ? ["CTA de Urgência - Enfatizar prazo"]
      : []),
    ...(formData.elementos.includes("escassez")
      ? ["CTA de Escassez - Enfatizar vagas limitadas"]
      : []),
  ];

  // Convert script to teleprompter format (uppercase, shorter lines)
  const teleprompter = script
    .toUpperCase()
    .replace(/\n\n/g, "\n")
    .replace(/### /g, "")
    .replace(/## /g, "")
    .replace(/# /g, "")
    .replace(/\*\*/g, "")
    .split("\n")
    .filter(line => line.trim())
    .map(line =>
      line.length > 60 ? line.match(/.{1,60}(\s|$)/g)?.join("\n") || line : line
    )
    .join("\n");

  return {
    script,
    slides,
    tempoEstimado,
    ctasPositions,
    teleprompter,
  };
}

export async function POST(request: NextRequest) {
  try {
    const formData: VSLRequest = await request.json();

    // Validate required fields
    if (
      !formData.tipo ||
      !formData.duracao ||
      !formData.abordagem ||
      !formData.cta
    ) {
      return NextResponse.json(
        { error: "Todos os campos obrigatórios devem ser preenchidos" },
        { status: 400 }
      );
    }

    // Generate VSL with AI
    const vslResult = await generateVSLWithAI(formData);

    return NextResponse.json({
      success: true,
      data: vslResult,
    });
  } catch (error) {
    console.error("Error generating VSL:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor. Tente novamente." },
      { status: 500 }
    );
  }
}
