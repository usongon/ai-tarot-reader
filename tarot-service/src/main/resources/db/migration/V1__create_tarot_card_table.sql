CREATE TABLE IF NOT EXISTS tarot_card (
    id                  BIGINT AUTO_INCREMENT PRIMARY KEY,
    card_id             VARCHAR(64)  NOT NULL UNIQUE,
    name_en             VARCHAR(128) NOT NULL,
    name_cn             VARCHAR(128) NOT NULL,
    category            VARCHAR(32)  NOT NULL COMMENT 'MAJOR/WANDS/CUPS/SWORDS/PENTACLES',
    number              INT          NOT NULL,
    upright_meaning     TEXT,
    upright_meaning_cn  TEXT,
    reversed_meaning    TEXT,
    reversed_meaning_cn TEXT,
    image_path          TEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
