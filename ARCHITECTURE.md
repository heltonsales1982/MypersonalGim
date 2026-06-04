# PeakOS - Arquitetura da Solução

## Visão Geral

PeakOS é uma aplicação fitness baseada em IA que combina músculos, cardio, análise corporal e coaching inteligente. A arquitetura é dividida em duas camadas principais: Frontend (atual em HTML, migrando para React) e Backend (Firebase + APIs externas).

## Arquitetura de Alto Nível

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND                                │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  │
│  │   HTML/Vanilla │  │   React + Vite  │  │   Mobile App    │  │
│  │   (Atual)      │  │   (Futuro)      │  │   (Nativo)      │  │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      BACKEND (Firebase)                          │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  │
│  │  Realtime DB    │  │  Cloud Functions│  │  Authentication│  │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     SERVIÇOS EXTERNOS                            │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  │
│  │  Anthropic API  │  │  Apple Health   │  │  Garmin Connect │  │
│  │  (IA Coach)     │  │  (HealthKit)    │  │  (OAuth 2.0)    │  │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘  │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  │
│  │  Google Fit     │  │  Stripe         │  │  Google Maps    │  │
│  │  (OAuth 2.0)    │  │  (Pagamentos)    │  │  (Geolocalização)│  │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## Frontend

### 1. HTML/Vanilla (Atual)

**Localização:** `/gymai/index.html`

**Componentes:**
- Sistema de autenticação baseado em tokens
- Dashboard com check-in de treino
- Log de treino rápido (estilo Hevy)
- Treinos personalizados por objetivo
- Scanner corporal com IA
- Metas inteligentes
- Performance score
- Relatórios de progresso
- IA Coach (chat)
- Perfil do usuário
- Portal de administração

**Tecnologias:**
- HTML5
- CSS3 (variáveis CSS para temas)
- JavaScript (Vanilla)
- Firebase SDK (v9)
- Google Maps API

### 2. React + Vite (Futuro)

**Localização:** `/peakos-react/`

**Estrutura de pastas:**
```
peakos-react/
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.jsx
│   │   │   ├── Navigation.jsx
│   │   │   └── AppRouter.jsx
│   │   └── ui/
│   │       ├── Button.jsx
│   │       ├── Card.jsx
│   │       └── Input.jsx
│   ├── pages/
│   │   ├── LoginPage.jsx
│   │   ├── HomePage.jsx
│   │   ├── TrainingPage.jsx
│   │   ├── EvolutionPage.jsx
│   │   ├── AIPage.jsx
│   │   ├── ProfilePage.jsx
│   │   └── AdminPage.jsx
│   ├── services/
│   │   ├── authService.js
│   │   ├── trainingService.js
│   │   ├── profileService.js
│   │   ├── bodyScannerService.js
│   │   ├── reportService.js
│   │   ├── healthService.js
│   │   ├── paymentService.js
│   │   ├── performanceService.js
│   │   ├── timelineService.js
│   │   └── rewardsService.js
│   ├── context/
│   │   ├── ThemeContext.jsx
│   │   ├── AuthContext.jsx
│   │   └── FirebaseContext.jsx
│   ├── config/
│   │   └── firebase.config.js
│   ├── constants/
│   │   └── trainingConstants.js
│   ├── utils/
│   │   └── cn.js
│   ├── styles/
│   │   └── index.css
│   ├── App.jsx
│   └── main.jsx
├── package.json
├── vite.config.js
├── tailwind.config.js
└── index.html
```

**Tecnologias:**
- React 18
- Vite (build tool)
- Tailwind CSS (estilização)
- React Router (roteamento)
- Firebase SDK (v9)
- Context API (estado global)

## Backend (Firebase)

### 1. Firebase Realtime Database

**Estrutura de dados:**
```
gymai/
├── gymai_tokens/                    # Tokens de acesso
│   └── {email}/
│       ├── nome
│       ├── validade
│       ├── features[]
│       ├── plan
│       └── planExpiresAt
├── gymai_admin_tokens/              # Tokens administrativos
├── gymai_features/                  # Controle de features
│   └── {tokenKey}/
├── gymai_requests/                  # Solicitações de acesso
├── gymai_log/                       # Log de treinos
│   └── {tokenKey}/
│       └── {logId}/
│           ├── data
│           ├── exercicios[]
│           └── timestamp
├── gymai_profile/                   # Perfil do usuário
│   └── {tokenKey}/
├── gymai_medidas/                   # Medidas corporais
│   └── {tokenKey}/
├── gymai_metas/                     # Metas diárias
│   └── {tokenKey}/
├── gymai_treinos/                   # Treinos personalizados
│   └── {tokenKey}/
├── gymai_dietas/                    # Dietas
│   └── {tokenKey}/
├── gymai_jejum_sono/                # Jejum e sono
│   └── {tokenKey}/
├── gymai_chat_sessions/             # Sessões de chat com IA
├── gymai_purchases/                 # Compras
├── gymai_logins/                    # Logs de login/check-in
├── gymai_body_scanner/              # Análises corporais
│   └── {tokenKey}/
├── gymai_dias_treino/               # Check-in de dias
│   └── {tokenKey}/
│       └── {dia}/
├── gymai_fichas/                    # Fichas de treino
│   └── {tokenKey}/
├── gymai_relatorios/                # Relatórios de progresso
│   └── {tokenKey}/
├── gymai_payments/                  # Pagamentos
│   └── {tokenKey}/
├── gymai_performance/               # Performance score
│   └── {tokenKey}/
├── gymai_timeline/                  # Timeline corporal
│   └── {tokenKey}/
└── gymai_rewards/                   # Sistema de recompensas
    └── {tokenKey}/
```

### 2. Firebase Authentication

**Método atual:** Token-based (custom)
- Usuários autenticados via email/token
- Tokens gerados pelo admin
- Validade configurável

**Método futuro (opcional):** Firebase Auth
- Email/Password
- Google OAuth
- Apple OAuth

### 3. Firebase Cloud Functions

**Localização:** `/gymai/functions/index.js`

**Funções:**
- Validação de tokens
- Geração de JWT
- Processamento de pagamentos
- Notificações push (futuro)

## Serviços Externos

### 1. Anthropic API (Claude)

**Uso:** IA Coach e análise de dados

**Endpoints:**
- `POST https://api.anthropic.com/v1/messages`
- Model: `claude-3-opus-20240229`

**Casos de uso:**
- Geração de treinos personalizados
- Análise de fotos corporais
- Geração de metas inteligentes
- Chat de coaching
- Análise de dados de saúde

### 2. Apple Health (HealthKit)

**Integração:**
- Requer app nativa iOS
- Web API simulada para desenvolvimento
- Dados: passos, distância, calorias, frequência cardíaca, sono, peso

### 3. Garmin Connect API

**Autenticação:** OAuth 2.0
- Client ID configurado
- Redirect URI
- Scope: `read:all`

**Dados:** Atividades, métricas de saúde

### 4. Google Fit API

**Autenticação:** OAuth 2.0 com Google Identity Services
- Client ID configurado
- Scope: `fitness.activity.read`, `fitness.body.read`

**Dados:** Passos, atividades, métricas corporais

### 5. Stripe (Pagamentos)

**Planos:**
- Free (R$ 0)
- Pro (R$ 19.90/mês)
- Premium (R$ 49.90/mês)

**Funcionalidades:**
- Criação de payment intents
- Confirmação de pagamentos
- Gestão de assinaturas
- Histórico de transações

### 6. Google Maps API

**Uso:** Geolocalização de check-in
- Exibição de mapa
- Captura de coordenadas
- Visualização de localização

## Segurança

### Firebase Rules

**Princípios:**
- `.read: false` e `.write: false` por padrão
- Acesso baseado em tokenKey ou email
- Admin (heltonsales@icloud.com) tem acesso total
- Usuários podem ler/gravar seus próprios dados

**Exemplo de regra:**
```json
"gymai_log": {
  "$tokenKey": {
    ".read": "auth != null && (auth.token.email == $tokenKey || auth.token.email == 'heltonsales@icloud.com' || auth.token.admin == true)",
    ".write": "auth != null && (auth.token.email == $tokenKey || auth.token.email == 'heltonsales@icloud.com' || auth.token.admin == true)"
  }
}
```

### Autenticação

**Sistema atual:**
- Token-based custom
- Tokens gerados pelo admin
- Validade configurável
- Features controladas por token

**Sistema futuro (opcional):**
- Firebase Authentication
- OAuth providers (Google, Apple)
- JWT tokens

## Fluxos de Dados

### 1. Fluxo de Autenticação

```
Usuário → Email/Token → Firebase → Validação → Sessão → Frontend
```

### 2. Fluxo de Check-in

```
Usuário → Clicar dia → Geolocalização → Firebase (gymai_dias_treino) → Firebase (gymai_logins) → Popup de confirmação
```

### 3. Fluxo de Treino

```
Usuário → Selecionar objetivo → TREINOS_POR_OBJETIVO → Firebase (gymai_treinos) → Exibir treino
```

### 4. Fluxo de IA Coach

```
Usuário → Pergunta → Anthropic API → Resposta → Firebase (gymai_chat_sessions) → Exibir resposta
```

### 5. Fluxo de Scanner Corporal

```
Usuário → Upload fotos → Anthropic API → Análise → Firebase (gymai_body_scanner) → Exibir resultados
```

### 6. Fluxo de Pagamento

```
Usuário → Selecionar plano → Stripe → Payment Intent → Firebase (gymai_payments) → Atualizar plano → Firebase (gymai_tokens)
```

## Performance

### Otimizações

1. **Listeners em tempo real:** Firebase Realtime Database com `on('value')`
2. **Cache local:** Dados de sessão em localStorage
3. **Lazy loading:** Carregamento sob demanda de componentes
4. **Debounce:** Para inputs de busca e formulários

### Monitoramento

- Firebase Analytics (futuro)
- Firebase Performance Monitoring (futuro)
- Logs de erros no console

## Escalabilidade

### Horizontal Scaling

- Firebase Realtime Database escala automaticamente
- Cloud Functions escalam com demanda
- CDN para assets estáticos (GitHub Pages)

### Vertical Scaling

- Upgrade do plano Firebase
- Aumento de limites de API
- Otimização de queries

## Deploy

### Frontend

**Atual:** GitHub Pages (gymai)
**Futuro:** GitHub Pages (peakos-react)

### Backend

- Firebase Console
- Firebase CLI para deploy de regras e functions

### Variáveis de Ambiente

```env
VITE_ANTHROPIC_API_KEY=sk-ant-xxx
VITE_GARMIN_CLIENT_ID=xxx
VITE_GOOGLE_CLIENT_ID=xxx
VITE_STRIPE_PUBLIC_KEY=pk_xxx
```

## Roadmap

### Fase 1 (Concluída)
- ✅ Autenticação token-based
- ✅ Log de treino rápido
- ✅ Treinos personalizados
- ✅ IA Coach básico
- ✅ Performance score

### Fase 2 (Concluída)
- ✅ Scanner corporal com IA
- ✅ Metas inteligentes
- ✅ Dashboard de performance
- ✅ Sistema de fichas

### Fase 3 (Concluída)
- ✅ Integração Apple Health
- ✅ Integração Garmin
- ✅ Integração Google Fit
- ✅ Sistema de pagamentos

### Fase 4 (Concluída)
- ✅ Performance score detalhado
- ✅ Timeline corporal
- ✅ Sistema de recompensas

### Fase 5 (Em progresso)
- 🔄 Migrar para React + Vite
- ⏳ Configurar GitHub Pages
- ⏳ Testar aplicação completa

### Fase 6 (Futuro)
- ⏳ App nativo iOS/Android
- ⏳ Notificações push
- ⏳ Integração com wearables
- ⏳ Analytics avançado

## Tecnologias

### Frontend
- HTML5, CSS3, JavaScript (Vanilla)
- React 18, Vite, Tailwind CSS
- React Router, Context API

### Backend
- Firebase Realtime Database
- Firebase Authentication
- Firebase Cloud Functions
- Firebase Hosting

### APIs Externas
- Anthropic API (Claude)
- Apple HealthKit
- Garmin Connect API
- Google Fit API
- Stripe API
- Google Maps API

### Ferramentas
- Git, GitHub
- Firebase CLI
- npm/yarn
- VS Code

## Documentação

### Código
- Comentários inline
- JSDoc para funções
- README.md em cada módulo

### API
- Documentação de endpoints
- Exemplos de uso
- Tratamento de erros

### Arquitetura
- Este documento
- Diagramas de fluxo
- Modelos de dados

## Suporte e Manutenção

### Logs
- Console do navegador
- Firebase Console
- Cloud Functions logs

### Debug
- Firebase Emulator Suite
- Chrome DevTools
- React DevTools

### Backup
- Export automático do Firebase
- Backup do código no GitHub
- Backup de configurações

## Conclusão

A arquitetura do PeakOS foi projetada para ser escalável, segura e fácil de manter. A migração para React + Vite melhorará a experiência do desenvolvedor e a performance da aplicação, enquanto o Firebase continua sendo a base robusta para o backend e banco de dados.
