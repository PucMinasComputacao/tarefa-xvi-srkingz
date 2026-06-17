[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/ymR3EXUy)
# Trabalho Pratico - Semana 16

Back end com CRUD no JSON Server.

O projeto evolui o Portal de Noticias para consumir uma API REST simulada com JSON Server. A entidade principal e `posts`, permitindo cadastrar, listar, visualizar detalhes, editar e excluir noticias com a API Fetch.

## Como executar

```bash
npm install
npm start
```

Depois acesse:

```text
http://localhost:3000
```

## Funcionalidades implementadas

- Listagem de noticias com requisicao `GET /posts`.
- Pagina de detalhes com parametro `?id=` e requisicao `GET /posts/:id`.
- Cadastro de noticia com formulario e requisicao `POST /posts`.
- Edicao de noticia com formulario preenchido e requisicao `PUT /posts/:id`.
- Exclusao de noticia com confirmacao e requisicao `DELETE /posts/:id`.
- Validacao dos campos obrigatorios no front-end.
- Login simples consumindo `GET /usuarios`.
- Favoritos por usuario usando `localStorage`.

## Estrutura de dados

O arquivo de dados fica em `db/db.json` e possui duas colecoes:

```json
{
  "usuarios": [
    {
      "id": "1",
      "nome": "Administrador",
      "login": "admin",
      "senha": "123",
      "email": "admin@email.com"
    }
  ],
  "posts": [
    {
      "id": "1",
      "titulo": "Noticia sobre Inteligencia Artificial",
      "categoria": "Tecnologia",
      "autor": "Isaque Paiva",
      "data": "2026-06-01",
      "descricao": "Resumo exibido no card da noticia.",
      "conteudo": "Texto completo exibido na pagina de detalhes."
    }
  ]
}
```

## Informacoes Gerais

- Nome: Isaque Paiva
- Matricula: 916385

## Prints do trabalho

<< COLOQUE A IMAGEM - PAGINA INICIAL COM CARDS E FORMULARIO CRUD - AQUI >>

<< COLOQUE A IMAGEM - PAGINA DE DETALHES DA NOTICIA - AQUI >>

<< COLOQUE A IMAGEM - DEVTOOLS NETWORK COM GET/POST/PUT/DELETE - AQUI >>
