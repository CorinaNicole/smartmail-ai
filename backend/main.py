from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime, timedelta
from typing import Optional
import logging
import pandas as pd
import psycopg2
import psycopg2.extras
import bcrypt
import jwt
import os
from sklearn.pipeline import Pipeline
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ── Configuración ──────────────────────────────────────────────────────────────
SECRET_KEY  = os.getenv("SECRET_KEY", "smartmail_secret_2026")
ALGORITHM   = "HS256"
TOKEN_HOURS = 24

DB_CONFIG = {
    "host":     os.getenv("DB_HOST",     "postgres"),
    "port":     os.getenv("DB_PORT",     "5432"),
    "dbname":   os.getenv("DB_NAME",     "smartmail"),
    "user":     os.getenv("DB_USER",     "smartmail_user"),
    "password": os.getenv("DB_PASSWORD", "smartmail_pass"),
}
app = FastAPI(
    title="SmartMail AI",
    description="Sistema inteligente de detección de spam",
    version="2.0.0"
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

model        = None
model_stats  = {}
def get_db():
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        return conn
    except Exception as e:
        logger.error(f"Error conectando a DB: {e}")
        return None

def crear_token(data: dict):
    payload = data.copy()
    payload["exp"] = datetime.utcnow() + timedelta(hours=TOKEN_HOURS)
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

def verificar_token(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("user_id")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Token inválido")
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expirado")
    except Exception:
        raise HTTPException(status_code=401, detail="Token inválido")

@app.on_event("startup")
def load_model():
    global model, model_stats
    try:
        logger.info("⚙️ Entrenando modelo con dataset en español...")
        df = pd.read_csv(
            "/app/data/spam_espanol.tsv",
            sep="\t",
            header=None,
            names=["label", "text"],
            encoding="utf-8"
        )
        df["label_num"] = df["label"].map({"spam": 1, "ham": 0})
        df = df.dropna()
        X, y = df["text"], df["label_num"]
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42
        )
        model = Pipeline([
            ("tfidf", TfidfVectorizer(
                lowercase=True,
                max_features=5000,
                ngram_range=(1, 2)
            )),
            ("classifier", MultinomialNB(alpha=0.1))
        ])
        model.fit(X_train, y_train)
        y_pred = model.predict(X_test)
        model_stats = {
            "accuracy":  round(accuracy_score(y_test, y_pred)  * 100, 2),
            "precision": round(precision_score(y_test, y_pred, zero_division=0) * 100, 2),
            "recall":    round(recall_score(y_test, y_pred, zero_division=0)    * 100, 2),
            "f1_score":  round(f1_score(y_test, y_pred, zero_division=0)        * 100, 2),
            "total_train": len(X_train),
            "total_test":  len(X_test),
            "spam_count":  int(y.sum()),
            "ham_count":   int((y == 0).sum()),
        }
        logger.info(f"✅ Modelo listo — Accuracy: {model_stats['accuracy']}%")
    except Exception as e:
        logger.error(f"❌ Error al entrenar: {e}")

class RegisterInput(BaseModel):
    nombre:   str
    email:    str
    password: str
class PredictInput(BaseModel):
    text:   str
    canal:  Optional[str] = "web"
class PredictOutput(BaseModel):
    text:             str
    prediction:       str
    is_spam:          bool
    confidence:       float
    spam_probability: float
    ham_probability:  float
    canal:            str
    timestamp:        str

@app.post("/auth/register")
def register(data: RegisterInput):
    conn = get_db()
    if not conn:
        raise HTTPException(status_code=503, detail="Base de datos no disponible")
    try:
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        cur.execute("SELECT id FROM usuarios WHERE email = %s", (data.email,))
        if cur.fetchone():
            raise HTTPException(status_code=400, detail="Email ya registrado")
        hashed = bcrypt.hashpw(data.password.encode(), bcrypt.gensalt()).decode()
        cur.execute(
            "INSERT INTO usuarios (nombre, email, password_hash) VALUES (%s, %s, %s) RETURNING id, nombre, email",
            (data.nombre, data.email, hashed)
        )
        user = cur.fetchone()
        conn.commit()
        token = crear_token({"user_id": user["id"], "email": user["email"], "nombre": user["nombre"]})
        return {"token": token, "usuario": dict(user)}
    except HTTPException:
        raise
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()
@app.post("/auth/login")
def login(form: OAuth2PasswordRequestForm = Depends()):
    conn = get_db()
    if not conn:
        raise HTTPException(status_code=503, detail="Base de datos no disponible")
    try:
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        cur.execute("SELECT * FROM usuarios WHERE email = %s", (form.username,))
        user = cur.fetchone()
        if not user or not bcrypt.checkpw(form.password.encode(), user["password_hash"].encode()):
            raise HTTPException(status_code=401, detail="Credenciales incorrectas")
        token = crear_token({"user_id": user["id"], "email": user["email"], "nombre": user["nombre"]})
        return {"access_token": token, "token_type": "bearer", "nombre": user["nombre"]}
    finally:
        conn.close()
@app.get("/auth/me")
def me(current_user: dict = Depends(verificar_token)):
    return current_user

@app.post("/predict", response_model=PredictOutput)
def predict(msg: PredictInput, current_user: dict = Depends(verificar_token)):
    if model is None:
        raise HTTPException(status_code=503, detail="Modelo no disponible")

    text = msg.text.strip()
    if not text:
        raise HTTPException(status_code=400, detail="Texto vacío")

    pred  = model.predict([text])[0]
    probs = model.predict_proba([text])[0]
    is_spam    = bool(pred == 1)
    confidence = round(float(max(probs)) * 100, 2)
    timestamp  = datetime.now().isoformat()
    conn = get_db()
    if conn:
        try:
            cur = conn.cursor()
            cur.execute(
                """INSERT INTO predictions
                   (user_id, text, prediction, is_spam, confidence, canal, created_at)
                   VALUES (%s, %s, %s, %s, %s, %s, %s)""",
                (current_user["user_id"], text,
                 "spam" if is_spam else "ham",
                 is_spam, confidence, msg.canal, timestamp)
            )
            conn.commit()
        except Exception as e:
            logger.error(f"Error guardando predicción: {e}")
            conn.rollback()
        finally:
            conn.close()

    logger.info(f"[{msg.canal}] {'SPAM' if is_spam else 'HAM'} ({confidence}%) → {text[:50]}")

    return PredictOutput(
        text=text,
        prediction="spam" if is_spam else "ham",
        is_spam=is_spam,
        confidence=confidence,
        spam_probability=round(float(probs[1]) * 100, 2),
        ham_probability=round(float(probs[0]) * 100, 2),
        canal=msg.canal,
        timestamp=timestamp,
    )

@app.post("/predict/bot")
def predict_bot(msg: PredictInput):
    if model is None:
        raise HTTPException(status_code=503, detail="Modelo no disponible")
    text = msg.text.strip()
    if not text:
        raise HTTPException(status_code=400, detail="Texto vacío")
    pred  = model.predict([text])[0]
    probs = model.predict_proba([text])[0]
    is_spam    = bool(pred == 1)
    confidence = round(float(max(probs)) * 100, 2)
    return {
        "is_spam":    is_spam,
        "prediction": "spam" if is_spam else "ham",
        "confidence": confidence,
        "mensaje":    f"🚨 SPAM detectado ({confidence}%)" if is_spam else f"✅ Mensaje legítimo ({confidence}%)"
    }

@app.get("/stats")
def stats(current_user: dict = Depends(verificar_token)):
    conn = get_db()
    db_stats = {}
    if conn:
        try:
            cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
            cur.execute("""
                SELECT
                    COUNT(*) as total,
                    SUM(CASE WHEN is_spam THEN 1 ELSE 0 END) as total_spam,
                    SUM(CASE WHEN NOT is_spam THEN 1 ELSE 0 END) as total_ham,
                    ROUND(AVG(confidence)::numeric, 2) as confianza_promedio
                FROM predictions WHERE user_id = %s
            """, (current_user["user_id"],))
            db_stats = dict(cur.fetchone())

            cur.execute("""
                SELECT canal, COUNT(*) as total,
                       SUM(CASE WHEN is_spam THEN 1 ELSE 0 END) as spam
                FROM predictions WHERE user_id = %s
                GROUP BY canal ORDER BY total DESC
            """, (current_user["user_id"],))
            db_stats["por_canal"] = [dict(r) for r in cur.fetchall()]
        finally:
            conn.close()

    return {**model_stats, **db_stats}

@app.get("/historial")
def historial(current_user: dict = Depends(verificar_token), limit: int = 20):
    conn = get_db()
    if not conn:
        raise HTTPException(status_code=503, detail="Base de datos no disponible")
    try:
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        cur.execute("""
            SELECT id, text, prediction, is_spam, confidence, canal, created_at
            FROM predictions WHERE user_id = %s
            ORDER BY created_at DESC LIMIT %s
        """, (current_user["user_id"], limit))
        return [dict(r) for r in cur.fetchall()]
    finally:
        conn.close()

@app.get("/health")
def health():
    return {
        "status":       "ok" if model is not None else "error",
        "model_loaded": model is not None,
        "timestamp":    datetime.now().isoformat()
    }

@app.get("/")
def root():
    return {"message": "SmartMail AI v2.0 funcionando 🎉"}