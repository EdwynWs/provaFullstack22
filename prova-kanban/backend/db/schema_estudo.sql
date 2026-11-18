-- BANCO LOCAL DE ESTUDO: execute apenas em uma base de testes.
-- O backend fornecido em backend/db/database.js utiliza database: 'test'.
CREATE DATABASE IF NOT EXISTS test CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE test;

CREATE TABLE IF NOT EXISTS tb_usuario (
    usu_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    usu_nome VARCHAR(120) NOT NULL,
    usu_email VARCHAR(180) NOT NULL UNIQUE,
    usu_senha VARCHAR(255) NOT NULL,
    usu_ativo CHAR(1) NOT NULL DEFAULT 'S'
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS tb_tarefa (
    tar_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    tar_titulo VARCHAR(150) NOT NULL,
    tar_descricao TEXT NOT NULL,
    tar_status VARCHAR(30) NOT NULL DEFAULT 'a_fazer',
    tar_data_limite DATE NOT NULL,
    usu_id INT NULL,
    tar_ativo CHAR(1) NOT NULL DEFAULT 'S',
    CONSTRAINT fk_tarefa_usuario FOREIGN KEY (usu_id) REFERENCES tb_usuario(usu_id)
) ENGINE=InnoDB;

-- Senhas em texto simples seguem apenas o backend didático recebido.
-- NUNCA reutilize esta estratégia em um sistema publicado.
INSERT IGNORE INTO tb_usuario (usu_id, usu_nome, usu_email, usu_senha, usu_ativo) VALUES
(1, 'Ana Silva', 'admin@kanban.com', '123456', 'S'),
(2, 'Carlos Lima', 'carlos@kanban.com', '123456', 'S'),
(3, 'Mariana Costa', 'mariana@kanban.com', '123456', 'S');

-- Exemplos de tarefas em todos os quatro status.
-- IDs explícitos facilitam repetir o script sem duplicar registros.
INSERT IGNORE INTO tb_tarefa (tar_id, tar_titulo, tar_descricao, tar_status, tar_data_limite, usu_id, tar_ativo) VALUES
(1, 'Criar login', 'Implementar autenticação com cookie JWT', 'a_fazer', '2026-11-23', 1, 'S'),
(2, 'Validar formulário', 'Validar campos obrigatórios', 'a_fazer', '2026-11-24', 2, 'S'),
(3, 'Definir rotas', 'Organizar páginas com App Router', 'a_fazer', '2026-11-25', 3, 'S'),
(4, 'Criar ApiClient', 'Configurar GET, POST, PUT, PATCH e DELETE', 'em_andamento', '2026-11-26', 1, 'S'),
(5, 'Montar Dashboard', 'Consumir a rota de resumo por status', 'em_andamento', '2026-11-27', 2, 'S'),
(6, 'Montar Quadro Kanban', 'Separar tarefas em quatro colunas', 'em_andamento', '2026-11-28', 3, 'S'),
(7, 'Revisar responsavel', 'Conferir objeto do usuário na API', 'em_revisao', '2026-11-29', 1, 'S'),
(8, 'Testar edição', 'Revisar pagina dinâmica com ID', 'em_revisao', '2026-11-30', 2, 'S'),
(9, 'Testar movimentação', 'Validar endpoint PATCH de status', 'em_revisao', '2026-12-01', 3, 'S'),
(10, 'Criar banco', 'Criar as tabelas de usuários e tarefas', 'concluido', '2026-11-20', 1, 'S'),
(11, 'Configurar backend', 'Preparar servidor Express', 'concluido', '2026-11-21', 2, 'S'),
(12, 'Revisar proxy', 'Restringir acesso às páginas de tarefas', 'concluido', '2026-11-22', 3, 'S');
