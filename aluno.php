<?php
require "config.php";

// Somente alunos podem acessar esta página.
if (!isset($_SESSION["tipo"]) || $_SESSION["tipo"] != "aluno") {
    header("Location: index.php");
    exit;
}

// Busca somente a nota do aluno logado.
$sql = "SELECT nota_final
        FROM notas
        WHERE aluno_id = ?";

$stmt = $pdo->prepare($sql);
$stmt->execute([$_SESSION["id"]]);

$nota = $stmt->fetchColumn();
?>

<!DOCTYPE html>
<html lang="pt-BR">

<head>

    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>Área do Aluno</title>

    <link rel="stylesheet" href="style.css">
    <script src="script.js" defer></script>

</head>

<body>

<main class="container pequeno">

    <header class="topo">

        <div>

            <h1>Área do Aluno</h1>

            <p>
                Olá, <?= htmlspecialchars($_SESSION["nome"]) ?>.
            </p>

        </div>

        <a href="logout.php" class="sair">
            Sair
        </a>

    </header>


    <section class="card nota-card">

        <p class="label-nota">
            Sua nota final
        </p>


        <?php if ($nota !== false): ?>

            <div class="nota">
                <?= number_format($nota, 2, ",", ".") ?>
            </div>

        <?php else: ?>

            <p class="vazio">
                Sua nota ainda não foi cadastrada.
            </p>

        <?php endif; ?>

    </section>

</main>

</body>
</html>
