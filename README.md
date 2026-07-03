# TalentBridge Frontend

Plataforma de recrutamento e seleção que conecta talentos às melhores oportunidades.

## Stack Tecnológica

| Tecnologia | Versão | Finalidade |
|---|---|---|
| Angular | 18+ (standalone) | SPA |
| PrimeNG | 17+ | Componentes de interface |
| PrimeFlex | 3+ | Layout e grid CSS |
| PrimeIcons | 7+ | Iconografia |
| RxJS | 7+ | Programação reativa |
| Chart.js | 4+ | Gráficos e dashboards |
| date-fns | 3+ | Manipulação de datas |

## Pré-requisitos

- Node.js 18.x ou 20.x
- npm 9+ ou yarn 1.22+
- Angular CLI 18+
- Git

## Instalação

```bash
# Clonar o repositório
git clone https://github.com/seu-usuario/talentbridge-frontend.git
cd talentbridge-frontend

# Instalar dependências
npm install --legacy-peer-deps

# Iniciar servidor de desenvolvimento
ng serve
```

Acesse `http://localhost:4200/` no navegador.

## Estrutura do Projeto

```
src/
├── app/
│   ├── core/                       # Serviços singleton, guards, interceptors
│   │   ├── guards/                 # AuthGuard, CandidatoGuard, EmpresaGuard, AdminGuard
│   │   ├── interceptors/           # Auth, Error, Loading
│   │   ├── services/               # Serviços globais (Token, Notification, etc.)
│   │   └── models/                 # DTOs e interfaces compartilhadas
│   ├── shared/                     # Componentes, pipes e diretivas reutilizáveis
│   │   ├── components/             # LoadingSpinner, Skeleton, EmptyState, etc.
│   │   ├── pipes/                  # Formatação CPF/CNPJ, Telefone, Data
│   │   └── directives/             # Diretiva de permissão
│   └── features/                   # Módulos carregados sob demanda (lazy)
│       ├── auth/                   # Login, Recuperação de senha
│       ├── candidato/              # Dashboard, Perfil, Big Five, Candidaturas
│       ├── empresa/                # Dashboard, Vagas, Candidaturas, Colaboradores
│       ├── admin/                  # Dashboard, Monitor, Convites, Parâmetros
│       └── landing-page/           # Páginas públicas de vagas
├── assets/                         # Imagens, ícones, fontes
├── environments/                   # Configurações por ambiente (dev/prod)
└── styles/                         # SCSS global e tema
```

## Autenticação

O sistema possui quatro perfis de acesso:

- **Candidato** — busca vagas, candidatura, teste comportamental
- **Recrutador** — gestão de vagas e candidaturas
- **Gestor de Empresa** — dashboard, vagas, relatórios, colaboradores
- **Administrador** — acesso total ao sistema

### Fluxo de Login

- Login com email e senha
- Suporte a multi-perfil (seleção após login)
- Suporte a multi-empresa (seleção após login)
- Refresh token automático via cookie httpOnly

## Comandos Disponíveis

```bash
# Desenvolvimento
ng serve                              # Servidor de desenvolvimento (porta 4200)
ng serve --open                       # Abre o navegador automaticamente

# Build
ng build                              # Build de desenvolvimento
ng build --configuration=production   # Build de produção

# Testes
ng test                               # Testes unitários (Jasmine/Karma)
ng e2e                                # Testes end-to-end (Cypress)

# Lint
ng lint                               # Verificação de código (ESLint)
ng lint --fix                         # Correção automática

# Geração de componentes
ng generate component features/nome-do-componente --standalone
```

## Deploy no Render

1. Crie uma conta no [Render](https://render.com)
2. Conecte seu repositório GitHub
3. Crie um **Static Site**
4. Configure:

| Configuração | Valor |
|---|---|
| **Build Command** | `npm install --legacy-peer-deps && npm run build --configuration=production` |
| **Publish Directory** | `dist/talentbridge-frontend/browser` |

### Variáveis de Ambiente

| Variável | Descrição |
|---|---|
| `API_URL` | URL do backend em produção |

### Redirect para SPA

Adicione uma regra de **rewrite** no Render para suportar rotas do Angular:

- **Source:** `/*`
- **Destination:** `/index.html`
- **Action:** Rewrite

## Temas e Customização

O tema é configurado através de variáveis CSS em `src/styles/styles.scss`:

```scss
:root {
  --primary-color: #3B82F6;
  --secondary-color: #10B981;
  --success-color: #22C55E;
  --warning-color: #F59E0B;
  --danger-color: #EF4444;
}
```

## Licença

Este projeto é proprietário. Todos os direitos reservados.
