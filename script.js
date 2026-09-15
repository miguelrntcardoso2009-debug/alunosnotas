// Dados iniciais salvos no navegador.
let alunos = JSON.parse(localStorage.getItem("alunos")) || [];

// Simula a sessão enquanto a página estiver aberta.
let sessao = sessionStorage.getItem("sessao");

// Cria um professor padrão somente na primeira execução.
if (!localStorage.getItem("professor")) {
    localStorage.setItem("professor", JSON.stringify({
        usuario: "professor",
        senha: "123456"
    }));
}


// Login
document.getElementById("loginForm").addEventListener("submit", function (event) {
    event.preventDefault();

    const tipo = document.getElementById("tipo").value;
    const usuario = document.getElementById("usuario").value.trim();
    const senha = document.getElementById("senha").value;

    if (tipo === "professor") {
        const professor = JSON.parse(localStorage.getItem("professor"));

        if (usuario === professor.usuario && senha === professor.senha) {
            sessionStorage.setItem("sessao", JSON.stringify({
                tipo: "professor"
            }));

            mostrarProfessor();
            return;
        }
    }

    if (tipo === "aluno") {
        const aluno = alunos.find(
            aluno => aluno.nome.toLowerCase() === usuario.toLowerCase()
            && aluno.senha === senha
        );

        if (aluno) {
            sessionStorage.setItem("sessao", JSON.stringify({
                tipo: "aluno",
                nome: aluno.nome
            }));

            mostrarAluno(aluno);
            return;
        }
    }

    mostrarMensagem("mensagemLogin", "Usuário, senha ou tipo inválido.", "erro");
});


// Cadastro feito pelo professor.
document.getElementById("cadastroForm").addEventListener("submit", function (event) {
    event.preventDefault();

    const nome = document.getElementById("novoNome").value.trim();
    const senha = document.getElementById("novaSenha").value;
    const nota = Number(document.getElementById("novaNota").value);

    if (!nome || !senha || nota < 0 || nota > 10) {
        mostrarMensagem(
            "mensagemProfessor",
            "Preencha os dados corretamente. A nota deve estar entre 0 e 10.",
            "erro"
        );
        return;
    }

    const existe = alunos.some(
        aluno => aluno.nome.toLowerCase() === nome.toLowerCase()
    );

    if (existe) {
        mostrarMensagem(
            "mensagemProfessor",
            "Já existe um aluno com esse nome.",
            "erro"
        );
        return;
    }

    alunos.push({
        nome: nome,
        senha: senha,
        nota: nota
    });

    salvarAlunos();

    document.getElementById("cadastroForm").reset();

    atualizarLista();

    mostrarMensagem(
        "mensagemProfessor",
        "Aluno cadastrado com sucesso!",
        "sucesso"
    );
});


// Mostra a área correta quando a página é aberta novamente.
window.addEventListener("load", function () {
    if (!sessao) {
        mostrarLogin();
        return;
    }

    const dadosSessao = JSON.parse(sessao);

    if (dadosSessao.tipo === "professor") {
        mostrarProfessor();
    } else {
        const aluno = alunos.find(
            aluno => aluno.nome === dadosSessao.nome
        );

        if (aluno) {
            mostrarAluno(aluno);
        } else {
            sair();
        }
    }
});


// Mostra a tela de login.
function mostrarLogin() {
    esconderTudo();
    document.getElementById("loginTela").classList.remove("escondido");
}


// Mostra a tela do professor.
function mostrarProfessor() {
    esconderTudo();
    document.getElementById("professorTela").classList.remove("escondido");
    atualizarLista();
}


// Mostra a tela do aluno.
function mostrarAluno(aluno) {
    esconderTudo();

    document.getElementById("alunoTela").classList.remove("escondido");
    document.getElementById("nomeAluno").textContent = "Olá, " + aluno.nome + "!";
    document.getElementById("notaAluno").textContent =
        aluno.nota.toFixed(2).replace(".", ",");
}


// Atualiza a tabela do professor.
function atualizarLista() {
    const lista = document.getElementById("listaAlunos");

    if (alunos.length === 0) {
        lista.innerHTML = '<p class="vazio">Nenhum aluno cadastrado.</p>';
        return;
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

    alunos.forEach(aluno => {
        html += `
            <tr>
                <td>${escaparHTML(aluno.nome)}</td>
                <td>${aluno.nota.toFixed(2).replace(".", ",")}</td>
            </tr>
        `;
    });

    html += `
            </tbody>
        </table>
    `;

    lista.innerHTML = html;
}


// Salva os alunos no armazenamento do navegador.
function salvarAlunos() {
    localStorage.setItem("alunos", JSON.stringify(alunos));
}


// Simula o encerramento da sessão.
function sair() {
    sessionStorage.removeItem("sessao");
    mostrarLogin();
}


// Esconde todas as telas.
function esconderTudo() {
    document.querySelectorAll("section").forEach(section => {
        section.classList.add("escondido");
    });
}


// Mostra mensagens na tela.
function mostrarMensagem(id, texto, tipo) {
    const elemento = document.getElementById(id);

    elemento.textContent = texto;
    elemento.className = "mensagem " + tipo;

    setTimeout(() => {
        elemento.classList.add("escondido");
    }, 3000);
}


// Evita inserir HTML digitado pelo usuário.
function escaparHTML(texto) {
    return texto
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}
