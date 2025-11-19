# 🚀 PROMPT PARA NUEVO CHAT - MEJORAS DE RAFAGENT

**Fecha:** 30 de octubre 2025  
**Usuario:** Rafael Alvarez (no técnico)  
**Status:** Bug crítico RESUELTO ✅ - Listo para mejoras

---

## 📋 CONTEXTO GENERAL

### ¿Qué es RafAgent?

**Aplicación SaaS completa** de automatización de ventas B2B que:
- Envía secuencias de emails automáticas vía Gmail API
- Analiza respuestas de prospectos con IA (Gemini)
- Detecta interés y programa reuniones automáticamente en Google Calendar
- UI completa en React/TypeScript
- Backend Node.js/Express con PostgreSQL

### Stack Tecnológico:
- **Frontend:** React, TypeScript, Vite, Tailwind, Wouter
- **Backend:** Node.js, Express, TypeScript (ejecutado con TSX)
- **Database:** PostgreSQL (Neon)
- **APIs:** Gmail API, Google Calendar API, Gemini AI
- **Auth:** Google OAuth 2.0
- **Deploy:**
  - Frontend: **Vercel** (repo: `rafaelalvarezb/rafagent-saas`)
  - Backend: **Railway** (repo: `rafaelalvarezb/rafagent-engine`)
- **Real-time:** WebSockets para actualizaciones en tiempo real

### ⚠️ ESTRUCTURA DE REPOSITORIOS (IMPORTANTE)

**HAY DOS REPOS:**

1. **`rafagent-saas`** (en GitHub)
   - Frontend: `src/` (React components, pages)
   - Backend: `server/` (services, automation, routes)
   - Vercel usa este repo
   - Código más reciente en desarrollo

2. **`rafagent-engine`** (en GitHub)
   - Backend SOLO: `src/` (misma estructura que `server/` de rafagent-saas)
   - Railway usa este repo
   - Recibe updates manuales del código de backend

**Workflow:**
- Desarrollo → `rafagent-saas` (en Cursor)
- Backend production → Copiar manualmente a `rafagent-engine`
- Frontend production → Auto-deploy desde `rafagent-saas` en Vercel

---

## ✅ LO QUE FUNCIONA PERFECTAMENTE

### Features completas:
- ✅ Autenticación con Google OAuth
- ✅ Gestión de prospectos (CRUD completo)
- ✅ Gestión de sequences y templates
- ✅ Envío de emails vía Gmail API
- ✅ Threading correcto de emails (conversaciones)
- ✅ Pixel tracking (detecta cuando abren emails)
- ✅ Análisis de respuestas con IA (Gemini)
- ✅ Detección de interés/rechazo/referrals/OOO
- ✅ **Programación de reuniones en Google Calendar** ⭐️ (recién arreglado)
- ✅ Dashboard con analytics
- ✅ Activity logs
- ✅ WebSockets para updates en tiempo real
- ✅ UI completamente funcional y moderna
- ✅ Responsive design
- ✅ Dark mode

### Configuración del usuario:
- ✅ Timezone (ej: America/Mexico_City)
- ✅ Working Hours (ej: 9 AM - 11 PM)
- ✅ Working Days (Lun-Vie seleccionables)
- ✅ Frecuencia del agente (cada 30 min recomendado)
- ✅ Días entre follow-ups
- ✅ Templates personalizables por sequence

---

## 🐛 BUG CRÍTICO QUE SE ARREGLÓ (30 OCT 2025)

### El Problema:
Las reuniones se programaban en **horarios incorrectos** en Google Calendar.

**Ejemplo del bug:**
- Usuario configura: 9 AM - 5 PM, Lun-Vie, timezone México
- Prospecto responde: "Claro, platiquemos" (sin preferencias)
- **Esperado:** Reunión mañana a las 9 AM hora México
- **Real:** Reunión 6 días después a las 4:30 PM (horario random)

### Causas raíz encontradas:

1. **Formato incorrecto para Google Calendar API**
   - Problema: Enviaba `.toISOString()` (con 'Z') + timezone
   - Solución: Enviar formato local (sin 'Z') + timezone separado

2. **IA parseaba headers de email como preferencias**
   - Problema: Extraía "DAYS:thursday TIME:10:43" de "El jue, 30 oct 2025 a las 10:43"
   - Solución: Función `cleanEmailForAI()` remueve headers antes de análisis

3. **Working days ignorados (hardcoded)**
   - Problema: Siempre usaba [1,2,3,4,5] sin importar configuración
   - Solución: Lee y respeta workingDays del usuario

4. **Día de la semana detectado en UTC**
   - Problema: En México 8 PM jueves, en UTC 2 AM viernes → confusión
   - Solución: Detecta día de la semana en timezone del usuario

### Archivos modificados:

**Backend (AMBOS repos actualizados):**
- ✅ `server/services/calendar.ts` (o `src/services/calendar.ts` en rafagent-engine)
  - Nueva función `formatDateForGoogleCalendar()`
  - Nueva función `createDateInTimezone()`
  - Fix en `getAvailableSlots()` para respetar workingDays y timezone
  - Fix en detección de día de la semana
  
- ✅ `server/services/gmail.ts` (o `src/services/gmail.ts`)
  - Nueva función `cleanEmailForAI()` - remueve headers y quoted text

- ✅ `server/automation/agent.ts` (o `src/automation/agent.ts`)
  - Usa `cleanEmailForAI()` antes de análisis de IA
  - Mejores logs para debugging

**Frontend:**
- No requirió cambios

---

## 🧪 CASOS DE PRUEBA VALIDADOS (TODOS FUNCIONAN ✅)

### CASO 1: Sin preferencias
- **Prospecto dice:** "Claro, platiquemos"
- **Resultado:** ✅ Agenda siguiente día disponible respetando 24h gap
- **Ejemplo:** Respondió jueves 8 PM → agendó viernes 8:30 PM

### CASO 2: Con día preferido
- **Prospecto dice:** "Podemos el lunes?"
- **Resultado:** ✅ Agenda lunes a las 9 AM (primer slot del día)

### CASO 3: Con día y hora preferida
- **Prospecto dice:** "Podemos el lunes a la 1 pm?"
- **Resultado:** ✅ Agenda lunes a la 1 PM exactamente

---

## 🔍 LECCIONES APRENDIDAS DEL DEBUGGING

### Problemas enfrentados durante el debug:

1. **Railway no detectaba cambios automáticamente**
   - Causa: Conectado a repo diferente (`rafagent-engine` vs `rafagent-saas`)
   - Solución: Volver Railway a `rafagent-engine` y actualizar manualmente

2. **Build failures en Railway**
   - Causa: Intentamos cambiar de repo y hubo conflictos de package-lock.json
   - Solución: Revertir cambios y usar configuración original

3. **Código nuevo no se reflejaba**
   - Causa: Railway usaba código de hace 3 días (caché)
   - Solución: Forzar redeploy manual + push al repo correcto

4. **Multiple intentos con diferentes enfoques**
   - `calendar-simple.ts` → Falló
   - `calendar-ultra-simple.ts` → Falló
   - `calendar.ts` (definitivo) → ✅ Funcionó

### Lo que funcionó al final:
- ✅ Entender que Vercel y Railway usan repos diferentes
- ✅ Actualizar ambos repos cuando hay cambios de backend
- ✅ Usar formato correcto de Google Calendar API (sin 'Z')
- ✅ Limpiar emails antes de análisis de IA
- ✅ Respetar timezone del usuario en TODA la lógica

---

## 📂 ESTRUCTURA DEL PROYECTO

### Directorio actual en Cursor:
`/Users/anaramos/Desktop/RafAgent (from Replit to Cursor)/`

### Estructura clave:

```
RafAgent/
├── src/                           # FRONTEND (Vercel)
│   ├── components/               # Componentes React
│   ├── pages/                    # Páginas principales
│   ├── hooks/                    # Custom hooks
│   ├── lib/                      # Utilidades
│   └── main.tsx                  # Entry point
│
├── server/                        # BACKEND (desarrollo)
│   ├── services/
│   │   ├── calendar.ts          # ⭐ Fix de timezone AQUÍ
│   │   ├── gmail.ts             # ⭐ cleanEmailForAI() AQUÍ
│   │   ├── ai.ts                # Análisis con Gemini
│   │   └── websocket.ts         # Real-time updates
│   ├── automation/
│   │   ├── agent.ts             # ⭐ Lógica principal del agente
│   │   ├── scheduler.ts         # Cron jobs
│   │   └── defaultTemplates.ts  # Templates por defecto
│   ├── routes.ts                # API endpoints
│   ├── auth.ts                  # OAuth Google
│   ├── storage.ts               # Database queries
│   └── index.ts                 # Server entry point
│
├── shared/
│   └── schema.ts                # Schema de DB (compartido)
│
└── migrations/                   # Migraciones de DB
```

### Base de datos (PostgreSQL en Neon):

**Tablas principales:**
- `users` - Usuarios autenticados
- `user_config` - Configuración de cada usuario
- `prospects` - Prospectos/contactos
- `sequences` - Sequences de emails
- `templates` - Templates de emails
- `activity_logs` - Logs de actividad

**Campos importantes en prospects:**
- `status` - Estado del prospecto
- `suggestedDays` - Días preferidos extraídos por IA
- `suggestedTime` - Hora preferida extraída por IA
- `suggestedTimezone` - Timezone mencionado
- `repliedAt` - Timestamp de cuándo respondió
- `meetingTime` - Cuándo está agendada la reunión
- `emailOpened` - Si abrió el email (pixel tracking)

---

## 🔑 ARCHIVOS CRÍTICOS A CONOCER

### Backend (lógica de negocio):

1. **`server/services/calendar.ts`** (200+ líneas)
   - `scheduleMeeting()` - Crea evento en Google Calendar
   - `getAvailableSlots()` - Encuentra slots disponibles
   - `findNextAvailableSlot()` - Selecciona mejor slot según preferencias
   - **RECIÉN ARREGLADO** - Usa formato correcto de timezone

2. **`server/services/gmail.ts`** (310+ líneas)
   - `sendEmail()` - Envía emails con threading correcto
   - `getThreadMessages()` - Obtiene mensajes de un thread
   - `getMessageBody()` - Extrae body del mensaje
   - `cleanEmailForAI()` - **NUEVA** - Limpia headers antes de IA

3. **`server/automation/agent.ts`** (700+ líneas)
   - `runAgent()` - Función principal que ejecuta cada 30 min
   - `sendInitialEmail()` - Envía primer email de sequence
   - `sendFollowUpEmail()` - Envía follow-ups
   - `checkForNewResponse()` - Detecta respuestas nuevas
   - `analyzeProspectResponse()` - Analiza con IA
   - `scheduleProspectMeeting()` - Orquesta programación de reunión

4. **`server/services/ai.ts`** (150 líneas)
   - `classifyResponse()` - Analiza email y extrae categoría + preferencias
   - Usa Gemini AI con prompt específico

5. **`server/routes.ts`** (1300+ líneas)
   - Todos los API endpoints
   - `/api/prospects/:id/schedule-meeting` - Programar reunión manual
   - `/api/agent/run` - Ejecutar agente manualmente
   - Authentication, CRUD de prospects, sequences, templates

### Frontend (UI):

1. **`src/pages/Prospects.tsx`** - Página principal de gestión de prospectos
2. **`src/pages/Configuration.tsx`** - Configuración de usuario
3. **`src/pages/Dashboard.tsx`** - Dashboard con analytics
4. **`src/components/` (69 archivos)** - Componentes reutilizables

---

## ✅ LO QUE SALIÓ BIEN

### Durante el debugging:
1. ✅ Identificamos todos los problemas de timezone
2. ✅ Implementamos solución correcta para Google Calendar API
3. ✅ Creamos función de limpieza de emails
4. ✅ Arreglamos detección de días laborables
5. ✅ Agregamos logs detallados para debugging
6. ✅ Probamos los 3 casos principales exitosamente
7. ✅ Documentamos TODO el proceso

### El sistema hoy (30 oct 2025, 8:30 PM):
1. ✅ Programa reuniones en horarios **CORRECTOS**
2. ✅ Respeta configuración de Working Days
3. ✅ Respeta configuración de Working Hours
4. ✅ Respeta timezone del usuario
5. ✅ NO se confunde con headers de emails
6. ✅ Extrae preferencias correctamente cuando el prospecto las menciona
7. ✅ Logs claros para debugging en Railway

---

## ❌ LO QUE SALIÓ MAL (Y SE ARREGLÓ)

### Problemas durante el debugging:

1. **Múltiples intentos fallidos**
   - `calendar-simple.ts` → Matemática de timezone incorrecta
   - `calendar-ultra-simple.ts` → Usaba `.toISOString()` incorrecto
   - `calendar.ts` → ✅ ÉXITO

2. **Confusión con repositorios**
   - Railway conectado a `rafagent-engine` (viejo)
   - Código nuevo en `rafagent-saas`
   - Deployments no se reflejaban
   - Solución: Mantener Railway en rafagent-engine, copiar código manualmente

3. **Build failures en Railway**
   - Intentamos cambiar repos → package-lock.json desincronizado
   - Solución: Revertir y usar configuración original

4. **IA parseando headers**
   - Extraía "DAYS:thursday TIME:11:15" de metadata del email
   - Solución: `cleanEmailForAI()` remueve headers antes de análisis

5. **Working days hardcoded**
   - Siempre usaba Lun-Vie
   - Solución: Leer configuración del usuario

6. **Timezone bugs múltiples**
   - Día de la semana en UTC vs local
   - Formato de fecha incorrecto
   - Conversiones incorrectas
   - Solución: Usar timezone del usuario en TODO

---

## 🎯 ESTADO ACTUAL (30 OCT 2025)

### Deployments:
- **Vercel:** ✅ Verde (frontend funcionando)
- **Railway:** ✅ Verde (backend funcionando)

### Último commit exitoso:
- **rafagent-saas:** `124932b` - "Fix: Corregir método para obtener día de la semana..."
- **rafagent-engine:** `6b581e8` - "Fix: Corregir método para obtener día de la semana..."

### Funcionalidad actual:
**Cuando un prospecto responde con interés:**

1. **Sin preferencias** ("Claro, platiquemos")
   → Agenda siguiente día disponible después de 24h gap
   → Respeta Working Days y Working Hours
   → Ejemplo: Jueves 8 PM + 24h = Viernes 8:30 PM ✅

2. **Con día** ("Podemos el lunes?")
   → Agenda ese día específico a las 9 AM (primer slot)
   → Ejemplo: Lunes 9:00 AM ✅

3. **Con día y hora** ("Podemos el lunes a la 1 pm?")
   → Agenda ese día a esa hora específica
   → Ejemplo: Lunes 1:00 PM ✅

**Todo funciona correctamente** ✅

---

## 📊 CONFIGURACIÓN ACTUAL DEL USUARIO

**Rafael Alvarez:**
- Email: rafaelalvrzb@gmail.com
- Timezone: Central Time (Mexico) - GMT-6
- Working Hours: 9:00 AM - 11:00 PM
- Working Days: Lunes, Martes, Miércoles, Jueves, Viernes
- Agent Frequency: 30 minutos

**Email de prueba:** carlosalvrzb@gmail.com (tiene acceso para testing)

---

## 🔧 CÓDIGO CLAVE QUE DEBES CONOCER

### 1. Función de limpieza de emails (`server/services/gmail.ts`):

```typescript
export function cleanEmailForAI(emailBody: string): string {
  // Remueve headers como "El jue, 30 oct 2025..."
  // Remueve quoted text (líneas con ">")
  // Retorna SOLO la respuesta del prospecto
}
```

**Por qué es importante:** Sin esto, la IA extrae preferencias falsas de los headers.

### 2. Formato correcto para Google Calendar (`server/services/calendar.ts`):

```typescript
function formatDateForGoogleCalendar(date: Date, timezone: string): string {
  // Retorna: "2025-10-31T20:00:00" (SIN Z, SIN offset)
  // Esto + timeZone separado = formato correcto
}
```

**Por qué es importante:** Google Calendar necesita este formato exacto para respetar timezones.

### 3. Lógica de programación (`server/automation/agent.ts`):

```typescript
async function scheduleProspectMeeting(user, prospect, config, sequence) {
  // 1. Lee configuración del usuario
  // 2. Busca slots disponibles en Google Calendar
  // 3. Filtra por Working Days y Working Hours
  // 4. Selecciona mejor slot según preferencias del prospecto
  // 5. Programa reunión con formato correcto
  // 6. Actualiza base de datos
  // 7. Emite WebSocket update
}
```

### 4. Análisis de IA (`server/services/ai.ts`):

Prompt para Gemini que:
- Clasifica respuestas en categorías (INTERESTED, NOT_INTERESTED, etc.)
- Extrae preferencias de día/hora SI las menciona explícitamente
- Ignora headers y metadata del email
- Soporta español e inglés

---

## 📝 DOCUMENTACIÓN CREADA

Durante el debugging, se crearon estos archivos (puedes leerlos si necesitas más contexto):

- `SOLUCION_DEFINITIVA_TIMEZONE.md` - Explicación técnica completa
- `COMO_VER_LOGS_RAILWAY.md` - Guía de logs
- `PASOS_PARA_APLICAR_SOLUCION.md` - Instrucciones paso a paso
- `RESUMEN_CAMBIOS.md` - Resumen de cambios
- `START_HERE_TIMEZONE_FIX.md` - Punto de entrada
- `EXITO_FIX_TIMEZONE.md` - Confirmación de éxito

---

## 🚨 COSAS IMPORTANTES A RECORDAR

### Sobre deployment:
1. **Frontend:** Vercel auto-deploya desde `rafagent-saas/main`
2. **Backend:** Railway auto-deploya desde `rafagent-engine/main`
3. **Workflow:** Desarrollar en local → Push a rafagent-saas → Copiar backend a rafagent-engine
4. **Verificación:** Siempre ver logs en Railway para confirmar que el código se actualizó

### Sobre el agente:
1. **Ejecuta cada 30 minutos** (configurable)
2. **Respeta working hours** - no envía emails fuera de horario
3. **Mínimo 24h entre primer email y reunión**
4. **Slots de 30 minutos** (9:00, 9:30, 10:00, etc.)
5. **Verifica conflictos** en Google Calendar antes de agendar

### Sobre el código:
1. **TypeScript ejecutado con TSX** - no se compila, se ejecuta directamente
2. **NO usar `npm run build`** en backend (causaba problemas)
3. **Logs son cruciales** - todos los console.log aparecen en Railway
4. **Timezone es crítico** - siempre usar timezone del usuario, nunca asumir UTC

---

## 💻 CÓMO HACER CAMBIOS EN PRODUCCIÓN

### Para cambios de FRONTEND:
```bash
# En Cursor
git add src/
git commit -m "Descripción del cambio"
git push origin main
# Vercel auto-deploya en 1-2 minutos
```

### Para cambios de BACKEND:
```bash
# En Cursor (rafagent-saas)
git add server/
git commit -m "Descripción del cambio"
git push origin main

# Luego copiar a rafagent-engine:
cd /Users/anaramos/Desktop
git clone https://github.com/rafaelalvarezb/rafagent-engine.git temp
cp -r "RafAgent (from Replit to Cursor)/server/ARCHIVO_MODIFICADO" temp/src/ARCHIVO_MODIFICADO
cd temp
git add .
git commit -m "Descripción del cambio"
git push origin main
cd ..
rm -rf temp
# Railway auto-deploya en 2-3 minutos
```

**O pedir ayuda al AI para hacer este proceso.**

---

## 🎯 LO QUE FALTA POR HACER

Rafael quiere hacer **mejoras** antes de publicar la aplicación.

**Pendiente:** Definir qué mejoras específicas necesita.

**Posibles áreas:**
- UI/UX improvements
- Nuevas funcionalidades
- Optimizaciones
- Documentación para usuarios finales
- Onboarding
- Analytics mejorados
- Etc.

---

## 🆘 INSTRUCCIONES PARA EL NUEVO CHAT

### Por favor:

1. **Lee este prompt completo** para entender el contexto
2. **Revisa el código actual** en `/Users/anaramos/Desktop/RafAgent (from Replit to Cursor)/`
3. **Enfócate especialmente en:**
   - `server/services/calendar.ts` - Lógica de scheduling
   - `server/automation/agent.ts` - Lógica del agente
   - `server/services/ai.ts` - Análisis de respuestas
4. **Recuerda:**
   - Rafael NO es técnico - necesita explicaciones simples
   - Siempre explicar POR QUÉ hacemos cada cosa
   - Probar todo antes de confirmar
   - Deployment: Vercel (frontend) + Railway (backend)
5. **Cuando hagas cambios de backend:**
   - Actualizar en `rafagent-saas` (desarrollo)
   - Copiar a `rafagent-engine` (producción Railway)

### Comandos útiles:

Ver logs de Railway en tiempo real:
```
Railway dashboard → rafagent-engine → Logs tab
```

Ejecutar agente manualmente:
```
En la app → Prospects → "Execute AI Agent Now"
```

Ver base de datos:
```
Neon dashboard → SQL Editor
```

---

## 📞 CONTACTO

**Usuario:** Rafael Alvarez  
**Email:** rafaelalvrzb@gmail.com  
**Nivel técnico:** No técnico (necesita guía paso a paso)  
**Timezone:** Ciudad de México (GMT-6)  

---

## ✨ ESTADO FINAL

**Aplicación:** ✅ Funcional al 100%  
**Bug crítico:** ✅ Resuelto  
**Listo para:** Mejoras y publicación  
**Próximo paso:** Implementar mejoras solicitadas por Rafael  

---

## 🎯 TU MISIÓN

Rafael va a pedirte mejoras específicas para RafAgent antes de publicarlo.

**Tu trabajo:**
1. Entender qué mejoras necesita
2. Implementarlas correctamente
3. Explicar cada cambio de forma simple
4. Probar que funcione
5. Hacer deployment correcto (Vercel + Railway según corresponda)
6. Documentar si es necesario

**Recuerda:**
- Rafael es no técnico pero puede seguir instrucciones
- Siempre explicar el "por qué" de cada cambio
- Probar ANTES de confirmar
- Mantener la calidad del código
- Los logs son tu mejor amigo para debugging

---

## 📚 RECURSOS ADICIONALES

**Si necesitas más contexto:**
- Lee `SOLUCION_DEFINITIVA_TIMEZONE.md` para entender el fix de timezone
- Lee `COMO_VER_LOGS_RAILWAY.md` para guiar a Rafael en debugging
- Revisa el código en los archivos mencionados arriba

**Variables de entorno importantes:**
- `GOOGLE_CLIENT_ID` y `GOOGLE_CLIENT_SECRET` - OAuth
- `GEMINI_API_KEY` - Para análisis de IA
- `DATABASE_URL` - PostgreSQL en Neon
- `SESSION_SECRET` - Para sesiones
- `BASE_URL` - URL del backend (Railway)

---

## 🚀 ¡ADELANTE!

Rafael está listo para las mejoras. Escucha lo que necesita e impleméntalo con la misma calidad y atención al detalle que usamos para arreglar el bug de timezone.

**¡Buena suerte!** 💪

---

**P.D.:** Si Rafael pide algo que no entiendes o que parece muy complejo, pregúntale para clarificar. Él prefiere hacer las cosas bien aunque tome más tiempo.

