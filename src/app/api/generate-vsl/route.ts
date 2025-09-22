import { NextRequest, NextResponse } from "next/server";

import { openai } from "@ai-sdk/openai";
import { convertToModelMessages, generateText } from "ai";

interface VSLRequest {
  tipo: string;
  duracao: string;
  abordagem: string;
  cta: string;
  elementos: string[];
  // Informações do projeto
  projectId?: string;
  projectData?: {
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
  };
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

// AI-powered VSL generation
async function generateVSLWithAI(formData: VSLRequest): Promise<VSLResponse> {
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

  const ctaLabels = {
    botao: "Botão na página",
    link: "Link na descrição",
    whatsapp: "WhatsApp",
    telefone: "Telefone",
  };

  // Construir informações do projeto para contextualização
  let projectContext = "";
  if (formData.projectData) {
    const { projectData } = formData;

    // Mapear modelo de negócio
    const modeloNegocioLabels = {
      infoproduto: "Infoprodutos/Cursos Online",
      ecommerce: "E-commerce/Loja Virtual",
      saas: "SaaS/Software",
      servicos: "Prestação de Serviços",
      afiliados: "Marketing de Afiliados",
      agencia: "Agência de Marketing",
    };

    // Mapear faixa de preço
    const faixaPrecoLabels = {
      "ate-100": "até R$ 100",
      "100-500": "R$ 100 a R$ 500",
      "500-1000": "R$ 500 a R$ 1.000",
      "1000-3000": "R$ 1.000 a R$ 3.000",
      "3000-plus": "acima de R$ 3.000",
    };

    projectContext = `
**CONTEXTO DO PROJETO/NEGÓCIO:**
- Nicho/Segmento: ${projectData.nicho}
- Modelo de Negócio: ${modeloNegocioLabels[projectData.modeloNegocio as keyof typeof modeloNegocioLabels] || projectData.modeloNegocio}
- Público-Alvo: ${projectData.publicoIdeal}
- Faixa de Preço: ${faixaPrecoLabels[projectData.faixaPreco as keyof typeof faixaPrecoLabels] || projectData.faixaPreco}
- Promessa Principal: ${projectData.promessaPrincipal}
- Diferenciais Competitivos: ${Array.isArray(projectData.diferencialCompetitivo) ? projectData.diferencialCompetitivo.join(", ") : projectData.diferencialCompetitivo}
- Nível Marketing Digital: ${projectData.nivelMarketingDigital}
- Faturamento Atual: ${projectData.faturamentoAtual}
- Principal Desafio: ${projectData.principalDesafio}

**IMPORTANTE:** Use essas informações para personalizar completamente a VSL, tornando-a específica para este negócio, nicho e público-alvo.`;
  }

  // Construir prompt dinâmico baseado nas respostas do formulário
  let prompt = `Você é um especialista em criação de VSLs (Video Sales Letters) de alta conversão. 

Crie um script completo e profissional de VSL baseado nas seguintes especificações:
${projectContext}

**CONFIGURAÇÕES DA VSL:**
- Tipo: ${tipoLabels[formData.tipo as keyof typeof tipoLabels]}
- Duração total: ${formData.duracao} minutos
- Abordagem principal: ${abordagemLabels[formData.abordagem as keyof typeof abordagemLabels]}
- Call-to-action: ${ctaLabels[formData.cta as keyof typeof ctaLabels]}
- Elementos incluídos: ${formData.elementos.map(el => elementosLabels[el as keyof typeof elementosLabels]).join(", ")}

**INSTRUÇÕES ESPECÍFICAS:**

1. **ESTRUTURA OBRIGATÓRIA:**
   - Introdução: 0:00 - 1:30 (gancho forte usando a abordagem ${abordagemLabels[formData.abordagem as keyof typeof abordagemLabels]})
   - Desenvolvimento: 1:30 até os últimos 2-3 minutos
   - Call-to-action final: últimos 2-3 minutos

2. **ABORDAGEM ESPECÍFICA:**`;

  // Adicionar instruções específicas por abordagem
  switch (formData.abordagem) {
    case "historia":
      prompt += `
   - Comece com uma história pessoal envolvente
   - Use storytelling para criar conexão emocional
   - Mostre a transformação pessoal`;
      break;
    case "dados":
      prompt += `
   - Apresente estatísticas impactantes logo no início
   - Use dados para estabelecer autoridade
   - Baseie argumentos em evidências concretas`;
      break;
    case "problema":
      prompt += `
   - Identifique e agite o problema principal
   - Mostre as consequências de não resolver
   - Crie urgência através da dor`;
      break;
    case "revelacao":
      prompt += `
   - Desperte curiosidade com uma revelação
   - Construa mistério e interesse
   - Revele segredos da indústria`;
      break;
  }

  // Adicionar instruções específicas baseadas no projeto
  if (formData.projectData) {
    prompt += `

3. **PERSONALIZAÇÃO BASEADA NO PROJETO:**
   - Adapte a linguagem para o nicho "${formData.projectData.nicho}"
   - Foque nos problemas específicos do público: "${formData.projectData.publicoIdeal}"
   - Enfatize a promessa principal: "${formData.projectData.promessaPrincipal}"
   - Destaque os diferenciais: ${Array.isArray(formData.projectData.diferencialCompetitivo) ? formData.projectData.diferencialCompetitivo.join(", ") : formData.projectData.diferencialCompetitivo}
   - Considere o nível de conhecimento do público (Marketing Digital: ${formData.projectData.nivelMarketingDigital})
   - Aborde o principal desafio: "${formData.projectData.principalDesafio}"
   - Justifique o investimento para a faixa de preço: ${formData.projectData.faixaPreco}

4. **ELEMENTOS OBRIGATÓRIOS A INCLUIR:**`;
  } else {
    prompt += `

3. **ELEMENTOS OBRIGATÓRIOS A INCLUIR:**`;
  }

  // Adicionar instruções específicas para cada elemento selecionado
  formData.elementos.forEach(elemento => {
    switch (elemento) {
      case "prova-social":
        prompt += `
   - Incluir 2-3 depoimentos específicos e detalhados
   - Mencionar resultados concretos e timeframes
   - Adicionar estatísticas de sucesso dos clientes`;
        break;
      case "urgencia":
        prompt += `
   - Criar senso de urgência com prazo limitado
   - Mencionar oferta especial com tempo determinado
   - Usar linguagem que incentive ação imediata`;
        break;
      case "escassez":
        prompt += `
   - Limitar número de vagas ou produtos disponíveis
   - Criar exclusividade na oferta
   - Mencionar quantidades específicas restantes`;
        break;
      case "bonus":
        prompt += `
   - Apresentar 3-4 bônus exclusivos com valores específicos
   - Detalhar cada bônus e seu benefício
   - Calcular valor total dos bônus`;
        break;
      case "garantia":
        prompt += `
   - Oferecer garantia robusta (30-90 dias)
   - Eliminar riscos da compra
   - Detalhar processo de reembolso`;
        break;
    }
  });

  const nextSectionNumber = formData.projectData ? 5 : 4;
  prompt += `

${nextSectionNumber}. **CALL-TO-ACTION ESPECÍFICO:**`;

  // Adicionar instruções específicas para o CTA escolhido
  switch (formData.cta) {
    case "botao":
      prompt += `
   - Direcionar para clicar no botão abaixo do vídeo
   - Explicar o que acontece após o clique
   - Criar urgência para a ação`;
      break;
    case "link":
      prompt += `
   - Mencionar link na descrição do vídeo
   - Instruir onde encontrar o link
   - Facilitar o acesso`;
      break;
    case "whatsapp":
      prompt += `
   - Solicitar mensagem no WhatsApp
   - Fornecer número específico (usar placeholder)
   - Explicar o que escrever na mensagem`;
      break;
    case "telefone":
      prompt += `
   - Solicitar ligação telefônica
   - Mencionar número na tela (usar placeholder)
   - Criar urgência para ligar agora`;
      break;
  }

  const formatSectionNumber = formData.projectData ? 6 : 5;
  const timingSectionNumber = formData.projectData ? 7 : 6;

  prompt += `

${formatSectionNumber}. **FORMATO DE SAÍDA:**
   - Retorne APENAS o script em markdown
   - Use títulos e subtítulos para organizar
   - Inclua marcações de tempo
   - Escreva como se fosse para ser falado diretamente
   - Use linguagem natural e persuasiva
   - Adapte o tom para o público brasileiro
   - Use "você" para se dirigir ao espectador

${timingSectionNumber}. **DURAÇÃO E TIMING:**
   - Respeite a duração total de ${formData.duracao} minutos
   - Distribua o conteúdo proporcionalmente
   - Inclua pausas naturais e transições
   - Mantenha ritmo adequado para conversão

Agora crie o script completo da VSL seguindo todas essas diretrizes.`;

  // Gerar script com IA
  const { text: aiGeneratedScript } = await generateText({
    model: openai("gpt-4o"),
    prompt: prompt,
  });

  // Gerar slides baseados na estrutura da VSL
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

  // Calcular tempos estimados baseados na duração escolhida
  const duracaoMinutos = parseInt(formData.duracao.split("-")[1]) || 8;
  const tempoEstimado = {
    introducao: "0:00 - 1:30",
    desenvolvimento: `1:30 - ${duracaoMinutos - 2}:00`,
    cta: `${duracaoMinutos - 2}:00 - ${duracaoMinutos}:00`,
    total: `${duracaoMinutos} minutos`,
  };

  // Gerar posições de CTAs baseadas na duração e elementos
  const ctasPositions = [
    "CTA Suave aos 3:00 - 'Continue assistindo para descobrir...'",
    `CTA Principal aos ${duracaoMinutos - 2}:00 - CTA final completo`,
    ...(formData.elementos.includes("urgencia")
      ? ["CTA de Urgência - Enfatizar prazo limitado"]
      : []),
    ...(formData.elementos.includes("escassez")
      ? ["CTA de Escassez - Enfatizar vagas limitadas"]
      : []),
  ];

  // Converter script para formato teleprompter (maiúsculo, linhas menores)
  const teleprompter = aiGeneratedScript
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
    script: aiGeneratedScript,
    slides,
    tempoEstimado,
    ctasPositions,
    teleprompter,
  };
}

export async function POST(request: NextRequest) {
  try {
    const formData: VSLRequest = await request.json();

    // Log received data for debugging
    console.log("📊 VSL Generation Request:");
    console.log("- Project ID:", formData.projectId);
    console.log("- Has Project Data:", !!formData.projectData);
    console.log("- Form Data:", {
      tipo: formData.tipo,
      duracao: formData.duracao,
      abordagem: formData.abordagem,
      cta: formData.cta,
      elementos: formData.elementos,
    });

    if (formData.projectData) {
      console.log("- Project Context:", {
        nicho: formData.projectData.nicho,
        modeloNegocio: formData.projectData.modeloNegocio,
        publicoIdeal: formData.projectData.publicoIdeal,
        promessaPrincipal: formData.projectData.promessaPrincipal,
      });
    }

    // Validate required fields
    if (
      !formData.tipo ||
      !formData.duracao ||
      !formData.abordagem ||
      !formData.cta
    ) {
      console.log("❌ Missing required fields");
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
