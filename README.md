# 📝 Micro CMS - Blog

Um micro CMS moderno e intuitivo para gerenciar blogs. Crie, edite e organize posts com artigos, imagens e muito mais!

## ✨ Características

- 🔐 **Autenticação Segura** - Login e registro com Next-Auth v5
- 📰 **Gerenciamento de Posts** - Crie e edite posts com banner e título
- 📄 **Artigos Dinâmicos** - Adicione múltiplos artigos por post com texto rico e imagens
- 🖼️ **Gestão de Imagens** - Upload de imagens via Cloudinary com suporte a drag-and-drop
- ✏️ **Editor de Texto Avançado** - Lexical Editor para formatação rica de conteúdo
- 🎯 **Reorganização com Drag-and-Drop** - Reordene artigos e imagens usando Swapy
- 📱 **Responsivo** - Interface totalmente adaptada para mobile, tablet e desktop
- 🔗 **API REST** - Endpoints públicos para integração com outras aplicações
- ⚙️ **Configurações de Conta** - Gerencie seu perfil, senha e chave de API

## 🚀 Quick Start

### Pré-requisitos

- Docker e Docker Compose instalados
- Git (opcional, para clonar o repositório)

### Instalação

1. **Clone o repositório**

```bash
git clone https://github.com/jhonVitor-rs/blog_cms.git
cd micro-cms-blog
```

2. **Inicie os containers**

```bash
docker-compose up
```

3. **Acesse a aplicação**

- Abra seu navegador e vá para `http://localhost:3000`

## 📖 Como Usar

### 1️⃣ Autenticação

#### Registrar

- Clique em "Criar Conta" na tela de login
- Preencha nome, email e senha
- A senha deve ter no mínimo 8 caracteres com letra maiúscula, minúscula e número

#### Login

- Use suas credenciais para acessar a aplicação

### 2️⃣ Gerenciamento de Posts

#### Criar Novo Post

1. Na página de Posts, clique no ícone `+`
2. Digite o título do post
3. Será redirecionado para a página de edição

#### Editar Post

- Na página de edição, você pode:
  - Alterar o **Título** do post
  - Fazer upload de um **Banner** (imagem de capa)
  - Adicionar, editar ou remover **Artigos**

#### Visualizar Posts

- A página de Posts exibe todos seus posts em um grid responsivo
- Cada card mostra o banner e título do post
- Clique em um post para editar ou visualizar seus artigos

### 3️⃣ Gerenciamento de Artigos

#### Adicionar Artigo

1. Na página de edição do post, clique em "Novo Artigo"
2. Preencha:
   - **Título** (opcional)
   - **Texto** (usando o Lexical Editor)
3. Clique em "Salvar"

#### Editor de Texto (Lexical)

- **Negrito, Itálico, Sublinhado** - Use os botões da toolbar
- **Títulos** - H1, H2
- **Listas** - Listas ordenadas e desordenadas
- **Citações** - Adicione blocos de citação

#### Reordenar Artigos

- Clique e segure o ícone de **grip** (três linhas) à esquerda do artigo
- Arraste para a nova posição
- A ordem será salva automaticamente

#### Deletar Artigo

- Clique no botão **Trash** no artigo
- Confirme a exclusão

### 4️⃣ Gerenciamento de Imagens

#### Adicionar Imagens ao Artigo

1. Na edição do artigo, role até a seção de imagens
2. Clique em "Adicionar Imagem" ou faça upload
3. As imagens serão associadas ao artigo

#### Imagens Aleatórias (Biblioteca)

- Na página de **Imagens**, você pode fazer upload de imagens que não estão associadas a nenhum artigo
- Use essas imagens como biblioteca para reutilização

#### Reordenar Imagens

- Assim como os artigos, as imagens podem ser reordenadas com drag-and-drop
- Use o ícone de **grip** para arrastar

#### Deletar Imagem

- Clique no ícone **Trash** sobre a imagem
- A imagem será removida imediatamente

### 5️⃣ Configurações de Conta

#### Alterar Dados Pessoais

1. Vá para **Configurações**
2. Seção "Dados do Usuário"
3. Altere nome e/ou email
4. Clique em "Salvar Dados"

#### Alterar Senha

1. Vá para **Configurações**
2. Seção "Alterar Senha"
3. Digite sua senha atual e a nova senha
4. Confirme a nova senha
5. Clique em "Alterar Senha"

#### Gerenciar Chave de API

1. Vá para **Configurações**
2. Seção "Configurações da Conta"
3. Visualize sua chave de API
4. Clique em **Copiar** para copiar para a área de transferência
5. Clique em **Gerar Nova** para regenerar a chave

#### Deletar Conta

1. Vá para **Configurações**
2. Seção "Zona de Perigo"
3. Clique em "Deletar Minha Conta"
4. Confirme a ação (esta ação é irreversível!)

#### Logout

- Clique em "Sair da Conta" em Configurações

## 🔌 API REST

### Endpoints Públicos

Todos os endpoints requerem autenticação via **Bearer Token** (sua chave de API) no header `Authorization`.

#### Exemplo de Requisição

```bash
curl -H "Authorization: Bearer sua-chave-api" http://localhost:3000/api/cms/posts
```

### Posts

**GET** `/api/cms/posts/:id`

- Retorna um post específico com detalhes completos

### Imagens

**GET** `/api/cms/images/:id`

- Retorna as imagens de um artigo ou aleatórias

## 🛠️ Stack Tecnológico

- **Framework**: Next.js 16
- **Banco de Dados**: PostgreSQL 17
- **ORM**: Drizzle ORM
- **Autenticação**: Next-Auth v5
- **UI Components**: shadcn/ui
- **Editor de Texto**: Lexical
- **Drag & Drop**: Swapy
- **Upload de Imagens**: Cloudinary
- **Estilos**: Tailwind CSS
- **Validação**: Zod
- **Form Management**: React Hook Form
- **Containerização**: Docker & Docker Compose

## 📦 Estrutura do Projeto

```
micro-cms-blog/
├── src/
│   ├── app/
│   │   ├── auth/          # Páginas de autenticação
│   │   ├── app/             # Aplicação principal
│   │   │   ├── posts/       # Gerenciamento de posts
│   │   │   ├── images/      # Gerenciamento de imagens
│   │   │   └── settings/    # Configurações
│   │   └── api/
│   │       └── cms/         # Endpoints da API
│   ├── components/          # Componentes reutilizáveis
│   ├── services/
│   │   ├── auth/           # Configuração Next-Auth
│   │   ├── db/             # Configuração Drizzle
│   │   └── db/schemas.ts   # Schemas do banco
│   └── lib/                # Utilidades
├── Dockerfile
├── docker-compose.yml
└── README.md
```

## 🐛 Troubleshooting

### Erro de conexão com banco de dados

```bash
docker-compose down -v
docker-compose up --build
```

### Imagens não aparecem no upload

- Verifique suas credenciais do Cloudinary em `.env`
- Garanta que a chave de API está correta

### Container não inicia

```bash
docker-compose logs web
# Verifique os logs de erro
```

## 🤝 Contribuição

Contribuições são bem-vindas! Para contribuir:

1. Faça um Fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

**Desenvolvido usando Next.js, React e TypeScript**
