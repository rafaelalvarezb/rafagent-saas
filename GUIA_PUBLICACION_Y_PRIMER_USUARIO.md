# 🚀 Guía Paso a Paso: Publicar RafAgent y Probar con Primer Usuario

## 📋 PASO 1: Verificar Variables de Entorno

### A. Frontend (Vercel)

1. **Ve a Vercel Dashboard:**
   ```
   https://vercel.com/rafael-alvarezs-projects-43d604b9/rafagent-saas
   ```

2. **Haz click en:** `Settings` → `Environment Variables`

3. **Verifica que esta variable esté configurada:**
   - `VITE_API_URL` = `https://rafagent-engine-production.up.railway.app`
   - ✅ Debe estar en **Production** environment

### B. Backend (Railway)

1. **Ve a Railway Dashboard:**
   ```
   https://railway.app/project/12223983-ee2d-498c-b05a-f54e8c524844/service/8c3ff196-0f52-4e00-b297-ce477feea350
   ```

2. **Haz click en:** `Variables`

3. **Verifica que estas variables estén configuradas:**
   - ✅ `DATABASE_URL` = Tu connection string de Neon PostgreSQL
   - ✅ `GOOGLE_CLIENT_ID` = Tu Google OAuth Client ID
   - ✅ `GOOGLE_CLIENT_SECRET` = Tu Google OAuth Client Secret
   - ✅ `GOOGLE_REDIRECT_URI` = `https://rafagent-engine-production.up.railway.app/api/auth/google/callback`
   - ✅ `GEMINI_API_KEY` = Tu API key de Google Gemini
   - ✅ `FRONTEND_URL` = `https://rafagent-saas.vercel.app`
   - ✅ `ADMIN_EMAIL` = `rafaelalvrzb@gmail.com` (ya lo agregaste ✅)
   - ✅ `SESSION_SECRET` = Un string secreto aleatorio
   - ✅ `NODE_ENV` = `production`
   - ✅ `PORT` = `3001` (o el puerto que Railway asigne)

---

## 🔐 PASO 2: Configurar Google Cloud Console

1. **Ve a Google Cloud Console:**
   ```
   https://console.cloud.google.com/apis/credentials
   ```

2. **Selecciona tu proyecto** y luego tu **OAuth 2.0 Client ID**

3. **En "Authorized JavaScript origins", verifica que esté:**
   - ✅ `https://rafagent-saas.vercel.app`
   - ✅ `https://rafagent-engine-production.up.railway.app`

4. **En "Authorized redirect URIs", verifica que esté:**
   - ✅ `https://rafagent-engine-production.up.railway.app/api/auth/google/callback`

5. **Si falta alguna, agrégalas y guarda**

---

## ✅ PASO 3: Verificar Deployments

### Frontend (Vercel)
1. **Ve a:** `Deployments` en Vercel
2. **Verifica que el último deployment esté en estado "Ready"** (verde)
3. **Confirma que el commit más reciente incluya:**
   ```
   fix: Fix Automation Engine status display and restrict to admin only
   ```
4. Si no está deployado, espera 1-2 minutos

### Backend (Railway)
1. **Ve a:** `Deployments` en Railway
2. **Verifica que el último deployment esté en estado "ACTIVE"** (verde)
3. **Confirma que el deployment sea exitoso** (checkmark verde)

---

## 🧪 PASO 4: Prueba con Tu Cuenta (Admin)

1. **Abre una ventana de incógnito:**
   - Chrome: `Cmd+Shift+N` (Mac) o `Ctrl+Shift+N` (Windows)
   - Firefox: `Cmd+Shift+P` (Mac) o `Ctrl+Shift+P` (Windows)

2. **Ve a tu aplicación:**
   ```
   https://rafagent-saas.vercel.app
   ```

3. **Haz login con tu cuenta admin:**
   - Email: `rafaelalvrzb@gmail.com`
   - Verifica que funcione sin errores

4. **Verifica que veas la sección "Automation Engine":**
   - ✅ Debe aparecer en el Dashboard
   - ✅ Debe mostrar datos reales (no NaN, no Invalid Date)

5. **Prueba funcionalidades básicas:**
   - ✅ Agregar un prospecto
   - ✅ Ver templates
   - ✅ Ver configuration
   - ✅ Verificar que timezone esté configurado

---

## 👤 PASO 5: Probar con Primer Usuario (Cuenta Nueva)

### Preparación

1. **Prepara una cuenta de Google diferente:**
   - Usa otra cuenta de Gmail (no `rafaelalvrzb@gmail.com`)
   - Puede ser una cuenta personal, de prueba, o de un colega que te dé permiso

### Prueba del Primer Usuario

2. **Abre otra ventana de incógnito** (nueva ventana completamente limpia)

3. **Ve a la aplicación:**
   ```
   https://rafagent-saas.vercel.app
   ```

4. **Haz click en "Continue with Google"**

5. **Selecciona la cuenta nueva** (NO tu cuenta admin)

6. **Acepta los permisos** de Google OAuth

7. **Verifica que se redirija correctamente al Dashboard**

---

## ✅ PASO 6: Verificaciones del Primer Usuario

### A. Verificar que NO vea Automation Engine

1. **En el Dashboard del usuario nuevo, verifica:**
   - ✅ **NO** debe aparecer la sección "Automation Engine"
   - ✅ Solo debe ver:
     - Sales Overview (métricas)
     - Achievements
     - Recent Activity
     - Dashboard Stats

### B. Verificar Detección de Timezone

1. **Ve a Configuration** (⚙️ en el sidebar)
2. **Verifica en "Active Timezone":**
   - ✅ Debe mostrar el timezone detectado automáticamente del navegador
   - ✅ Si está en otra ciudad/país, debe detectar el timezone correcto
   - ✅ Ejemplo: Si está en Buenos Aires, debe mostrar "Argentina Time" o similar

### C. Verificar Funcionalidades Básicas

1. **Agregar un Prospecto:**
   - Ve a "Prospects" → "+ Add Prospect"
   - Completa los campos:
     - Contact First Name: `Juan`
     - Contact Email: `juan@ejemplo.com`
     - Company Name: `Empresa Test`
   - Selecciona una sequence
   - Haz click en "Send Sequence"
   - ✅ Debe agregarse exitosamente

2. **Ver Templates:**
   - Ve a "Templates"
   - ✅ Debe mostrar los templates default
   - ✅ Debe poder editar templates

3. **Ver Configuration:**
   - Ve a "Configuration"
   - ✅ Debe mostrar la configuración del usuario
   - ✅ Debe poder modificar timezone, working hours, etc.
   - ✅ Debe poder guardar cambios

### D. Verificar en Tu Cuenta Admin

1. **Vuelve a tu cuenta admin** (rafaelalvrzb@gmail.com)

2. **Ve al Dashboard**

3. **Verifica que en "Automation Engine":**
   - ✅ Total Users: Debe ser **2** (tú + el usuario nuevo)
   - ✅ Active Users: Debe mostrar usuarios con actividad reciente
   - ✅ Uptime: Debe mostrar tiempo desde que Railway inició
   - ✅ Status: "running"
   - ✅ Last updated: Debe mostrar hora actual

---

## 🧪 PASO 7: Prueba de Conversión de Timezone

### Prueba con Primer Usuario

1. **Desde el usuario nuevo, agrega un prospecto:**
   - Ve a Prospects → "+ Add Prospect"
   - Completa los datos y envía la secuencia

2. **Simula una respuesta desde ese prospecto:**
   - Desde el correo del prospecto, responde:
   ```
   "Claro, podemos hablar el lunes a las 12 pm hora argentina por favor"
   ```

3. **Ejecuta el agente:**
   - Desde Prospects → "Execute AI Agent Now"
   - O espera a que el agente se ejecute automáticamente

4. **Verifica en Google Calendar del usuario:**
   - ✅ La reunión debe estar agendada
   - ✅ La hora debe estar convertida al timezone del usuario
   - ✅ Ejemplo: Si usuario está en México y prospecto dijo "12pm Argentina", debe agendar a las 9am México

---

## 📊 PASO 8: Verificar Logs y Monitoreo

### A. Logs de Railway

1. **Ve a Railway** → Tu servicio → `Logs`

2. **Verifica que no haya errores críticos:**
   - ✅ "RafAgent Backend server running on port..."
   - ✅ "Database connected"
   - ✅ No hay errores 500 repetidos
   - ✅ No hay errores de conexión a base de datos

### B. Logs de Vercel (Opcional)

1. **Ve a Vercel** → Tu proyecto → `Logs`

2. **Verifica:**
   - ✅ No hay errores de build
   - ✅ Deployments exitosos

---

## ✅ Checklist Final

Antes de considerar que la publicación fue exitosa:

- [ ] ✅ Login funciona para admin
- [ ] ✅ Login funciona para usuario nuevo
- [ ] ✅ Usuario nuevo NO ve Automation Engine
- [ ] ✅ Admin SÍ ve Automation Engine
- [ ] ✅ Timezone se detecta automáticamente para usuario nuevo
- [ ] ✅ Usuario nuevo puede agregar prospectos
- [ ] ✅ Usuario nuevo puede ver templates
- [ ] ✅ Usuario nuevo puede modificar configuration
- [ ] ✅ Automation Engine muestra Total Users correcto (2+ usuarios)
- [ ] ✅ Conversión de timezone funciona
- [ ] ✅ No hay errores en consola del navegador
- [ ] ✅ No hay errores críticos en logs de Railway

---

## 🚨 Solución de Problemas Comunes

### Problema: Usuario nuevo ve Automation Engine

**Solución:**
1. Verifica que `ADMIN_EMAIL` en Railway sea exactamente `rafaelalvrzb@gmail.com`
2. Verifica que el usuario nuevo tenga un email diferente
3. Refresca la página (Cmd+Shift+R o Ctrl+Shift+R)

### Problema: Login no funciona para usuario nuevo

**Solución:**
1. Verifica que `GOOGLE_REDIRECT_URI` en Railway sea correcto
2. Verifica que Google Cloud Console tenga el redirect URI correcto
3. Revisa los logs de Railway para ver el error específico

### Problema: Timezone no se detecta automáticamente

**Solución:**
1. Verifica que el navegador del usuario nuevo permita detectar timezone
2. Verifica que el usuario pueda cambiarlo manualmente en Configuration
3. Verifica logs de Railway para ver si hay errores en la detección

### Problema: Automation Engine muestra NaN o Invalid Date

**Solución:**
1. Verifica que Railway esté deployado con los últimos cambios
2. Verifica que el endpoint `/api/engine/status` esté funcionando
3. Revisa los logs de Railway para ver errores específicos

---

## 📝 URLs Importantes

### Frontend
- **App URL:** https://rafagent-saas.vercel.app
- **Vercel Dashboard:** https://vercel.com/rafael-alvarezs-projects-43d604b9/rafagent-saas

### Backend
- **Backend URL:** https://rafagent-engine-production.up.railway.app
- **Railway Dashboard:** https://railway.app/project/12223983-ee2d-498c-b05a-f54e8c524844

### Configuración
- **Google Cloud Console:** https://console.cloud.google.com/apis/credentials
- **Neon Database:** https://console.neon.tech

---

## 🎉 ¡Publicación Exitosa!

Una vez que hayas completado todos los pasos y verificaciones:

1. **Comparte la URL** con tus usuarios:
   ```
   https://rafagent-saas.vercel.app
   ```

2. **Monitorea el uso** en Railway y Vercel

3. **Recopila feedback** de los primeros usuarios

4. **Ajusta según sea necesario** basándote en el uso real

---

## ✨ Próximos Pasos

Después de que varios usuarios estén usando la app:

1. **Monitorea errores** en logs de Railway
2. **Recopila feedback** de usuarios
3. **Optimiza queries** lentas si es necesario
4. **Agrega features** basados en feedback real

---

**¡Felicitaciones! Tu RafAgent está listo para ser usado por vendedores reales.** 🚀

