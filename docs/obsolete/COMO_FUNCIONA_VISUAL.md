# 🎨 CÓMO FUNCIONA RAFAGENT - Guía Visual

> **Explicación visual y simple de tu arquitectura RafAgent**

---

## 🏗️ ARQUITECTURA COMPLETA

```
┌─────────────────────────────────────────────────────────────────┐
│                         TU RAFAGENT                              │
│                    (Arquitectura Híbrida)                        │
└─────────────────────────────────────────────────────────────────┘

         👤 Usuario visita
         https://rafagent-saas.vercel.app
                    │
                    ▼
┌────────────────────────────────────────────────────────────────┐
│                     FRONTEND (Vercel)                           │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  🎨 Interfaz de Usuario                                  │  │
│  │  ├─ Dashboard                                            │  │
│  │  ├─ Gestión de Prospectos                               │  │
│  │  ├─ Templates de Email                                   │  │
│  │  ├─ Analytics y Reportes                                 │  │
│  │  └─ Login con Google                                     │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  💰 Costo: $0/mes (gratis)                                      │
│  📊 Límite: 100GB bandwidth (suficiente para 1000+ usuarios)   │
└────────────────────────────┬───────────────────────────────────┘
                             │
                             │ API Calls (HTTPS)
                             │ credentials: 'include'
                             │
                             ▼
┌────────────────────────────────────────────────────────────────┐
│              BACKEND + MOTOR (Railway)                          │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  ⚙️ Express.js Server                                    │  │
│  │  ├─ Rutas API (/api/*)                                   │  │
│  │  ├─ Autenticación Google OAuth                           │  │
│  │  ├─ Sesiones (memorystore)                               │  │
│  │  └─ CORS configurado                                     │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  🤖 Motor de Automatización                              │  │
│  │  ├─ Scheduler (cron jobs cada 15 min)                    │  │
│  │  ├─ Envío de emails automáticos                          │  │
│  │  ├─ Análisis AI de respuestas (Gemini)                   │  │
│  │  ├─ Programación de reuniones (Google Calendar)          │  │
│  │  └─ Working Hours Intelligence                           │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  💰 Costo: $5/mes                                               │
│  📊 Límite: Ilimitado                                           │
│  ⏰ Uptime: 24/7 (no se apaga nunca)                            │
└────────────────────────────┬───────────────────────────────────┘
                             │
                             │ SQL Queries
                             │ (PostgreSQL Protocol)
                             │
                             ▼
┌────────────────────────────────────────────────────────────────┐
│                  BASE DE DATOS (Neon)                           │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  🗄️ PostgreSQL Serverless                               │  │
│  │  ├─ users (usuarios y vendedores)                        │  │
│  │  ├─ prospects (prospectos)                               │  │
│  │  ├─ sequences (secuencias de email)                      │  │
│  │  ├─ templates (plantillas de email)                      │  │
│  │  ├─ email_opens (tracking de aperturas)                  │  │
│  │  └─ analytics (métricas)                                 │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  💰 Costo: $0/mes (gratis)                                      │
│  📊 Límite: 3GB storage (~10,000 prospectos)                   │
└────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────┐
│                  SERVICIOS EXTERNOS                             │
│                                                                  │
│  🔐 Google Cloud Console                                        │
│  ├─ Gmail API (envío y lectura de emails)                      │
│  ├─ Calendar API (programación de reuniones)                   │
│  └─ OAuth (autenticación de usuarios)                          │
│                                                                  │
│  🤖 Google Gemini AI                                            │
│  └─ Análisis de respuestas de prospectos                       │
│                                                                  │
│  💰 Costo: $0/mes (plan gratuito)                              │
└────────────────────────────────────────────────────────────────┘
```

---

## 🔄 FLUJO DE UN EMAIL AUTOMÁTICO

```
INICIO: Usuario crea un prospecto en el frontend
│
├─ PASO 1: Frontend envía datos al Backend (Railway)
│   POST /api/prospects
│   {
│     name: "Juan Pérez",
│     email: "juan@empresa.com",
│     company: "Empresa ABC"
│   }
│
├─ PASO 2: Backend guarda prospecto en Base de Datos (Neon)
│   INSERT INTO prospects (name, email, company, status)
│   Status: "pending"
│
├─ PASO 3: Motor detecta nuevo prospecto (cada 15 min)
│   Cron Job: "*/15 * * * *"
│   SELECT * FROM prospects WHERE status = 'pending'
│
├─ PASO 4: Motor verifica Working Hours
│   ├─ Zona horaria del prospecto
│   ├─ Horario actual
│   └─ ¿Es buen momento para enviar? (9 AM - 6 PM)
│
├─ PASO 5: Motor prepara email
│   ├─ Selecciona template (Initial Contact)
│   ├─ Personaliza con datos del prospecto
│   └─ Agrega pixel de tracking
│
├─ PASO 6: Motor envía email vía Gmail API
│   Gmail API → juan@empresa.com
│   Subject: "Hola Juan..."
│   Body: "Plantilla personalizada..."
│
├─ PASO 7: Motor actualiza Base de Datos
│   UPDATE prospects SET status = 'contacted', last_contact = NOW()
│
└─ PASO 8: Motor programa siguiente seguimiento
    ├─ Si no responde en 3 días → Second Touch
    ├─ Si no responde en 7 días → Third Touch
    └─ Si no responde en 14 días → Fourth Touch
```

---

## 📧 FLUJO CUANDO UN PROSPECTO RESPONDE

```
INICIO: Prospecto responde al email
│
├─ PASO 1: Motor detecta nueva respuesta (cada 15 min)
│   Gmail API: checkForReplies()
│   Busca emails en inbox con threading correcto
│
├─ PASO 2: Motor analiza respuesta con AI (Gemini)
│   Gemini AI analiza el contenido:
│   ├─ Sentimiento: Positivo/Neutral/Negativo
│   ├─ Intención: Interesado/No interesado/Necesita más info
│   └─ Acción sugerida: Agendar reunión/Enviar más info/Cerrar
│
├─ PASO 3: Motor actualiza Base de Datos
│   UPDATE prospects SET 
│     status = 'replied',
│     sentiment = 'positive',
│     replied_at = NOW()
│
├─ PASO 4: ¿Prospecto está interesado?
│   ├─ SÍ → PASO 5
│   └─ NO → Marcar como "not_interested"
│
├─ PASO 5: Motor sugiere agendar reunión
│   ├─ Busca slots disponibles en Google Calendar
│   ├─ Genera respuesta automática con opciones
│   └─ Envía email con link a calendario
│
└─ PASO 6: Notifica al vendedor
    WebSocket → Frontend → Notificación en tiempo real
    "¡Juan Pérez respondió! Está interesado 🎉"
```

---

## 🔑 FLUJO DE LOGIN

```
INICIO: Usuario hace clic en "Continue with Google"
│
├─ PASO 1: Frontend redirige a Backend
│   Redirect: https://rafagent-engine-production.up.railway.app/auth/google
│
├─ PASO 2: Backend redirige a Google
│   Redirect: https://accounts.google.com/o/oauth2/v2/auth
│   Params:
│   ├─ client_id: 335742457345-...
│   ├─ redirect_uri: https://rafagent-engine-production.up.railway.app/auth/google/callback
│   └─ scope: gmail, calendar, userinfo
│
├─ PASO 3: Usuario autoriza en Google
│   Usuario hace clic en "Permitir"
│
├─ PASO 4: Google redirige de vuelta al Backend
│   Callback: /auth/google/callback?code=...
│
├─ PASO 5: Backend intercambia code por tokens
│   POST https://oauth2.googleapis.com/token
│   Response:
│   ├─ access_token
│   ├─ refresh_token
│   └─ expires_in
│
├─ PASO 6: Backend busca/crea usuario en Base de Datos
│   SELECT * FROM users WHERE email = 'user@gmail.com'
│   Si no existe → INSERT INTO users
│
├─ PASO 7: Backend crea sesión
│   Session Store (memorystore)
│   sessionId → { userId, tokens }
│
├─ PASO 8: Backend verifica secuencias por defecto
│   ensureDefaults() →
│   Si no existen → Crea "Standard Sequence" con 4 templates
│
└─ PASO 9: Backend redirige al Frontend
    Redirect: https://rafagent-saas.vercel.app/dashboard
    Cookie: sessionId=...
    
    Usuario ve: Dashboard con secuencias y opciones ✅
```

---

## 🔐 FLUJO DE SEGURIDAD (Cookies y Sessions)

```
┌─────────────────────────────────────────────────────────────┐
│  FRONTEND (rafagent-saas.vercel.app)                        │
│                                                              │
│  Cada request incluye:                                      │
│  ├─ credentials: 'include'  ← Importante!                  │
│  └─ Cookie: sessionId=abc123                                │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        │ HTTPS Request
                        │ + Cookie
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│  BACKEND (rafagent-engine-production.up.railway.app)        │
│                                                              │
│  Middleware verifica:                                       │
│  ├─ CORS permite el origen (rafagent-saas.vercel.app)      │
│  ├─ Cookie tiene sessionId válido                           │
│  └─ Session existe en memorystore                           │
│                                                              │
│  Si es válido:                                              │
│  ├─ Extrae userId de la sesión                             │
│  ├─ Carga datos del usuario                                │
│  └─ Procesa el request                                     │
│                                                              │
│  Si NO es válido:                                           │
│  └─ Return 401 Unauthorized                                │
└─────────────────────────────────────────────────────────────┘
```

---

## 📊 VARIABLES DE ENTORNO Y COMUNICACIÓN

```
┌──────────────────────────────────────────────────────────────┐
│                  FRONTEND (Vercel)                            │
│                                                               │
│  Environment Variables:                                      │
│  ├─ VITE_API_URL ← 🚨 FALTA AGREGAR (PASO 2)                │
│  │   = https://rafagent-engine-production.up.railway.app    │
│  │                                                           │
│  ├─ DATABASE_URL (no se usa en frontend, pero está ahí)     │
│  ├─ GOOGLE_CLIENT_ID                                         │
│  ├─ GOOGLE_CLIENT_SECRET                                     │
│  ├─ GEMINI_API_KEY                                           │
│  └─ SESSION_SECRET                                           │
│                                                               │
│  Código que usa VITE_API_URL:                               │
│  client/src/lib/api.ts:                                      │
│    export const API_BASE_URL =                               │
│      import.meta.env.VITE_API_URL || '...'                  │
└──────────────────────────────────────────────────────────────┘
                              │
                              │ API Calls
                              │ fetch(`${API_BASE_URL}/api/...`)
                              │
                              ▼
┌──────────────────────────────────────────────────────────────┐
│                  BACKEND (Railway)                            │
│                                                               │
│  Environment Variables:                                      │
│  ├─ DATABASE_URL ✅                                          │
│  ├─ GOOGLE_CLIENT_ID ✅                                      │
│  ├─ GOOGLE_CLIENT_SECRET ✅                                  │
│  ├─ GOOGLE_REDIRECT_URI ✅                                   │
│  │   = https://rafagent-engine-production.up.railway.app... │
│  ├─ GEMINI_API_KEY ✅                                        │
│  ├─ PORT = 3001 ✅                                           │
│  └─ NODE_ENV = production ✅                                 │
│                                                               │
│  CORS Configuration:                                         │
│  origin: [                                                   │
│    'https://rafagent-saas.vercel.app',                      │
│    'http://localhost:5173'                                   │
│  ],                                                           │
│  credentials: true                                           │
└──────────────────────────────────────────────────────────────┘
```

---

## 🎯 EL PROBLEMA ACTUAL Y LA SOLUCIÓN

### ❌ PROBLEMA ACTUAL

```
Usuario → Frontend (Vercel)
              │
              ├─ Intenta hacer login
              │
              └─ Frontend no sabe dónde está el Backend ❌
                 (Falta VITE_API_URL)
                 │
                 └─ Hace request a URL incorrecta
                    │
                    └─ ERROR 404 ❌
```

### ✅ SOLUCIÓN (PASO 2)

```
1. Agregar VITE_API_URL en Vercel:
   VITE_API_URL = https://rafagent-engine-production.up.railway.app

2. Redeploy Vercel

3. Ahora:
   Usuario → Frontend (Vercel)
               │
               ├─ Hace clic en login
               │
               ├─ Frontend sabe dónde está el Backend ✅
               │   (usa VITE_API_URL)
               │
               └─ Redirect correcto a Railway ✅
                   │
                   └─ Login funciona ✅
```

---

## 💡 CONCEPTOS CLAVE EXPLICADOS SIMPLE

### ¿Qué es CORS?
```
Frontend (Vercel):           Backend (Railway):
"Hola Backend,              "¿Quién eres?"
quiero datos"               │
    │                       ├─ Verifica origen
    │                       ├─ ¿Es vercel.app? ✅
    │                       └─ "OK, aquí están tus datos"
    └────────────────────────►
```

### ¿Qué son las Sessions?
```
Login:
Usuario → Backend crea sesión
          │
          ├─ Genera ID único: "abc123"
          ├─ Guarda en memoria: { abc123: { userId: 1 } }
          └─ Envía cookie al Frontend

Requests siguientes:
Usuario → Frontend envía cookie (abc123)
          │
          └─ Backend: "Ah, eres el usuario 1" ✅
```

### ¿Qué es el Motor de Automatización?
```
Es un programa que corre 24/7 en Railway:

Cada 15 minutos:
│
├─ Busca prospectos pendientes
├─ Verifica si es buen horario
├─ Envía emails automáticos
├─ Chequea respuestas
├─ Actualiza base de datos
└─ Repite...

Nunca se detiene! ⏰
```

---

## 🚀 PRÓXIMOS PASOS

Ahora que entiendes cómo funciona, es hora de completar los 3 pasos finales:

1. **Verifica Railway** está funcionando (VERDE)
2. **Agrega VITE_API_URL** en Vercel
3. **Prueba el login** en producción

**Lee:** `PASOS_FINALES_SIMPLES.md` para las instrucciones exactas.

---

**¡Con este conocimiento visual, entiendes mejor tu RafAgent que muchos desarrolladores! 💪**

