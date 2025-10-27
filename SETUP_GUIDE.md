# 🚀 Guía de Configuración - RafAgent

Esta guía te llevará paso a paso para configurar tu plataforma de ventas profesional. ¡No te preocupes, es más fácil de lo que parece!

---

## 📋 **Índice de Pasos**

1. [Configurar Base de Datos (Neon)](#paso-1-base-de-datos)
2. [Configurar Gemini AI](#paso-2-gemini-ai)
3. [Configurar Google Cloud (Gmail & Calendar)](#paso-3-google-cloud)
4. [Instalar Dependencias](#paso-4-instalar-dependencias)
5. [Configurar Variables de Entorno](#paso-5-variables-de-entorno)
6. [Iniciar la Aplicación](#paso-6-iniciar-aplicación)

---

## 🗄️ **PASO 1: Configurar Base de Datos** {#paso-1-base-de-datos}

Tu plataforma necesita una base de datos para guardar contactos, emails, templates, etc.

### **Opción Recomendada: Neon (Gratis)**

1. **Ve a**: https://neon.tech
2. **Haz click en** "Sign Up" (puedes usar tu cuenta de GitHub o Google)
3. **Crea un nuevo proyecto**:
   - Nombre: `rafagent-crm`
   - Region: Selecciona la más cercana (US East, Europe, etc.)
4. **Copia la Connection String**:
   - Verás algo como: `postgresql://usuario:password@ep-xxx.region.neon.tech/neondb?sslmode=require`
   - **GUÁRDALA** - la necesitaremos en el Paso 5

> 💡 **Tip**: La connection string es como la dirección de tu base de datos. No la compartas públicamente.

---

## 🤖 **PASO 2: Configurar Gemini AI** {#paso-2-gemini-ai}

Ya tienes tu API Key de Gemini, pero asegurémonos de que funciona:

1. **Ve a**: https://aistudio.google.com/app/apikey
2. **Verifica** que tu API Key esté activa
3. **Copia la API Key** (algo como: `AIzaSy...`)
4. **GUÁRDALA** - la usaremos en el Paso 5

---

## ☁️ **PASO 3: Configurar Google Cloud** {#paso-3-google-cloud}

Para que RafAgent pueda enviar emails por Gmail y crear reuniones en Calendar:

### **3.1 - Crear Proyecto en Google Cloud**

1. **Ve a**: https://console.cloud.google.com
2. **Haz click** en el selector de proyectos (arriba izquierda)
3. **Crea un nuevo proyecto**:
   - Nombre: `RafAgent`
   - Click en "Create"

### **3.2 - Habilitar APIs**

1. En el menú lateral, ve a **"APIs & Services"** → **"Library"**
2. **Busca y habilita** estas APIs (una por una):
   - Gmail API
   - Google Calendar API

### **3.3 - Crear Credenciales OAuth**

1. Ve a **"APIs & Services"** → **"Credentials"**
2. Click en **"+ CREATE CREDENTIALS"** → **"OAuth client ID"**
3. Si te pide configurar "OAuth consent screen":
   - User Type: **External**
   - App name: `RafAgent`
   - User support email: Tu email
   - Developer contact: Tu email
   - Click **"Save and Continue"** hasta terminar
4. Vuelve a **"Credentials"** → **"+ CREATE CREDENTIALS"** → **"OAuth client ID"**
5. Selecciona:
   - Application type: **Web application**
   - Name: `RafAgent Web Client`
   - Authorized redirect URIs: `http://localhost:3000/auth/google/callback`
   - Click **"Create"**
6. **COPIA** el Client ID y Client Secret que aparecen
   - Client ID: algo como `123456-abc.apps.googleusercontent.com`
   - Client Secret: algo como `GOCSPX-abc123...`
7. **GUÁRDALOS** - los usaremos en el Paso 5

### **3.4 - Agregar tu email como usuario de prueba**

1. Ve a **"OAuth consent screen"**
2. En la sección **"Test users"**, click en **"+ ADD USERS"**
3. Agrega tu email (el que usarás para RafAgent)
4. Click **"Save"**

> ⚠️ **Importante**: Mientras tu app esté en modo "Testing", solo los usuarios que agregues aquí podrán usarla.

---

## 📦 **PASO 4: Instalar Dependencias** {#paso-4-instalar-dependencias}

Ahora instalamos todas las librerías que necesita la aplicación:

1. **Abre la terminal** en Cursor (View → Terminal)
2. **Ejecuta**:
   ```bash
   npm install
   ```
   
   Esto tomará unos minutos. Verás muchas líneas de texto - es normal.

---

## 🔐 **PASO 5: Configurar Variables de Entorno** {#paso-5-variables-de-entorno}

Aquí juntamos toda la información que guardaste:

1. **En Cursor**, crea un archivo llamado `.env` en la raíz del proyecto
2. **Copia** el contenido de `.env.example` al nuevo `.env`
3. **Completa los valores** con la información que guardaste:

```bash
# Base de Datos (del Paso 1)
DATABASE_URL=postgresql://tu-connection-string-aqui

# Gemini AI (del Paso 2)
GEMINI_API_KEY=AIzaSy...

# Google OAuth (del Paso 3)
GOOGLE_CLIENT_ID=123456-abc.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-abc123...
GOOGLE_REDIRECT_URI=http://localhost:3000/auth/google/callback

# Configuración del Servidor
PORT=3000
NODE_ENV=development

# Session Secret (genera uno aleatorio)
SESSION_SECRET=puedes-poner-cualquier-texto-largo-y-aleatorio-aqui
```

4. **Guarda el archivo** `.env`

> 🔒 **Seguridad**: El archivo `.env` NO se sube a GitHub (está en .gitignore). Es privado.

---

## ▶️ **PASO 6: Iniciar la Aplicación** {#paso-6-iniciar-aplicación}

¡Momento de la verdad!

### **6.1 - Crear las Tablas en la Base de Datos**

```bash
npm run db:push
```

Esto crea todas las tablas necesarias (users, prospects, templates, etc.)

### **6.2 - Iniciar el Servidor**

```bash
npm run dev
```

Verás algo como:
```
🚀 Server running at http://localhost:3000
```

### **6.3 - Abrir en el Navegador**

1. Abre tu navegador
2. Ve a: http://localhost:3000
3. ¡Deberías ver tu plataforma RafAgent! 🎉

---

## 🎯 **Próximos Pasos**

Una vez que la aplicación esté corriendo:

1. **Login con Google** - La primera vez te pedirá autorizar el acceso a Gmail y Calendar
2. **Configura tus Templates** - Crea plantillas para tus emails de outreach
3. **Agrega Prospects** - Importa o crea manualmente tus contactos
4. **Activa Secuencias** - Marca "Send Sequence" para que el agente empiece a trabajar

---

## 🆘 **¿Necesitas Ayuda?**

### **Problemas Comunes**:

1. **Error de base de datos**: Verifica que la `DATABASE_URL` esté correcta
2. **Error de Gemini API**: Verifica que tu API Key sea válida
3. **Error de Gmail**: Asegúrate de haber agregado tu email como "Test User" en Google Cloud

### **Comandos Útiles**:

- `npm run dev` - Inicia el servidor en modo desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run db:push` - Sincroniza el schema de la base de datos
- `npm run check` - Verifica errores de TypeScript

---

## 📝 **Notas Finales**

- **Desarrollo Local**: Por ahora la app corre solo en tu computadora
- **Puerto**: Si el puerto 5000 está ocupado, puedes cambiarlo en `.env`
- **Actualizaciones**: Cuando modifiques código, el servidor se recarga automáticamente

¡Listo! Ahora tienes una plataforma profesional de ventas outbound 🚀

