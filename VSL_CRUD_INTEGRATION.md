# CRUD de VSL Integrado com Prisma - CopyFlow

## 🎬 Sistema VSL Completo Implementado

### Funcionalidades Integradas

**CRUD Completo de VSLs:**

- ✅ **Create**: Criação de VSL com todos os parâmetros
- ✅ **Read**: Listagem e visualização de VSLs por projeto
- ✅ **Update**: Edição com auto-save em tempo real
- ✅ **Delete**: Exclusão de VSLs com confirmação

**Dados Salvos no Banco:**

- ✅ **Parâmetros de Criação**: tipo, duração, abordagem, CTA, elementos
- ✅ **Conteúdo**: script completo da VSL editável
- ✅ **Chat History**: histórico completo de conversas com IA
- ✅ **Metadados**: título, status, timestamps

## 📊 Schema Atualizado

### Tabela Creative (Expandida)

```sql
model Creative {
  id            String @id @default(cuid())
  title         String
  content       String?
  type          CreativeType
  status        CreativeStatus @default(DRAFT)

  -- Novos campos VSL --
  vslParameters String? -- JSON: {tipo, duracao, abordagem, cta, elementos[]}
  chatHistory   String? -- JSON: ChatMessage[]

  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  projectId     String
  project       Project @relation(...)
}
```

### Tipos TypeScript

```typescript
interface VSLFormData {
  tipo: string;        // "curta" | "media" | "longa"
  duracao: string;     // "5-8" | "12-15" | "20-25" | "30+"
  abordagem: string;   // "historia" | "dados" | "problema" | "revelacao"
  cta: string;         // "botao" | "link" | "whatsapp" | "telefone"
  elementos: string[]; // ["prova-social", "urgencia", "escassez", ...]
}

interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}
```

## 🛠️ APIs Criadas

### Criativos (Incluindo VSLs)

#### GET `/api/creatives`

```typescript
// Query params
?projectId=string&type=VSL

// Response
Creative[] // Array de VSLs com dados parseados
```

#### POST `/api/creatives`

```typescript
// Request
{
  title: string,
  content?: string,
  type: "VSL",
  projectId: string,
  vslParameters?: VSLFormData,
  chatHistory?: ChatMessage[],
  status?: "DRAFT" | "PUBLISHED" | "ARCHIVED"
}

// Response
Creative // VSL criada
```

#### GET `/api/creatives/[id]`

```typescript
// Response
{
  ...Creative,
  vslParameters: VSLFormData | null, // JSON parsed
  chatHistory: ChatMessage[] | null  // JSON parsed
}
```

#### PUT `/api/creatives/[id]`

```typescript
// Request (todos campos opcionais)
{
  title?: string,
  content?: string,
  status?: CreativeStatus,
  vslParameters?: VSLFormData,
  chatHistory?: ChatMessage[]
}
```

#### DELETE `/api/creatives/[id]`

```typescript
// Response
{ message: "Creative deleted successfully" }
```

## 📱 Páginas Implementadas

### 1. Criação de VSL: `/criativos/vsl/create`

**Funcionalidades:**

- ✅ Wizard de 6 etapas para configuração
- ✅ Campo de título da VSL
- ✅ Geração de script via IA
- ✅ Editor completo com chat IA
- ✅ Auto-save em tempo real
- ✅ Estatísticas em tempo real (palavras, duração, qualidade)
- ✅ Salvamento no banco com todos os dados

**Fluxo:**

```
1. Título da VSL → 2. Tipo → 3. Duração → 4. Abordagem
→ 5. CTA → 6. Elementos → 7. Revisão → 8. Geração
→ 9. Editor com Chat → 10. Auto-save
```

### 2. Listagem de VSLs: `/criativos/vsl`

**Funcionalidades:**

- ✅ Grid de VSLs por projeto
- ✅ Preview de conteúdo
- ✅ Tags com parâmetros VSL
- ✅ Status e datas de criação/atualização
- ✅ Dropdown menu com ações (Editar/Visualizar/Excluir)
- ✅ Estado vazio com call-to-action
- ✅ Loading states

## 🔄 Auto-Save Inteligente

### Quando Salva Automaticamente:

1. **Após geração**: Salva automaticamente se título preenchido
2. **Durante edição**: Auto-save a cada 3 segundos de inatividade
3. **Após melhoria IA**: Salva 2 segundos após aplicar sugestão
4. **Chat atualizado**: Inclui mensagens no auto-save

### Indicadores Visuais:

- 🟡 "Salvando..." (ponto amarelo piscando)
- 🟢 "Salvo automaticamente" (ponto verde)
- 🔴 "Não salvo" (ponto cinza)

## 📈 Estatísticas em Tempo Real

### Métricas Calculadas:

- **Palavras**: Contagem dinâmica
- **Duração estimada**: Com base em 140 palavras/min
- **Parágrafos**: Estrutura do conteúdo
- **CTAs detectados**: Identificação automática
- **Score de qualidade**: 0-100 baseado em estrutura
- **Caracteres**: Contagem total
- **Linhas**: Estrutura visual

### Feedback Visual:

- Barra de progresso colorida (verde/amarelo/laranja/vermelho)
- Feedback textual baseado no score
- Atualização em tempo real durante edição

## 🎯 Dados Demo Incluídos

### VSL Exemplo no Seed:

```javascript
{
  title: "VSL Produto Fitness Revolucionário",
  content: "Script completo com abertura, problema, solução e CTA",
  type: "VSL",
  vslParameters: {
    tipo: "media",
    duracao: "12-15",
    abordagem: "problema",
    cta: "botao",
    elementos: ["prova-social", "urgencia", "bonus"]
  },
  chatHistory: [
    // Mensagens demo do chat com IA
  ]
}
```

## 🚀 Como Testar

### 1. Popular Banco

```bash
npm run db:seed
```

### 2. Testar Criação

```
1. Login → Dashboard → "Nova VSL"
2. Preencher título: "Minha VSL Teste"
3. Configurar parâmetros do wizard
4. Gerar VSL → Editor abre automaticamente
5. Editar script → Auto-save funcionando
6. Chat com IA → Melhorias aplicadas
```

### 3. Testar Listagem

```
1. Navegar para /criativos/vsl
2. Ver VSL demo + VSLs criadas
3. Testar ações do dropdown
4. Verificar preview e metadados
```

### 4. Testar Banco de Dados

```bash
npm run db:studio
# Verificar tabela 'creatives'
# Ver dados JSON em vslParameters e chatHistory
```

## 🔧 Funcionalidades Avançadas

### Chat IA Integrado:

- ✅ Histórico persistido no banco
- ✅ Ações sugeridas (melhorar gancho, adicionar urgência, etc.)
- ✅ Aplicação automática de melhorias no script
- ✅ Interface fluida com auto-scroll

### Editor Avançado:

- ✅ Painel lateral escondível
- ✅ FAB com ações rápidas quando painel oculto
- ✅ Sintaxe highlighting para markdown
- ✅ Auto-complete inteligente
- ✅ Exportação de conteúdo

### Gestão de Estado:

- ✅ Sincronização tempo real entre editor/chat/banco
- ✅ Recuperação de sessão em caso de refresh
- ✅ Prevenção de perda de dados

## ✅ Status Final

**100% Implementado e Funcional:**

- ✅ Schema Prisma atualizado
- ✅ APIs CRUD completas
- ✅ Interface de criação avançada
- ✅ Sistema de listagem
- ✅ Auto-save inteligente
- ✅ Chat IA persistido
- ✅ Estatísticas em tempo real
- ✅ Dados demo populados

O sistema VSL está **completamente integrado** com o Prisma e pronto para uso em produção! 🎉
