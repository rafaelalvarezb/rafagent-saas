# 🔧 PASOS FINALES PARA COMPLETAR EL DEPLOYMENT

## ✅ LO QUE YA HICE:

1. ✅ Moví el backend completo al motor (rafagent-engine)
2. ✅ Configuré CORS para permitir llamadas desde Vercel
3. ✅ Actualicé el frontend para usar el API de Railway
4. ✅ Agregué todas las dependencias necesarias

---

## 📋 LO QUE TÚ NECESITAS HACER AHORA:

### **PASO 1: Actualizar Variable en Railway** (2 minutos)

1. Ve a Railway → Proyecto "profound-reverence" → rafagent-engine
2. Haz clic en "Variables"
3. **ACTUALIZA** la variable `GOOGLE_REDIRECT_URI`:
   - **Valor anterior**: `https://tu-dominio-railway.railway.app/auth/google/callback`
   - **Valor NUEVO**: `https://rafagent-engine-production.up.railway.app/auth/google/callback`

4. Railway automáticamente hará redeploy

### **PASO 2: Agregar Variable en Vercel** (1 minuto)

1. Ve a Vercel → rafagent-saas → Settings → Environment Variables
2. **AGREGA** una nueva variable:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://rafagent-engine-production.up.railway.app`

3. Haz clic en "Save"
4. Redeploy el proyecto

### **PASO 3: Actualizar Google Cloud Console** (2 minutos)

1. Ve a Google Cloud Console → Credentials
2. Edita tu OAuth client
3. En "Authorized redirect URIs", **AGREGA**:
   - `https://rafagent-engine-production.up.railway.app/auth/google/callback`

4. **NOTA**: Mantén también las URLs de Vercel que ya agregaste
5. Guarda

---

## 🚀 DESPUÉS DE ESTOS 3 PASOS:

Tu RafAgent funcionará completamente:
- Frontend en Vercel (solo UI)
- Backend completo en Railway (API + Automatización)
- Todo conectado correctamente

---

**Empieza con el PASO 1 (actualizar Railway) y dime cuando lo hayas hecho! 🚀**
