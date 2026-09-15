<?php
require "config.php";

// Se já estiver logado, vai para sua área.
if (isset($_SESSION["tipo"])) {
    header("Location: " . ($_SESSION["tipo"] == "professor" ? "professor.php" : "aluno.php"));
    exit;
}

$erro = "";

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $nome = trim($_POST["nome"]);
    $senha = $_POST["senha"];
    $tipo = $_POST["tipo"];

    if ($nome == "" || $senha == "" || !in_array($tipo, ["professor", "aluno"])) {
        $erro = "Preencha todos os campos.";
    } else {

        // Procura o usuário pelo nome e tipo.
        $sql = "SELECT * FROM usuarios WHERE nome = ? AND tipo = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$nome, $tipo]);

        $usuario = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($usuario && password_verify($senha, $usuario["senha"])) {

            // Garante uma nova sessão após o login.
            session_regenerate_id(true);

            $_SESSION["id"] = $usuario["id"];
            $_SESSION["nome"] = $usuario["nome"];
            $_SESSION["tipo"] = $usuario["tipo"];

            header("Location: " . ($tipo == "professor" ? "professor.php" : "aluno.php"));
            exit;

        } else {
            $erro = "Usuário, senha ou tipo inválido.";
        }
    }
}
?>

<!DOCTYPE html>
<html lang="pt-BR">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>Sistema de Notas</title>

    <link rel="stylesheet" href="style.css">
    <script src="script.js" defer></script>
</head>

<body>

<main class="card login">

    <h1>Sistema de Notas</h1>

    <p class="subtitulo">
        Faça login para acessar sua área.
    </p>

    <?php if ($erro): ?>
        <div class="erro">
            <?= htmlspecialchars($erro) ?>
        </div>
    <?php endif; ?>

    <form method="POST">

        <label>Tipo de usuário</label>

        <select name="tipo" required>
            <option value="">Selecione</option>
            <option value="professor">Professor</option>
            <option value="aluno">Aluno</option>
        </select>


        <label>Nome de usuário</label>

        <input
            type="text"
            name="nome"
            placeholder="Digite seu usuário"
            required
        >


        <label>Senha</label>

        <input
            type="password"
            name="senha"
            placeholder="Digite sua senha"
            required
        >


        <button type="submit">
            Entrar
        </button>

    </form>

    <div class="dica">
        <strong>Professor:</strong> professor / 123456
    </div>

</main>

</body>
</html>
