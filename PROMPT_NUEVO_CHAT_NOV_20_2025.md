# 🚀 PROMPT COMPLETO PARA NUEVO CHAT - SENDLR.AI (NOVIEMBRE 20, 2025)

## 📋 INSTRUCCIONES CRÍTICAS - LEE ESTO PRIMERO

**ANTES DE AYUDARME CON CUALQUIER TAREA, POR FAVOR:**

1. **Lee TODOS los archivos markdown en este directorio** (especialmente `PROMPT_*`, `ROADMAP_*`, `GUIA_*`, `MEJORAS_*`, `ANALISIS_*`)
2. **Lee el código MÁS RECIENTE** en `src/` y `server/` - **NO asumas cómo funcionaba antes, verifica el código ACTUAL**
3. **Entiende cómo funciona HOY** - el código puede ser diferente a la documentación
4. **Lee archivos completos antes de modificar** - no hagas cambios sin entender el contexto completo
5. **Verifica el estado actual** del deployment en Railway y Vercel antes de sugerir cambios
6. **Considera el roadmap** - hay un plan claro para WebSocket a los 500 usuarios
7. **El código es la fuente de verdad** - siempre verifica el código actual, no asumas basándote solo en documentación
8. **El nombre de la aplicación es SENDLR.AI** (no RafAgent, no Sendler.ai) - verifica el rebranding completo

---

## 🎯 ¿QUÉ ES SENDLR.AI?

Sendlr.ai es una aplicación SaaS de automatización de ventas outbound que:
- Envía emails automáticamente a prospects en secuencias
- Usa AI (Google Gemini) para analizar respuestas de prospects
- Agenda reuniones automáticamente cuando un prospect muestra interés
- Convierte timezones inteligentemente (ej: "12pm hora argentina" → 9am hora México)
- Maneja referidos y otros tipos de respuestas
- Sistema de notificaciones en tiempo real (polling cada 3 segundos)
- Panel de administración para monitorear usuarios
- **Detiene secuencias automáticamente** cuando vendedor responde manualmente o cuando prospecto de misma empresa responde con interés
- **Usa solo el primer nombre** en los emails (extrae automáticamente de nombre completo)

### Stack Tecnológico

**Frontend:**
- React + TypeScript
- Vite
- Tailwind CSS
- TanStack Query (React Query)
- Wouter (routing)
- Radix UI components
- Desplegado en **Vercel (Hobby - Gratis)**: `https://rafagent-saas.vercel.app`

**Backend:**
- Node.js + TypeScript + Express
- PostgreSQL (Neon - $5/mes)
- Google OAuth 2.0
- Google Calendar API
- Gmail API
- Google Gemini API (AI)
- Socket.IO (WebSocket - deshabilitado en producción, usando polling)
- Desplegado en **Railway ($5/mes)**: `https://rafagent-engine-production.up.railway.app`

**Base de Datos:**
- Neon PostgreSQL ($5/mes - versión más económica)
- Schema: `shared/schema.ts`
- Drizzle ORM

**Costos Actuales:**
- **Neon PostgreSQL:** $5/mes (versión más económica)
- **Railway:** $5/mes (versión más económica)
- **Vercel:** Gratis (Hobby plan)
- **Total:** ~$10/mes

**Actualizaciones en Tiempo Real:**
- **Método actual:** POLLING cada 3 segundos
- **Razón:** Railway tiene problemas de compatibilidad con WebSocket
- **Plan futuro:** Migrar a Render.com y habilitar WebSocket a los 500 usuarios
- **Ver:** `ROADMAP_WEBSOCKET_ESCALAMIENTO.md` para plan completo

---

## ✅ LO QUE HA SALIDO BIEN - IMPLEMENTADO Y FUNCIONANDO

### 1. **Sistema de Timezone Completo** ✅
- **Detección automática:** Al hacer login, detecta timezone del navegador y lo guarda automáticamente
- **Selector manual:** Usuario puede cambiar timezone en Configuration → "Active Timezone"
- **Conversión inteligente:** Detecta timezones mencionados por prospects (ej: "12pm hora argentina") y convierte a timezone del usuario
- **Funcionando correctamente:** Prueba exitosa: "12pm hora argentina" → "9am hora México"
- **Sincronización en UI:** El timezone se muestra correctamente después de guardar cambios
- **Archivos relevantes:**
  - `server/utils/timezoneDetection.ts` - Detección y conversión
  - `server/services/calendar.ts` - `convertTimeBetweenTimezones()` y `mapTimezoneNameToIANA()`
  - `src/hooks/use-auth.tsx` - Auto-detección en login
  - `src/components/TimezoneSelector.tsx` - Selector manual con sincronización de estado
  - `src/pages/Configuration.tsx` - UI para modificar timezone con actualización inmediata

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
- **Fix error 401:** Corregido agregando token de autorización en `useEngineHealth()`
- **Archivos relevantes:**
  - `server/routes.ts` - Endpoint `/api/engine/status` y `/api/engine/health` con verificación de admin
  - `src/pages/Dashboard.tsx` - Solo muestra `EngineStatusCard` si `isAdmin`
  - `src/components/EngineStatusCard.tsx` - Componente con manejo de errores mejorado
  - `src/hooks/use-engine.tsx` - Hook con manejo de errores 403 y token de auth

### 4. **Toggle de Vista Admin/Estándar** ✅ (Diciembre 2025)
- **Toggle en Dashboard:** Switch "Admin View" visible solo para admin
- **Vista estándar:** Permite ocultar secciones de admin para hacer demos
- **Persistencia:** Preferencia guardada en localStorage
- **Funcionando correctamente:** Permite cambiar entre vista admin y vista estándar
- **Archivos relevantes:**
  - `src/hooks/use-admin-view.tsx` - Hook para gestionar estado del toggle
  - `src/pages/Dashboard.tsx` - Toggle agregado y lógica de mostrar/ocultar

### 5. **Detención Inteligente de Secuencias** ✅ (Diciembre 2025)
- **Detección de respuestas manuales:** Detecta si vendedor respondió manualmente
- **Detención automática:** Detiene secuencia si vendedor respondió manualmente
- **Estatus claro:** Muestra `🛑 Sequence Ended - Manual Reply` cuando vendedor responde
- **Detención por empresa:** Detiene secuencias de otros prospectos de misma empresa cuando uno responde con interés
- **Estatus por empresa:** Muestra `🏢 Sequence Ended - Company Contacted` para prospectos de empresa ya contactada
- **Funcionando correctamente:** Pruebas exitosas en ambos escenarios
- **Archivos relevantes:**
  - `server/automation/agent.ts` - Función `checkForNewResponse()` actualizada para detectar respuestas manuales
  - `server/automation/agent.ts` - Nueva función `stopSequencesForSameCompany()` para detener secuencias por empresa
  - `server/automation/agent.ts` - Lógica agregada en `runAgent()` para manejar ambos casos

### 6. **UI/UX Mejoras Dopamínicas** ✅
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

### 7. **Sistema de Colores Coherente** ✅
- **Sistema unificado de colores en toda la aplicación:**
  - 🟡 **Amarillo** = Enviado (Total Sent)
  - 🔵 **Azul** = Abierto (Email Opened)
  - 🟣 **Morado** = Respondido (Replied)
  - 🟢 **Verde** = Meeting Agendado (ÉXITO MÁXIMO)
- **Archivos relevantes:**
  - `src/components/DashboardStats.tsx` - Cards con colores coherentes
  - `src/components/NotificationBell.tsx` - Iconos de colores según tipo
  - `src/pages/Prospects.tsx` - Sección expandible con colores coherentes
- **Ver:** `SISTEMA_COLORES_COHERENTE.md` para documentación completa

### 8. **Sistema de Notificaciones Tipo Campana** ✅
- **Botón de campana en header** con badge rojo de contador
- **Panel expandible/colapsable** estilo Monday.com
- **Notificaciones de:**
  - 📧 Emails abiertos (icono azul)
  - 💬 Respuestas de prospects (icono morado)
  - 📅 Meetings agendados (icono verde)
- **Ordenadas por fecha** (más reciente primero)
- **Muestra primero 5**, botón "Show More" para ver todas
- **Badge actualiza automáticamente** cada 30 segundos
- **Al abrir el panel**, marca todas como leídas (resetea contador)
- **Archivos relevantes:**
  - `server/routes.ts` - Endpoint `/api/notifications` (líneas 692-766)
  - `src/hooks/use-notifications.tsx` - Hook para obtener notificaciones
  - `src/components/NotificationBell.tsx` - Componente principal
  - `src/App.tsx` - Integración en header

### 9. **Panel de Usuarios Admin** ✅
- **Solo visible para admin** (`rafaelalvrzb@gmail.com`)
- **Tabla con todos los usuarios registrados:**
  - Nombre y email
  - Status (Active/Inactive)
  - Total de prospects
  - Prospects en últimos 30 días
  - Timezone
  - Fecha de registro
- **Métricas resumidas:**
  - Total Users
  - Active Users (últimos 30 días)
  - Total Prospects (suma de todos)
- **Archivos relevantes:**
  - `server/routes.ts` - Endpoint `/api/admin/users` (líneas 1273-1339)
  - `src/components/AdminUsersPanel.tsx` - Componente de tabla
  - `src/pages/Dashboard.tsx` - Integración (solo para admin)

### 10. **Fix: Nombre de Usuario en Correos** ✅
- **Problema resuelto:** Los correos ahora muestran `"Rafael Alvarez" <rafaelalvrzb@gmail.com>` en lugar de solo `rafaelalvrzb@gmail.com`
- **Genera más confianza** y profesionalismo
- **Archivos relevantes:**
  - `server/services/gmail.ts` - Función `sendEmail()` con parámetro `senderName`
  - Todas las llamadas a `sendEmail()` actualizadas con `user.name`

### 11. **Mejora de Priorización en Agendamiento** ✅
- **Problema resuelto:** El agente ahora prioriza el día y hora especificados por el prospecto
- **Funcionando correctamente:**
  - "claro, platiquemos" → Busca primer slot con gap de 24h ✅
  - "claro, platiquemos el miércoles por fa" → Agenda en miércoles ✅
  - "claro, platiquemos el jueves a las 10 am" → Agenda en jueves a las 10am ✅
  - "claro, platiquemos a las 12 pm hora argentina" → Convierte a 9am hora México y agenda ✅
- **Archivos relevantes:**
  - `server/services/calendar.ts` - Función `findNextAvailableSlot()` completamente reescrita
  - `server/services/calendar.ts` - Helper `getSlotDay()` corregido para usar timezone del usuario

### 12. **Rebranding Completo a Sendlr.ai** ✅ (Noviembre 20, 2025)
- **Cambio de nombre:** RafAgent → **Sendlr.ai** (sin la "e")
- **Actualizado en:**
  - Sidebar (`src/components/AppSidebar.tsx`)
  - Página de Login (`src/pages/Login.tsx`)
  - Título HTML (`index.html`)
  - Páginas legales (Privacy Policy y Terms of Service)
  - Documentación de análisis de competidores
- **IMPORTANTE:** El nombre correcto es **Sendlr.ai** (no Sendler.ai, no RafAgent)

### 13. **Páginas Legales para Verificación Google OAuth** ✅ (Noviembre 20, 2025)
- **Privacy Policy:** Creada en `src/pages/PrivacyPolicy.tsx`
- **Terms of Service:** Creada en `src/pages/TermsOfService.tsx`
- **Rutas agregadas:** `/privacy` y `/terms`
- **Enlaces en Login:** Agregados en página de login
- **Estilo:** Basado en Instantly.ai
- **Empresa:** AGIT S.A. de C.V. (México)
- **Dominios:** Configurados para `sendlr.ai` (aún no existe, pero listo cuando se compre)
- **Listo para:** Verificación de Google OAuth

### 14. **Duplicar Secuencias de Templates** ✅ (Noviembre 20, 2025)
- **Botón "Duplicate":** Agregado en página de Templates
- **Modal intuitivo:** Permite nombrar la secuencia duplicada
- **Funcionalidad completa:** Duplica secuencia y todos sus templates
- **Backend ya existía:** Solo se agregó la UI
- **Archivos relevantes:**
  - `src/pages/Templates.tsx` - Botón y modal de duplicar
  - `server/routes.ts` - Endpoint `/api/sequences/:id/clone` (ya existía)
  - `server/storage.ts` - Función `cloneSequence()` (ya existía)

### 15. **Mejora de Bulk Import** ✅ (Noviembre 20, 2025)
- **Template CSV descargable:**
  - Encoding UTF-8 con BOM para abrir correctamente en Excel
  - Headers descriptivos: "First Name", "Email Address", "Job Title", "Company Name", "Industry"
  - Datos de ejemplo con solo primer nombre
  - Escape correcto de comillas y comas
- **Google Sheets Template:**
  - Link público configurado: `https://docs.google.com/spreadsheets/d/1htZVPsxPtEktUM07oZmJZAqKkRxQblcfq50roA7-dhg/edit?usp=sharing&copy=true`
  - Botón "Use Google Sheets Template" en modal de import
  - Instrucciones claras en el sheet
- **Extracción de Primer Nombre:**
  - Si usuario ingresa "John Doe", solo se usa "John" en los emails
  - Funciona en procesamiento de CSV y en reemplazo de variables en templates
  - Función `extractFirstName()` implementada en frontend y backend
- **Validación de Datos de Ejemplo:**
  - Filtra automáticamente filas con datos de ejemplo (example, sample, test, etc.)
  - Muestra notificación cuando se filtran datos de ejemplo
- **Mejoras de UX:**
  - Instrucciones paso a paso en el modal
  - Mapeo automático mejorado de columnas
  - Nota clara sobre uso de solo primer nombre
- **Archivos relevantes:**
  - `src/pages/Prospects.tsx` - Función `downloadTemplate()`, `extractFirstName()`, `filterExampleData()`, `generateMappedDataWithFilter()`
  - `server/services/ai.ts` - Función `extractFirstName()` en `replaceTemplateVariables()`
  - `src/services/ai.ts` - Función `extractFirstName()` en `replaceTemplateVariables()`
  - `GUIA_GOOGLE_SHEETS_TEMPLATE.md` - Guía para crear el template

### 16. **Análisis Detallado de Competidores** ✅ (Noviembre 20, 2025)
- **Documento completo:** `ANALISIS_COMPETIDORES_DETALLADO.md`
- **Competidores analizados:**
  - Instantly.ai
  - Smartlead.ai
  - Saleshandy
- **Capacidades identificadas:**
  - ✅ Lo que Sendlr.ai ya tiene
  - ❌ Lo que Sendlr.ai NO tiene (oportunidades de mejora)
- **Recomendaciones priorizadas:**
  - 🔴 Alta prioridad: LinkedIn Integration, AI Template Generation, Email Warmup
  - 🟡 Media prioridad: SMS Integration, Advanced Analytics, Email Verification
  - 🟢 Baja prioridad: Lead Database, Unified Inbox, Team Collaboration

---

## ❌ LO QUE HA SALIDO MAL Y SE HA CORREGIDO

### 1. **Error de Login Loop** ❌ → ✅ CORREGIDO
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

### 2. **Error de Prospects en Blanco** ❌ → ✅ CORREGIDO
- **Problema:** Página de Prospects se mostraba completamente en blanco
- **Causa:** Error `Cannot access 'cn' before initialization` - problema de orden de importación en bundle
- **Solución:**
  - Configuración de Vite con manual chunks para `clsx` y `tailwind-merge`
  - Rebuild completo
- **Archivos modificados:**
  - `vite.config.ts` - Manual chunks configurados

### 3. **Error de Conversión de Timezone** ❌ → ✅ CORREGIDO
- **Problema:** "12pm hora argentina" se agendaba como "12pm hora México" en lugar de "9am hora México"
- **Causa:** Función `convertTimeBetweenTimezones()` calculaba offset incorrectamente
- **Solución:**
  - Reescribida función usando `Intl.DateTimeFormat` para calcular offset correctamente
- **Archivos modificados:**
  - `server/services/calendar.ts` - Función `convertTimeBetweenTimezones()` reescrita

### 4. **Error de OAuth Callback 404** ❌ → ✅ CORREGIDO
- **Problema:** Error 404 en `/api/auth/google/callback` en Railway
- **Causa:** Ruta definida incorrectamente
- **Solución:**
  - Corregida ruta a `/api/auth/google/callback`
  - Actualizado `GOOGLE_REDIRECT_URI` para incluir `/api`
  - Server binding cambiado a `0.0.0.0` para Railway

### 5. **Error de Automation Engine Status** ❌ → ✅ CORREGIDO
- **Problema:** Engine Status mostraba NaN, Invalid Date, valores vacíos
- **Causa:** Endpoint intentaba redirigir a Railway engine que no existía
- **Solución:**
  - Endpoint ahora calcula datos reales del backend actual
  - Valores por defecto para evitar NaN
- **Archivos modificados:**
  - `server/routes.ts` - Endpoint `/api/engine/status` reescrito

### 6. **Error 401 en /api/engine/health** ❌ → ✅ CORREGIDO
- **Problema:** El endpoint `/api/engine/health` devolvía 401 (Unauthorized) para el usuario admin
- **Causa:** El hook `useEngineHealth()` no enviaba el token de autenticación
- **Solución:**
  - Agregado `credentials: 'include'` y header `Authorization: Bearer ${token}` al request
  - Agregado manejo de errores 401/403 para usuarios no-admin
- **Archivos modificados:**
  - `src/hooks/use-engine.tsx` - Fix en `checkHealth()` (líneas 72-109)

### 7. **Error al Editar Prospects en "Waiting for Working Hours"** ❌ → ✅ CORREGIDO
- **Problema:** Al intentar editar un prospecto en estado "waiting_working_hours", salía error 400 Bad Request
- **Causa:** El endpoint PATCH no validaba correctamente los campos editables
- **Solución:**
  - Agregada validación para permitir editar solo si `touchpointsSent === 0`
  - Filtrado de campos editables
  - Mensajes de error claros
- **Archivos modificados:**
  - `server/routes.ts` - Endpoint PATCH `/api/prospects/:id` con validación

### 8. **WebSocket Crashes en Railway** ❌ → ✅ CORREGIDO
- **Problema:** Intentos de habilitar WebSocket causaban crashes en Railway
- **Causa:** Railway tiene problemas de compatibilidad con Socket.IO WebSocket
- **Solución:**
  - Rollback a configuración estable con polling
  - WebSocket deshabilitado en producción
  - Polling funciona perfectamente (actualizaciones cada 3 segundos)
  - Plan documentado para migrar a Render.com a los 500 usuarios
- **Archivos modificados:**
  - `src/hooks/use-websocket.tsx` - WebSocket deshabilitado en producción
  - `src/hooks/use-polling.tsx` - Polling habilitado
  - `server/services/websocket.ts` - Configuración lista para cuando migremos
- **Documentación:**
  - `ROADMAP_WEBSOCKET_ESCALAMIENTO.md` - Plan completo de migración
  - `WEBSOCKET_RAILWAY_PROBLEMA.md` - Análisis del problema

### 9. **Timezone no se mostraba correctamente después de guardar** ❌ → ✅ CORREGIDO (Diciembre 2025)
- **Problema:** Al cambiar timezone y guardar, el backend funcionaba pero el frontend no mostraba el cambio
- **Causa:** `TimezoneSelector` no sincronizaba su estado interno cuando `currentTimezone` cambiaba desde el padre
- **Solución:**
  - Agregado `useEffect` en `TimezoneSelector` para sincronizar estado interno
  - Mejorado `onSuccess` en `Configuration` para actualizar estado local inmediatamente
- **Archivos modificados:**
  - `src/components/TimezoneSelector.tsx` - Agregado `useEffect` para sincronizar estado
  - `src/pages/Configuration.tsx` - Mejorado `onSuccess` para actualizar estado inmediatamente

### 10. **Error de Build en Vercel: Icono "Clone" no existe** ❌ → ✅ CORREGIDO (Noviembre 20, 2025)
- **Problema:** Build fallaba con error `"Clone" is not exported by "lucide-react"`
- **Causa:** Icono `Clone` no existe en la librería `lucide-react`
- **Solución:**
  - Reemplazado `Clone` por `Files` (icono válido y apropiado)
  - Build funciona correctamente ahora
- **Archivos modificados:**
  - `src/pages/Templates.tsx` - Cambiado `Clone` por `Files`

### 11. **CSV Template no se abría correctamente** ❌ → ✅ CORREGIDO (Noviembre 20, 2025)
- **Problema:** CSV descargado no se podía abrir directamente en Excel/Google Sheets
- **Causa:** Faltaba BOM (Byte Order Mark) para encoding UTF-8
- **Solución:**
  - Agregado BOM (`\uFEFF`) al inicio del CSV
  - Mejorado escape de comillas y comas
  - Headers más descriptivos
- **Archivos modificados:**
  - `src/pages/Prospects.tsx` - Función `downloadTemplate()` mejorada

### 12. **Uso de Nombre Completo en Emails** ❌ → ✅ CORREGIDO (Noviembre 20, 2025)
- **Problema:** Si usuario ingresaba "John Doe", se usaba el nombre completo en emails
- **Causa:** No se extraía solo el primer nombre
- **Solución:**
  - Función `extractFirstName()` implementada en frontend y backend
  - Extrae automáticamente solo el primer nombre al procesar CSV
  - También funciona en reemplazo de variables en templates (por si hay datos antiguos)
- **Archivos modificados:**
  - `src/pages/Prospects.tsx` - Función `extractFirstName()` y `generateMappedDataWithFilter()`
  - `server/services/ai.ts` - Función `extractFirstName()` en `replaceTemplateVariables()`
  - `src/services/ai.ts` - Función `extractFirstName()` en `replaceTemplateVariables()`

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
  - CORS configurado correctamente (ya está, pero revisar)

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

#### 7. **WebSocket para Actualizaciones Instantáneas** 🚀 (PLANIFICADO)
- **Estado:** Plan completo documentado para migración a los 500 usuarios
- **Plan:**
  - Mantener polling hasta 500 usuarios
  - Migrar backend a Render.com a los 500 usuarios
  - Habilitar WebSocket (2 líneas de código)
  - Actualizaciones instantáneas (<100ms vs 3000ms)
- **Ver:** `ROADMAP_WEBSOCKET_ESCALAMIENTO.md` para plan detallado
- **Tiempo estimado:** 2-3 días de trabajo cuando llegue el momento
- **Costo adicional:** +$22/mes (vale completamente la pena)

#### 8. **Monitoring y Analytics**
- Google Analytics o similar
- Error tracking (Sentry, Rollbar)
- Logging centralizado

#### 9. **Testing**
- Tests unitarios
- Tests de integración
- Tests E2E

#### 10. **Documentación**
- Documentación de API
- Guías de usuario
- Video tutorials

---

## 📋 FUNCIONALIDADES PENDIENTES DEL TODO ACTUAL

### 1. **Generación de Templates con AI** ⏳ (PENDIENTE)
- **Estado:** No implementado
- **Requisitos:**
  - Usar Gemini API (ya configurada)
  - Input: URL de empresa + tipo de cliente que busca
  - Output: Secuencia completa (4 touchpoints) con templates personalizados
  - Tono humano y profesional
- **Archivos a modificar:**
  - `server/services/ai.ts` - Nueva función para generar templates
  - `src/pages/Templates.tsx` - UI para generar templates con AI
  - `server/routes.ts` - Endpoint para generar templates

### 2. **Integración con CRMs** ⏳ (PENDIENTE)
- **Estado:** No implementado
- **Requisitos:**
  - OAuth para conectar cuentas de Salesforce, HubSpot, Attio
  - Sincronización unidireccional: Sendlr.ai → CRM
  - Registrar: emails enviados, respuestas, meetings agendados
  - UI para conectar/desconectar CRMs
- **Archivos a crear/modificar:**
  - `server/services/crm/` - Nuevos servicios para cada CRM
  - `server/routes.ts` - Endpoints para OAuth y sincronización
  - `src/pages/Configuration.tsx` - Sección de integraciones CRM
  - `shared/schema.ts` - Tabla para almacenar tokens de CRM

### 3. **Versión White-label** ⏳ (PENDIENTE)
- **Estado:** No implementado
- **Requisitos:**
  - Sistema de pago mensual (Stripe)
  - Personalización: logo, colores, dominio personalizado
  - Panel de administración para clientes white-label
  - Gestión de usuarios por cliente white-label
- **Archivos a crear/modificar:**
  - `server/config/stripe.ts` - Configuración de Stripe (ya existe parcialmente)
  - `server/routes.ts` - Endpoints de pago y suscripciones
  - `shared/schema.ts` - Tablas para white-label (organizations, subscriptions, customizations)
  - `src/pages/WhiteLabel/` - Nuevas páginas para gestión white-label
  - `src/components/WhiteLabelCustomization.tsx` - Componente para personalización

---

## 📁 ESTRUCTURA DEL PROYECTO

### Repositorios

1. **`rafagent-saas`** (Frontend - Vercel)
   - Ubicación local: `/Users/anaramos/Desktop/RafAgent (from Replit to Cursor)`
   - GitHub: `rafaelalvarezb/rafagent-saas`
   - Deploy: Vercel (auto-deploy desde `main`)
   - URL: `https://rafagent-saas.vercel.app`
   - **NOTA:** Aunque el repo se llama `rafagent-saas`, la aplicación ahora se llama **Sendlr.ai**

2. **`rafagent-engine`** (Backend - Railway)
   - Ubicación local: `/Users/anaramos/Desktop/rafagent-engine`
   - GitHub: `rafaelalvarezb/rafagent-engine`
   - Deploy: Railway (auto-deploy desde `main`)
   - URL: `https://rafagent-engine-production.up.railway.app`
   - **IMPORTANTE:** Cuando hay cambios en backend, hay que copiar archivos a `rafagent-engine` y hacer push

### Directorios Principales

```
RafAgent/
├── src/                    # Frontend React
│   ├── components/         # Componentes React
│   │   ├── NotificationBell.tsx  # Sistema de notificaciones
│   │   ├── AdminUsersPanel.tsx  # Panel de usuarios admin
│   │   ├── DashboardStats.tsx   # Stats con colores coherentes
│   │   ├── TimezoneSelector.tsx # Selector de timezone
│   │   └── ...
│   ├── pages/              # Páginas principales
│   │   ├── Dashboard.tsx   # Dashboard con Engine Status y Panel Admin
│   │   ├── Prospects.tsx  # Gestión de prospects (con Bulk Import mejorado)
│   │   ├── Templates.tsx  # Gestión de templates (con duplicar secuencias)
│   │   ├── Configuration.tsx # Configuración (timezone, working hours)
│   │   ├── PrivacyPolicy.tsx # Privacy Policy (nueva)
│   │   ├── TermsOfService.tsx # Terms of Service (nueva)
│   │   └── ...
│   ├── hooks/              # Custom hooks
│   │   ├── use-notifications.tsx  # Hook de notificaciones
│   │   ├── use-websocket.tsx      # WebSocket (deshabilitado en prod)
│   │   ├── use-polling.tsx         # Polling (habilitado)
│   │   ├── use-admin-view.tsx      # Hook para toggle admin view
│   │   └── ...
│   └── App.tsx             # App principal con NotificationBell
├── server/                 # Backend Express
│   ├── routes.ts           # Todas las rutas API
│   │   ├── /api/notifications  # Sistema de notificaciones
│   │   ├── /api/admin/users    # Panel de usuarios admin
│   │   ├── /api/engine/status  # Engine Status (solo admin)
│   │   ├── /api/sequences/:id/clone  # Duplicar secuencias
│   │   └── ...
│   ├── services/           # Servicios
│   │   ├── gmail.ts        # Envío de emails con nombre de usuario
│   │   ├── calendar.ts     # Agendamiento con priorización
│   │   ├── ai.ts           # Gemini API (análisis y reemplazo de variables con extractFirstName)
│   │   ├── websocket.ts    # WebSocket (listo para Render)
│   │   └── ...
│   ├── automation/         # Lógica del agente
│   │   └── agent.ts        # Lógica principal del agente (detención de secuencias)
│   └── utils/              # Utilidades
├── shared/                 # Código compartido
│   └── schema.ts           # Schema de base de datos
└── *.md                    # Documentación
```

### Archivos Importantes para Leer

**Contexto del Proyecto:**
- `PROMPT_NUEVO_CHAT_NOV_20_2025.md` - **ESTE ARCHIVO** - Contexto completo más actualizado
- `PROMPT_NUEVO_CHAT_NOV_19_5:30PM_2025.md` - Contexto anterior (útil para historia)
- `ANALISIS_COMPETIDORES_DETALLADO.md` - Análisis completo de competidores ⭐
- `ROADMAP_WEBSOCKET_ESCALAMIENTO.md` - Plan para WebSocket a los 500 usuarios ⭐
- `MEJORAS_NOVIEMBRE_2025_PARTE_2.md` - Mejoras recientes detalladas
- `SISTEMA_COLORES_COHERENTE.md` - Sistema de colores
- `GUIA_GOOGLE_SHEETS_TEMPLATE.md` - Guía para template de Google Sheets

**Backend:**
- `server/routes.ts` - **LEER PRIMERO** - Todas las rutas API
- `server/auth.ts` - Autenticación Google OAuth
- `server/services/calendar.ts` - Conversión de timezone y agendamiento
- `server/services/gmail.ts` - Envío de emails (con nombre de usuario)
- `server/services/ai.ts` - Integración con Gemini (con extractFirstName)
- `server/automation/agent.ts` - **LEER** - Lógica principal del agente (detención de secuencias manual/empresa)
- `server/storage.ts` - Acceso a base de datos
- `server/services/websocket.ts` - WebSocket (listo para Render)

**Frontend:**
- `src/App.tsx` - Routing principal + NotificationBell
- `src/pages/Dashboard.tsx` - Dashboard con Engine Status, Panel Admin y Toggle Admin View
- `src/pages/Prospects.tsx` - Gestión de prospects (con Bulk Import mejorado, extractFirstName)
- `src/pages/Templates.tsx` - Gestión de templates (con duplicar secuencias)
- `src/pages/Configuration.tsx` - Configuración (timezone con sincronización)
- `src/pages/PrivacyPolicy.tsx` - Privacy Policy (nueva)
- `src/pages/TermsOfService.tsx` - Terms of Service (nueva)
- `src/components/NotificationBell.tsx` - Sistema de notificaciones
- `src/components/AdminUsersPanel.tsx` - Panel de usuarios admin
- `src/components/DashboardStats.tsx` - Stats con colores coherentes
- `src/components/TimezoneSelector.tsx` - Selector de timezone con sincronización
- `src/hooks/use-auth.tsx` - Hook de autenticación
- `src/hooks/use-notifications.tsx` - Hook de notificaciones
- `src/hooks/use-polling.tsx` - Polling para actualizaciones
- `src/hooks/use-admin-view.tsx` - Hook para toggle admin view
- `src/lib/api.ts` - Configuración de API calls

**Schema:**
- `shared/schema.ts` - Schema completo de base de datos

---

## 🔐 CONFIGURACIÓN ACTUAL

### Variables de Entorno (Vercel)
- `VITE_API_URL` = `https://rafagent-engine-production.up.railway.app`
- `VITE_WEBSOCKET_URL` = `https://rafagent-engine-production.up.railway.app` (no usada actualmente)

### Variables de Entorno (Railway)
- `DATABASE_URL` = Connection string de Neon PostgreSQL
- `GOOGLE_CLIENT_ID` = Google OAuth Client ID
- `GOOGLE_CLIENT_SECRET` = Google OAuth Client Secret
- `GOOGLE_REDIRECT_URI` = `https://rafagent-engine-production.up.railway.app/api/auth/google/callback`
- `GEMINI_API_KEY` = Google Gemini API Key
- `FRONTEND_URL` = `https://rafagent-saas.vercel.app`
- `ADMIN_EMAIL` = `rafaelalvrzb@gmail.com` ✅ Configurada
- `SESSION_SECRET` = String secreto aleatorio
- `JWT_SECRET` = String secreto aleatorio
- `NODE_ENV` = `production`
- `PORT` = `3001` (o el que Railway asigne)

### Google Cloud Console
- **Estado actual:** "En producción" (Public) ✅
- **Tipo de usuario:** Usuarios externos (External users)
- **Límite de usuarios OAuth:** 1 de 100 usuarios (sin verificación completa)
- **Nota:** Aplicación publicada pero sin verificación completa. Permite hasta 100 usuarios antes de requerir verificación completa (dominio, términos y condiciones, etc.)
- **URL:** https://console.cloud.google.com/auth/audience?project=rafagent-saas
- **Páginas legales:** Listas en `/privacy` y `/terms` (listas para verificación)

### Google Sheets Template
- **URL:** `https://docs.google.com/spreadsheets/d/1htZVPsxPtEktUM07oZmJZAqKkRxQblcfq50roA7-dhg/edit?usp=sharing&copy=true`
- **Configurado en:** `src/pages/Prospects.tsx` (línea ~1540)
- **Estado:** Público y copiable ✅

---

## 🎯 FUNCIONALIDADES PRINCIPALES

### 1. **Sistema de Prospects**
- Agregar prospectos individualmente
- **Bulk import desde CSV o Google Sheets** (mejorado Nov 20, 2025)
  - Template CSV descargable con encoding correcto
  - Link a Google Sheets template público
  - Extracción automática de primer nombre
  - Filtrado automático de datos de ejemplo
  - Instrucciones claras paso a paso
- Editar prospectos (solo si no tienen touchpoints enviados - `touchpointsSent === 0`)
- Eliminar prospectos
- Ver estado de cada prospecto (email abierto, respondido, meeting agendado)
- **Vista expandible:** Click en ">" muestra:
  - 📧 Email Opened (azul)
  - 💬 Replied (morado)
  - 📅 Meeting Scheduled (verde)
- **Detención automática de secuencias:**
  - `🛑 Sequence Ended - Manual Reply` - Vendedor respondió manualmente
  - `🏢 Sequence Ended - Company Contacted` - Otro prospecto de misma empresa respondió con interés

### 2. **Sistema de Templates**
- Templates por sequence (secuencias)
- Cada sequence tiene múltiples templates (Initial, Second Touch, Third Touch, Fourth Touch)
- Variables en templates: `${contactName}` (solo primer nombre), `${companyName}`, `${yourName}`, etc.
- Threading automático (mismo subject para seguir conversación)
- **Duplicar secuencias:** Botón "Duplicate" para copiar secuencia completa con todos sus templates

### 3. **AI Agent (Automation)**
- Se ejecuta automáticamente cada X horas (configurable, default 30 min)
- Analiza respuestas de prospects usando Gemini AI
- Clasifica respuestas: interested, not_interested, question, referral, etc.
- Agenda reuniones automáticamente si prospecto muestra interés
- **Priorización inteligente:** Respeta el día y hora especificados por el prospecto
- Convierte timezones mencionados por prospectos
- Maneja working hours y working days
- **Mensajes informativos:** Muestra mensajes claros cuando está fuera de working hours o no hay respuestas nuevas
- **Detención inteligente:**
  - Detecta si vendedor respondió manualmente y detiene secuencia
  - Detiene secuencias de otros prospectos de misma empresa cuando uno responde con interés
- **Uso de solo primer nombre:** Extrae automáticamente el primer nombre de `contactName` en todos los templates

### 4. **Sistema de Timezone**
- Detección automática al login
- Conversión inteligente de timezones en respuestas
- Selector manual en Configuration
- Working hours configurados por timezone
- **Sincronización en UI:** El timezone se muestra correctamente después de guardar

### 5. **Dashboard**
- Métricas de ventas (Total Sent 🟡, Opened 🔵, Replied 🟣, Meetings 🟢)
- Badge system (achievements)
- Recent Activity
- **Engine Status Card (solo admin)** - Muestra "Healthy" correctamente
- **Panel de Usuarios Admin (solo admin)** - Lista de usuarios registrados y activos
- **Toggle Admin View (solo admin)** - Permite cambiar entre vista admin y vista estándar

### 6. **Sistema de Notificaciones** 🔔
- Botón de campana en header con badge rojo de contador
- Panel expandible/colapsable
- Notificaciones de:
  - 📧 Emails abiertos (azul)
  - 💬 Respuestas de prospects (morado)
  - 📅 Meetings agendados (verde)
- Ordenadas por fecha (más reciente primero)
- Muestra primero 5, botón "Show More" para ver todas
- Badge actualiza automáticamente cada 30 segundos

### 7. **Actualizaciones en Tiempo Real**
- **Método actual:** POLLING cada 3 segundos
- **Por qué:** Railway tiene problemas de compatibilidad con WebSocket
- **Funciona perfectamente** para 0-500 usuarios
- **Plan futuro:** Migrar a Render.com y habilitar WebSocket a los 500 usuarios
- **Ver:** `ROADMAP_WEBSOCKET_ESCALAMIENTO.md` para plan completo

### 8. **Páginas Legales** 📄 (Nuevo - Nov 20, 2025)
- **Privacy Policy:** `/privacy` - Política de privacidad completa
- **Terms of Service:** `/terms` - Términos de servicio completos
- **Estilo:** Basado en Instantly.ai
- **Empresa:** AGIT S.A. de C.V. (México)
- **Listo para:** Verificación de Google OAuth

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
   - **El timezone se muestra correctamente después de guardar**

3. **Usuario agrega prospects**
   - Ve a Prospects → "+ Add Prospect" (individual)
   - O Prospects → "Bulk Import" (masivo)
     - Descarga template CSV o usa Google Sheets template
     - Llena datos (solo primer nombre se usará en emails)
     - Sube CSV
     - Sistema mapea columnas automáticamente
     - Filtra datos de ejemplo automáticamente
     - Selecciona sequence
     - Importa prospects
   - Prospecto se agrega a base de datos
   - Si `sendSequence: true`, el agente enviará emails automáticamente
   - Si está fuera de working hours, el prospecto queda en estado "waiting_working_hours"

4. **AI Agent procesa prospects**
   - Se ejecuta cada X horas (configurable, default 30 min)
   - Para cada prospect activo:
     - Si no tiene touchpoints enviados → envía initial email (si está en working hours)
     - Si tiene respuesta nueva → analiza con AI
     - **Si vendedor respondió manualmente → detiene secuencia con estatus `🛑 Sequence Ended - Manual Reply`**
     - Si prospecto muestra interés → agenda reunión
     - **Si prospecto de misma empresa respondió con interés → detiene secuencias de otros prospectos de esa empresa con estatus `🏢 Sequence Ended - Company Contacted`**
     - Si prospecto menciona timezone → convierte hora
   - Actualiza estado de prospecto
   - **Usa solo primer nombre** en todos los emails (extrae de `contactName`)
   - **Polling actualiza la UI cada 3 segundos** (ver cambios en tiempo real)

---

## 📝 NOTAS IMPORTANTES

### Sobre el Admin Email
- **Admin email:** `rafaelalvrzb@gmail.com`
- **Configurado en:** Railway → Variables → `ADMIN_EMAIL`
- **Usado en:**
  - `server/routes.ts` - Endpoints `/api/engine/status`, `/api/engine/health`, `/api/admin/users` verifican admin
  - `src/pages/Dashboard.tsx` - Solo muestra Engine Status Card, Panel Admin y Toggle Admin View si es admin

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
- **Verificación completa pendiente:** Después de 100 usuarios, se requerirá verificación completa (dominio, términos y condiciones, políticas de privacidad, etc.)
- **Páginas legales:** Ya creadas y listas en `/privacy` y `/terms`

### Sobre la Autenticación
- **Sistema dual:** Usa tanto JWT tokens como sessions
- **JWT token:** Se genera en el callback de OAuth y se envía en la URL al frontend
- **Frontend:** Captura el token de la URL y lo guarda en localStorage
- **API calls:** Envía el token en el header `Authorization: Bearer <token>`
- **Backend:** Verifica JWT token primero, luego fallback a session

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

### Sobre el Sistema de Colores
- **Sistema unificado en toda la aplicación:**
  - 🟡 **Amarillo** = Enviado (Total Sent)
  - 🔵 **Azul** = Abierto (Email Opened)
  - 🟣 **Morado** = Respondido (Replied)
  - 🟢 **Verde** = Meeting Agendado (ÉXITO MÁXIMO)
- **Aplicado en:**
  - Dashboard Stats (4 cards)
  - Notificaciones (iconos de colores)
  - Prospects expandible (3 iconos)
- **Ver:** `SISTEMA_COLORES_COHERENTE.md` para documentación completa

### Sobre la Detención de Secuencias
- **Detección de respuestas manuales:**
  - El agente detecta si el último mensaje en el thread es del usuario (vendedor)
  - Si es del usuario, detiene la secuencia automáticamente
  - Muestra estatus: `🛑 Sequence Ended - Manual Reply`
- **Detención por empresa:**
  - Cuando un prospecto responde con interés, el agente busca otros prospectos de la misma empresa
  - Detiene sus secuencias automáticamente
  - Muestra estatus: `🏢 Sequence Ended - Company Contacted`
- **Archivos relevantes:**
  - `server/automation/agent.ts` - Función `checkForNewResponse()` detecta respuestas manuales
  - `server/automation/agent.ts` - Función `stopSequencesForSameCompany()` detiene secuencias por empresa

### Sobre el Uso de Primer Nombre
- **Extracción automática:** Si usuario ingresa "John Doe", solo se usa "John" en los emails
- **Funciona en:**
  - Procesamiento de CSV (al importar)
  - Reemplazo de variables en templates (backend y frontend)
- **Archivos relevantes:**
  - `src/pages/Prospects.tsx` - Función `extractFirstName()` y `generateMappedDataWithFilter()`
  - `server/services/ai.ts` - Función `extractFirstName()` en `replaceTemplateVariables()`
  - `src/services/ai.ts` - Función `extractFirstName()` en `replaceTemplateVariables()`

### Sobre el Bulk Import
- **Template CSV:** Descargable con encoding UTF-8 BOM (se abre correctamente en Excel)
- **Google Sheets Template:** Link público configurado
- **Headers descriptivos:** "First Name", "Email Address", "Job Title", "Company Name", "Industry"
- **Filtrado automático:** Elimina filas con datos de ejemplo (example, sample, test, etc.)
- **Extracción de primer nombre:** Automática al procesar CSV
- **Mapeo automático:** Detecta columnas comunes y las mapea automáticamente

---

## 🎯 PRÓXIMOS PASOS SUGERIDOS

### Corto Plazo (0-100 usuarios):
1. **Conseguir los primeros 100 usuarios** (enfoque lean) ⭐
2. **Completar verificación de Google OAuth** (páginas legales ya listas)
3. **Implementar generación de templates con AI** (ya en TODO)
4. **Mejoras del agente basadas en feedback de usuarios**
5. **Agregar validación de formularios** (mejora UX)
6. **Mantener polling** (funciona perfectamente para MVP)

### Mediano Plazo (100-500 usuarios):
7. **Monitorear métricas de performance** (polling vs costo)
8. **Implementar integración con CRMs** (Salesforce, HubSpot, Attio)
9. **Agregar retry logic para Google APIs** (mejora confiabilidad)
10. **Implementar monitoring** (Sentry o similar)
11. **Preparar migración a Render.com** para WebSocket

### Largo Plazo (500+ usuarios):
12. **Migrar backend a Render.com** (soporte nativo de WebSocket) ⚡
13. **Habilitar WebSocket** para actualizaciones instantáneas
14. **Implementar versión white-label** (sistema de pago, personalización)
15. **Verificación completa de Google OAuth** (dominio, términos, políticas)
16. **Optimizar bundle size** (code splitting, lazy loading)

**Ver `ROADMAP_WEBSOCKET_ESCALAMIENTO.md` para plan detallado.**
**Ver `ANALISIS_COMPETIDORES_DETALLADO.md` para features de competidores a implementar.**

---

## 📚 ARCHIVOS DE DOCUMENTACIÓN

### Contexto General:
1. **`PROMPT_NUEVO_CHAT_NOV_20_2025.md`** - **ESTE ARCHIVO** - Contexto completo más actualizado
2. **`PROMPT_NUEVO_CHAT_NOV_19_5:30PM_2025.md`** - Contexto anterior (útil para historia)
3. **`ANALISIS_COMPETIDORES_DETALLADO.md`** - Análisis completo de competidores ⭐
4. **`REVISION_COMPLETA_Y_AREAS_OPORTUNIDAD.md`** - Revisión técnica y áreas de oportunidad

### Publicación y Deployment:
5. **`GUIA_PUBLICACION_Y_PRIMER_USUARIO.md`** - Guía paso a paso para publicar
6. **`PUBLICAR_APP_EN_GOOGLE_CLOUD.md`** - Cómo publicar en Google Cloud
7. **`GUIA_PUBLICACION_RAFAGENT.md`** - Guía general de publicación
8. **`GUIA_GOOGLE_SHEETS_TEMPLATE.md`** - Guía para template de Google Sheets

### Mejoras Recientes (Noviembre-Diciembre 2025):
9. **`MEJORAS_NOVIEMBRE_2025_PARTE_2.md`** - Sistema de notificaciones, panel admin, colores
10. **`SISTEMA_COLORES_COHERENTE.md`** - Esquema de colores de la aplicación

### Escalamiento y Futuro:
11. **`ROADMAP_WEBSOCKET_ESCALAMIENTO.md`** - **LEER ESTO** - Plan completo para WebSocket a los 500 usuarios ⭐
12. **`WEBSOCKET_CONFIGURACION.md`** - Configuración técnica de WebSocket
13. **`WEBSOCKET_RAILWAY_PROBLEMA.md`** - Problemas de Railway con WebSocket

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
10. **Considera el roadmap** - hay un plan claro para WebSocket a los 500 usuarios, no intentes habilitarlo ahora en Railway
11. **El nombre es SENDLR.AI** (no RafAgent, no Sendler.ai) - verifica el rebranding completo

---

## 🎉 ESTADO ACTUAL

**Sendlr.ai está PUBLICADO Y LISTO PARA USUARIOS** ✅

- ✅ Aplicación publicada en Google Cloud Console (modo "Público")
- ✅ Todas las funcionalidades principales funcionan
- ✅ Timezone detection y conversion funcionando
- ✅ Login funcionando (con JWT token)
- ✅ Engine Status solo para admin (funciona correctamente)
- ✅ Panel de usuarios admin funcionando
- ✅ Sistema de notificaciones funcionando
- ✅ Sistema de colores coherente implementado
- ✅ Nombre de usuario en correos funcionando
- ✅ UI/UX mejorada
- ✅ Toggle Admin View funcionando
- ✅ Detención inteligente de secuencias funcionando (manual y por empresa)
- ✅ Rebranding a Sendlr.ai completado
- ✅ Páginas legales creadas (Privacy Policy y Terms of Service)
- ✅ Duplicar secuencias funcionando
- ✅ Bulk Import mejorado (CSV + Google Sheets, extractFirstName, filtrado de ejemplo)
- ✅ Análisis de competidores completo
- ✅ Build exitoso
- ✅ Sin errores críticos
- ✅ Límite actual: 1 de 100 usuarios OAuth (sin verificación completa)
- ✅ Polling funcionando perfectamente (actualizaciones cada 3 segundos)
- ✅ WebSocket deshabilitado en producción (rollback a versión estable)

**Estado de Publicación:**
- ✅ Aplicación publicada en Google Cloud Console (modo "Público")
- ✅ Límite actual: 1 de 100 usuarios OAuth (sin verificación completa)
- ✅ Páginas legales listas para verificación de Google OAuth
- ✅ Listo para recibir usuarios y hacer mejoras iterativas (enfoque lean)

**Costos Actuales:**
- ✅ Neon PostgreSQL: $5/mes
- ✅ Railway: $5/mes
- ✅ Vercel: Gratis (Hobby)
- ✅ Total: ~$10/mes

**Pendiente:**
- ⏳ Generación de templates con AI (en TODO)
- ⏳ Integración con CRMs (en TODO)
- ⏳ Versión White-label (en TODO)
- ⏳ Mejoras del agente mientras se consiguen los primeros 100 usuarios
- ⏳ Verificación completa después de 100 usuarios (dominio, términos y condiciones, etc.)
- ⏳ Migración a Render.com y WebSocket a los 500 usuarios (plan documentado)

---

## 📋 RESUMEN DE CAMBIOS RECIENTES (NOVIEMBRE 20, 2025)

### Noviembre 20, 2025 - Mejoras Implementadas:

1. **Rebranding Completo a Sendlr.ai** ✅
   - Cambiado "RafAgent" a "Sendlr.ai" en toda la aplicación
   - Actualizado en: Sidebar, Login, HTML title, páginas legales, documentación
   - **IMPORTANTE:** El nombre correcto es **Sendlr.ai** (sin la "e")

2. **Páginas Legales para Verificación Google OAuth** ✅
   - Privacy Policy creada (`src/pages/PrivacyPolicy.tsx`)
   - Terms of Service creada (`src/pages/TermsOfService.tsx`)
   - Rutas `/privacy` y `/terms` agregadas
   - Enlaces en página de Login
   - Estilo basado en Instantly.ai
   - Empresa: AGIT S.A. de C.V. (México)
   - Dominios configurados para `sendlr.ai` (listo cuando se compre el dominio)

3. **Duplicar Secuencias de Templates** ✅
   - Botón "Duplicate" agregado en página de Templates
   - Modal intuitivo para nombrar secuencia duplicada
   - Funcionalidad completa (backend ya existía)

4. **Mejora de Bulk Import** ✅
   - Template CSV descargable con encoding UTF-8 BOM (se abre correctamente)
   - Google Sheets template público configurado
   - Headers descriptivos: "First Name", "Email Address", etc.
   - Extracción automática de primer nombre (si ingresa "John Doe", solo usa "John")
   - Filtrado automático de datos de ejemplo
   - Instrucciones claras paso a paso
   - Mapeo automático mejorado de columnas

5. **Análisis Detallado de Competidores** ✅
   - Documento completo: `ANALISIS_COMPETIDORES_DETALLADO.md`
   - Análisis de Instantly.ai, Smartlead.ai, Saleshandy
   - Identificadas capacidades que Sendlr.ai tiene y no tiene
   - Recomendaciones priorizadas

### Diciembre 2025 - Mejoras Anteriores:

6. **Fix: Timezone no se mostraba correctamente después de guardar** ✅
   - Agregado `useEffect` en `TimezoneSelector` para sincronizar estado interno
   - Mejorado `onSuccess` en `Configuration` para actualizar estado local inmediatamente

7. **Toggle de Vista Admin/Estándar** ✅
   - Crear hook `useAdminView` para gestionar estado del toggle en localStorage
   - Agregar switch "Admin View" en Dashboard header (solo visible para admin)
   - Ocultar secciones de admin cuando toggle está OFF

8. **Detención Inteligente de Secuencias** ✅
   - Detectar si último mensaje en thread fue enviado manualmente por vendedor
   - Detener secuencia automáticamente si vendedor respondió manualmente
   - Detener secuencias de otros prospectos de misma empresa cuando uno responde con interés

---

## 🎯 FILOSOFÍA DEL PROYECTO

### Enfoque Lean:
- ✅ **No sobre-optimizar prematuramente**
- ✅ **Polling es suficiente para MVP** (0-500 usuarios)
- ✅ **WebSocket es importante, pero no urgente**
- ✅ **Mejor tener 100 usuarios con polling que 0 usuarios con WebSocket perfecto**
- ✅ **La optimización se hace cuando el problema es real, no anticipado**

### Prioridades Actuales:
1. **Conseguir los primeros 100 usuarios** ⭐
2. **Iterar en features basado en feedback**
3. **Optimizar cuando tenga sentido** (a los 500 usuarios)

---

## 💡 TIPS PARA EL AI

- **Siempre lee los archivos markdown** antes de hacer cambios, especialmente `PROMPT_NUEVO_CHAT_NOV_20_2025.md`
- **Lee el código relevante COMPLETO** - no hagas cambios sin leer primero el archivo completo que vas a modificar
- **Verifica el código más reciente** en `server/routes.ts`, `server/services/calendar.ts`, `server/automation/agent.ts`, y `src/pages/`
- **Entiende cómo funciona HOY** - lee el código actual, no asumas basándote en documentación antigua
- **Si necesitas entender una funcionalidad**, lee el código relacionado primero:
  - Agendamiento: `server/services/calendar.ts` (función `findNextAvailableSlot()`)
  - Agente: `server/automation/agent.ts` (función `runAgent()`, `checkForNewResponse()`, `stopSequencesForSameCompany()`)
  - Rutas API: `server/routes.ts`
  - UI: `src/pages/Prospects.tsx`, `src/pages/Dashboard.tsx`, `src/pages/Configuration.tsx`, `src/pages/Templates.tsx`
  - Notificaciones: `src/components/NotificationBell.tsx`, `src/hooks/use-notifications.tsx`
  - Toggle Admin View: `src/hooks/use-admin-view.tsx`, `src/pages/Dashboard.tsx`
  - Bulk Import: `src/pages/Prospects.tsx` (funciones `downloadTemplate()`, `extractFirstName()`, `filterExampleData()`)
  - Extracción de primer nombre: `server/services/ai.ts` y `src/services/ai.ts` (función `extractFirstName()`)
- **Considera el contexto completo** de lo que se ha hecho y lo que falta por hacer
- **Mantén consistencia** con el estilo de código existente
- **Si haces cambios en backend**, recuerda que hay que copiar a `rafagent-engine` y hacer push
- **No intentes habilitar WebSocket en Railway** - hay un plan documentado para migrar a Render.com a los 500 usuarios
- **Polling funciona perfectamente** - no es necesario cambiarlo ahora
- **No asumas cómo funcionaba antes** - verifica el código actual siempre
- **El nombre es SENDLR.AI** - verifica el rebranding completo antes de hacer cambios

---

**¡Gracias por leer todo el contexto! Ahora puedes ayudarme con cualquier tarea relacionada con Sendlr.ai.** 🚀

**Recuerda: Lee el código actual, no asumas basándote solo en documentación. El código es la fuente de verdad.** ✅

**El nombre de la aplicación es SENDLR.AI (no RafAgent, no Sendler.ai).** ✅

