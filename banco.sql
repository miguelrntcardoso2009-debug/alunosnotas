CREATE DATABASE IF NOT EXISTS sistema_notas;
USE sistema_notas;

CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    tipo ENUM('professor', 'aluno') NOT NULL
);

CREATE TABLE notas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    aluno_id INT NOT NULL UNIQUE,
    nota_final DECIMAL(4,2) NOT NULL,
    FOREIGN KEY (aluno_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Professor padrão:
-- Usuário: professor
-- Senha: 123456
INSERT INTO usuarios (nome, senha, tipo)
VALUES (
    'professor',
    '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llCip3W4Bq9S4G7a4TQ2',
    'professor'
);
