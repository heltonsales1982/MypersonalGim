# Gym AI PWA 🏋️

App de treino com IA integrada (Claude API) + sistema de acesso por QR code.

## Estrutura

```
gymai/
├── index.html     ← App principal (usuários)
├── admin.html     ← Seu painel de controle
└── manifest.json  ← PWA manifest
```

## Deploy no GitHub Pages

### 1. Criar repositório

```bash
git init
git add .
git commit -m "feat: Gym AI PWA v1.0.0"
gh repo create gymai --public
git push -u origin main
```

### 2. Ativar GitHub Pages

Settings → Pages → Source: **main branch / root**

Sua URL será: `https://SEU_USUARIO.github.io/gymai/`

### 3. Configurar no admin.html

Abra `admin.html` e altere linha:
```javascript
const ADMIN_PASSWORD = 'gymai@2024'; // TROQUE PARA SUA SENHA
```

### 4. Usar o sistema

**Você (admin):**
1. Acesse `https://SEU_USUARIO.github.io/gymai/admin.html`
2. Entre com sua senha de admin
3. Preencha nome do usuário, validade e limite de usos
4. Clique "Gerar QR Code"
5. Envie o QR ou o link para o usuário

**Usuário:**
1. Escaneia o QR code
2. Cria nome e senha
3. Acessa o app normalmente nas próximas vezes com a mesma senha

## Controle de acesso

| Parâmetro | Descrição |
|---|---|
| Validade | Número de dias até expirar |
| Limite de usos | Quantas vezes o link pode ser usado para criar conta |
| Renovar | Admin pode adicionar +30 dias a qualquer token |
| Revogar | Admin pode cancelar acesso imediatamente |

## Personalização

- **Senha admin**: `admin.html` linha `const ADMIN_PASSWORD`
- **Treinos padrão**: `index.html` objeto `FICHAS`
- **Exercícios do log**: `index.html` `<select id="log-ex">`
- **Cores**: variáveis CSS `:root` no início de cada arquivo

## Notas técnicas

- Os tokens ficam no `localStorage` do navegador admin
- Zero backend, zero custo de servidor
- O app do usuário lê os tokens do mesmo `localStorage`
- **Importante**: admin e usuário devem estar no mesmo domínio/dispositivo para validação funcionar
- Para validação cross-device, integre com Firebase Realtime Database (gratuito) — consulte o README avançado
