# 🎯 RafAgent - Pasos Restantes para Go-Live

## ✅ **LO QUE YA HICISTE:**
1. ✅ Configuraste Google Cloud Console con proyecto "rafagent-saas"
2. ✅ Habilitaste APIs: Gmail, Google Calendar, Google+ OAuth
3. ✅ Creaste repositorio "rafagent-engine" en GitHub

---

## 📋 **LO QUE FALTA POR HACER:**

### **PASO 1: Subir Código del Motor a GitHub** (2 minutos)

Abre tu Terminal y ejecuta estos comandos **uno por uno**:

```bash
cd "/Users/anaramos/Desktop/RafAgent (from Replit to Cursor)/rafagent-engine"
```

```bash
git push -u origin main
```

```bash
git push origin v1.0.0-engine
```

**Nota:** Te pedirá tu usuario de GitHub (`rafaelalvrzb@gmail.com`) y contraseña.

---

### **PASO 2: Completar Configuración de Google Cloud Console** (10 minutos)

#### **2.1 Configurar OAuth Consent Screen**
1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Selecciona proyecto "rafagent-saas"
3. Ve a "APIs & Services" → "OAuth consent screen"
4. Selecciona "External" → "Create"
5. **Completa la información:**
   - **App name**: RafAgent
   - **User support email**: rafaelalvrzb@gmail.com
   - **Developer contact**: rafaelalvrzb@gmail.com
6. Haz clic en "Save and Continue"

#### **2.2 Agregar Scopes (Permisos)**
1. En la siguiente pantalla, haz clic en "Add or Remove Scopes"
2. **Busca y marca estos scopes:**
   - `https://www.googleapis.com/auth/gmail.send`
   - `https://www.googleapis.com/auth/gmail.readonly`
   - `https://www.googleapis.com/auth/calendar`
   - `https://www.googleapis.com/auth/userinfo.email`
   - `https://www.googleapis.com/auth/userinfo.profile`
3. Haz clic en "Update" → "Save and Continue"

#### **2.3 Agregar Test Users**
1. En "Test users", haz clic en "Add Users"
2. Agrega tu email: `rafaelalvrzb@gmail.com`
3. Haz clic en "Save and Continue"

#### **2.4 Crear Credenciales OAuth**
1. Ve a "APIs & Services" → "Credentials"
2. Haz clic en "Create Credentials" → "OAuth client ID"
3. **Tipo**: Web application
4. **Nombre**: "RafAgent Web Client"
5. **Authorized redirect URIs**, agrega:
   - `http://localhost:3000/auth/google/callback` (para desarrollo)
   - *(Agregarás la URL de producción después)*
6. Haz clic en "Create"
7. **¡MUY IMPORTANTE!** Copia y guarda:
   - **Client ID** (algo como: xxxxx.apps.googleusercontent.com)
   - **Client Secret** (cadena aleatoria)

---

### **PASO 3: Crear Base de Datos en Neon** (5 minutos)

1. Ve a [Neon.tech](https://neon.tech/)
2. Haz clic en "Sign Up" → Conecta con GitHub
3. Haz clic en "Create Project"
4. **Nombre**: `rafagent-production`
5. **Región**: `us-east-1` (recomendado para Vercel)
6. Haz clic en "Create Project"
7. En "Connection Details", copia la **Connection String** completa
   - Empieza con: `postgresql://...`
   - **¡Guárdala!** La necesitarás para las variables de entorno

---

### **PASO 4: Obtener API Key de Gemini AI** (2 minutos)

1. Ve a [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Haz clic en "Create API Key"
3. Selecciona tu proyecto "rafagent-saas"
4. Copia la **API Key**
5. **¡Guárdala!**

---

### **PASO 5: Generar Session Secret** (1 minuto)

Abre tu Terminal y ejecuta:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copia el resultado (una cadena larga de letras y números). **¡Guárdala!**

---

### **PASO 6: Subir Código Principal a GitHub** (3 minutos)

1. Ve a [GitHub.com](https://github.com/)
2. Haz clic en "New repository"
3. **Nombre**: `rafagent-saas`
4. **Descripción**: `RafAgent - AI-Powered B2B Sales Automation`
5. **Público** ✅
6. Haz clic en "Create repository"

Luego, en tu Terminal:

```bash
cd "/Users/anaramos/Desktop/RafAgent (from Replit to Cursor)"
```

```bash
git remote add origin https://github.com/rafaelalvarezb/rafagent-saas.git
```

```bash
git push -u origin main
```

```bash
git push origin v1.0.0-production
```

---

### **PASO 7: Deploy en Railway (Motor Persistente)** (10 minutos)

1. Ve a [Railway.app](https://railway.app/)
2. Haz clic en "Sign Up" → Conecta con GitHub
3. Haz clic en "New Project"
4. Selecciona "Deploy from GitHub repo"
5. Busca y selecciona `rafagent-engine`
6. Haz clic en "Deploy Now"

#### **7.1 Configurar Variables de Entorno en Railway**
1. En Railway, haz clic en tu proyecto
2. Ve a la pestaña "Variables"
3. Agrega estas variables:

```
DATABASE_URL = (pega tu Connection String de Neon)
GOOGLE_CLIENT_ID = (pega tu Client ID de Google)
GOOGLE_CLIENT_SECRET = (pega tu Client Secret de Google)
GEMINI_API_KEY = (pega tu Gemini API Key)
PORT = 3001
NODE_ENV = production
```

4. Haz clic en "Deploy" para aplicar los cambios

#### **7.2 Obtener URL del Motor**
1. En Railway, ve a "Settings" → "Domains"
2. Haz clic en "Generate Domain"
3. Copia la URL (algo como: `https://rafagent-engine-production.railway.app`)
4. **¡Guárdala!** La necesitarás para Vercel

---

### **PASO 8: Deploy en Vercel (Frontend)** (10 minutos)

1. Ve a [Vercel.com](https://vercel.com/)
2. Haz clic en "Sign Up" → Conecta con GitHub
3. Haz clic en "New Project"
4. Busca y selecciona `rafagent-saas`
5. Haz clic en "Import"

#### **8.1 Configurar Variables de Entorno en Vercel**
1. Antes de hacer deploy, haz clic en "Environment Variables"
2. Agrega estas variables:

```
DATABASE_URL = (pega tu Connection String de Neon)
GOOGLE_CLIENT_ID = (pega tu Client ID de Google)
GOOGLE_CLIENT_SECRET = (pega tu Client Secret de Google)
GEMINI_API_KEY = (pega tu Gemini API Key)
SESSION_SECRET = (pega tu Session Secret generado)
NODE_ENV = production
ENGINE_URL = (pega la URL de Railway del paso 7.2)
```

3. Haz clic en "Deploy"
4. Espera 2-3 minutos mientras se construye

#### **8.2 Obtener URL de Vercel**
1. Una vez terminado el deploy, verás tu URL
2. Algo como: `https://rafagent-saas.vercel.app`
3. **¡Cópiala!**

---

### **PASO 9: Actualizar URLs en Google Cloud Console** (3 minutos)

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Ve a "APIs & Services" → "Credentials"
3. Haz clic en tu OAuth client "RafAgent Web Client"
4. En "Authorized redirect URIs", agrega:
   - `https://rafagent-saas.vercel.app/auth/google/callback` (tu URL de Vercel)
   - `https://rafagent-engine-production.railway.app/auth/google/callback` (tu URL de Railway)
5. Haz clic en "Save"

---

### **PASO 10: Actualizar Variables de Entorno con URLs Finales** (2 minutos)

#### **En Railway:**
1. Ve a Variables
2. Actualiza:
```
GOOGLE_REDIRECT_URI = https://rafagent-saas.vercel.app/auth/google/callback
```

#### **En Vercel:**
1. Ve a Settings → Environment Variables
2. Actualiza:
```
GOOGLE_REDIRECT_URI = https://rafagent-saas.vercel.app/auth/google/callback
```

3. Haz clic en "Redeploy" en Vercel para aplicar cambios

---

## 🎉 **PASO 11: ¡PROBAR TU RAFAGENT EN PRODUCCIÓN!**

1. Ve a tu URL de Vercel: `https://rafagent-saas.vercel.app`
2. Haz clic en "Login with Google"
3. Autoriza la aplicación
4. ¡Deberías ver el dashboard con tus secuencias y templates!

---

## 💰 **COSTOS FINALES:**

- **Vercel**: $0/mes
- **Railway**: $5/mes
- **Neon**: $0/mes
- **Google APIs**: $0/mes
- **TOTAL**: **$5/mes** para 1000+ usuarios

---

## 🆘 **SI TIENES PROBLEMAS:**

### Error: "Invalid redirect URI"
- Verifica que las URLs en Google Cloud Console coincidan exactamente

### Error: "Database connection failed"
- Verifica que DATABASE_URL esté correctamente copiada
- Asegúrate de que Neon esté activo

### Error: "Engine not responding"
- Verifica que Railway esté corriendo
- Revisa los logs en Railway Dashboard

---

## ✅ **CHECKLIST COMPLETO:**

- [ ] Subir código del motor a GitHub
- [ ] Configurar OAuth Consent Screen en Google
- [ ] Crear credenciales OAuth
- [ ] Crear base de datos en Neon
- [ ] Obtener API Key de Gemini
- [ ] Generar Session Secret
- [ ] Subir código principal a GitHub
- [ ] Deploy en Railway
- [ ] Deploy en Vercel
- [ ] Actualizar URLs en Google Cloud
- [ ] Actualizar variables de entorno
- [ ] Probar en producción

**¡Tu RafAgent SaaS estará listo para 1000+ vendedores! 🚀**
