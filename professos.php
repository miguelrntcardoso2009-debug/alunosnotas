<?php
require "config.php";

// Somente professores podem acessar esta página.
if (!isset($_SESSION["tipo"]) || $_SESSION["tipo"] != "professor") {
    header("Location: index.php");
    exit;
}

$msg = "";
$erro = "";

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $nome = trim($_POST["nome"]);
    $senha = $_POST["senha"];
    $nota = $_POST["nota"];

    if (
        $nome == "" ||
        $senha == "" ||
        !is_numeric($nota) ||
        $nota < 0 ||
        $nota > 10
    ) {
        $erro = "Preencha os dados corretamente.";
    } else {

        try {

            // Inicia uma transação para cadastrar aluno e nota juntos.
            $pdo->beginTransaction();

            $sql = "INSERT INTO usuarios (nome, senha, tipo)
                    VALUES (?, ?, 'aluno')";

            $stmt = $pdo->prepare($sql);

            $stmt->execute([
                $nome,
                password_hash($senha, PASSWORD_DEFAULT)
            ]);

            $alunoId = $pdo->lastInsertId();


            $sql = "INSERT INTO notas (aluno_id, nota_final)
                    VALUES (?, ?)";

            $stmt = $pdo->prepare($sql);

            $stmt->execute([
                $alunoId,
                $nota
            ]);

            $pdo->commit();

            $msg = "Aluno cadastrado com sucesso.";

        } catch (PDOException $e) {

            if ($pdo->inTransaction()) {
                $pdo->rollBack();
            }

            $erro = "Não foi possível cadastrar. O aluno pode já existir.";
        }
    }
}


// Busca os alunos cadastrados.
$sql = "SELECT u.nome, n.nota_final
        FROM usuarios u
        INNER JOIN notas n ON n.aluno_id = u.id
        WHERE u.tipo = 'aluno'
        ORDER BY u.nome";

$alunos = $pdo->query($sql)->fetchAll(PDO::FETCH_ASSOC);
?>

<!DOCTYPE html>
<html lang="pt-BR">

<head>

    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>Área do Professor</title>

    <link rel="stylesheet" href="style.css">
    <script src="script.js" defer></script>

</head>

<body>

<main class="container">

    <header class="topo">

        <div>

            <h1>Área do Professor</h1>

            <p>
                Olá, <?= htmlspecialchars($_SESSION["nome"]) ?>.
            </p>

        </div>

        <a href="logout.php" class="sair">
            Sair
        </a>

    </header>


    <?php if ($msg): ?>

        <div class="sucesso">
            <?= htmlspecialchars($msg) ?>
        </div>

    <?php endif; ?>


    <?php if ($erro): ?>

        <div class="erro">
            <?= htmlspecialchars($erro) ?>
        </div>

    <?php endif; ?>


    <section class="grid">


        <div class="card">

            <h2>Cadastrar aluno</h2>

            <form method="POST">

                <label>Nome do aluno</label>

                <input
                    type="text"
                    name="nome"
                    required
                >


                <label>Senha do aluno</label>

                <input
                    type="password"
                    name="senha"
                    required
                >


                <label>Nota final</label>

                <input
                    type="number"
                    name="nota"
                    min="0"
                    max="10"
                    step="0.01"
                    required
                >


                <button type="submit">
                    Cadastrar
                </button>

            </form>

        </div>


        <div class="card">

            <h2>Alunos cadastrados</h2>

            <?php if (!$alunos): ?>

                <p class="vazio">
                    Nenhum aluno cadastrado.
                </p>

            <?php else: ?>

                <table>

                    <thead>

                        <tr>
                            <th>Aluno</th>
                            <th>Nota final</th>
                        </tr>

                    </thead>

                    <tbody>

                        <?php foreach ($alunos as $aluno): ?>

                            <tr>

                                <td>
                                    <?= htmlspecialchars($aluno["nome"]) ?>
                                </td>

                                <td>
                                    <?= number_format($aluno["nota_final"], 2, ",", ".") ?>
                                </td>

                            </tr>

                        <?php endforeach; ?>

                    </tbody>

                </table>

            <?php endif; ?>

        </div>

    </section>

</main>

</body>
</html>
