# TalentBridge Frontend

Frontend da plataforma **TalentBridge (GoBee Jobs)** - conectando talentos às melhores oportunidades.

## 🚀 Stack Tecnológica

| Tecnologia | Versão | Uso |
|------------|--------|-----|
| **Angular** | 18+ (standalone) | Framework SPA |
| **PrimeNG** | 17+ | Componentes UI |
| **PrimeFlex** | 3+ | Layout CSS |
| **PrimeIcons** | 7+ | Ícones |
| **RxJS** | 7+ | Programação reativa |
| **Chart.js** | 4+ | Gráficos |
| **date-fns** | 3+ | Manipulação de datas |

## 📋 Pré-requisitos

- **Node.js** 18.x ou 20.x
- **npm** 9+ ou **yarn** 1.22+
- **Angular CLI** 18+
- **Git**

## 🔧 Instalação

```bash
# Clonar o repositório
git clone https://github.com/seu-usuario/talentbridge-frontend.git
cd talentbridge-frontend

# Instalar dependências
npm install --legacy-peer-deps

# Iniciar servidor de desenvolvimento
ng serve
Acesse http://localhost:4200/ no navegador.

🏗️ Estrutura do Projeto
text
src/
├── app/
│   ├── core/                    # Serviços singleton, guards, interceptors
│   │   ├── guards/              # AuthGuard, CandidatoGuard, EmpresaGuard, AdminGuard
│   │   ├── interceptors/        # Auth, Error, Loading
│   │   ├── services/            # Token, Notification, Loading, Dominio
│   │   └── models/              # DTOs e interfaces
│   ├── shared/                  # Componentes, pipes, directives reutilizáveis
│   │   ├── components/          # LoadingSpinner, Skeleton, EmptyState, etc.
│   │   ├── pipes/               # CPF/CNPJ, Telefone, Data
│   │   └── directives/          # Permissao
│   └── features/                # Módulos lazy-loading
│       ├── auth/                # Login, Forgot/Reset Password
│       ├── candidato/           # Dashboard, Perfil, Big Five, Candidaturas
│       ├── empresa/             # Dashboard, Vagas, Candidaturas, Créditos
│       ├── admin/               # Dashboard, Monitor, Convites, Parâmetros
│       └── landing-page/        # Páginas públicas de vagas
├── assets/                      # Imagens, ícones, fonts
├── environments/                # Configurações por ambiente
└── styles/                      # SCSS global e temas
🔑 Autenticação
O sistema suporta 4 perfis de acesso:

Candidato: Busca vagas, candidatura, teste comportamental

Recrutador: Gestão de vagas e candidaturas

Gestor de Empresa: Dashboard, vagas, relatórios, créditos

Administrador: Acesso total ao sistema

Fluxo de Login
Login com email/senha

Suporte a multi-perfil (seleção após login)

Suporte a multi-empresa (seleção após login)

Refresh token automático via cookie httpOnly

🛠️ Comandos Disponíveis
bash
# Desenvolvimento
ng serve                    # Servidor de desenvolvimento (porta 4200)
ng serve --open             # Abre navegador automaticamente

# Build
ng build                    # Build de desenvolvimento
ng build --configuration=production  # Build de produção

# Testes
ng test                     # Testes unitários (Jasmine/Karma)
ng e2e                      # Testes end-to-end (Cypress)

# Lint
ng lint                     # Verificação de código (ESLint)
ng lint --fix               # Correção automática

# Geração de componentes
ng generate component features/nome-do-componente --standalone
📦 Deploy no Render
Configuração
O projeto está configurado para deploy no Render.

Crie uma conta no Render

Conecte seu repositório GitHub

Crie um novo Static Site ou Web Service

Configure:

Build Command:

bash
npm install --legacy-peer-deps && npm run build --configuration=production
Publish Directory:

text
dist/talentbridge-frontend/browser
Adicione as variáveis de ambiente:

API_URL: URL do backend em produção

Redirect para SPA
Adicione uma regra de rewrite no Render para suportar rotas do Angular:

text
Source: /*
Destination: /index.html
Action: Rewrite
🎨 Temas e Customização
O tema é configurado através de variáveis CSS em src/styles/styles.scss:

scss
:root {
  --primary-color: #3B82F6;
  --secondary-color: #10B981;
  --success-color: #22C55E;
  --warning-color: #F59E0B;
  --danger-color: #EF4444;
  // ...
}
📄 Licença
Este projeto é proprietário. Todos os direitos reservados.