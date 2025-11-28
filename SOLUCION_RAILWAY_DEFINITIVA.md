# ✅ Solución Definitiva: Conectar Railway a rafagent-saas

## 🔍 Problema Identificado

- **rafagent-saas** → Tiene todos los cambios nuevos ✅
- **rafagent-engine** → Tiene commits antiguos con secrets que GitHub bloquea ❌
- **Railway** → Está conectado a `rafagent-engine` (el que tiene problemas)

## ✅ Solución: Cambiar Railway a rafagent-saas

Railway puede usar el mismo repositorio que Vercel, solo necesitas configurarlo para que use solo la carpeta `server/` como root.

---

## 📋 PASO A PASO (Hazlo Ahora)

### Paso 1: Ir a Railway Settings

1. **Ve a Railway:**
   ```
   https://railway.app/project/12223983-ee2d-498c-b05a-f54e8c524844/service/8c3ff196-0f52-4e00-b297-ce477feea350
   ```

2. **Haz clic en la pestaña "Settings"** (arriba, junto a Deployments, Variables, Metrics)

### Paso 2: Cambiar el Repositorio

1. **Busca la sección "Source"** o **"Repository"**
2. **Haz clic en "Change Repository"** o el botón de editar (lápiz)
3. **Selecciona:** `rafaelalvarezb/rafagent-saas`
4. **Branch:** `main`
5. **Root Directory:** `./` (o déjalo vacío)
6. **Guarda los cambios**

### Paso 3: Configurar Build Settings (IMPORTANTE)

Railway necesita saber qué comando ejecutar. En Settings, busca "Build Command" y "Start Command":

1. **Build Command:** (déjalo vacío o `npm install`)
2. **Start Command:** `npm start`

O si Railway tiene una sección "Deploy", verifica que:
- **Build Command:** `npm install`
- **Start Command:** `npm start`

### Paso 4: Verificar Variables de Entorno

Asegúrate de que todas las variables estén configuradas (deberían estar, pero verifica):

- `DATABASE_URL`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GOOGLE_REDIRECT_URI` = `https://rafagent-engine-production.up.railway.app/api/auth/google/callback`
- `GEMINI_API_KEY`
- `FRONTEND_URL` = `https://rafagent-saas.vercel.app`
- `NODE_ENV` = `production`
- `PORT` = (déjalo que Railway lo asigne automáticamente)

### Paso 5: Esperar el Deploy

1. Railway automáticamente detectará el cambio y hará un nuevo deploy
2. Ve a la pestaña **"Deployments"**
3. Deberías ver un nuevo deploy con el commit más reciente:
   - `"chore: Force Railway redeploy for mailboxes feature"`
   - `"fix: Auto-sync user main mailbox..."`
   - `"feat: Add multiple mailboxes system..."`
4. Espera 2-3 minutos a que termine

---

## ✅ Verificación

Una vez que el deploy termine:

1. **Ve a la pestaña "Deployments"**
2. **Verifica que el deploy más reciente tenga:**
   - ✅ Status: "Deployment successful" (verde)
   - ✅ Commit: Uno de los commits recientes de mailboxes
3. **Prueba en Sendlr.ai:**
   - Refresca la página de Mailboxes
   - Deberías ver tu mailbox `rafaelalvrzb@gmail.com` automáticamente

---

## 🐛 Si Algo No Funciona

### Error: "Cannot find module"
**Solución:** Verifica que el `package.json` esté en la raíz del proyecto (está en `rafagent-saas`)

### Error: "Build failed"
**Solución:** 
1. Ve a "Deployments" → Haz clic en el deploy fallido
2. Ve a "Deploy Logs"
3. Copia los últimos 20-30 líneas y envíamelas

### Railway sigue mostrando el commit antiguo
**Solución:**
1. Haz clic en "Redeploy" manualmente
2. O espera 5 minutos (a veces Railway tarda en detectar cambios)

---

## 📝 Nota Importante

Una vez que Railway esté conectado a `rafagent-saas`:
- ✅ Todos los cambios futuros se desplegarán automáticamente
- ✅ No necesitarás sincronizar entre repos
- ✅ Railway y Vercel usarán el mismo código base

---

**¿Listo?** Sigue los pasos y avísame cuando Railway muestre el deploy correcto! 🚀

