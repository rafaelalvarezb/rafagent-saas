# 🔴 Solución: Railway en ROJO (Crashed)

## ¿Qué significa que Railway esté "crashed"?

Significa que el motor de automatización (backend) no está corriendo. Esto es normal durante el deployment, pero si persiste más de 5 minutos, hay un problema.

---

## ✅ SOLUCIÓN RÁPIDA (Funciona en 90% de los casos)

### Paso 1: Verificar las Variables de Entorno

1. **Ve a Railway:**
   ```
   https://railway.app/project/12223983-ee2d-498c-b05a-f54e8c524844
   ```

2. **Haz clic en:** `rafagent-engine`

3. **Haz clic en la pestaña:** `Variables`

4. **Verifica que TODAS estas variables estén presentes:**

   ```
   DATABASE_URL
   GOOGLE_CLIENT_ID
   GOOGLE_CLIENT_SECRET
   GOOGLE_REDIRECT_URI
   GEMINI_API_KEY
   PORT
   NODE_ENV
   ```

5. **Verifica específicamente que `GOOGLE_REDIRECT_URI` tenga este valor:**
   ```
   https://rafagent-engine-production.up.railway.app/auth/google/callback
   ```

6. **Si falta alguna variable o tiene un valor incorrecto:**
   - Haz clic en `Add Variable` o en el lápiz para editar
   - Corrígela
   - Railway automáticamente hará redeploy

---

## 🔍 SOLUCIÓN AVANZADA: Leer los Logs

### Paso 1: Ver qué está fallando

1. **En Railway, haz clic en:** `Deployments`

2. **Haz clic en el deployment en ROJO (crashed)**

3. **Haz clic en la pestaña:** `Deploy Logs`

4. **Busca las últimas 10-20 líneas** (arriba, las más recientes)

### Paso 2: Identificar el error común

Aquí están los errores más comunes y sus soluciones:

#### Error 1: "Cannot find module"
```
Error: Cannot find module 'X'
```

**Solución:** Falta instalar una dependencia.

**Qué hacer:**
1. Envíame el nombre del módulo faltante (la X)
2. Lo agregaré al package.json
3. Haremos un nuevo commit

---

#### Error 2: "DATABASE_URL is not defined"
```
Error: DATABASE_URL is not defined
```

**Solución:** Falta la variable de entorno DATABASE_URL.

**Qué hacer:**
1. Ve a `Variables` en Railway
2. Haz clic en `Add Variable`
3. **Name:** `DATABASE_URL`
4. **Value:** 
   ```
   postgresql://neondb_owner:npg_jSBEw6LTN7Yu@ep-autumn-recipe-aeis6a3s-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```
5. Guarda

---

#### Error 3: "Port already in use"
```
Error: Port 3000 already in use
```

**Solución:** El puerto no está configurado correctamente.

**Qué hacer:**
1. Ve a `Variables` en Railway
2. Verifica que `PORT` esté en `3001`
3. Si no existe, agrégala:
   - **Name:** `PORT`
   - **Value:** `3001`

---

#### Error 4: "Google OAuth failed"
```
Error: redirect_uri_mismatch
```

**Solución:** La URL de callback no está en Google Cloud Console.

**Qué hacer:**
1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Ve a `APIs & Services` → `Credentials`
3. Haz clic en tu OAuth client
4. En `Authorized redirect URIs`, verifica que esté:
   ```
   https://rafagent-engine-production.up.railway.app/auth/google/callback
   ```
5. Si no está, agrégala y guarda

---

#### Error 5: "Cannot connect to database"
```
Error: connect ECONNREFUSED
```

**Solución:** La base de datos no está accesible.

**Qué hacer:**
1. Ve a [Neon.tech](https://console.neon.tech/)
2. Verifica que el proyecto `rafagent-production` esté activo
3. Si está en pausa, haz clic en `Resume`
4. Verifica que el connection string sea el correcto en Railway

---

## 🚨 SOLUCIÓN DE EMERGENCIA: Redeploy Manual

Si nada funciona, fuerza un nuevo deployment:

### Paso 1: Hacer un pequeño cambio en el código

En tu computadora, abre la Terminal y ejecuta:

```bash
cd "/Users/anaramos/Desktop/RafAgent (from Replit to Cursor)/rafagent-engine"
```

```bash
git commit --allow-empty -m "force redeploy"
```

```bash
git push origin main
```

Esto forzará a Railway a hacer un nuevo deployment desde cero.

---

## 📞 ¿Todavía no funciona?

Si después de todos estos pasos Railway sigue crasheado:

1. **Copia los últimos 20 líneas de los logs de Railway**
2. **Envíamelas con este formato:**

```
ERROR DE RAILWAY:
---
[Pega aquí las últimas 20 líneas de los logs]
---

VARIABLES QUE TENGO CONFIGURADAS:
- DATABASE_URL: [Sí/No]
- GOOGLE_CLIENT_ID: [Sí/No]
- GOOGLE_CLIENT_SECRET: [Sí/No]
- GOOGLE_REDIRECT_URI: [Sí/No]
- GEMINI_API_KEY: [Sí/No]
- PORT: [Sí/No]
- NODE_ENV: [Sí/No]
```

3. **Te ayudaré a solucionarlo inmediatamente**

---

## ✅ ¿Cómo saber si Railway ya está funcionando?

Railway está funcionando correctamente cuando:

1. **El status dice:** `ACTIVE` (verde) ✅
2. **Puedes abrir esta URL sin error:**
   ```
   https://rafagent-engine-production.up.railway.app/health
   ```
3. **Ves un JSON como este:**
   ```json
   {
     "status": "healthy",
     "timestamp": "2025-10-27T...",
     "service": "rafagent-engine"
   }
   ```

---

## 💡 Consejos Pro

- **Los deployments toman 2-5 minutos:** No te preocupes si ves "Building..." o "Deploying..."
- **Los crashes al inicio son normales:** Railway puede intentar 2-3 veces antes de funcionar
- **Revisa los logs siempre:** Los logs te dirán exactamente qué está fallando

---

**¡Railway es súper confiable una vez configurado correctamente! 💪**

