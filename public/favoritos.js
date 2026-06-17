const API_POSTS = "http://localhost:3000/posts";

const listaFavoritos = document.getElementById("listaFavoritos");
const areaLogin = document.getElementById("areaLogin");

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

function obterChaveFavoritos() {
  const usuario = obterUsuarioCorrente();
  return usuario ? `favoritos_${usuario.id}` : null;
}

function obterFavoritos() {
  const chave = obterChaveFavoritos();

  if (!chave) {
    return [];
  }

  const favoritosSalvos = localStorage.getItem(chave);
  return favoritosSalvos ? JSON.parse(favoritosSalvos) : [];
}

function salvarFavoritos(favoritos) {
  const chave = obterChaveFavoritos();

  if (chave) {
    localStorage.setItem(chave, JSON.stringify(favoritos));
  }
}

function removerFavorito(idPost) {
  const id = String(idPost);
  const favoritos = obterFavoritos().filter(item => item !== id);

  salvarFavoritos(favoritos);
  carregarFavoritos();
}

async function carregarFavoritos() {
  const usuario = obterUsuarioCorrente();

  if (!usuario) {
    listaFavoritos.innerHTML = `
      <div class="mensagem">
        <p>Voce precisa estar logado para ver seus favoritos.</p>
        <a href="./login/index.html" class="btn-login">Entrar</a>
      </div>
    `;
    return;
  }

  try {
    const resposta = await fetch(API_POSTS);
    const posts = await resposta.json();
    const favoritos = obterFavoritos();
    const postsFavoritos = posts.filter(post => favoritos.includes(String(post.id)));

    listaFavoritos.innerHTML = "";

    if (postsFavoritos.length === 0) {
      listaFavoritos.innerHTML = `
        <div class="mensagem">
          <p>Voce ainda nao possui itens favoritos.</p>
          <a href="./index.html" class="btn-login">Voltar para a Home</a>
        </div>
      `;
      return;
    }

    postsFavoritos.forEach(post => {
      const card = document.createElement("article");
      card.className = "card favorito";

      card.innerHTML = `
        <div class="card-topo">
          <span class="categoria">${post.categoria}</span>
          <button class="btn-favorito" onclick="removerFavorito('${post.id}')">
            Remover
          </button>
        </div>

        <h3>${post.titulo}</h3>
        <p>${post.descricao}</p>

        <div class="card-meta">
          <span>Autor: ${post.autor || "Nao informado"}</span>
        </div>

        <div class="card-actions">
          <a href="./detalhes.html?id=${post.id}" class="btn-outline">Detalhes</a>
        </div>
      `;

      listaFavoritos.appendChild(card);
    });
  } catch (erro) {
    listaFavoritos.innerHTML = `
      <div class="mensagem">
        <p>Erro ao carregar favoritos. Verifique se o JSON Server esta rodando.</p>
      </div>
    `;
    console.error(erro);
  }
}

atualizarAreaLogin();
carregarFavoritos();
