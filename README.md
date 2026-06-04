# 📧 SmartMail AI

Sistema de detección de spam multicanal con inteligencia artificial. Detecta spam con >97% de confianza usando un modelo Naive Bayes entrenado con datos en español/LATAM.

---

## ⚙️ Requisitos previos

Antes de empezar, asegúrate de tener instalado:

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) 
- Python 3.10 o superior (solo para el bot de Discord)
- Git

---

## 🚀 Cómo levantar el proyecto

### 1. Clonar el repositorio

```bash
git clone https://github.com/TU_USUARIO/smartmail-ai.git
cd smartmail-ai
```

### 2. Abrir Docker Desktop

Abre **Docker Desktop** desde el menú inicio y espera a que diga **Engine running** (ícono de ballena 🐳 en la barra de tareas).

### 3. Levantar todos los servicios

```bash
docker-compose up --build
```

La primera vez tarda unos minutos porque descarga las imágenes. Las siguientes veces:

```bash
docker-compose up
```

### 4. Verificar que todo esté corriendo

En Docker Desktop deberías ver estos contenedores en verde:

| Contenedor | Puerto |
|---|---|
| smartmail_frontend | 3000 |
| smartmail_api | 8000 |
| smartmail_db | 5432 |
| smartmail_n8n | 5678 |

---

## 🌐 Acceder a los servicios

| Servicio | URL |
|---|---|
| 🖥️ Frontend (app web) | http://localhost:3000 |
| ⚡ API | http://localhost:8000 |
| 🔧 n8n (automatización) | http://localhost:5678 |

---

## 🤖 Levantar el bot de Discord

El bot corre por separado. Abre una terminal adicional y ejecuta:

```bash
# Instalar dependencias (solo la primera vez)
pip install discord.py requests

# Correr el bot
python discord_bot.py
```

Si dice `Bot conectado como ...` significa que está funcionando correctamente.

> ⚠️ El bot necesita que la API esté corriendo primero (paso 3).

---

## 🛑 Detener el proyecto

```bash
docker-compose down
```

---

## 📁 Estructura del proyecto

```
smartmail-ai/
├── backend/
│   ├── main.py              # API FastAPI
│   ├── model/spam_model.pkl # Modelo entrenado
│   ├── data/                # Dataset español/LATAM
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── pages/           # Login, Register, Analizar, Dashboard, Historial
│   │   ├── components/      # Navbar, AlertaSpam, DarkModeToggle, etc.
│   │   └── services/        # api.js, auth.js
│   └── Dockerfile
├── database/
│   └── init.sql             # Inicialización de la BD
├── n8n/
│   ├── telegram_workflow.json
│   └── discord_workflow.json
├── discord_bot.py           # Bot de Discord
└── docker-compose.yml
```

---

## 🧠 Modelo de ML

- **Algoritmo:** Multinomial Naive Bayes + TF-IDF
- **Precisión:** ~95.8%
- **Dataset:** Español/LATAM
- **Confianza en detección:** >97%

---

## ❓ Problemas frecuentes

**Error: "failed to connect to the docker API"**  
→ Docker Desktop no está abierto. Ábrelo y espera a que cargue.

**El frontend no carga**  
→ Espera unos segundos más, a veces tarda en compilar la primera vez.

**El bot de Discord no conecta**  
→ Asegúrate de que la API esté corriendo en http://localhost:8000 antes de iniciar el bot.
