# 🚀 RafAgent SaaS - Guía de Deployment Híbrido Completa

## 📋 Arquitectura Híbrida para 1000+ Usuarios

### **Frontend (Vercel)** - Interfaz de Usuario
- ✅ Dashboard y gestión de prospectos
- ✅ Autenticación Google OAuth
- ✅ Templates y configuración
- ✅ Analytics en tiempo real

### **Motor Persistente (Railway)** - Automatización
- ✅ Secuencias de emails automáticas
- ✅ Análisis AI de respuestas
- ✅ Programación de reuniones
- ✅ Cron jobs y schedulers

### **Base de Datos (Neon)** - Datos Compartidos
- ✅ PostgreSQL serverless
- ✅ Datos compartidos entre frontend y motor

---

## 🔧 FASE 1: Configuración del Motor Persistente (Railway)

### Paso 1: Crear Cuenta en Railway
1. Ve a [Railway.app](https://railway.app/)
2. Haz clic en "Sign Up"
3. Conecta con GitHub
4. Autoriza el acceso a tus repositorios

### Paso 2: Deploy del Motor
1. En Railway, haz clic en "New Project"
2. Selecciona "Deploy from GitHub repo"
3. Busca y selecciona `rafagent-engine`
4. Haz clic en "Deploy Now"

### Paso 3: Configurar Variables de Entorno
En Railway, ve a "Variables" y agrega:

```
DATABASE_URL = postgresql://tu_connection_string_de_neon
GOOGLE_CLIENT_ID = tu_client_id_de_google
GOOGLE_CLIENT_SECRET = tu_client_secret_de_google
GOOGLE_REDIRECT_URI = https://tu-dominio-railway.railway.app/auth/google/callback
GEMINI_API_KEY = tu_api_key_de_gemini
PORT = 3001
NODE_ENV = production
```

### Paso 4: Obtener URL del Motor
1. En Railway, ve a "Settings" → "Domains"
2. Copia la URL del motor (algo como `https://rafagent-engine-production.railway.app`)
3. **¡IMPORTANTE!** Guarda esta URL, la necesitarás para el frontend

---

## 🌐 FASE 2: Configuración del Frontend (Vercel)

### Paso 1: Actualizar Variables de Entorno en Vercel
En Vercel, ve a "Settings" → "Environment Variables" y agrega:

```
# Variables existentes (mantener)
DATABASE_URL = postgresql://tu_connection_string_de_neon
GOOGLE_CLIENT_ID = tu_client_id_de_google
GOOGLE_CLIENT_SECRET = tu_client_secret_de_google
GOOGLE_REDIRECT_URI = https://tu-dominio-vercel.vercel.app/auth/google/callback
GEMINI_API_KEY = tu_api_key_de_gemini
SESSION_SECRET = tu_session_secret
NODE_ENV = production

# NUEVA VARIABLE - URL del motor persistente
ENGINE_URL = https://tu-dominio-railway.railway.app
```

### Paso 2: Actualizar Google OAuth
1. Ve a Google Cloud Console → Credentials
2. Edita tu OAuth client
3. En "Authorized redirect URIs", agrega:
   - `https://tu-dominio-vercel.vercel.app/auth/google/callback` (frontend)
   - `https://tu-dominio-railway.railway.app/auth/google/callback` (motor)
4. Guarda los cambios

---

## 🔄 FASE 3: Actualización del Código Frontend

### Paso 1: Modificar Rutas de API
El frontend ahora debe llamar al motor persistente para:
- Iniciar secuencias de email
- Obtener estado de automatización
- Ejecutar análisis AI

### Paso 2: Configurar WebSocket
El motor persistente enviará notificaciones en tiempo real al frontend.

---

## ✅ FASE 4: Verificación y Testing

### Paso 1: Verificar Motor
1. Ve a la URL del motor: `https://tu-dominio-railway.railway.app/health`
2. Deberías ver: `{"status":"healthy","timestamp":"...","service":"rafagent-engine"}`

### Paso 2: Verificar Frontend
1. Ve a tu URL de Vercel
2. Haz login con Google
3. Crea un prospecto y activa la secuencia
4. Verifica que el motor procese automáticamente

### Paso 3: Verificar Integración
1. El frontend debe mostrar el estado del motor
2. Las notificaciones deben llegar en tiempo real
3. Los emails deben enviarse automáticamente

---

## 💰 Costos Finales

| Servicio | Costo Mensual | Límite |
|----------|---------------|---------|
| **Vercel** | $0 | 100GB bandwidth |
| **Railway** | $5 | Ilimitado |
| **Neon Database** | $0 | 3GB storage |
| **Google APIs** | $0 | Quota gratuita |
| **Total** | **$5/mes** | Para 1000+ usuarios |

---

## 🆘 Solución de Problemas

### Error: "Engine not responding"
- Verifica que Railway esté corriendo
- Revisa los logs en Railway Dashboard
- Verifica las variables de entorno

### Error: "Database connection failed"
- Verifica DATABASE_URL en ambos servicios
- Asegúrate de que Neon esté activo

### Error: "Google OAuth failed"
- Verifica que ambas URLs estén en Google Cloud Console
- Revisa GOOGLE_CLIENT_ID y GOOGLE_CLIENT_SECRET

---

## 🎯 Beneficios de la Arquitectura Híbrida

✅ **Sin límites de tiempo** - Motor corre 24/7
✅ **Escalabilidad** - Soporta 1000+ usuarios
✅ **Confiabilidad** - Frontend y motor independientes
✅ **Costo eficiente** - Solo $5/mes adicionales
✅ **Fácil mantenimiento** - Separación clara de responsabilidades

---

**¡Tu RafAgent SaaS híbrido estará listo para escalar a 1000+ vendedores! 🚀**
