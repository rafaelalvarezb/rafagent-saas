# 🚀 PROMPT COMPLETO PARA NUEVO CHAT - RAFAGENT (NOVIEMBRE 2025)

## 📋 INSTRUCCIONES PRINCIPALES

Antes de ayudarme con cualquier tarea, **POR FAVOR**:

1. **Lee TODOS los archivos markdown en este directorio** (especialmente los que empiezan con `PROMPT_`, `GUIA_`, `REVISION_`)
2. **Lee el código más reciente** en `src/` y `server/` - **NO asumas cómo funcionaba antes, verifica el código actual**
3. **Entiende la arquitectura actual** del RafAgent leyendo los archivos principales:
   - `server/routes.ts` - Todas las rutas API
   - `server/services/calendar.ts` - Lógica de agendamiento (recientemente mejorada)
   - `server/automation/agent.ts` - Lógica principal del agente
   - `src/pages/Prospects.tsx` - UI de prospects
   - `shared/schema.ts` - Schema de base de datos
4. **Considera el contexto completo** de lo que se ha hecho y lo que falta por hacer
5. **Entiende cómo funciona HOY** - lee el código actual, no asumas basándote en documentación antigua
6. **Si necesitas hacer cambios, primero lee el código relevante completamente** antes de modificar

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
- **Fix de login loop:** Corregido con JWT token en URL y redirección al frontend
- **Archivos relevantes:**
  - `server/routes.ts` - Endpoints de auth (incluye generación de JWT en callback)
  - `server/auth.ts` - Lógica de OAuth
  - `src/hooks/use-auth.tsx` - Hook de autenticación frontend (captura token de URL)

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
- **Editar prospects:** Funciona correctamente (solo si no tienen touchpoints enviados)
- **Eliminar prospects:** Funciona correctamente
- **Bulk import:** Funciona correctamente
- **Templates:** Ver y editar funciona
- **Configuration:** Guardar configuración funciona
- **Dashboard:** Métricas y stats funcionan

### 7. **Mejoras Recientes de UX (Noviembre 2025)** ✅

#### 7.1. **Edición de Prospects con Estado "Waiting for Working Hours"** ✅
- **Problema resuelto:** Los prospects en estado "waiting_working_hours" ahora se pueden editar sin errores
- **Validación backend:** Solo permite editar si `touchpointsSent === 0`
- **Mensaje informativo:** Muestra un recuadro azul con instrucciones claras cuando el prospecto está esperando working hours
- **Botón de acción:** Incluye botón "Modify Working Hours" que lleva a Configuration
- **Orden del modal:** El mensaje informativo aparece primero, luego los campos editables
- **Archivos relevantes:**
  - `server/routes.ts` - Endpoint PATCH `/api/prospects/:id` con validación de `touchpointsSent`
  - `src/pages/Prospects.tsx` - Modal de edición con mensaje informativo y botón

#### 7.2. **Mensajes Informativos en "Execute AI Agent Now"** ✅
- **Detección de working hours:** Cuando el usuario está fuera de working hours, muestra mensaje claro
- **Detección de respuestas:** Cuando no hay respuestas nuevas en Gmail, muestra mensaje informativo
- **Botón de acción:** Incluye botón "Modify Working Hours" en la alerta cuando está fuera de working hours
- **Mejor contraste:** Botón con fondo blanco y texto rojo para mejor visibilidad
- **Archivos relevantes:**
  - `server/automation/agent.ts` - Retorna `outsideWorkingHours` y `noNewResponses` en `ProcessResult`
  - `src/pages/Prospects.tsx` - `executeAgentMutation` muestra mensajes informativos según el resultado

#### 7.3. **Mejora de Priorización en Agendamiento de Reuniones** ✅ (Noviembre 2025)
- **Problema resuelto:** El agente no priorizaba el día y hora especificados por el prospecto
- **Solución implementada:**
  - **Priorización del día:** Si el prospecto especifica un día (ej: "jueves"), busca primero en ese día
  - **Búsqueda de hora exacta:** Si especifica día y hora, busca la hora exacta primero
  - **Fallback inteligente:** Si no encuentra hora exacta, busca +30min, +1h, etc. en el mismo día
  - **Día siguiente:** Si no encuentra nada en el día preferido, busca al día siguiente
  - **Corrección de timezone:** `getSlotDay()` ahora usa el timezone del usuario (no UTC), evitando agendar en el día incorrecto
- **Funcionando correctamente:** Pruebas exitosas:
  - "claro, platiquemos" → Busca primer slot con gap de 24h ✅
  - "claro, platiquemos el miércoles por fa" → Agenda en miércoles ✅
  - "claro, platiquemos el jueves a las 10 am" → Agenda en jueves a las 10am (o el siguiente slot disponible) ✅
  - "claro, platiquemos a las 12 pm hora argentina" → Convierte a 9am hora México y agenda ✅
- **Archivos relevantes:**
  - `server/services/calendar.ts` - Función `findNextAvailableSlot()` completamente reescrita con lógica de priorización
  - `server/services/calendar.ts` - Helper `getSlotDay()` corregido para usar timezone del usuario

---

## ❌ LO QUE HA SALIDO MAL Y SE HA CORREGIDO

### 1. **Error de Login Loop** ❌ → ✅ CORREGIDO (Noviembre 2025)
- **Problema:** Después de login, usuario era redirigido de vuelta a login
- **Causa:** El callback de OAuth redirigía a `/` en lugar del frontend con JWT token
- **Solución:** 
  - Agregado `generateToken()` en callback de OAuth
  - Redirección a `${frontendUrl}/dashboard?token=...` con token en URL
  - Frontend captura token y lo guarda en localStorage
  - Endpoint `/api/auth/status` ahora soporta JWT tokens
- **Archivos modificados:**
  - `server/routes.ts` - Callback ahora genera JWT y redirige al frontend con token
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

### 6. **Error al Editar Prospects en "Waiting for Working Hours"** ❌ → ✅ CORREGIDO (Noviembre 2025)
- **Problema:** Al intentar editar un prospecto en estado "waiting_working_hours", salía error 400 Bad Request
- **Causa:** El endpoint PATCH no validaba correctamente los campos editables y no filtraba campos no permitidos
- **Solución:**
  - Agregada validación para permitir editar solo si `touchpointsSent === 0`
  - Filtrado de campos editables (solo `contactName`, `contactEmail`, `contactTitle`, `companyName`, `industry`)
  - Validación de campos requeridos
  - Mensajes de error claros
- **Archivos modificados:**
  - `server/routes.ts` - Endpoint PATCH `/api/prospects/:id` con validación y filtrado de campos

### 7. **Error de Agendamiento: No Priorizaba Día y Hora Especificados por Prospecto** ❌ → ✅ CORREGIDO (Noviembre 2025)
- **Problema:** 
  - Si el prospecto decía "claro, platiquemos el miércoles por fa", agendaba para el martes si había un slot disponible
  - Si el prospecto decía "claro, platiquemos el jueves a las 10 am", agendaba para el miércoles a las 6pm
  - No respetaba las preferencias del prospecto, solo buscaba el primer slot disponible con gap de 24h
- **Causa:** 
  - La función `findNextAvailableSlot()` no priorizaba el día especificado
  - La función `getSlotDay()` usaba `getDay()` que devuelve el día en UTC, no en el timezone del usuario
  - Esto causaba que se identificara incorrectamente el día de la semana cuando había diferencia de timezone
- **Solución:**
  - Reescribida completamente `findNextAvailableSlot()` con lógica de priorización:
    1. Si hay día preferido (sin hora): Busca primero en ese día, si no encuentra busca al día siguiente
    2. Si hay día y hora preferidos: Busca hora exacta → +30min, +1h en el mismo día → día siguiente
    3. Si no hay preferencias: Usa primer slot disponible (comportamiento original)
  - Corregida función `getSlotDay()` para usar `toLocaleString()` con el timezone del usuario
  - Agregados helpers `getSlotTime()` y `getSlotDay()` para obtener hora y día correctos según timezone
- **Archivos modificados:**
  - `server/services/calendar.ts` - Función `findNextAvailableSlot()` completamente reescrita (líneas 435-747)
  - `server/services/calendar.ts` - Helper `getSlotDay()` corregido para usar timezone del usuario (líneas 497-513)
- **Commit:** `91b3a77` - "Fix: Priorizar día y hora especificados por prospecto en agendamiento de reuniones"
- **Deploy:** Cambios desplegados en Railway desde `rafagent-engine/main`

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
  - Rate limiting en endpoints críticos
  - Validación de permisos en todos los endpoints
  - CORS configurado correctamente

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
- `PROMPT_COMPLETO_NUEVO_CHAT.md` - Contexto inicial del proyecto
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
- `src/pages/Prospects.tsx` - Gestión de prospects (con modal de edición mejorado)
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
- `JWT_SECRET` = String secreto aleatorio (o usa SESSION_SECRET)
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
- Editar prospectos (solo si no tienen touchpoints enviados - `touchpointsSent === 0`)
- Eliminar prospectos
- Ver estado de cada prospecto (email abierto, respondido, meeting agendado)
- **Mensaje informativo:** Cuando un prospecto está en "waiting_working_hours", muestra mensaje con botón para modificar working hours

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
- **Priorización inteligente:** Respeta el día y hora especificados por el prospecto:
  - Si dice "jueves", busca primero en jueves
  - Si dice "jueves a las 10am", busca 10am exacta, luego +30min, +1h, etc.
  - Si no encuentra en el día preferido, busca al día siguiente
- Convierte timezones mencionados por prospectos (ej: "12pm hora argentina" → "9am hora México")
- Maneja working hours y working days
- **Mensajes informativos:** Muestra mensajes claros cuando está fuera de working hours o no hay respuestas nuevas

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
   - Backend redirige a `${frontendUrl}/dashboard?token=...`
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
   - Si está fuera de working hours, el prospecto queda en estado "waiting_working_hours"

4. **AI Agent procesa prospects**
   - Se ejecuta cada X horas (configurable, default 30 min)
   - Para cada prospect activo:
     - Si no tiene touchpoints enviados → envía initial email (si está en working hours)
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

4. **Agendamiento (con priorización inteligente):**
   - Busca slots disponibles en Google Calendar del usuario
   - **Prioriza el día y hora especificados:**
     - Si hay día y hora: Busca hora exacta → +30min → +1h en el mismo día → día siguiente
     - Si solo hay día: Busca primer slot en ese día → día siguiente si no hay
     - Si no hay preferencias: Usa primer slot disponible con gap de 24h
   - Usa el timezone del usuario para identificar correctamente el día de la semana
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
- **IMPORTANTE:** Cuando hay cambios en backend, hay que copiar archivos a `rafagent-engine` y hacer push
- **Proceso de deployment:**
  1. Hacer cambios en `/Users/anaramos/Desktop/RafAgent (from Replit to Cursor)/server/`
  2. Copiar archivos modificados a `/Users/anaramos/Desktop/rafagent-engine/src/`
  3. Hacer commit y push en `rafagent-engine`
  4. Railway detecta el cambio y hace deploy automático

### Sobre Google Cloud Console

- **Estado actual:** "En producción" (Public) ✅
- **Tipo de usuario:** Usuarios externos (External users)
- **Límite actual:** 1 de 100 usuarios OAuth
- **Estrategia:** Haciendo mejoras del agente mientras se consiguen los primeros 100 usuarios (enfoque lean)
- **Verificación completa pendiente:** Después de 100 usuarios, se requerirá verificación completa (dominio propio, términos y condiciones, políticas de privacidad, etc.)
- **URL:** https://console.cloud.google.com/auth/audience?project=rafagent-saas

### Sobre la Autenticación

- **Sistema dual:** Usa tanto JWT tokens como sessions
- **JWT token:** Se genera en el callback de OAuth y se envía en la URL al frontend
- **Frontend:** Captura el token de la URL y lo guarda en localStorage
- **API calls:** Envía el token en el header `Authorization: Bearer <token>`
- **Backend:** Verifica JWT token primero, luego fallback a session
- **Archivos relevantes:**
  - `server/routes.ts` - Genera JWT en callback, verifica en `/api/auth/status`
  - `src/hooks/use-auth.tsx` - Captura token de URL, lo guarda en localStorage
  - `src/lib/api.ts` - Envía token en header Authorization

### Sobre WebSocket vs Polling

- **Estado actual:** Usando **POLLING** (actualizaciones cada 3 segundos)
- **Por qué:** Railway tiene problemas de compatibilidad con WebSocket
- **Funciona para:** 0-500 usuarios perfectamente
- **Plan futuro:** Migrar a **Render.com** y habilitar **WebSocket** a los 500 usuarios
- **Beneficio esperado:** Actualizaciones instantáneas (<100ms vs 3000ms)
- **Ver:** `ROADMAP_WEBSOCKET_ESCALAMIENTO.md` para plan completo de migración
- **Archivos relevantes:**
  - `src/hooks/use-websocket.tsx` - WebSocket deshabilitado en producción
  - `src/hooks/use-polling.tsx` - Polling habilitado (cada 3 segundos)
  - `server/services/websocket.ts` - Configuración de WebSocket (listo para cuando migremos)

---

## 🎯 PRÓXIMOS PASOS SUGERIDOS

### Corto Plazo (0-100 usuarios):
1. **Conseguir los primeros 100 usuarios** (enfoque lean) ⭐
2. **Mejoras del agente basadas en feedback de usuarios**
3. **Agregar validación de formularios** (mejora UX)
4. **Mantener polling** (funciona perfectamente para MVP)

### Mediano Plazo (100-500 usuarios):
5. **Monitorear métricas de performance** (polling vs costo)
6. **Agregar retry logic para Google APIs** (mejora confiabilidad)
7. **Implementar monitoring** (Sentry o similar)
8. **Preparar migración a Render.com** para WebSocket

### Largo Plazo (500+ usuarios):
9. **Migrar backend a Render.com** (soporte nativo de WebSocket) ⚡
10. **Habilitar WebSocket** para actualizaciones instantáneas
11. **Verificación completa de Google OAuth** (dominio, términos, políticas)
12. **Optimizar bundle size** (code splitting, lazy loading)

**Ver `ROADMAP_WEBSOCKET_ESCALAMIENTO.md` para plan detallado.**

---

## 📚 ARCHIVOS DE DOCUMENTACIÓN

Lee estos archivos para contexto completo:

### Contexto General:
1. **`PROMPT_COMPLETO_NUEVO_CHAT.md`** - Contexto inicial completo del proyecto
2. **`PROMPT_NUEVO_CHAT_MEJORAS.md`** - Contexto inicial completo del proyecto
3. **`REVISION_COMPLETA_Y_AREAS_OPORTUNIDAD.md`** - Revisión técnica y áreas de oportunidad

### Publicación y Deployment:
4. **`GUIA_PUBLICACION_Y_PRIMER_USUARIO.md`** - Guía paso a paso para publicar
5. **`PUBLICAR_APP_EN_GOOGLE_CLOUD.md`** - Cómo publicar en Google Cloud
6. **`GUIA_PUBLICACION_RAFAGENT.md`** - Guía general de publicación

### Mejoras Recientes (Noviembre 2025):
7. **`MEJORAS_NOVIEMBRE_2025_PARTE_2.md`** - Sistema de notificaciones, panel admin, colores
8. **`SISTEMA_COLORES_COHERENTE.md`** - Esquema de colores de la aplicación

### Escalamiento y Futuro:
9. **`ROADMAP_WEBSOCKET_ESCALAMIENTO.md`** - Plan para WebSocket a los 500 usuarios ⭐
10. **`WEBSOCKET_CONFIGURACION.md`** - Configuración técnica de WebSocket
11. **`WEBSOCKET_RAILWAY_PROBLEMA.md`** - Problemas de Railway con WebSocket

---

## ⚠️ IMPORTANTE: ANTES DE HACER CAMBIOS

1. **Lee el código relevante COMPLETO** antes de modificar - no hagas cambios basándote solo en documentación
2. **Entiende cómo funciona HOY** - lee el código actual en `server/` y `src/`, no asumas cómo funcionaba antes
3. **Lee los archivos markdown** para entender el contexto completo del proyecto
4. **Verifica que los cambios no rompan funcionalidad existente** - revisa dependencias y llamadas a funciones
5. **Prueba localmente** antes de hacer push (si es posible)
6. **Considera el impacto** en producción - especialmente en endpoints usados por el frontend
7. **Mantén consistencia** con el estilo de código existente
8. **Si haces cambios en backend**, recuerda copiar a `rafagent-engine` y hacer push para que se despliegue
9. **Lee el código más reciente** - el código actual puede ser diferente a lo que dice la documentación

---

## 🎉 ESTADO ACTUAL

**RafAgent está PUBLICADO Y LISTO PARA USUARIOS** ✅

- ✅ Aplicación publicada en Google Cloud Console (modo "Público")
- ✅ Todas las funcionalidades principales funcionan
- ✅ Timezone detection y conversion funcionando
- ✅ Login funcionando (con JWT token)
- ✅ Engine Status solo para admin
- ✅ UI/UX mejorada
- ✅ Build exitoso
- ✅ Sin errores críticos
- ✅ Límite actual: 1 de 100 usuarios OAuth (sin verificación completa)
- ✅ Mejoras de UX recientes implementadas (mensajes informativos, edición de prospects)

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

- **Siempre lee los archivos markdown** antes de hacer cambios, especialmente `PROMPT_NUEVO_CHAT_NOV_2025.md`
- **Lee el código relevante COMPLETO** - no hagas cambios sin leer primero el archivo completo que vas a modificar
- **Verifica el código más reciente** en `server/routes.ts`, `server/services/calendar.ts`, `server/automation/agent.ts`, y `src/pages/`
- **Entiende cómo funciona HOY** - lee el código actual, no asumas basándote en documentación antigua
- **Si necesitas entender una funcionalidad**, lee el código relacionado primero:
  - Agendamiento: `server/services/calendar.ts` (función `findNextAvailableSlot()`)
  - Agente: `server/automation/agent.ts` (función `runAgent()`)
  - Rutas API: `server/routes.ts`
  - UI: `src/pages/Prospects.tsx`, `src/pages/Dashboard.tsx`
- **Considera el contexto completo** de lo que se ha hecho y lo que falta por hacer
- **Mantén consistencia** con el estilo de código existente
- **Si haces cambios en backend**, recuerda que hay que copiar a `rafagent-engine` y hacer push
- **No asumas cómo funcionaba antes** - verifica el código actual siempre

---

## 📋 RESUMEN DE CAMBIOS RECIENTES (NOVIEMBRE 2025)

### 1. **Fix de Login Loop** ✅
- **Problema:** Usuario era redirigido de vuelta a login después de OAuth
- **Solución:** Callback de OAuth ahora genera JWT token y redirige al frontend con token en URL
- **Archivos:** `server/routes.ts`, `src/hooks/use-auth.tsx`

### 2. **Mejora de Edición de Prospects** ✅
- **Problema:** No se podían editar prospects en estado "waiting_working_hours"
- **Solución:** Validación en backend para permitir editar solo si `touchpointsSent === 0`
- **Mejora UX:** Modal de edición con mensaje informativo y botón para modificar working hours
- **Archivos:** `server/routes.ts`, `src/pages/Prospects.tsx`

### 3. **Mensajes Informativos en AI Agent** ✅
- **Problema:** No había visibilidad cuando el agente no se ejecutaba por working hours o no había respuestas
- **Solución:** Backend retorna `outsideWorkingHours` y `noNewResponses` en `ProcessResult`
- **Mejora UX:** Frontend muestra mensajes informativos con botones de acción
- **Archivos:** `server/automation/agent.ts`, `src/pages/Prospects.tsx`

### 4. **Mejora de Contraste en Botones** ✅
- **Problema:** Botón "Modify Working Hours" en alerta destructiva no tenía buen contraste
- **Solución:** Botón con fondo blanco y texto rojo para mejor visibilidad
- **Archivos:** `src/pages/Prospects.tsx`

### 5. **Mejora de Priorización en Agendamiento de Reuniones** ✅ (Noviembre 2025)
- **Problema:** El agente no priorizaba el día y hora especificados por el prospecto, agendaba el primer slot disponible
- **Solución:** 
  - Reescribida función `findNextAvailableSlot()` con lógica de priorización completa
  - Corregida función `getSlotDay()` para usar timezone del usuario (no UTC)
  - Implementada búsqueda inteligente: hora exacta → +30min → +1h → día siguiente
- **Resultado:** Ahora respeta las preferencias del prospecto siempre que haya slots disponibles
- **Archivos:** `server/services/calendar.ts`
- **Commit:** `91b3a77` - Desplegado en Railway

---

**¡Gracias por leer todo el contexto! Ahora puedes ayudarme con cualquier tarea relacionada con RafAgent.** 🚀

