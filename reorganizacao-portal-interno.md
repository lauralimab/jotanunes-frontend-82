# Reorganização do Portal Interno

## Objetivo e referência

Este documento registra a reorganização realizada em `apps/internal`, tomando o código atual do Portal Externo (`apps/external`) como fonte de verdade para a organização dos arquivos.

Antes das alterações, foram analisados a estrutura dos dois portais, seus arquivos de entrada, navegação, layouts, páginas, componentes, dados simulados e configurações. O documento `estrutura-frontend-jotanunes.md`, fornecido como contexto, auxiliou na compreensão da divisão dos portais. Suas sugestões de arquitetura e funcionalidades não foram implementadas automaticamente.

O trabalho ficou restrito à organização do código existente. Não foram implementadas funcionalidades, integrações ou regras de negócio novas.

## Situação encontrada

O Portal Externo já utilizava:

- `app/` para providers, roteamento e layouts;
- `pages/<área>/<Página>/index.tsx` para páginas;
- `components/` dentro da página para componentes exclusivos dela;
- `shared/components/` para componentes utilizados em diferentes partes do portal;
- `shared/mocks/` e `shared/types/` para dados simulados e tipos compartilhados.

No Portal Interno, o `src/App.tsx` concentrava as 12 telas efetivamente utilizadas, a navegação por estado, o menu, a moldura visual, componentes auxiliares, tipos e mocks.

Também existia uma estrutura anterior com `routes/AppRoutes.tsx`, `layouts/InternalLayout.tsx` e três páginas simples. Essa estrutura não era utilizada pelo `App.tsx` executado pela aplicação. Ela foi preservada e reorganizada, sem ser ativada.

## 1. Entrada da aplicação e configuração

Todos os caminhos nas próximas seções são relativos a `apps/internal/src/`, salvo indicação contrária.

| Arquivo | Alteração | Motivo |
| --- | --- | --- |
| `App.tsx` | Passou a renderizar somente `AppRouter`. Seus componentes, telas, mocks, tipos e controle de navegação foram distribuídos nos arquivos descritos abaixo. | Retirar do arquivo de entrada responsabilidades que o Externo já separa em `app/`, `pages/` e `shared/`. |
| `main.tsx` | Substituiu o uso direto de `BrowserRouter` por `AppProviders`, mantendo `StrictMode`, `App` e a importação do CSS. | Seguir o ponto de composição de providers utilizado pelo Externo. |
| `app/providers.tsx` | Recebeu o `BrowserRouter` que já envolvia a aplicação em `main.tsx`. | Centralizar o provider existente, sem acrescentar autenticação ou outros providers. |
| `app/router.tsx` | Recebeu o estado `screen`, o estado do menu móvel, os callbacks de entrada, saída e navegação e o `switch` de seleção das telas. | Centralizar a escolha das páginas e a composição com o layout. |

Apesar do nome `router.tsx`, a navegação ativa do Interno continua baseada no estado `screen`. Não houve conversão para URLs ou criação de novas rotas.

## 2. Layout e menu

| Destino | Origem e responsabilidade |
| --- | --- |
| `app/layouts/PortalLayout.tsx` | Extraído da estrutura visual retornada pelo antigo `App.tsx`: contêiner principal, menu lateral, área de conteúdo e barra móvel. Recebe a página por `children` e os callbacks por props. |
| `app/layouts/Sidebar.tsx` | Extraído do componente `Sidebar` do antigo `App.tsx`. Mantém os grupos, rótulos, ícones, seleção de tela, fechamento do menu e ação de saída. |

As cores, dimensões, classes CSS, informações exibidas e ações do menu foram preservadas. Não foram copiados recursos visuais do Externo, como o recolhimento da barra lateral.

## 3. Telas extraídas de App.tsx

Cada tela passou a ter uma pasta por área e um `index.tsx`, conforme o padrão encontrado no Externo. Os nomes dos componentes de página foram adequados a essa organização; os identificadores de navegação existentes permaneceram iguais.

| Componente anterior | Componente atual | Novo arquivo | Identificador de navegação preservado |
| --- | --- | --- | --- |
| `LoginScreen` | `LoginPage` | `pages/auth/Login/index.tsx` | `login` |
| `AdminDashboard` | `InicioPage` | `pages/inicio/Inicio/index.tsx` | `admin-dashboard` |
| `AdminSuppliers` | `EmpresasPage` | `pages/empresas/Empresas/index.tsx` | `admin-suppliers` |
| `SupplierDetails` | `EmpresaDetalhePage` | `pages/empresas/EmpresaDetalhe/index.tsx` | `supplier-details` |
| `DocumentAnalysis` | `AvaliarDocumentoPage` | `pages/documentos/AvaliarDocumento/index.tsx` | `document-analysis` |
| `Expirations` | `VencimentosPage` | `pages/documentos/Vencimentos/index.tsx` | `expirations` |
| `Boletim` | `BoletimPage` | `pages/documentos/Boletim/index.tsx` | `boletim` |
| `AutorizacaoExcepcional` | `AutorizacaoExcepcionalPage` | `pages/autorizacoes/AutorizacaoExcepcional/index.tsx` | `autorizacao-excepcional` |
| `RecebimentoMaterial` | `RecebimentoMaterialPage` | `pages/materiais/RecebimentoMaterial/index.tsx` | `recebimento-material` |
| `Notifications` | `NotificacoesPage` | `pages/sistema/Notificacoes/index.tsx` | `notifications` |
| `History` | `HistoricoPage` | `pages/sistema/Historico/index.tsx` | `history` |
| `Requisitos` | `RequisitosPage` | `pages/sistema/Requisitos/index.tsx` | `requisitos` |

Os imports e exports foram ajustados para conectar esses arquivos. Não foram criadas páginas adicionais a partir de sugestões do documento de estrutura.

## 4. Componentes exclusivos de páginas

Os trechos abaixo já existiam nas telas e foram separados em componentes locais. A separação segue exemplos presentes no Externo, como o formulário de login, os cards da página inicial, a tabela de trabalhadores e os modais de páginas.

| Arquivo extraído | Conteúdo e estado preservados |
| --- | --- |
| `pages/auth/Login/components/LoginBrandPanel.tsx` | Painel institucional do login, incluindo marca, textos e indicadores. |
| `pages/auth/Login/components/LoginForm.tsx` | Formulário e recuperação de senha exibida dentro do login. Os estados `forgot`, `email` e `pass` acompanham o formulário; o callback `onLogin` continua vindo da página. |
| `pages/inicio/Inicio/components/EstatisticasCards.tsx` | Array de estatísticas e grade de cards administrativos, com os mesmos valores e estilos. |
| `pages/inicio/Inicio/components/DocumentosRecentesCard.tsx` | Tabela de documentos aguardando análise, mantendo a filtragem dos mocks e os destinos de navegação. |
| `pages/empresas/Empresas/components/EmpresasTable.tsx` | Tabela de fornecedores e seus filtros. Os estados de busca, status e unidade e a expressão de filtragem foram movidos junto com a tabela. |
| `pages/documentos/AvaliarDocumento/components/SolicitarCorrecaoModal.tsx` | Marcação do modal de correção. Valores e setters continuam pertencendo à página e são recebidos por props. |
| `pages/documentos/AvaliarDocumento/components/ReprovarDocumentoModal.tsx` | Marcação do modal de reprovação, confirmação e ações. A página mantém os estados e fornece os setters por props. |
| `pages/sistema/Requisitos/components/RFStatusBadge.tsx` | Componente `RFStatusBadge` que já existia em `App.tsx`, utilizado apenas pela página de requisitos. |

A constante `FUNCTIONAL_REQS` foi mantida junto à página de requisitos, em `pages/sistema/Requisitos/index.tsx`.

Os demais trechos das páginas permaneceram em seus arquivos quando uma separação adicional não era necessária para esta adequação. Não foram criados hooks, serviços ou abstrações novos.

## 5. Componentes compartilhados

Os cinco componentes abaixo foram extraídos do antigo `App.tsx` para os mesmos locais usados pelo Externo:

| Arquivo | Responsabilidade preservada |
| --- | --- |
| `shared/components/BrandLogo.tsx` | Renderização da marca e escolha entre as duas imagens existentes. |
| `shared/components/Header.tsx` | Título, subtítulo e ações do cabeçalho. |
| `shared/components/Icon.tsx` | Catálogo de ícones SVG e ícone de fallback. |
| `shared/components/PageWrapper.tsx` | Contêiner de conteúdo com o espaçamento e a largura existentes no Interno. |
| `shared/components/StatusBadge.tsx` | Classes, textos, cores e indicadores de status já existentes. |

Foram acrescentados exports e imports necessários à extração. Os componentes mantêm a implementação visual do Interno; não foram substituídos pelas versões do Externo.

Os imports das imagens em `BrandLogo.tsx` passaram a apontar, por caminhos relativos, para `src/imports/logo.png` e `src/imports/logo-1.png`. As imagens não foram movidas nem modificadas.

## 6. Mocks e tipos compartilhados

### Dados simulados

As oito coleções antes declaradas em `App.tsx` foram movidas para `shared/mocks/portal.ts`, com exports para seus consumidores:

- `MOCK_SUPPLIERS`;
- `MOCK_DOCUMENTS`;
- `MOCK_EMPLOYEES`;
- `MOCK_NOTIFICATIONS`;
- `MOCK_HISTORY`;
- `MOCK_BOLETINS`;
- `MOCK_AUTORIZACOES`;
- `MOCK_MATERIAIS`.

Os registros, valores, datas e status foram preservados. Não houve substituição dos mocks por chamadas HTTP.

### Tipos

Os tipos existentes `Screen`, `DocStatus` e `SupplierStatus` foram extraídos para `shared/types/portal.ts` e exportados. Seus consumidores passaram a utilizar imports de tipo. Não foram alterados seus valores possíveis.

## 7. Arquivos anteriores movidos integralmente

Os cinco arquivos desta tabela já existiam separadamente. Diferentemente das extrações de `App.tsx`, eles foram movidos de suas localizações anteriores.

| Origem | Destino | Ajustes de conteúdo |
| --- | --- | --- |
| `routes/AppRoutes.tsx` | `app/AppRoutes.tsx` | Somente caminhos dos imports do layout e das três páginas. |
| `layouts/InternalLayout.tsx` | `app/layouts/InternalLayout.tsx` | Nenhum. |
| `pages/DashboardPage.tsx` | `pages/inicio/Dashboard/index.tsx` | Nenhum. |
| `pages/CompaniesPage.tsx` | `pages/empresas/Companies/index.tsx` | Nenhum. |
| `pages/NotFoundPage.tsx` | `pages/erros/NaoEncontrado/index.tsx` | Nenhum. |

As antigas pastas `src/routes/` e `src/layouts/` ficaram vazias após as movimentações e foram removidas.

A estrutura anterior continua desconectada da aplicação ativa. Suas definições de `/`, `/dashboard`, `/companies` e fallback foram preservadas, sem passar a controlar a navegação atual.

As páginas `inicio/Dashboard` e `empresas/Companies` mantêm os componentes anteriores `DashboardPage` e `CompaniesPage`. Elas não substituem as páginas ativas `inicio/Inicio` e `empresas/Empresas`. Essa distinção preserva os arquivos anteriores sem misturá-los às telas utilizadas.

## 8. Ajustes decorrentes da reorganização

Além das movimentações e extrações descritas, foram necessários:

- imports das páginas no novo `app/router.tsx`;
- imports dos componentes compartilhados e locais nos respectivos consumidores;
- exports dos componentes, mocks e tipos extraídos;
- props para transmitir os valores e callbacks antes acessados dentro de `App.tsx` ou da própria página;
- ajuste de `main.tsx` para usar `AppProviders`;
- ajuste de `App.tsx` para delegar a composição a `AppRouter`;
- atualização exclusiva dos caminhos de importação no antigo `AppRoutes.tsx`;
- remoção de linhas vazias deixadas pela extração em três páginas.

`main.tsx` recebeu somente o ajuste necessário para conectar os providers. Dos arquivos movidos integralmente, apenas `app/AppRoutes.tsx` teve conteúdo ajustado, exclusivamente nos imports. Os demais arquivos novos representam código extraído e as conexões necessárias para utilizá-lo.

## 9. Diferenças mantidas propositalmente

### Navegação

O Externo utiliza rotas por URL para as páginas ativas. O Interno continua selecionando telas por estado. Converter esse mecanismo alteraria o comportamento e ultrapassaria a reorganização solicitada.

### Autenticação e recuperação de senha

O Interno mantém o login simulado e a recuperação de senha como alternância dentro do formulário. Não foram copiados o contexto de autenticação, a restauração de sessão, os tokens, as chamadas de API ou as proteções de rota do Externo. Também não foi criado um `AuthProvider` vazio com base no documento de contexto.

### Funcionalidades específicas do Interno

Vencimentos, boletins, autorizações excepcionais, recebimento de materiais, notificações, histórico e requisitos mantêm seus conteúdos e comportamentos. A ausência de uma tela equivalente no Externo não motivou uma solução nova.

### Aparência

Foram preservados o CSS, a marcação renderizada, os textos, os ícones, as cores e as particularidades do layout interno. O trabalho seguiu a organização de arquivos do Externo sem tentar igualar visualmente os portais.

### Estrutura anterior

O layout com `Outlet`, as três páginas simples e o antigo `AppRoutes` foram mantidos sem uso, como já estavam. Sua remoção ou ativação não fazia parte do escopo.

## 10. Arquivos e áreas preservados

Não foram alterados:

- os arquivos do Portal Externo, em `apps/external/`;
- `apps/internal/src/index.css`;
- imagens e arquivos públicos dos portais;
- configurações de Vite, TypeScript e ESLint;
- arquivos de ambiente;
- dependências, scripts de pacote e `package-lock.json`;
- regras de negócio, dados simulados, validações existentes e ações das telas.

Não foram criados pacotes compartilhados entre os portais, estruturas de API ou novas dependências.

## 11. Validações realizadas

| Verificação | Resultado |
| --- | --- |
| `npm run build:internal` antes da reorganização | Aprovado; registrou a condição inicial. |
| `npm run build:internal` após a reorganização | Aprovado; TypeScript e empacotamento concluídos. |
| `npm run lint --workspace=internal` | Aprovado antes e após as etapas de reorganização. |
| Comparação programática de 25 cenários de renderização | O HTML produzido coincidiu com a implementação anterior. Incluiu as 12 telas, menu móvel, recuperação de senha, filtros, modais, aprovação/reprovação, aba de Petrolina e filtro de requisitos. |
| Comparação programática de 28 interações sequenciais | A árvore de elementos e os efeitos de estado coincidiram com a implementação anterior. Incluiu entrada e saída, filtros, navegação, correção/reprovação, notificações, abas e reinicialização de estado ao sair da página. |
| Conferência dos quatro arquivos movidos sem edição | Conteúdo preservado, considerando a normalização de quebras de linha entre Git e Windows. |
| Conferência do antigo `AppRoutes.tsx` | Somente os caminhos dos imports foram alterados. |
| Revisão de imports | Nenhuma página passou a importar arquivos de outra página. |
| `git diff --check` e revisão dos arquivos TypeScript | Sem erros de whitespace nas verificações finais. |
| Conferência do Externo, estilos e dependências | Sem alterações nessas áreas. |

As comparações de renderização e interação foram executadas por scripts temporários em memória, usando a versão anterior de `App.tsx` disponível no Git como referência. Esses scripts não foram adicionados ao repositório e não constituem testes automatizados permanentes nem testes de ponta a ponta em navegador.

O build apresentou o aviso preexistente do Vite relacionado a `__dirname` em `vite.config.ts`. Essa configuração foi mantida por não fazer parte da reorganização.

## Resultado

O Portal Interno passou a seguir a divisão de responsabilidades e a organização por páginas já presentes no Portal Externo. As diferenças de navegação, autenticação, aparência e funcionalidades específicas foram preservadas para limitar o impacto da mudança.

Nenhuma funcionalidade foi adicionada ou removida e nenhuma regra de negócio ou comportamento existente foi alterado intencionalmente. As verificações executadas confirmaram a equivalência nos cenários descritos acima.
