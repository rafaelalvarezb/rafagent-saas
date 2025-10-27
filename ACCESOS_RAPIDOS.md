# 🔑 ACCESOS RÁPIDOS - RafAgent SaaS

## 📌 URLs de Producción

### Tu RafAgent (para usuarios)
```
https://rafagent-saas.vercel.app
```
👆 Esta es la URL que compartirás con tus vendedores

---

## 🛠️ Dashboards de Administración

### Vercel (Frontend)
```
https://vercel.com/rafael-alvarezs-projects-43d604b9/rafagent-saas
```
**¿Para qué?** Ver logs del frontend, configurar variables, hacer redeploys

### Railway (Backend + Motor)
```
https://railway.app/project/12223983-ee2d-498c-b05a-f54e8c524844
```
**¿Para qué?** Ver logs del backend, configurar variables, verificar uptime

### Neon (Base de Datos)
```
https://console.neon.tech/
```
**¿Para qué?** Ver datos, hacer consultas, monitorear uso

---

## 🔐 Credenciales Importantes

### Google Cloud Console
```
Proyecto: rafagent-saas
URL: https://console.cloud.google.com/

Client ID: 335742457345-edqurv1l5npberj763tlvg1k0r1c1d1s.apps.googleusercontent.com
Client Secret: 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
```

### Neon Database
```
Proyecto: rafagent-production
Connection String:
postgresql://neondb_owner:npg_jSBEw6LTN7Yu@ep-autumn-recipe-aeis6a3s-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require
```

### Gemini AI
```
API Key: AIzaSyBZDLPPhECzNrPBzGWjRlm0NU3i1cjiKlY
```

### Session Secret
```
aa8e9a32bf015cffb2b21a6ff55afc96357aacccfbd22420c749944813f2d4cb
```

### GitHub
```
Usuario: rafaelalvarezb
Email: rafaelalvrzb@gmail.com
Token: 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

Repos:
- Frontend: https://github.com/rafaelalvarezb/rafagent-saas
- Backend: https://github.com/rafaelalvarezb/rafagent-engine
```

---

## 🚨 URLs de Diagnóstico

### Health Check del Backend
```
https://rafagent-engine-production.up.railway.app/health
```
**Qué deberías ver:**
```json
{
  "status": "healthy",
  "timestamp": "...",
  "service": "rafagent-engine"
}
```

### Health Check de la Base de Datos
Ve a Neon console y verifica que el proyecto esté "Active"

---

## 📊 Monitoreo Rápido

### ¿Cómo saber si todo está funcionando?

#### 1. Frontend (Vercel)
- [ ] Ve a: https://rafagent-saas.vercel.app
- [ ] La página carga correctamente
- [ ] El botón de login aparece

#### 2. Backend (Railway)
- [ ] Ve a: https://railway.app/project/12223983-ee2d-498c-b05a-f54e8c524844
- [ ] El status es "ACTIVE" (verde)
- [ ] No hay errores en los logs

#### 3. Base de Datos (Neon)
- [ ] Ve a: https://console.neon.tech/
- [ ] El proyecto está "Active"
- [ ] No hay errores de conexión

#### 4. Login Funcional
- [ ] Ve a: https://rafagent-saas.vercel.app
- [ ] Haz clic en "Continue with Google"
- [ ] El login funciona correctamente
- [ ] Ves el dashboard con secuencias

---

## 🔧 Variables de Entorno Configuradas

### Railway (rafagent-engine)
```
DATABASE_URL = ✅
GOOGLE_CLIENT_ID = ✅
GOOGLE_CLIENT_SECRET = ✅
GOOGLE_REDIRECT_URI = https://rafagent-engine-production.up.railway.app/auth/google/callback
GEMINI_API_KEY = ✅
PORT = 3001
NODE_ENV = production
```

### Vercel (rafagent-saas)
```
DATABASE_URL = ✅
GOOGLE_CLIENT_ID = ✅
GOOGLE_CLIENT_SECRET = ✅
GOOGLE_REDIRECT_URI = ✅
GEMINI_API_KEY = ✅
SESSION_SECRET = ✅
NODE_ENV = production
ENGINE_URL = ✅
VITE_API_URL = https://rafagent-engine-production.up.railway.app (⚠️ AGREGAR EN PASO 2)
```

---

## 📱 Contactos Útiles

### Soporte de Plataformas

**Vercel:**
- Docs: https://vercel.com/docs
- Support: https://vercel.com/support

**Railway:**
- Docs: https://docs.railway.app/
- Discord: https://discord.gg/railway

**Neon:**
- Docs: https://neon.tech/docs
- Support: https://neon.tech/docs/introduction/support

---

## 💰 Información de Facturación

### Costos Mensuales Actuales

| Servicio | Plan | Costo | Límite |
|----------|------|-------|--------|
| Vercel | Hobby | $0 | 100GB bandwidth |
| Railway | Developer | $5 | Ilimitado |
| Neon | Free | $0 | 3GB storage |
| Google APIs | Free Tier | $0 | Quota diaria |
| **TOTAL** | | **$5/mes** | 1000+ usuarios |

### ¿Cuándo necesitarías pagar más?

- **Vercel:** Solo si superas 100GB de bandwidth/mes (muy difícil con 1000 usuarios)
- **Railway:** Plan actual ($5) soporta tráfico ilimitado
- **Neon:** Solo si superas 3GB de datos (aproximadamente 10,000+ prospectos)

---

## 🎯 Mejoras Futuras (Cuando lo necesites)

### Dominio Personalizado
- Comprar: `rafagent.com` en Namecheap (~$12/año)
- Configurar en Vercel
- Actualizar OAuth en Google Cloud

### Upgrade a Neon Pro ($19/mes)
- Cuando tengas más de 3GB de datos
- Backups automáticos
- Point-in-time recovery

### Stripe Integration (Pagos)
- Para convertir RafAgent en SaaS de pago
- Planes: Básico, Pro, Empresa

---

## 📚 Documentación del Proyecto

| Archivo | Propósito |
|---------|-----------|
| `PASOS_FINALES_SIMPLES.md` | Guía simple de los 3 pasos finales |
| `CHECKLIST_FINAL.md` | Checklist imprimible |
| `SOLUCION_RAILWAY_CRASHES.md` | Qué hacer si Railway crashea |
| `ACCESOS_RAPIDOS.md` | Este archivo (URLs y credenciales) |
| `DEPLOYMENT_GUIDE.md` | Guía completa de deployment |
| `HYBRID_DEPLOYMENT_GUIDE.md` | Arquitectura híbrida explicada |

---

## 🆘 Troubleshooting Rápido

### Login no funciona (404)
1. Verifica `VITE_API_URL` en Vercel
2. Redeploy Vercel
3. Verifica Railway esté ACTIVE

### Emails no se envían
1. Verifica Railway esté ACTIVE
2. Revisa logs de Railway
3. Verifica permisos de Gmail API

### Secuencias no aparecen
1. Cierra sesión
2. Vuelve a hacer login
3. Deberían crearse automáticamente

### Dashboard no carga
1. Abre consola del navegador (F12)
2. Busca errores en rojo
3. Envíame el screenshot

---

## ✅ Recordatorios

- ⏰ **Railway se cobra cada mes:** Revisa tu tarjeta en Railway settings
- 🔐 **Nunca compartas estas credenciales:** Son privadas y críticas
- 📊 **Revisa analytics semanalmente:** Para ver uso y rendimiento
- 🔄 **Backups automáticos:** Neon hace backups diarios (en plan free por 7 días)

---

**¡Guarda este documento en un lugar seguro! 🔒**
**Es tu guía rápida para administrar RafAgent.**

