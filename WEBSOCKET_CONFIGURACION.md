# 🔌 WEBSOCKET - CONFIGURACIÓN PARA PRODUCCIÓN

## ✅ CAMBIOS REALIZADOS

### 1. Frontend (`src/hooks/use-websocket.tsx`)
- ✅ Removida línea que deshabilitaba WebSocket en producción
- ✅ Configurada URL dinámica: Railway en producción, localhost en desarrollo
- ✅ Mejorado logging para debugging

### 2. Backend (`server/services/websocket.ts`)
- ✅ Configurado CORS para permitir conexiones desde Vercel
- ✅ Agregados múltiples orígenes permitidos:
  - `https://rafagent-saas.vercel.app` (producción)
  - `http://localhost:5173` (desarrollo)
  - `http://localhost:5174` (Vite preview)
- ✅ Habilitados transports: websocket y polling (fallback)
- ✅ Mejorado logging de conexiones

---

## 🚀 DEPLOYMENT COMPLETADO

### Backend (Railway):
```
✅ Commit: 40939e4
✅ Push exitoso
✅ Railway auto-deploy: EN PROGRESO (~3-5 minutos)
```

### Frontend (Vercel):
```
✅ Commit: 7f44951
✅ Push exitoso
✅ Vercel auto-deploy: EN PROGRESO (~2-3 minutos)
```

---

## ⏱️ TIEMPO DE ESPERA

**Espera 5 minutos** para que ambos deployments terminen:
- Railway (backend): 3-5 minutos
- Vercel (frontend): 2-3 minutos

---

## ✅ CÓMO VERIFICAR QUE WEBSOCKET FUNCIONA

### Paso 1: Abrir la Consola del Navegador

1. Ve a: https://rafagent-saas.vercel.app/prospects
2. Abre DevTools: **F12** o **Cmd+Option+I** (Mac)
3. Ve a la pestaña **Console**

### Paso 2: Buscar Mensajes de WebSocket

Deberías ver estos mensajes en la consola:

#### ✅ CONEXIÓN EXITOSA:
```
🔌 Attempting to connect to WebSocket: https://rafagent-engine-production.up.railway.app
👤 User ID: [tu-user-id]
🌍 Environment: PRODUCTION
🔌 WebSocket connected to: [URL]
📤 Sent join event for user: [tu-user-id]
```

#### ❌ SI AÚN DICE ESTO (malo):
```
⚠️ WebSocket disabled in production - using polling instead
🔄 Polling for updates...
```

Significa que:
- El deployment de Vercel aún no terminó, O
- Tu navegador tiene cache viejo (Shift+Cmd+R para hard refresh)

---

## 🧪 PROBAR WEBSOCKET EN TIEMPO REAL

### Test 1: Execute AI Agent Now

1. Ve a **Prospects** (https://rafagent-saas.vercel.app/prospects)
2. Click en **"Execute AI Agent Now"**
3. **Observa la consola** - deberías ver mensajes como:
   ```
   📡 Prospect status changed: { prospectId: "...", status: "📝 Drafting next touch" }
   🔄 Invalidating and refetching prospects...
   ```

4. **Observa la UI** - el status del prospect debería actualizarse **instantáneamente** sin refrescar la página

### Test 2: Verificar Actualizaciones Automáticas

1. Abre **dos pestañas** del mismo prospect
2. En una pestaña, cambia algo (ej: edita un prospect)
3. La **otra pestaña** debería actualizarse automáticamente

---

## 📊 DIFERENCIAS: WebSocket vs Polling

### ANTES (Polling):
```
⚠️ WebSocket disabled in production - using polling instead
🔄 Polling for updates...   (cada 3 segundos)
🔄 Polling for updates...   (cada 3 segundos)
🔄 Polling for updates...   (cada 3 segundos)
```
- ❌ Actualizaciones cada 3 segundos
- ❌ Muchos requests al servidor
- ❌ Menos eficiente

### AHORA (WebSocket):
```
🔌 WebSocket connected
📡 Prospect status changed: ...  (instantáneo)
📡 Prospect updated: ...         (instantáneo)
```
- ✅ Actualizaciones instantáneas
- ✅ 1 sola conexión persistente
- ✅ Más eficiente y "dopamínico"

---

## 🐛 TROUBLESHOOTING

### Problema 1: Sigue diciendo "WebSocket disabled"

**Solución:**
1. Hard refresh: **Shift+Cmd+R** (Mac) o **Shift+Ctrl+F5** (Windows)
2. Limpia cache del navegador
3. Verifica que el deployment de Vercel haya terminado: https://vercel.com/dashboard

### Problema 2: WebSocket se conecta pero se desconecta inmediatamente

**Causa:** CORS o configuración de Railway

**Solución:**
1. Verifica que `FRONTEND_URL` esté configurada en Railway:
   - Ve a Railway Dashboard
   - Selecciona `rafagent-engine`
   - Ve a **Variables**
   - Verifica que existe: `FRONTEND_URL=https://rafagent-saas.vercel.app`

2. Si no existe, agrégala:
   ```
   FRONTEND_URL = https://rafagent-saas.vercel.app
   ```

3. Haz redeploy de Railway

### Problema 3: Error "CORS policy"

**Causa:** El origen no está permitido

**Solución:**
- Verifica que el backend tenga la configuración correcta (ya la tiene)
- Verifica que Railway haya hecho redeploy (espera 5 minutos)

---

## 📝 LOGS ÚTILES PARA DEBUGGING

### En el Frontend (Consola del Navegador):

**Buenos logs (funciona):**
```javascript
🔌 Attempting to connect to WebSocket: https://...
🔌 WebSocket connected to: wss://...
📤 Sent join event for user: abc123
📡 Prospect status changed: {...}
```

**Malos logs (no funciona):**
```javascript
❌ WebSocket connection error: {...}
❌ WebSocket disconnected
🔄 WebSocket reconnection failed after all attempts
```

### En el Backend (Railway Logs):

**Buenos logs (funciona):**
```
🔌 Initializing WebSocket with CORS origins: [...]
🔌 Client connected: [socket-id] from [ip]
✅ User abc123 joined their room
📡 Emitted "prospect:status" to user abc123
```

---

## 🎉 RESULTADO ESPERADO

Cuando funcione correctamente:

1. **Consola limpia** - Sin "WebSocket disabled" ni "Polling for updates"
2. **Actualizaciones instantáneas** - El status cambia en tiempo real
3. **Toast notifications** - Aparecen cuando hay cambios
4. **UX dopamínica** - Ver los cambios en vivo es motivador

---

## ⏰ CHECKLIST DE VERIFICACIÓN (5 minutos después del deploy)

- [ ] Abrir https://rafagent-saas.vercel.app/prospects
- [ ] Abrir consola (F12)
- [ ] Buscar "🔌 WebSocket connected"
- [ ] NO debe aparecer "⚠️ WebSocket disabled"
- [ ] NO debe aparecer "🔄 Polling for updates"
- [ ] Click en "Execute AI Agent Now"
- [ ] Ver mensajes "📡 Prospect status changed"
- [ ] Ver que el status se actualiza instantáneamente

---

## 📞 SI TODO FUNCIONA

Si ves en la consola:
```
🔌 WebSocket connected to: wss://rafagent-engine-production.up.railway.app
✅ User [tu-id] joined their room
```

**¡ÉXITO!** 🎉 WebSocket está funcionando en producción.

---

## 📞 SI NO FUNCIONA DESPUÉS DE 5 MINUTOS

1. Verifica que los deployments hayan terminado:
   - Vercel: https://vercel.com/dashboard
   - Railway: https://railway.app/dashboard

2. Haz hard refresh: **Shift+Cmd+R**

3. Revisa los logs de Railway para ver errores de WebSocket

4. Si sigue sin funcionar, avísame y revisaremos juntos.

---

**Deployments completados. Espera 5 minutos y verifica según esta guía.** ⏱️

