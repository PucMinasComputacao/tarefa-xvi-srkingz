const API_POSTS = "http://localhost:3000/posts";

const areaLogin = document.getElementById("areaLogin");
const detalhePost = document.getElementById("detalhePost");

function obterUsuarioCorrente() {
  const usuarioSalvo = sessionStorage.getItem("usuarioCorrente");
  return usuarioSalvo ? JSON.parse(usuarioSalvo) : null;
}

function atualizarAreaLogin() {
  const usuario = obterUsuarioCorrente();

  if (usuario) {
    areaLogin.innerHTML = `
      <span>Ola, ${usuario.nome}</span>
      <button onclick="logoutUser()">Sair</button>
    `;
  } else {
    areaLogin.innerHTML = `
      <a href="./login/index.html" class="btn-login">Entrar</a>
    `;
  }
}

function logoutUser() {
  sessionStorage.removeItem("usuarioCorrente");
  window.location.href = "./login/index.html";
}

function obterIdDaUrl() {
  const parametros = new URLSearchParams(window.location.search);
  return parametros.get("id");
}

function formatarData(dataOriginal) {
  if (!dataOriginal) {
    return "Sem data";
  }

  const data = new Date(`${dataOriginal}T00:00:00`);
  return data.toLocaleDateString("pt-BR");
}

async function carregarDetalhes() {
  const id = obterIdDaUrl();

  if (!id) {
    mostrarNaoEncontrado();
    return;
  }

  try {
    const resposta = await fetch(`${API_POSTS}/${id}`);

    if (!resposta.ok) {
      mostrarNaoEncontrado();
      return;
    }

    const post = await resposta.json();
    document.title = `${post.titulo} - Portal de Noticias`;

    detalhePost.innerHTML = `
      <article class="detalhe-card">
        <span class="categoria">${post.categoria}</span>
        <h2>${post.titulo}</h2>

        <div class="detalhe-meta">
          <span>Autor: ${post.autor}</span>
          <span>Publicado em ${formatarData(post.data)}</span>
        </div>

        <p class="detalhe-resumo">${post.descricao}</p>
        <p class="detalhe-conteudo">${post.conteudo}</p>

        <a href="./index.html" class="btn-primary">Voltar para a Home</a>
      </article>
    `;
  } catch (erro) {
    detalhePost.innerHTML = `
      <div class="mensagem">
        <p>Erro ao carregar os detalhes. Verifique se o JSON Server esta rodando.</p>
        <a href="./index.html" class="btn-login">Voltar para a Home</a>
      </div>
    `;
    console.error(erro);
  }
}

function mostrarNaoEncontrado() {
  detalhePost.innerHTML = `
    <div class="mensagem">
      <p>Noticia nao encontrada.</p>
      <a href="./index.html" class="btn-login">Voltar para a Home</a>
    </div>
  `;
}

atualizarAreaLogin();
carregarDetalhes();
