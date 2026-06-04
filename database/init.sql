-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS usuarios (
    id            SERIAL PRIMARY KEY,
    nombre        VARCHAR(100) NOT NULL,
    email         VARCHAR(150) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at    TIMESTAMP DEFAULT NOW()
);

-- Tabla de predicciones
CREATE TABLE IF NOT EXISTS predictions (
    id          SERIAL PRIMARY KEY,
    user_id     INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
    text        TEXT NOT NULL,
    prediction  VARCHAR(4) NOT NULL,
    is_spam     BOOLEAN NOT NULL,
    confidence  DECIMAL(5,2),
    canal       VARCHAR(20) DEFAULT 'web',
    created_at  TIMESTAMP DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_predictions_user    ON predictions(user_id);
CREATE INDEX IF NOT EXISTS idx_predictions_created ON predictions(created_at);
CREATE INDEX IF NOT EXISTS idx_predictions_canal   ON predictions(canal);

-- Vista de estadísticas por usuario
CREATE OR REPLACE VIEW stats_por_usuario AS
SELECT
    u.id,
    u.nombre,
    u.email,
    COUNT(p.id)                                        AS total_mensajes,
    SUM(CASE WHEN p.is_spam THEN 1 ELSE 0 END)         AS total_spam,
    SUM(CASE WHEN NOT p.is_spam THEN 1 ELSE 0 END)     AS total_ham,
    ROUND(AVG(p.confidence)::numeric, 2)               AS confianza_promedio
FROM usuarios u
LEFT JOIN predictions p ON p.user_id = u.id
GROUP BY u.id, u.nombre, u.email;

-- Usuario de prueba (contraseña: 123456)
INSERT INTO usuarios (nombre, email, password_hash)
VALUES (
    'Corina',
    'corina@test.com',
    '$2b$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uaa6XFaYa'
) ON CONFLICT DO NOTHING;