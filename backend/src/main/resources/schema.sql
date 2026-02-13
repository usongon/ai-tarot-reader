-- ========================================
-- Tarot Reader 数据库初始化脚本
-- 适用于 MySQL 8.0+
-- ========================================

-- 创建数据库（如果还没有）
CREATE DATABASE IF NOT EXISTS tarot_reader
    DEFAULT CHARACTER SET utf8mb4
    DEFAULT COLLATE utf8mb4_unicode_ci;

USE tarot_reader;

-- ========================================
-- 访问口令表
-- ========================================
CREATE TABLE IF NOT EXISTS access_token (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT '主键ID',
    token VARCHAR(64) NOT NULL COMMENT '访问口令',
    remaining_count INT NOT NULL DEFAULT 0 COMMENT '剩余使用次数',
    total_count INT NOT NULL DEFAULT 0 COMMENT '初始总次数（用于记录）',
    status TINYINT NOT NULL DEFAULT 1 COMMENT '状态：1-启用，0-禁用',
    description VARCHAR(255) DEFAULT NULL COMMENT '口令描述（如用户名）',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    UNIQUE KEY uk_token (token),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='访问口令表';

-- ========================================
-- 初始口令数据（可选，根据实际情况修改）
-- ========================================
-- INSERT INTO access_token (token, remaining_count, total_count, description) VALUES
-- ('YOUR_TOKEN_HERE', 100, 100, '描述信息');
