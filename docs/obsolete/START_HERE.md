# 🚀 START HERE - Quick Setup Guide

## ✅ **Todo lo que construí mientras tú lees esto:**

- ✅ **Motor automatizado completo** - Corre cada X horas y procesa todo automáticamente
- ✅ **Templates por defecto** - Se crean automáticamente cuando te registras
- ✅ **Sistema de autenticación** - Login con Google funcionando
- ✅ **Página de Prospects** - Tabla profesional para gestionar contactos
- ✅ **Todas las integraciones** - Gmail, Calendar, Gemini AI
- ✅ **API completa** - Backend 100% funcional

---

## 📝 **Tu Checklist (30 minutos)**

### **☐ Paso 1: Crear Base de Datos (5 min)**

1. Abre: https://neon.tech
2. Click "Sign Up" (usa GitHub o Google)
3. Click "Create Project"
   - Nombre: `rafagent-crm`
   - Region: US East (o la más cercana)
4. **COPIA** la Connection String
   - Se ve así: `postgresql://usuario:password@ep-xxx.region.neon.tech/neondb?sslmode=require`
   - **GUÁRDALA** en un lugar seguro

---

### **☐ Paso 2: Google Cloud Setup (15 min)**

1. Abre: https://console.cloud.google.com
2. Click en el selector de proyectos (arriba izquierda)
3. Click "New Project"
   - Nombre: `RafAgent`
   - Click "Create"

**Habilitar APIs:**
4. Ve a "APIs & Services" → "Library"
5. Busca "Gmail API" → Click "Enable"
6. Busca "Google Calendar API" → Click "Enable"

**Configurar OAuth:**
7. Ve a "APIs & Services" → "OAuth consent screen"
   - User Type: **External**
   - App name: `RafAgent`
   - User support email: Tu email
   - Developer contact: Tu email
   - Click "Save and Continue" hasta terminar

8. Ve a "APIs & Services" → "Credentials"
9. Click "+ CREATE CREDENTIALS" → "OAuth client ID"
   - Application type: **Web application**
   - Name: `RafAgent Web Client`
   - Authorized redirect URIs: `http://localhost:3000/auth/google/callback`
   - Click "Create"

10. **COPIA** el Client ID y Client Secret que aparecen
    - Client ID: `123456-abc.apps.googleusercontent.com`
    - Client Secret: `GOCSPX-abc123...`
    - **GUÁRDALOS**

11. Ve a "OAuth consent screen" → "Test users" → "+ ADD USERS"
    - Agrega tu email
    - Click "Save"

---

### **☐ Paso 3: Crear archivo .env (5 min)**

1. En Cursor, crea un archivo nuevo llamado `.env` (en la raíz del proyecto)
2. Copia esto y completa los valores:

```bash
# Base de Datos (del Paso 1)
DATABASE_URL=postgresql://TU-CONNECTION-STRING-AQUI

# Gemini AI (tu API key)
GEMINI_API_KEY=AIzaSy...

# Google OAuth (del Paso 2)
GOOGLE_CLIENT_ID=123456-abc.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-abc123...
GOOGLE_REDIRECT_URI=http://localhost:3000/auth/google/callback

# Server
PORT=3000
NODE_ENV=development

# Session Secret (cualquier texto largo aleatorio)
SESSION_SECRET=mi-secreto-super-seguro-123456
```

3. Guarda el archivo

---

### **☐ Paso 4: Instalar e Iniciar (5 min)**

Abre la terminal en Cursor y ejecuta:

```bash
# Instalar dependencias
npm install

# Crear tablas en la base de datos
npm run db:push

# Iniciar el servidor
npm run dev
```

Deberías ver:
```
serving on port 5000
```

---

### **☐ Paso 5: ¡Probarlo! (2 min)**

1. Abre tu navegador
2. Ve a: http://localhost:3000
3. Deberías ver la página de Login
4. Click "Continue with Google"
5. Autoriza Gmail y Calendar
6. ¡Listo! Deberías estar en el Dashboard

---

## 🎯 **¿Qué hacer después?**

1. **Ve a "Prospects"** (en el sidebar)
2. **Click "Add Prospect"**
3. **Agrega un contacto de prueba:**
   - Contact Name: Test User
   - Email: tu-email@gmail.com (usa tu propio email para probar)
   - Company: Test Company
   - ✅ Marca "Start sequence immediately"
4. **Click "Add Prospect"**
5. **Click el checkbox "Active"** para activar la secuencia
6. **Click el botón de email** para enviar el inicial

---

## ✅ **Lo que funciona AHORA:**

- ✅ Login con Google
- ✅ Agregar/editar prospectos
- ✅ Enviar emails iniciales
- ✅ Ver status en tiempo real
- ✅ Templates automáticos (ya están creados)
- ✅ Gmail signature incluida automáticamente
- ✅ Link directo al thread de Gmail

---

## 🤖 **Motor Automatizado**

El motor corre automáticamente cada 2 horas (configurable). Puedes también ejecutarlo manualmente:

**En la terminal:**
```bash
curl -X POST http://localhost:3000/api/agent/run \
  -H "Content-Type: application/json" \
  --cookie "connect.sid=TU-SESSION-ID"
```

O simplemente espera 2 horas y verás los follow-ups automáticos.

---

## 🆘 **Problemas Comunes**

**Error: "DATABASE_URL must be set"**
- Verifica que el `.env` esté en la raíz
- Verifica que `DATABASE_URL` esté correctamente copiado

**Error: "Gmail not connected"**
- Asegúrate de haber autorizado Gmail
- Intenta hacer logout y login de nuevo

**Error en npm install**
- Asegúrate de tener Node.js 20+ instalado
- Intenta: `rm -rf node_modules && npm install`

**No puedo loguearme**
- Verifica que agregaste tu email como "Test user" en Google Cloud
- Verifica que el GOOGLE_CLIENT_ID y SECRET estén correctos

---

## 📚 **Archivos Útiles**

- `SETUP_GUIDE.md` - Guía detallada paso a paso
- `WHATS_BUILT.md` - Lista completa de features
- `PROGRESS_REPORT.md` - Estado del proyecto
- `ENV_TEMPLATE.txt` - Plantilla de variables

---

## 💬 **¿Listo para probar?**

Sigue los pasos del checklist y avísame si:
- ✅ Todo funcionó perfecto
- ❌ Tuviste algún problema (te ayudo a solucionarlo)
- ❓ Tienes alguna duda

¡Vamos a hacer que funcione! 🚀

