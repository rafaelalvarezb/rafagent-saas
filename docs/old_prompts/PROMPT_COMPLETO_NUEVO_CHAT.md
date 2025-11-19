# 🚀 PROMPT COMPLETO PARA NUEVO CHAT - RAFAGENT

## 📋 INSTRUCCIONES PRINCIPALES

Antes de ayudarme con cualquier tarea, **POR FAVOR**:

1. **Lee TODOS los archivos markdown en este directorio** (especialmente los que empiezan con `PROMPT_`, `GUIA_`, `REVISION_`)
2. **Revisa el código más reciente** en `src/` y `server/`
3. **Entiende la arquitectura actual** del RafAgent
4. **Considera el contexto completo** de lo que se ha hecho y lo que falta por hacer

---

## 🎯 ¿QUÉ ES RAFAGENT?

RafAgent es una aplicación SaaS de automatización de ventas outbound que:
- Envía emails automáticamente a prospects en secuencias
- Usa AI (Google Gemini) para analizar respuestas de prospects
- Agenda reuniones automáticamente cuando un prospect muestra interés
- Convierte timezones inteligentemente (ej: "12pm hora argentina" → 9am hora México)
- Maneja referidos y otros tipos de respuestas

### Stack Tecnológico

**Frontend:**
- React + TypeScript
- Vite
- Tailwind CSS
- TanStack Query (React Query)
- Wouter (routing)
- Radix UI components
- Desplegado en **Vercel**: `https://rafagent-saas.vercel.app`

**Backend:**
- Node.js + TypeScript + Express
- PostgreSQL (Neon)
- Google OAuth 2.0
- Google Calendar API
- Gmail API
- Google Gemini API (AI)
- Desplegado en **Railway**: `https://rafagent-engine-production.up.railway.app`

**Base de Datos:**
- Neon PostgreSQL
- Schema: `shared/schema.ts`
- Drizzle ORM

---

## ✅ LO QUE HA SALIDO BIEN - IMPLEMENTADO Y FUNCIONANDO

### 1. **Sistema de Timezone Completo** ✅
- **Detección automática:** Al hacer login, detecta timezone del navegador y lo guarda automáticamente
- **Selector manual:** Usuario puede cambiar timezone en Configuration → "Active Timezone"
- **Conversión inteligente:** Detecta timezones mencionados por prospects (ej: "12pm hora argentina") y convierte a timezone del usuario
- **Funcionando correctamente:** Prueba exitosa: "12pm hora argentina" → "9am hora México"
- **Archivos relevantes:**
  - `server/utils/timezoneDetection.ts` - Detección y conversión
  - `server/services/calendar.ts` - `convertTimeBetweenTimezones()` y `mapTimezoneNameToIANA()`
  - `src/hooks/use-auth.tsx` - Auto-detección en login
  - `src/components/TimezoneSelector.tsx` - Selector manual
  - `src/pages/Configuration.tsx` - UI para modificar timezone

### 2. **Autenticación y Login** ✅
- **Google OAuth funcionando:** Login con Google funciona correctamente
- **JWT token:** Generación y almacenamiento de tokens JWT
- **Redirección correcta:** OAuth callback funciona (`/api/auth/google/callback`)
- **Session management:** Manejo de sesiones en backend
- **Archivos relevantes:**
  - `server/routes.ts` - Endpoints de auth
  - `server/auth.ts` - Lógica de OAuth
  - `server/middleware/jwt.ts` - Generación y verificación de tokens
  - `src/hooks/use-auth.tsx` - Hook de autenticación frontend

### 3. **Automation Engine Status (Solo Admin)** ✅
- **Restricción de acceso:** Solo admin (`rafaelalvrzb@gmail.com`) puede ver Engine Status
- **Datos reales:** Endpoint devuelve datos reales del backend (uptime, total users, active users)
- **Sin errores de visualización:** Corregidos NaN, Invalid Date, etc.
- **Archivos relevantes:**
  - `server/routes.ts` - Endpoint `/api/engine/status` con verificación de admin
  - `src/pages/Dashboard.tsx` - Solo muestra `EngineStatusCard` si `isAdmin`
  - `src/components/EngineStatusCard.tsx` - Componente con manejo de errores mejorado
  - `src/hooks/use-engine.tsx` - Hook con manejo de errores 403

### 4. **UI/UX Mejoras Dopamínicas** ✅
- **Badge System:** Sistema de achievements/logros
- **Toast notifications:** Mejoras con variante `success`
- **Hover effects:** Efectos en cards y botones
- **Progress bars animadas:** Animación suave en progress bars
- **Dark mode compatible:** Todo compatible con modo oscuro
- **Archivos relevantes:**
  - `src/components/BadgeSystem.tsx` - Sistema de badges
  - `src/components/ui/toast.tsx` - Toast con variante success
  - `src/components/ui/progress.tsx` - Progress bars animadas
  - `src/pages/Dashboard.tsx` - Hover effects aplicados

### 5. **Correcciones Técnicas** ✅
- **Error de Prospects en blanco:** Corregido problema de `cn` initialization
- **Error de login loop:** Corregido con JWT token y redirección correcta
- **Error de OAuth callback 404:** Corregido ruta `/api/auth/google/callback`
- **Build optimizado:** Manual chunks para vendor-utils
- **Archivos relevantes:**
  - `vite.config.ts` - Configuración de build mejorada
  - `server/routes.ts` - Rutas corregidas
  - `server/index.ts` - Server binding a `0.0.0.0` para Railway

### 6. **Funcionalidades Core** ✅
- **Agregar prospects:** Funciona correctamente
- **Editar prospects:** Funciona correctamente
- **Eliminar prospects:** Funciona correctamente
- **Bulk import:** Funciona correctamente
- **Templates:** Ver y editar funciona
- **Configuration:** Guardar configuración funciona
- **Dashboard:** Métricas y stats funcionan

---

## ❌ LO QUE HA SALIDO MAL Y SE HA CORREGIDO

### 1. **Error de Login Loop** ❌ → ✅ CORREGIDO
- **Problema:** Después de login, usuario era redirigido de vuelta a login
- **Causa:** El callback de OAuth no generaba JWT token, solo creaba sesión
- **Solución:** 
  - Agregado `generateToken()` en callback de OAuth
  - Redirección a `/dashboard?token=...` con token en URL
  - Frontend captura token y lo guarda en localStorage
  - Endpoint `/api/auth/status` ahora soporta JWT tokens
- **Archivos modificados:**
  - `server/routes.ts` - Callback ahora genera JWT
  - `src/hooks/use-auth.tsx` - Captura token de URL
  - `server/routes.ts` - `/api/auth/status` soporta JWT

### 2. **Error de Prospects en Blanco** ❌ → ✅ CORREGIDO
- **Problema:** Página de Prospects se mostraba completamente en blanco
- **Causa:** Error `Cannot access 'cn' before initialization` - problema de orden de importación en bundle
- **Solución:**
  - Limpieza de cache de build
  - Configuración de Vite con manual chunks para `clsx` y `tailwind-merge`
  - Rebuild completo
- **Archivos modificados:**
  - `vite.config.ts` - Manual chunks configurados
  - `src/lib/utils.ts` - Función `cn` verificada

### 3. **Error de Conversión de Timezone** ❌ → ✅ CORREGIDO
- **Problema:** "12pm hora argentina" se agendaba como "12pm hora México" en lugar de "9am hora México"
- **Causa:** Función `convertTimeBetweenTimezones()` calculaba offset incorrectamente
- **Solución:**
  - Reescribida función usando `Intl.DateTimeFormat` para calcular offset correctamente
  - Uso de referencia UTC para calcular diferencia entre timezones
- **Archivos modificados:**
  - `server/services/calendar.ts` - Función `convertTimeBetweenTimezones()` reescrita

### 4. **Error de OAuth Callback 404** ❌ → ✅ CORREGIDO
- **Problema:** Error 404 en `/api/auth/google/callback` en Railway
- **Causa:** Ruta definida como `/auth/google/callback` en lugar de `/api/auth/google/callback`
- **Solución:**
  - Corregida ruta a `/api/auth/google/callback`
  - Actualizado `GOOGLE_REDIRECT_URI` para incluir `/api`
  - Server binding cambiado a `0.0.0.0` para Railway
- **Archivos modificados:**
  - `server/routes.ts` - Ruta corregida
  - `server/auth.ts` - Default redirect URI actualizado
  - `server/index.ts` - Binding a `0.0.0.0`

### 5. **Error de Automation Engine Status** ❌ → ✅ CORREGIDO
- **Problema:** Engine Status mostraba NaN, Invalid Date, valores vacíos
- **Causa:** Endpoint intentaba redirigir a Railway engine que no existía, devolvía datos incorrectos
- **Solución:**
  - Endpoint ahora calcula datos reales del backend actual
  - Uptime desde `process.uptime()`
  - Total Users desde base de datos
  - Active Users calculado desde prospects recientes
  - Valores por defecto para evitar NaN
- **Archivos modificados:**
  - `server/routes.ts` - Endpoint `/api/engine/status` reescrito
  - `src/components/EngineStatusCard.tsx` - Manejo de valores undefined/NaN
  - `src/hooks/use-engine.tsx` - Manejo de errores 403

---

## 🚧 LO QUE FALTA POR HACER / ÁREAS DE OPORTUNIDAD

### 🔴 Críticas (Considerar antes de lanzar)

#### 1. **Validación de Formularios**
- **Estado:** Falta validación robusta de inputs
- **Necesita:**
  - Validación de emails en formularios
  - Validación de nombres (no vacíos, caracteres válidos)
  - Validación de fechas
  - Mensajes de error claros para el usuario

#### 2. **Error Handling Mejorado**
- **Estado:** Errores de API no siempre se muestran claramente
- **Necesita:**
  - Mensajes de error más descriptivos
  - Retry logic para requests fallidos
  - Loading states más claros
  - Manejo de errores de red (timeout, conexión perdida)

#### 3. **Seguridad**
- **Estado:** Admin email hardcodeado en frontend (aunque verificado en backend)
- **Necesita:**
  - Mover completamente verificación de admin al backend (ya hecho)
  - Rate limiting en endpoints críticos
  - Validación de permisos en todos los endpoints

### 🟡 Importantes (Después de lanzamiento)

#### 4. **Performance Optimizations**
- **Estado:** Bundle size grande (>500KB)
- **Necesita:**
  - Code splitting con lazy loading
  - Lazy load componentes pesados
  - Optimizar query de Engine Status (cache, evitar iterar sobre todos los usuarios)

#### 5. **Google APIs Error Handling**
- **Estado:** Si Google Calendar API falla, no hay retry automático
- **Necesita:**
  - Retry logic para Google APIs
  - Notificar al usuario si hay problemas con permisos
  - Logging mejorado de errores de Google APIs

#### 6. **UX/UI Mejoras**
- **Estado:** Estados de loading no son consistentes
- **Necesita:**
  - Skeleton loaders en lugar de spinners
  - Mensajes de error con acciones sugeridas
  - Confirmaciones antes de acciones destructivas

### 🟢 Nice to Have (Futuro)

#### 7. **Monitoring y Analytics**
- Google Analytics o similar
- Error tracking (Sentry, Rollbar)
- Logging centralizado

#### 8. **Testing**
- Tests unitarios
- Tests de integración
- Tests E2E

#### 9. **Documentación**
- Documentación de API
- Guías de usuario
- Video tutorials

---

## 📁 ESTRUCTURA DEL PROYECTO

### Repositorios

1. **`rafagent-saas`** (Frontend - Vercel)
   - Ubicación local: `/Users/anaramos/Desktop/RafAgent (from Replit to Cursor)`
   - GitHub: `rafaelalvarezb/rafagent-saas`
   - Deploy: Vercel (auto-deploy desde `main`)

2. **`rafagent-engine`** (Backend - Railway)
   - Ubicación local: `/Users/anaramos/Desktop/rafagent-engine`
   - GitHub: `rafaelalvarezb/rafagent-engine`
   - Deploy: Railway (auto-deploy desde `main`)

### Directorios Principales

```
RafAgent/
├── src/                    # Frontend React
│   ├── components/         # Componentes React
│   ├── pages/              # Páginas principales
│   ├── hooks/              # Custom hooks
│   ├── lib/                # Utilidades y config
│   └── App.tsx             # App principal
├── server/                 # Backend Express
│   ├── routes.ts           # Todas las rutas API
│   ├── services/           # Servicios (gmail, calendar, ai)
│   ├── automation/         # Lógica del agente
│   ├── middleware/         # Middleware (auth, jwt)
│   └── utils/              # Utilidades
├── shared/                 # Código compartido
│   └── schema.ts           # Schema de base de datos
└── *.md                    # Documentación
```

### Archivos Importantes para Leer

**Contexto del Proyecto:**
- `PROMPT_NUEVO_CHAT_MEJORAS.md` - Contexto inicial del proyecto
- `REVISION_COMPLETA_Y_AREAS_OPORTUNIDAD.md` - Revisión completa y áreas de oportunidad
- `GUIA_PUBLICACION_Y_PRIMER_USUARIO.md` - Guía de publicación
- `PUBLICAR_APP_EN_GOOGLE_CLOUD.md` - Cómo publicar en Google Cloud

**Backend:**
- `server/routes.ts` - **LEER PRIMERO** - Todas las rutas API
- `server/auth.ts` - Autenticación Google OAuth
- `server/services/calendar.ts` - Conversión de timezone y agendamiento
- `server/services/ai.ts` - Integración con Gemini
- `server/automation/agent.ts` - Lógica principal del agente
- `server/storage.ts` - Acceso a base de datos

**Frontend:**
- `src/App.tsx` - Routing principal
- `src/pages/Dashboard.tsx` - Dashboard con Engine Status (solo admin)
- `src/pages/Prospects.tsx` - Gestión de prospects
- `src/hooks/use-auth.tsx` - Hook de autenticación
- `src/lib/api.ts` - Configuración de API calls

**Schema:**
- `shared/schema.ts` - Schema completo de base de datos

---

## 🔐 CONFIGURACIÓN ACTUAL

### Variables de Entorno (Vercel)
- `VITE_API_URL` = `https://rafagent-engine-production.up.railway.app`

### Variables de Entorno (Railway)
- `DATABASE_URL` = Connection string de Neon PostgreSQL
- `GOOGLE_CLIENT_ID` = Google OAuth Client ID
- `GOOGLE_CLIENT_SECRET` = Google OAuth Client Secret
- `GOOGLE_REDIRECT_URI` = `https://rafagent-engine-production.up.railway.app/api/auth/google/callback`
- `GEMINI_API_KEY` = Google Gemini API Key
- `FRONTEND_URL` = `https://rafagent-saas.vercel.app`
- `ADMIN_EMAIL` = `rafaelalvrzb@gmail.com` ✅ Configurada
- `SESSION_SECRET` = String secreto aleatorio
- `NODE_ENV` = `production`
- `PORT` = `3001` (o el que Railway asigne)

### Google Cloud Console
- **Estado actual:** "En producción" (Public) ✅
- **Tipo de usuario:** Usuarios externos (External users)
- **Límite de usuarios OAuth:** 1 de 100 usuarios (sin verificación completa)
- **Nota:** Aplicación publicada pero sin verificación completa. Permite hasta 100 usuarios antes de requerir verificación completa (dominio, términos y condiciones, etc.)
- **URL:** https://console.cloud.google.com/auth/audience?project=rafagent-saas

---

## 🎯 FUNCIONALIDADES PRINCIPALES

### 1. **Sistema de Prospects**
- Agregar prospectos individualmente
- Bulk import desde CSV
- Editar prospectos (solo si no tienen touchpoints enviados)
- Eliminar prospectos
- Ver estado de cada prospecto (email abierto, respondido, meeting agendado)

### 2. **Sistema de Templates**
- Templates por sequence (secuencias)
- Cada sequence tiene múltiples templates (Initial, Second Touch, Third Touch, etc.)
- Variables en templates: `${contactName}`, `${companyName}`, `${yourName}`, etc.
- Threading automático (mismo subject para seguir conversación)

### 3. **AI Agent (Automation)**
- Se ejecuta automáticamente cada X horas (configurable)
- Analiza respuestas de prospects usando Gemini AI
- Clasifica respuestas: interested, not_interested, question, referral, etc.
- Agenda reuniones automáticamente si prospecto muestra interés
- Convierte timezones mencionados por prospectos
- Maneja working hours y working days

### 4. **Sistema de Timezone**
- Detección automática al login
- Conversión inteligente de timezones en respuestas
- Selector manual en Configuration
- Working hours configurados por timezone

### 5. **Dashboard**
- Métricas de ventas (Total Sent, Opened, Replied, Meetings)
- Badge system (achievements)
- Recent Activity
- **Engine Status Card (solo admin)**

---

## 🔄 FLUJO DE TRABAJO ACTUAL

### Flujo de Usuario Nuevo

1. **Usuario hace login con Google**
   - Frontend redirige a `/api/auth/google/redirect`
   - Backend redirige a Google OAuth
   - Usuario autoriza en Google
   - Google redirige a `/api/auth/google/callback`
   - Backend genera JWT token
   - Backend redirige a `/dashboard?token=...`
   - Frontend captura token y lo guarda en localStorage
   - Frontend detecta timezone automáticamente y lo envía al backend

2. **Usuario configura su cuenta**
   - Ve a Configuration
   - Timezone ya está configurado (auto-detectado)
   - Puede modificar working hours, working days, etc.
   - Guarda configuración

3. **Usuario agrega prospects**
   - Ve a Prospects → "+ Add Prospect"
   - Completa datos y selecciona sequence
   - Prospecto se agrega a base de datos
   - Si `sendSequence: true`, el agente enviará emails automáticamente

4. **AI Agent procesa prospects**
   - Se ejecuta cada X horas (configurable, default 30 min)
   - Para cada prospect activo:
     - Si no tiene touchpoints enviados → envía initial email
     - Si tiene respuesta nueva → analiza con AI
     - Si prospecto muestra interés → agenda reunión
     - Si prospecto menciona timezone → convierte hora
   - Actualiza estado de prospecto

### Flujo de Agendamiento de Reunión

1. **Prospecto responde con interés y menciona hora:**
   ```
   "Claro, podemos hablar el lunes a las 12 pm hora argentina"
   ```

2. **AI Agent detecta:**
   - Clasifica como "interested"
   - Extrae: `suggestedDays: "lunes"`, `suggestedTime: "12:00"`, `suggestedTimezone: "hora argentina"`

3. **Conversión de Timezone:**
   - Mapea "hora argentina" → `America/Argentina/Buenos_Aires`
   - Convierte "12:00" de Argentina a timezone del usuario (ej: México)
   - Resultado: "09:00" en México

4. **Agendamiento:**
   - Busca slots disponibles en Google Calendar del usuario
   - Encuentra el próximo slot disponible que coincida con día y hora
   - Crea evento en Google Calendar
   - Google Calendar envía invitación automática al prospecto

---

## 🐛 BUGS CONOCIDOS Y SOLUCIONES

### Ninguno actualmente crítico

Todos los bugs críticos han sido corregidos. Los únicos problemas conocidos son mejoras de UX que no afectan funcionalidad.

---

## 📝 NOTAS IMPORTANTES

### Sobre el Admin Email

- **Admin email:** `rafaelalvrzb@gmail.com`
- **Configurado en:** Railway → Variables → `ADMIN_EMAIL`
- **Usado en:**
  - `server/routes.ts` - Endpoint `/api/engine/status` verifica admin
  - `src/pages/Dashboard.tsx` - Solo muestra Engine Status Card si es admin
- **Para cambiar admin:** Cambiar variable `ADMIN_EMAIL` en Railway

### Sobre el Deployment

- **Frontend:** Auto-deploy desde `rafagent-saas/main` a Vercel
- **Backend:** Auto-deploy desde `rafagent-engine/main` a Railway
- **Cualquier push a `main`** → Deployment automático

### Sobre Google Cloud Console

- **Estado actual:** "En producción" (Public) ✅
- **Tipo de usuario:** Usuarios externos (External users)
- **Límite actual:** 1 de 100 usuarios OAuth
- **Estrategia:** Haciendo mejoras del agente mientras se consiguen los primeros 100 usuarios (enfoque lean)
- **Verificación completa pendiente:** Después de 100 usuarios, se requerirá verificación completa (dominio propio, términos y condiciones, políticas de privacidad, etc.)
- **URL:** https://console.cloud.google.com/auth/audience?project=rafagent-saas

---

## 🎯 PRÓXIMOS PASOS SUGERIDOS

1. **Mejoras del agente mientras se consiguen los primeros 100 usuarios** (enfoque lean)
2. **Agregar validación de formularios** (mejora UX)
3. **Optimizar bundle size** (mejora performance)
4. **Agregar retry logic para Google APIs** (mejora confiabilidad)
5. **Implementar monitoring** (mejora debugging)
6. **Verificación completa después de 100 usuarios** (dominio, términos y condiciones, políticas de privacidad, etc.)

---

## 📚 ARCHIVOS DE DOCUMENTACIÓN

Lee estos archivos para contexto completo:

1. **`PROMPT_NUEVO_CHAT_MEJORAS.md`** - Contexto inicial completo del proyecto
2. **`REVISION_COMPLETA_Y_AREAS_OPORTUNIDAD.md`** - Revisión técnica y áreas de oportunidad
3. **`GUIA_PUBLICACION_Y_PRIMER_USUARIO.md`** - Guía paso a paso para publicar
4. **`PUBLICAR_APP_EN_GOOGLE_CLOUD.md`** - Cómo publicar en Google Cloud
5. **`GUIA_PUBLICACION_RAFAGENT.md`** - Guía general de publicación

---

## ⚠️ IMPORTANTE: ANTES DE HACER CAMBIOS

1. **Lee el código relevante** antes de modificar
2. **Verifica que los cambios no rompan funcionalidad existente**
3. **Prueba localmente** antes de hacer push
4. **Considera el impacto** en producción
5. **Mantén consistencia** con el código existente

---

## 🎉 ESTADO ACTUAL

**RafAgent está PUBLICADO Y LISTO PARA USUARIOS** ✅

- ✅ Aplicación publicada en Google Cloud Console (modo "Público")
- ✅ Todas las funcionalidades principales funcionan
- ✅ Timezone detection y conversion funcionando
- ✅ Login funcionando
- ✅ Engine Status solo para admin
- ✅ UI/UX mejorada
- ✅ Build exitoso
- ✅ Sin errores críticos
- ✅ Límite actual: 1 de 100 usuarios OAuth (sin verificación completa)

**Estado de Publicación:**
- ✅ Aplicación publicada en Google Cloud Console (modo "Público")
- ✅ Límite actual: 1 de 100 usuarios OAuth (sin verificación completa)
- ✅ Listo para recibir usuarios y hacer mejoras iterativas (enfoque lean)

**Pendiente:**
- ⏳ Mejoras del agente mientras se consiguen los primeros 100 usuarios
- ⏳ Verificación completa después de 100 usuarios (dominio, términos y condiciones, etc.)
- ⏳ Mejoras de UX/Performance (opcional, después de lanzamiento)

---

## 💡 TIPS PARA EL AI

- **Siempre lee los archivos markdown** antes de hacer cambios
- **Verifica el código más reciente** en `server/routes.ts` y `src/pages/`
- **Considera el contexto completo** de lo que se ha hecho
- **Mantén consistencia** con el estilo de código existente
- **Prueba localmente** antes de sugerir cambios
- **Considera el impacto** en producción cuando sugieras cambios

---

**¡Gracias por leer todo el contexto! Ahora puedes ayudarme con cualquier tarea relacionada con RafAgent.** 🚀

