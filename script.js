// Dados iniciais salvos no navegador.
let alunos = JSON.parse(localStorage.getItem("alunos")) || [];[cite: 2]

// Cria um professor padrão somente na primeira execução[cite: 2].
if (!localStorage.getItem("professor")) {[cite: 2]
  localStorage.setItem("professor", JSON.stringify({
    usuario: "professor",
    senha: "123456"
  }));[cite: 2]
}

// Executa a verificação ao carregar a página[cite: 2].
window.addEventListener("load", verificarSessao);

// Ouve mudanças de armazenamento entre abas diferentes[cite: 2].
// Se o usuário logar/deslogar em outra aba, todas atualizam automaticamente.
window.addEventListener("storage", function (e) {
  if (e.key === "sessao" || e.key === "alunos") {
    alunos = JSON.parse(localStorage.getItem("alunos")) || [];
    verificarSessao();
  }
});

// Função para validar a sessão atual no localStorage[cite: 2].
function verificarSessao() {
  const sessao = localStorage.getItem("sessao");[cite: 2]
  if (!sessao) {[cite: 2]
    mostrarLogin();[cite: 2]
    return;[cite: 2]
  }

  const dadosSessao = JSON.parse(sessao);[cite: 2]
  if (dadosSessao.tipo === "professor") {[cite: 2]
    mostrarProfessor();[cite: 2]
  } else if (dadosSessao.tipo === "aluno") {
    const aluno = alunos.find(a => a.nome === dadosSessao.nome);[cite: 2]
    if (aluno) {[cite: 2]
      mostrarAluno(aluno);[cite: 2]
    } else {
      sair();[cite: 2]
    }
  }
}

// Login
document.getElementById("loginForm").addEventListener("submit", function (event) {[cite: 2]
  event.preventDefault();[cite: 2]
  const tipo = document.getElementById("tipo").value;[cite: 2]
  const usuario = document.getElementById("usuario").value.trim();[cite: 2]
  const senha = document.getElementById("senha").value;[cite: 2]

  if (tipo === "professor") {[cite: 2]
    const professor = JSON.parse(localStorage.getItem("professor"));[cite: 2]
    if (usuario === professor.usuario && senha === professor.senha) {[cite: 2]
      // Salva sessão no localStorage para ser global[cite: 2]
      localStorage.setItem("sessao", JSON.stringify({ tipo: "professor" }));[cite: 2]
      mostrarProfessor();[cite: 2]
      return;[cite: 2]
    }
  }

  if (tipo === "aluno") {[cite: 2]
    const aluno = alunos.find([cite: 2]
      a => a.nome.toLowerCase() === usuario.toLowerCase() && a.senha === senha[cite: 2]
    );
    if (aluno) {[cite: 2]
      // Salva sessão do aluno no localStorage[cite: 2]
      localStorage.setItem("sessao", JSON.stringify({ tipo: "aluno", nome: aluno.nome }));[cite: 2]
      mostrarAluno(aluno);[cite: 2]
      return;[cite: 2]
    }
  }

  mostrarMensagem("mensagemLogin", "Usuário, senha ou tipo inválido.", "erro");[cite: 2]
});

// Cadastro de novos alunos pelo professor[cite: 2]
document.getElementById("cadastroForm").addEventListener("submit", function (event) {[cite: 2]
  event.preventDefault();[cite: 2]
  const nome = document.getElementById("novoNome").value.trim();[cite: 2]
  const senha = document.getElementById("novaSenha").value;[cite: 2]
  const nota = Number(document.getElementById("novaNota").value);[cite: 2]

  if (!nome || !senha || nota < 0 || nota > 10) {[cite: 2]
    mostrarMensagem("mensagemProfessor", "Preencha os dados corretamente. A nota deve estar entre 0 e 10.", "erro");[cite: 2]
    return;[cite: 2]
  }

  const existe = alunos.some(a => a.nome.toLowerCase() === nome.toLowerCase());[cite: 2]
  if (existe) {[cite: 2]
    mostrarMensagem("mensagemProfessor", "Já existe um aluno com esse nome.", "erro");[cite: 2]
    return;[cite: 2]
  }

  alunos.push({ nome: nome, senha: senha, nota: nota });[cite: 2]
  salvarAlunos();[cite: 2]
  document.getElementById("cadastroForm").reset();[cite: 2]
  atualizarLista();[cite: 2]
  mostrarMensagem("mensagemProfessor", "Aluno cadastrado com sucesso!", "sucesso");[cite: 2]
});

// Mostra a tela de login[cite: 2]
function mostrarLogin() {
  esconderTudo();[cite: 2]
  document.getElementById("loginTela").classList.remove("escondido");[cite: 3]
}

// Mostra a tela do professor[cite: 2]
function mostrarProfessor() {
  esconderTudo();[cite: 2]
  document.getElementById("professorTela").classList.remove("escondido");[cite: 3]
  atualizarLista();[cite: 2]
}

// Mostra a tela do aluno[cite: 2]
function mostrarAluno(aluno) {
  esconderTudo();[cite: 2]
  document.getElementById("alunoTela").classList.remove("escondido");[cite: 3]
  document.getElementById("nomeAluno").textContent = "Olá, " + aluno.nome + "!";[cite: 2]
  document.getElementById("notaAluno").textContent = aluno.nota.toFixed(2).replace(".", ",");[cite: 2]
}

// Atualiza a tabela do professor[cite: 2]
function atualizarLista() {
  const lista = document.getElementById("listaAlunos");[cite: 2]
  if (alunos.length === 0) {[cite: 2]
    lista.innerHTML = '<p class="vazio">Nenhum aluno cadastrado.</p>';[cite: 2]
    return;[cite: 2]
  }

  let html = `
  <table>
    <thead>
      <tr>
        <th>Aluno</th>
        <th>Nota</th>
      </tr>
    </thead>
    <tbody>
  `;

  alunos.forEach(aluno => {[cite: 2]
    html += `
    <tr>
      <td>${escaparHTML(aluno.nome)}</td>[cite: 2]
      <td>${aluno.nota.toFixed(2).replace(".", ",")}</td>[cite: 2]
    </tr>
    `;
  });

  html += `</tbody></table>`;[cite: 2]
  lista.innerHTML = html;[cite: 2]
}

// Salva os alunos no localStorage[cite: 2]
function salvarAlunos() {
  localStorage.setItem("alunos", JSON.stringify(alunos));[cite: 2]
}

// Encerra a sessão[cite: 2]
function sair() {
  localStorage.removeItem("sessao");[cite: 2]
  mostrarLogin();[cite: 2]
}

// Esconde todas as telas[cite: 2]
function esconderTudo() {
  document.querySelectorAll("section").forEach(section => {[cite: 2]
    section.classList.add("escondido");[cite: 2]
  });
}

// Exibe mensagens informativas[cite: 2]
function mostrarMensagem(id, texto, tipo) {[cite: 2]
  const elemento = document.getElementById(id);[cite: 2]
  elemento.textContent = texto;[cite: 2]
  elemento.className = "mensagem " + tipo;[cite: 2]
  setTimeout(() => {
    elemento.classList.add("escondido");[cite: 2]
  }, 3000);[cite: 2]
}

// Sanitiza caracteres especiais[cite: 2]
function escaparHTML(texto) {
  return texto
    .replaceAll("&", "&amp;")[cite: 2]
    .replaceAll("<", "&lt;")[cite: 2]
    .replaceAll(">", "&gt;")[cite: 2]
    .replaceAll('"', "&quot;")[cite: 2]
    .replaceAll("'", "&#039;");[cite: 2]
}
