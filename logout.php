<?php
session_start();

// Encerra a sessão atual.
$_SESSION = [];

session_destroy();

header("Location: index.php");
exit;
?>
