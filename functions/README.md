# PeakOS Cloud Functions

Este diretório contém as Cloud Functions do Firebase para o PeakOS.

## Instalação

1. Instale as dependências:
```bash
cd functions
npm install
```

2. Configure a chave secreta JWT no Firebase Console:
   - Acesse [https://console.firebase.google.com/](https://console.firebase.google.com/)
   - Selecione o projeto **mygym-ebc54**
   - Vá em **Project Settings** → **Functions** → **Environment variables**
   - Adicione a variável `jwt.secret` com um valor seguro

## Deploy

Para fazer deploy das Cloud Functions:

```bash
firebase deploy --only functions
```

## Funções Disponíveis

### JWT Utilities

- `generateToken`: Gera um token JWT para o usuário autenticado
- `validateToken`: Valida um token JWT

### User Management

- `createUser`: Cria um novo usuário com email e senha
- `updateUserProfile`: Atualiza o perfil do usuário

### Feature Management

- `activateFeature`: Ativa uma feature para o usuário
- `deactivateFeature`: Desativa uma feature para o usuário

### Data Aggregation

- `generateReport`: Gera relatório de progresso do usuário

## Teste Local

Para testar as funções localmente:

```bash
firebase emulators:start
```

## Integração com Frontend

As funções podem ser chamadas do frontend usando:

```javascript
const generateToken = firebase.functions().httpsCallable('generateToken');
const result = await generateToken();
```
