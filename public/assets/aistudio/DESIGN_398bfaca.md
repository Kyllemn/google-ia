---
name: Vértice
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#434655'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#737686'
  outline-variant: '#c3c6d7'
  surface-tint: '#0053db'
  primary: '#004ac6'
  on-primary: '#ffffff'
  primary-container: '#2563eb'
  on-primary-container: '#eeefff'
  inverse-primary: '#b4c5ff'
  secondary: '#3755c3'
  on-secondary: '#ffffff'
  secondary-container: '#708cfd'
  on-secondary-container: '#00217a'
  tertiary: '#943700'
  on-tertiary: '#ffffff'
  tertiary-container: '#bc4800'
  on-tertiary-container: '#ffede6'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dbe1ff'
  primary-fixed-dim: '#b4c5ff'
  on-primary-fixed: '#00174b'
  on-primary-fixed-variant: '#003ea8'
  secondary-fixed: '#dde1ff'
  secondary-fixed-dim: '#b8c4ff'
  on-secondary-fixed: '#001453'
  on-secondary-fixed-variant: '#173bab'
  tertiary-fixed: '#ffdbcd'
  tertiary-fixed-dim: '#ffb596'
  on-tertiary-fixed: '#360f00'
  on-tertiary-fixed-variant: '#7d2d00'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  headline-lg:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 30px
    letterSpacing: -0.015em
  headline-sm:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 26px
    letterSpacing: -0.01em
  title-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 22px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  label-lg:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.04em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1rem
  margin: 1.5rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Marca e Estilo

Este sistema de design foi concebido para uma plataforma de CRM B2B SaaS voltada a equipas comerciais, gestores de contas e operações de receita que exigem precisão, velocidade e confiabilidade no uso diário. A personalidade da marca é **analítica, transparente e segura**, transmitindo calma operacional mesmo perante grandes volumes de dados e funis complexos.

O estilo visual combina **Corporativo / Moderno** com **Minimalismo funcional**: superfícies claras e nítidas, hierarquia tipográfica rigorosa, bordas subtis de 1px para delimitação estrutural e acentos em azul cobalto que direcionam a atenção exclusivamente para ações primárias e estados críticos. A interface evita ornamentos decorativos, priorizando a legibilidade de tabelas densas, formulários estruturados e indicadores de estado semânticos.

## Cores

O sistema de design opera exclusivamente em **modo claro (light mode)**, utilizando superfícies em branco puro (`#FFFFFF`) para cartões, modais e tabelas sobre um fundo base em `slate-50` (`#F8FAFC`), garantindo contraste elevado e redução da fadiga visual em jornadas longas.

- **Primária (`#2563EB`):** Azul cobalto vibrante usado em botões de ação principal, links ativos, indicadores de foco e estados selecionados.
- **Secundária (`#1E40AF`):** Azul índigo profundo aplicado em estados de hover da ação primária, cabeçalhos de destaque e elementos de navegação ativa.
- **Neutra (`#64748B`):** Escala de cinza-ardósia (`slate`) para textos secundários, ícones de suporte e rótulos. Bordas estruturais utilizam `#E2E8F0` (`slate-200`) e o texto principal utiliza `#0F172A` (`slate-900`).
- **Cores Semânticas (Estados de CRM):**
  - **Ativo / Ganho:** Esmeralda (`#10B981` fundo suave `#ECFDF5`, texto `#065F46`).
  - **Pendente / Novo Lead:** Âmbar (`#F59E0B` fundo suave `#FFFBEB`, texto `#92400E`).
  - **Inativo / Arquivado:** Ardósia (`#64748B` fundo suave `#F1F5F9`, texto `#334155`).
  - **Erro / Perdido:** Vermelho (`#EF4444` fundo suave `#FEF2F2`, texto `#991B1B`).

## Tipografia

Este sistema de design adota **Inter** como família tipográfica única para títulos, corpo de texto e rótulos, garantindo máxima legibilidade em ecrãs de alta e média densidade e alinhamento numérico preciso (`tabular-nums`) em colunas financeiras, valores de negócios e métricas de funil.

- **Títulos (`headline-lg` a `headline-sm`):** Utilizam pesos `600` e `700` com `letter-spacing` ligeiramente negativo para compactar cabeçalhos de páginas e painéis de resumo.
- **Corpo (`body-lg` a `body-sm`):** `14px` (`body-md`) é o padrão para células de tabelas e campos de formulário, oferecendo equilíbrio entre densidade de informação e conforto de leitura.
- **Rótulos (`label-lg` a `label-sm`):** `label-sm` em caixa alta (`uppercase`) com `letter-spacing: 0.04em` é reservado para cabeçalhos de colunas de tabela e títulos de secções em formulários.

## Layout e Espaçamento

O sistema de design utiliza uma **grelha fluida de 12 colunas** com `gutter` de `16px` (`1rem`) e margens externas de `24px` (`1.5rem`) em desktop, adaptando-se para 8 colunas em tablet (`1024px`) e 4 colunas em mobile (`< 640px`) com margens reduzidas para `16px`.

- **Navegação Lateral + Área de Conteúdo:** A barra lateral fixa (`240px` expandida, `64px` recolhida) dá lugar a um menu gaveta em ecrãs menores que `1024px`.
- **Ritmo de Espaçamento:** Baseado em múltiplos de `4px` (`0.25rem`). O preenchimento interno de cartões e painéis de formulário utiliza `space-lg` (`24px`), enquanto o espaçamento entre campos de formulário e linhas de grelha utiliza `space-md` (`16px`).
- **Tabelas Densas:** Células de tabela utilizam preenchimento vertical compacto (`10px` a `12px`) e horizontal de `16px` (`space-md`), mantendo respiração visual sem sacrificar a quantidade de registos visíveis.

## Elevação e Profundidade

A hierarquia visual neste sistema de design é construída principalmente através de **contornos de baixo contraste (bordas subtis de 1px em `#E2E8F0`)** e **diferenciação tonal de superfícies** (`#F8FAFC` no fundo da aplicação vs. `#FFFFFF` nos cartões e tabelas).

- **Nível 0 (Base):** Fundo da aplicação (`#F8FAFC`), sem sombra.
- **Nível 1 (Superfícies Contidas):** Cartões, tabelas e painéis de formulário (`#FFFFFF`) delimitados por borda de `1px solid #E2E8F0`, sem sombra projetada.
- **Nível 2 (Elementos Flutuantes):** Menus suspensos (*dropdowns*), *popovers* e barras de ação flutuantes utilizam borda de `1px solid #E2E8F0` combinada com sombra ambiente difusa (`0 4px 12px -2px rgba(15, 23, 42, 0.08)`).
- **Nível 3 (Modais e Gavetas):** Diálogos críticos aplicam sombra mais pronunciada (`0 20px 25px -5px rgba(15, 23, 42, 0.1)`) sobre um *backdrop* escuro translúcido (`rgba(15, 23, 42, 0.4)`).

## Formas

Este sistema de design adota um nível de arredondamento **suave (`1`)**, equilibrando a seriedade corporativa com uma estética moderna e acessível:

- **Padrão (`0.25rem` / `4px`):** Aplicado a *checkboxes*, pequenos indicadores e botões compactos de tabela.
- **Médio (`0.5rem` / `8px` - `rounded-lg`):** Aplicado a botões principais, campos de entrada (*inputs*), cartões de métricas e contentores de tabela.
- **Grande (`0.75rem` / `12px` - `rounded-xl`):** Reservado para modais, painéis laterais e cartões de destaque.
- **Pílula (`9999px`):** Utilizado exclusivamente em *badges* de estado semântico (Ativo, Pendente, Inativo) para diferenciação imediata em relação aos botões de ação.

## Componentes

- **Botões:**
  - *Primário:* Fundo `#2563EB`, texto `#FFFFFF`, hover `#1E40AF`, altura `36px` (padrão) ou `32px` (compacto), raio `8px`.
  - *Secundário:* Fundo `#FFFFFF`, borda `1px solid #E2E8F0`, texto `#0F172A`, hover `#F8FAFC`.
  - *Fantasma (Ghost):* Fundo transparente, texto `#64748B`, hover `#F1F5F9` com texto `#0F172A`.
- **Badges de Estado (Chips):** Formato pílula com `label-md`, preenchimento `2px 10px` e ponto indicador opcional de `6px`. Seguem estritamente as cores semânticas (Esmeralda para Ativo, Âmbar para Pendente/Novo Lead, Ardósia para Inativo).
- **Campos de Entrada e Formulários Estruturados:** Altura de `38px`, fundo `#FFFFFF`, borda `1px solid #E2E8F0`, texto `#0F172A` e *placeholder* `#94A3B8`. O estado de foco aplica borda `#2563EB` com anel externo suave (`0 0 0 3px rgba(37, 99, 235, 0.15)`). Rótulos posicionados acima do campo (`label-md`, `#334155`) com espaçamento de `6px`.
- **Tabelas de Dados:** Cabeçalho fixo com fundo `#F8FAFC`, texto `label-sm` em caixa alta (`#64748B`) e borda inferior `1px solid #E2E8F0`. Linhas com altura mínima de `44px`, separadas por `1px solid #E2E8F0`, com estado *hover* em `#F8FAFC` e suporte a seleção múltipla via *checkbox* na primeira coluna.
- **Checkboxes e Radio Buttons:** Tamanho `16px × 16px`, borda `1.5px solid #CBD5E1`, preenchimento `#2563EB` quando selecionados com ícone branco nítido.
- **Cartões (Cards):** Fundo `#FFFFFF`, borda `1px solid #E2E8F0`, raio `8px`, preenchimento interno de `24px` (`space-lg`).