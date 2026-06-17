const API_POSTS = "http://localhost:3000/posts";

const listaPosts = document.getElementById("listaPosts");
const areaLogin = document.getElementById("areaLogin");
const formPost = document.getElementById("formPost");
const tituloFormulario = document.getElementById("tituloFormulario");
const mensagemForm = document.getElementById("mensagemForm");
const btnSalvar = document.getElementById("btnSalvar");
const btnCancelar = document.getElementById("btnCancelar");

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

function verificarFavorito(idPost) {
  const favoritos = obterFavoritos();
  return favoritos.includes(String(idPost));
}

function alternarFavorito(idPost) {
  const usuario = obterUsuarioCorrente();

  if (!usuario) {
    alert("Voce precisa estar logado para favoritar itens.");
    window.location.href = "./login/index.html";
    return;
  }

  const id = String(idPost);
  let favoritos = obterFavoritos();

  if (favoritos.includes(id)) {
    favoritos = favoritos.filter(item => item !== id);
  } else {
    favoritos.push(id);
  }

  salvarFavoritos(favoritos);
  carregarPosts();
}

async function requisitar(url, opcoes = {}) {
  const resposta = await fetch(url, opcoes);

  if (!resposta.ok) {
    throw new Error(`Erro HTTP ${resposta.status}`);
  }

  if (resposta.status === 204) {
    return null;
  }

  return resposta.json();
}

async function buscarPosts() {
  return requisitar(API_POSTS);
}

async function criarPost(post) {
  return requisitar(API_POSTS, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(post)
  });
}

async function atualizarPost(id, post) {
  return requisitar(`${API_POSTS}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(post)
  });
}

async function excluirPost(id) {
  return requisitar(`${API_POSTS}/${id}`, {
    method: "DELETE"
  });
}

function obterDadosFormulario() {
  return {
    titulo: document.getElementById("titulo").value.trim(),
    categoria: document.getElementById("categoria").value.trim(),
    autor: document.getElementById("autor").value.trim(),
    data: document.getElementById("data").value,
    descricao: document.getElementById("descricao").value.trim(),
    conteudo: document.getElementById("conteudo").value.trim()
  };
}

function validarPost(post) {
  return Object.values(post).every(valor => String(valor).trim() !== "");
}

function limparFormulario() {
  formPost.reset();
  document.getElementById("postId").value = "";
  tituloFormulario.textContent = "Cadastrar noticia";
  btnSalvar.textContent = "Cadastrar";
  btnCancelar.style.display = "none";
}

function mostrarMensagem(texto, tipo = "sucesso") {
  mensagemForm.textContent = texto;
  mensagemForm.className = `mensagem-form ${tipo}`;

  setTimeout(() => {
    mensagemForm.textContent = "";
    mensagemForm.className = "mensagem-form";
  }, 3500);
}

function preencherFormulario(post) {
  document.getElementById("postId").value = post.id;
  document.getElementById("titulo").value = post.titulo;
  document.getElementById("categoria").value = post.categoria;
  document.getElementById("autor").value = post.autor;
  document.getElementById("data").value = post.data;
  document.getElementById("descricao").value = post.descricao;
  document.getElementById("conteudo").value = post.conteudo;

  tituloFormulario.textContent = "Editar noticia";
  btnSalvar.textContent = "Salvar alteracoes";
  btnCancelar.style.display = "inline-flex";
  formPost.scrollIntoView({ behavior: "smooth", block: "start" });
}

async function editarPost(id) {
  try {
    const post = await requisitar(`${API_POSTS}/${id}`);
    preencherFormulario(post);
  } catch (erro) {
    mostrarMensagem("Nao foi possivel carregar a noticia para edicao.", "erro");
    console.error(erro);
  }
}

async function removerPost(id) {
  const confirmou = confirm("Deseja realmente excluir esta noticia?");

  if (!confirmou) {
    return;
  }

  try {
    await excluirPost(id);
    removerPostDosFavoritos(id);
    await carregarPosts();
    mostrarMensagem("Noticia excluida com sucesso.");
  } catch (erro) {
    mostrarMensagem("Nao foi possivel excluir a noticia.", "erro");
    console.error(erro);
  }
}

function removerPostDosFavoritos(idPost) {
  const usuario = obterUsuarioCorrente();

  if (!usuario) {
    return;
  }

  const id = String(idPost);
  const favoritos = obterFavoritos().filter(item => item !== id);
  salvarFavoritos(favoritos);
}

function formatarData(dataOriginal) {
  if (!dataOriginal) {
    return "Sem data";
  }

  const data = new Date(`${dataOriginal}T00:00:00`);
  return data.toLocaleDateString("pt-BR");
}

function renderizarPosts(posts) {
  listaPosts.innerHTML = "";

  if (posts.length === 0) {
    listaPosts.innerHTML = `
      <div class="mensagem">
        <p>Nenhuma noticia cadastrada.</p>
      </div>
    `;
    return;
  }

  posts.forEach(post => {
    const favoritado = verificarFavorito(post.id);

    const card = document.createElement("article");
    card.className = favoritado ? "card favorito" : "card";

    card.innerHTML = `
      <div class="card-topo">
        <span class="categoria">${post.categoria}</span>
        <button class="btn-favorito" onclick="alternarFavorito('${post.id}')">
          ${favoritado ? "Favoritado" : "Favoritar"}
        </button>
      </div>

      <h3>${post.titulo}</h3>
      <p>${post.descricao}</p>

      <div class="card-meta">
        <span>Autor: ${post.autor}</span>
        <span>${formatarData(post.data)}</span>
      </div>

      <div class="card-actions">
        <a href="./detalhes.html?id=${post.id}" class="btn-outline">Detalhes</a>
        <button type="button" class="btn-secondary" onclick="editarPost('${post.id}')">Editar</button>
        <button type="button" class="btn-danger" onclick="removerPost('${post.id}')">Excluir</button>
      </div>
    `;

    listaPosts.appendChild(card);
  });
}

async function carregarPosts() {
  try {
    const posts = await buscarPosts();
    renderizarPosts(posts);
  } catch (erro) {
    listaPosts.innerHTML = `
      <div class="mensagem">
        <p>Erro ao carregar os posts. Verifique se o JSON Server esta rodando.</p>
      </div>
    `;
    console.error(erro);
  }
}

formPost.addEventListener("submit", async function(evento) {
  evento.preventDefault();

  const id = document.getElementById("postId").value;
  const post = obterDadosFormulario();

  if (!validarPost(post)) {
    mostrarMensagem("Preencha todos os campos do formulario.", "erro");
    return;
  }

  try {
    if (id) {
      await atualizarPost(id, { id, ...post });
      mostrarMensagem("Noticia atualizada com sucesso.");
    } else {
      await criarPost(post);
      mostrarMensagem("Noticia cadastrada com sucesso.");
    }

    limparFormulario();
    await carregarPosts();
  } catch (erro) {
    mostrarMensagem("Nao foi possivel salvar a noticia.", "erro");
    console.error(erro);
  }
});

btnCancelar.addEventListener("click", limparFormulario);

atualizarAreaLogin();
limparFormulario();
carregarPosts();
