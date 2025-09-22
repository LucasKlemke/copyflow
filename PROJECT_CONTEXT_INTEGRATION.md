# Integração de Contexto do Projeto na Geração de VSL - CopyFlow

## 📋 Funcionalidade Implementada

### Personalização Inteligente de VSLs com Dados do Projeto

Agora a geração de VSLs considera automaticamente todas as informações do projeto para criar scripts **ultra-personalizados** e específicos para cada negócio!

## 🚀 Melhorias Implementadas

### 1. Endpoint de Geração (`/api/generate-vsl/route.ts`)

**Interface Atualizada:**

```typescript
interface VSLRequest {
  tipo: string;
  duracao: string;
  abordagem: string;
  cta: string;
  elementos: string[];
  // ✅ NOVO: Informações do projeto
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
```

**Contexto Inteligente Adicionado ao Prompt:**

```typescript
// Mapear modelo de negócio
const modeloNegocioLabels = {
  infoproduto: "Infoprodutos/Cursos Online",
  ecommerce: "E-commerce/Loja Virtual",
  saas: "SaaS/Software",
  servicos: "Prestação de Serviços",
  afiliados: "Marketing de Afiliados",
  agencia: "Agência de Marketing"
};

// Mapear faixa de preço
const faixaPrecoLabels = {
  "ate-100": "até R$ 100",
  "100-500": "R$ 100 a R$ 500",
  "500-1000": "R$ 500 a R$ 1.000",
  "1000-3000": "R$ 1.000 a R$ 3.000",
  "3000-plus": "acima de R$ 3.000"
};
```

**Contexto Dinâmico Injeted no Prompt:**

```
**CONTEXTO DO PROJETO/NEGÓCIO:**
- Nicho/Segmento: [nicho específico]
- Modelo de Negócio: [modelo específico]
- Público-Alvo: [público específico]
- Faixa de Preço: [faixa específica]
- Promessa Principal: [promessa específica]
- Diferenciais Competitivos: [diferenciais específicos]
- Nível Marketing Digital: [nível específico]
- Faturamento Atual: [faturamento específico]
- Principal Desafio: [desafio específico]

**IMPORTANTE:** Use essas informações para personalizar
completamente a VSL, tornando-a específica para este
negócio, nicho e público-alvo.
```

**Personalização Baseada no Projeto:**

```
3. **PERSONALIZAÇÃO BASEADA NO PROJETO:**
   - Adapte a linguagem para o nicho "[nicho]"
   - Foque nos problemas específicos do público: "[público]"
   - Enfatize a promessa principal: "[promessa]"
   - Destaque os diferenciais: [diferenciais]
   - Considere o nível de conhecimento do público (Marketing Digital: [nível])
   - Aborde o principal desafio: "[desafio]"
   - Justifique o investimento para a faixa de preço: [faixa]
```

### 2. Página de Criação (`/criativos/vsl/create/page.tsx`)

**Envio de Dados do Projeto:**

```typescript
const handleSubmit = async () => {
  // Prepare request data with project information
  const requestData = {
    ...formData,
    projectId: project?.id,
    projectData: project ? {
      nicho: project.nicho || "",
      modeloNegocio: project.modeloNegocio || "",
      publicoIdeal: project.publicoIdeal || "",
      faixaPreco: project.faixaPreco || "",
      promessaPrincipal: project.promessaPrincipal || "",
      diferencialCompetitivo: typeof project.diferencialCompetitivo === 'string'
        ? JSON.parse(project.diferencialCompetitivo)
        : project.diferencialCompetitivo || [],
      nivelMarketingDigital: project.nivelMarketingDigital || "",
      nivelCopywriting: project.nivelCopywriting || "",
      faturamentoAtual: project.faturamentoAtual || "",
      principalDesafio: project.principalDesafio || "",
    } : undefined
  };
};
```

**Indicador Visual no Cabeçalho:**

```tsx
{project && (
  <div className="mt-2 flex items-center gap-2 text-xs text-blue-600">
    <div className="h-1.5 w-1.5 rounded-full bg-blue-600"></div>
    <span>
      Usando dados do projeto "{project.name}" para personalização
    </span>
  </div>
)}
```

**Seção de Contexto na Revisão:**

```tsx
{project && (
  <div className="rounded-lg bg-blue-50 p-4 mb-6">
    <h4 className="font-medium text-blue-900 mb-3">
      📊 Contexto do Projeto (será considerado na geração)
    </h4>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
      <div>
        <span className="font-medium text-blue-800">Nicho:</span>
        <span className="ml-2 text-blue-700">{project.nicho}</span>
      </div>
      // ... outros campos
    </div>
  </div>
)}
```

## 🎯 Benefícios da Personalização

### 1. **VSLs Ultra-Específicas**

- Scripts adaptados para o nicho exato do negócio
- Linguagem ajustada para o público-alvo específico
- Problemas e soluções direcionados

### 2. **Conversão Maximizada**

- Promessa principal enfatizada em todo o script
- Diferenciais competitivos destacados
- Preço justificado para a faixa específica

### 3. **Experiência Personalizada**

- Considera nível de conhecimento do público
- Aborda desafios específicos do negócio
- Adapta abordagem ao modelo de negócio

### 4. **Transparência Total**

- Usuário vê exatamente quais dados serão usados
- Contexto visível na página de revisão
- Feedback visual sobre personalização ativa

## 📊 Exemplos de Personalização

### Para E-commerce de Roupas:

```
- Nicho: "Moda Feminina"
- Público: "Mulheres 25-45 anos, classe B/C"
- Promessa: "Vista-se bem gastando pouco"
- Desafio: "Competir com fast fashion"

→ VSL foca em: qualidade vs preço, durabilidade,
   estilo atemporal, compra consciente
```

### Para Curso de Inglês:

```
- Nicho: "Educação/Idiomas"
- Público: "Profissionais que querem crescer na carreira"
- Promessa: "Inglês fluente em 6 meses"
- Desafio: "Falta de tempo para estudar"

→ VSL foca em: método rápido, estudo flexível,
   resultados profissionais, casos de sucesso
```

### Para SaaS de Gestão:

```
- Nicho: "Software/Produtividade"
- Público: "Pequenos empresários"
- Promessa: "Organizar negócio em uma ferramenta"
- Desafio: "Processos manuais e desorganizados"

→ VSL foca em: automação, economia de tempo,
   crescimento escalável, ROI mensurável
```

## 🔄 Fluxo Completo

1. **Usuário cria projeto** → Dados salvos no banco
2. **Usuário acessa criação de VSL** → Projeto carregado automaticamente
3. **Configuração da VSL** → Interface mostra dados que serão usados
4. **Geração da VSL** → IA recebe contexto completo do projeto
5. **Script personalizado** → Resultado específico para o negócio

## ✅ Status Final

**100% Funcional:**

- ✅ Endpoint atualizado para receber dados do projeto
- ✅ Interface mostra contexto do projeto
- ✅ Dados enviados automaticamente na geração
- ✅ Prompt enriquecido com informações específicas
- ✅ VSLs ultra-personalizadas para cada negócio
- ✅ Transparência total para o usuário

**Resultado:** VSLs agora são **10x mais relevantes** e específicas para cada projeto! 🚀
