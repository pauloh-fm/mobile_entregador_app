# 📋 Padrão de Commits Semânticos

## 🎯 **Estrutura dos Commits**

```
<emoji> <tipo>(<escopo>): <descrição>

[corpo opcional]

[rodapé opcional]
```

## 📦 **Tipos de Commit**

### 🚀 **feat** - Novas funcionalidades
- **Emoji**: 🚀
- **Descrição**: Adição de nova funcionalidade para o usuário final
- **Exemplo**: `🚀 feat(delivery): adicionar timeline interativa de entrega`

### 🐛 **fix** - Correções de bugs
- **Emoji**: 🐛
- **Descrição**: Correção de bugs que afetam o usuário final
- **Exemplo**: `🐛 fix(toast): corrigir erro useInsertionEffect no componente Toast`

### 🎨 **style** - Melhorias visuais
- **Emoji**: 🎨
- **Descrição**: Mudanças de estilo, UI/UX, cores, tipografia
- **Exemplo**: `🎨 style(button): melhorar design do FloatingActionButton`

### ♻️ **refactor** - Refatoração de código
- **Emoji**: ♻️
- **Descrição**: Mudanças no código que não adicionam funcionalidade nem corrigem bugs
- **Exemplo**: `♻️ refactor(navigation): reorganizar estrutura de tabs`

### 📱 **ui** - Interface do usuário
- **Emoji**: 📱
- **Descrição**: Mudanças específicas na interface do usuário
- **Exemplo**: `📱 ui(tabs): implementar navegação com 3 tabs centralizadas`

### 🔧 **config** - Configurações
- **Emoji**: 🔧
- **Descrição**: Mudanças em arquivos de configuração
- **Exemplo**: `🔧 config(metro): adicionar metro.config.js para resolver módulos`

### 📚 **docs** - Documentação
- **Emoji**: 📚
- **Descrição**: Adição ou atualização de documentação
- **Exemplo**: `📚 docs(ajustes): criar documentação de melhorias UX/UI`

### ✨ **enhancement** - Melhorias
- **Emoji**: ✨
- **Descrição**: Melhorias em funcionalidades existentes
- **Exemplo**: `✨ enhancement(feedback): adicionar haptic feedback e toast notifications`

### 🗑️ **remove** - Remoção de código
- **Emoji**: 🗑️
- **Descrição**: Remoção de arquivos, código ou funcionalidades obsoletas
- **Exemplo**: `🗑️ remove(tabs): remover arquivos obsoletos das tabs`

### 🔄 **update** - Atualizações
- **Emoji**: 🔄
- **Descrição**: Atualizações de dependências ou versões
- **Exemplo**: `🔄 update(deps): instalar expo-haptics para feedback tátil`

### 🎭 **animation** - Animações
- **Emoji**: 🎭
- **Descrição**: Adição ou modificação de animações
- **Exemplo**: `🎭 animation(button): adicionar animação pulse no FloatingActionButton`

### 🛡️ **security** - Segurança
- **Emoji**: 🛡️
- **Descrição**: Melhorias de segurança
- **Exemplo**: `🛡️ security(auth): implementar validação de autenticação`

### ⚡ **perf** - Performance
- **Emoji**: ⚡
- **Descrição**: Melhorias de performance
- **Exemplo**: `⚡ perf(toast): otimizar re-renderizações com useCallback`

### 🧪 **test** - Testes
- **Emoji**: 🧪
- **Descrição**: Adição ou modificação de testes
- **Exemplo**: `🧪 test(delivery): adicionar testes para fluxo de entrega`

## 📋 **Escopos Principais**

- **delivery**: Funcionalidades relacionadas ao fluxo de entrega
- **navigation**: Sistema de navegação e tabs
- **ui**: Componentes de interface do usuário
- **auth**: Autenticação e autorização
- **toast**: Sistema de notificações toast
- **button**: Componentes de botões
- **timeline**: Componente de timeline
- **profile**: Tela e funcionalidades do perfil
- **config**: Arquivos de configuração
- **deps**: Dependências do projeto

## 🎯 **Diretrizes**

### ✅ **Boas Práticas**
- Use o presente imperativo ("adiciona" não "adicionado")
- Primeira linha com até 72 caracteres
- Corpo do commit opcional para explicações detalhadas
- Referencie issues quando aplicável
- Use emojis para melhor visualização

### ❌ **Evitar**
- Commits muito genéricos ("fix bug", "update")
- Misturar tipos diferentes em um commit
- Commits muito grandes com muitas mudanças
- Descrições vagas ou sem contexto

## 📝 **Exemplos Completos**

```bash
🚀 feat(delivery): implementar timeline interativa de 3 etapas

- Adicionar componente DeliveryTimeline
- Implementar navegação entre etapas (coleta, entrega, devolução)
- Adicionar estados visuais para cada etapa
- Incluir botões de "Pular" e "Voltar"

Resolves: #123
```

```bash
🐛 fix(toast): corrigir erro useInsertionEffect no componente

- Substituir React.useState por useState
- Adicionar useCallback para otimizar performance
- Implementar estado isVisible independente
- Melhorar cleanup de timers

Fixes: #456
```

```bash
🎨 style(navigation): implementar design minimalista com 3 tabs

- Remover tab de perfil da navegação inferior
- Centralizar FloatingActionButton
- Implementar proporção harmônica 33.33% por tab
- Mover perfil para header superior

```

## 🔄 **Workflow de Commits**

1. **Análise**: Identifique o tipo de mudança
2. **Escopo**: Determine o escopo afetado
3. **Descrição**: Escreva descrição clara e objetiva
4. **Review**: Revise antes de fazer commit
5. **Push**: Envie as mudanças

---

**Mantido por**: Equipe de Desenvolvimento  
**Última atualização**: Janeiro 2025 