# 🚀 RafAgent SaaS - Guía de Deployment Paso a Paso

## 📋 Prerrequisitos
- Cuenta de GitHub
- Cuenta de Vercel (gratuita)
- Cuenta de Google Cloud Console
- Cuenta de Neon Database (gratuita)

---

## 🔧 FASE 1: Configuración de Google Cloud Console

### Paso 1: Crear Proyecto en Google Cloud
1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Haz clic en "Select a project" → "New Project"
3. Nombre del proyecto: `rafagent-saas`
4. Haz clic en "Create"

### Paso 2: Habilitar APIs Necesarias
1. En el menú lateral, ve a "APIs & Services" → "Library"
2. Busca y habilita estas APIs:
   - **Gmail API**
   - **Google Calendar API**
   - **Google+ API** (para OAuth)

### Paso 3: Configurar OAuth Consent Screen
1. Ve a "APIs & Services" → "OAuth consent screen"
2. Selecciona "External" → "Create"
3. Completa la información:
   - **App name**: RafAgent
   - **User support email**: tu email
   - **Developer contact**: tu email
4. En "Scopes", agrega:
   - `https://www.googleapis.com/auth/gmail.send`
   - `https://www.googleapis.com/auth/gmail.readonly`
   - `https://www.googleapis.com/auth/calendar`
   - `https://www.googleapis.com/auth/userinfo.email`
   - `https://www.googleapis.com/auth/userinfo.profile`
5. En "Test users", agrega tu email
6. Guarda y continúa

### Paso 4: Crear Credenciales OAuth
1. Ve a "APIs & Services" → "Credentials"
2. Haz clic en "Create Credentials" → "OAuth client ID"
3. Tipo: "Web application"
4. Nombre: "RafAgent Web Client"
5. En "Authorized redirect URIs", agrega:
   - `http://localhost:3000/auth/google/callback` (para desarrollo)
   - `https://your-domain.vercel.app/auth/google/callback` (para producción)
6. Haz clic en "Create"
7. **¡IMPORTANTE!** Copia el **Client ID** y **Client Secret**

---

## 🗄️ FASE 2: Configuración de Base de Datos (Neon)

### Paso 1: Crear Cuenta en Neon
1. Ve a [Neon.tech](https://neon.tech/)
2. Haz clic en "Sign Up" (gratuito)
3. Conecta con GitHub

### Paso 2: Crear Base de Datos
1. Haz clic en "Create Project"
2. Nombre: `rafagent-production`
3. Región: `us-east-1` (más cerca de Vercel)
4. Haz clic en "Create Project"

### Paso 3: Obtener Connection String
1. En el dashboard, ve a "Connection Details"
2. Copia la **Connection String** (empieza con `postgresql://`)
3. **¡IMPORTANTE!** Esta será tu `DATABASE_URL`

---

## 🤖 FASE 3: Configuración de Gemini AI

### Paso 1: Obtener API Key
1. Ve a [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Haz clic en "Create API Key"
3. Selecciona tu proyecto de Google Cloud
4. Copia la **API Key**

---

## 📦 FASE 4: Preparar Código para GitHub

### Paso 1: Inicializar Git (si no está inicializado)
```bash
cd /Users/anaramos/Desktop/RafAgent\ \(from\ Replit\ to\ Cursor\)
git init
git add .
git commit -m "Initial commit - RafAgent SaaS ready for production"
```

### Paso 2: Crear Repositorio en GitHub
1. Ve a [GitHub.com](https://github.com/)
2. Haz clic en "New repository"
3. Nombre: `rafagent-saas`
4. Descripción: "RafAgent - AI-Powered B2B Sales Automation"
5. Haz clic en "Create repository"

### Paso 3: Conectar Repositorio Local
```bash
git remote add origin https://github.com/TU_USUARIO/rafagent-saas.git
git branch -M main
git push -u origin main
```

---

## 🚀 FASE 5: Deployment en Vercel

### Paso 1: Crear Cuenta en Vercel
1. Ve a [Vercel.com](https://vercel.com/)
2. Haz clic en "Sign Up"
3. Conecta con GitHub

### Paso 2: Importar Proyecto
1. Haz clic en "New Project"
2. Selecciona tu repositorio `rafagent-saas`
3. Haz clic en "Import"

### Paso 3: Configurar Variables de Entorno
En Vercel, ve a "Settings" → "Environment Variables" y agrega:

```
DATABASE_URL = postgresql://tu_connection_string_de_neon
GOOGLE_CLIENT_ID = tu_client_id_de_google
GOOGLE_CLIENT_SECRET = tu_client_secret_de_google
GOOGLE_REDIRECT_URI = https://tu-dominio.vercel.app/auth/google/callback
GEMINI_API_KEY = tu_api_key_de_gemini
SESSION_SECRET = genera_un_secreto_aleatorio
NODE_ENV = production
```

### Paso 4: Generar Session Secret
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Paso 5: Deploy
1. Haz clic en "Deploy"
2. Espera a que termine el build
3. ¡Tu aplicación estará disponible en `https://tu-proyecto.vercel.app`!

---

## 🔄 FASE 6: Configuración Final

### Paso 1: Actualizar Google OAuth Redirect URI
1. Ve a Google Cloud Console → Credentials
2. Edita tu OAuth client
3. Agrega la URL de producción: `https://tu-dominio.vercel.app/auth/google/callback`
4. Guarda los cambios

### Paso 2: Probar la Aplicación
1. Ve a tu URL de Vercel
2. Haz clic en "Login with Google"
3. Autoriza la aplicación
4. ¡Deberías ver el dashboard de RafAgent!

---

## 🎯 FASE 7: Configuración de Dominio Personalizado (Opcional)

### Paso 1: Comprar Dominio
1. Compra un dominio en Namecheap, GoDaddy, etc.
2. Ejemplo: `rafagent.com`

### Paso 2: Configurar en Vercel
1. En Vercel, ve a "Settings" → "Domains"
2. Agrega tu dominio
3. Sigue las instrucciones de DNS

### Paso 3: Actualizar OAuth
1. Actualiza el redirect URI en Google Cloud Console
2. Cambia a: `https://rafagent.com/auth/google/callback`

---

## ✅ Checklist Final

- [ ] Google Cloud Console configurado
- [ ] OAuth credentials creadas
- [ ] Neon database creada
- [ ] Gemini API key obtenida
- [ ] Código subido a GitHub
- [ ] Vercel configurado
- [ ] Variables de entorno configuradas
- [ ] Deploy exitoso
- [ ] Login con Google funcionando
- [ ] Base de datos conectada

---

## 🆘 Solución de Problemas Comunes

### Error: "Invalid redirect URI"
- Verifica que la URL en Google Cloud Console coincida exactamente con la de Vercel

### Error: "Database connection failed"
- Verifica que DATABASE_URL esté correctamente configurada
- Asegúrate de que Neon esté activo

### Error: "Authentication failed"
- Verifica GOOGLE_CLIENT_ID y GOOGLE_CLIENT_SECRET
- Asegúrate de que las APIs estén habilitadas

---

## 📞 Soporte

Si tienes problemas, revisa:
1. Los logs en Vercel Dashboard
2. La consola del navegador
3. Los logs de Neon Database

¡Tu RafAgent SaaS estará listo para usar! 🎉
