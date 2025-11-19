# 🚨 PROMPT PARA NUEVO CHAT EN CURSOR - PROBLEMA CRÍTICO TIMEZONE

## 📋 CONTEXTO GENERAL

Soy una persona **sin conocimientos técnicos**, pero puedo seguir instrucciones paso a paso. Tengo una aplicación SaaS de automatización de ventas llamada **RafAgent** que está **95% funcional** y lista para lanzar, pero tiene un **problema crítico** con la programación de reuniones que necesito resolver **URGENTEMENTE** esta semana para poder publicarla.

### ¿Qué es RafAgent?

- **Aplicación completa** de ventas automatizadas
- **Stack:** React/TypeScript (frontend), Node.js/Express (backend), PostgreSQL, Google OAuth, Gmail API, Google Calendar API
- **Deployment:** Vercel (frontend) + Railway (backend)
- **Estado:** Todo funciona (autenticación, emails, seguimiento, UI) **EXCEPTO** la programación correcta de reuniones en Google Calendar

### ¿Qué funciona perfectamente?

✅ Autenticación con Google OAuth  
✅ Envío y recepción de emails vía Gmail API  
✅ Análisis de respuestas con IA (Claude)  
✅ Detección de interés del prospecto  
✅ Interfaz completa y funcional  
✅ Base de datos PostgreSQL  
✅ Gestión de prospectos y sequences  
✅ Templates de email  
✅ WebSockets para updates en tiempo real  
✅ La reunión SÍ se crea en Google Calendar  
✅ El sistema detecta cuando debe programar reunión  

### ❌ ¿Qué NO funciona?

**PROBLEMA CRÍTICO:** Las reuniones se programan en **horarios incorrectos** en Google Calendar.

**Ejemplos del problema:**
- Usuario configura horarios: 9 AM - 5 PM (zona horaria: America/Mexico_City)
- Prospecto responde: "claro, platiquemos" (sin especificar día/hora)
- **Resultado esperado:** Agenda mañana a las 9:00 AM (hora México)
- **Resultado real:** Agenda 6 días después a las 4:30 PM (Nov 5, 2025 at 4:30 PM)

**Otro ejemplo:**
- Prospecto responde: "claro, platiquemos el viernes a las 2 pm"
- **Resultado esperado:** Agenda viernes a las 2:00 PM (hora México)
- **Resultado real:** Agenda en horarios random como 3 AM, 7 AM, 8 AM

---

## 🔧 LO QUE HEMOS INTENTADO (Y FALLÓ)

### Intento #1: Arreglar función `formatDateTimeForGoogleCalendar`
- **Archivo:** `server/services/calendar.ts`
- **Qué hicimos:** Simplificamos la función de conversión de fechas
- **Resultado:** ❌ Siguió fallando

### Intento #2: Agregar parámetro `userTimezone`
- **Archivo:** `server/automation/agent.ts` línea 689
- **Qué hicimos:** Agregamos `userTimezone: config.timezone` al llamar `scheduleMeeting()`
- **Resultado:** ❌ Siguió fallando (agendó a las 3 AM)

### Intento #3: Crear `calendar-simple.ts`
- **Archivo:** Nuevo archivo `server/services/calendar-simple.ts`
- **Qué hicimos:** Reescribimos TODA la lógica con enfoque "simple" de Google Apps Script
- **Problema:** La función `createMexicoCityDate()` tenía matemática incorrecta de timezones
- **Resultado:** ❌ Siguió fallando

### Intento #4: Crear `calendar-ultra-simple.ts`
- **Archivo:** Nuevo archivo `server/services/calendar-ultra-simple.ts`
- **Qué hicimos:** Usamos formato ISO con offset explícito: `new Date('2025-10-30T09:00:00-06:00')`
- **Resultado:** ❌ SIGUE FALLANDO (agendó Nov 5 at 4:30 PM en lugar de mañana 9:00 AM)

---

## 📂 ARCHIVOS RELEVANTES

### Archivos principales del problema:

1. **`server/services/calendar-ultra-simple.ts`** (actual, el que está en uso)
   - Contiene: `getAvailableSlots()`, `findNextAvailableSlot()`, `scheduleMeeting()`
   - Es el archivo que actualmente usa el sistema

2. **`server/automation/agent.ts`** (línea 553-679)
   - Función: `scheduleProspectMeeting()` - orquesta todo el proceso
   - Llama a las funciones de calendar para agendar

3. **`server/routes.ts`** (línea 867-1009)
   - Endpoint: `/api/prospects/:id/schedule-meeting`
   - Maneja requests manuales de programación

4. **`server/services/ai.ts`**
   - Función: `classifyResponse()` - analiza respuesta del prospecto
   - Extrae `suggestedDays`, `suggestedTime`, `suggestedTimezone` de la respuesta

### Archivos de configuración:

5. **`src/pages/Configuration.tsx`**
   - UI donde usuario configura timezone, horarios de trabajo, días
   - Datos se guardan en `user_config` table

6. **`shared/schema.ts`**
   - Define schema de base de datos
   - Tablas: `users`, `user_config`, `prospects`, `sequences`

### Archivos anteriores (NO se usan más, pero existen):

- `server/services/calendar.ts` (versión original, compleja)
- `server/services/calendar-simple.ts` (primer intento de simplificar)

---

## 🎯 LO QUE NECESITO

### Requerimiento funcional SIMPLE:

**El timezone SIEMPRE debe ser Ciudad de México (America/Mexico_City, GMT-6)**

**Lógica de programación:**

1. **Sin preferencias** ("claro, platiquemos")
   → Agenda **mañana a las 9:00 AM** (hora México)
   → Si 9:00 AM está ocupado, prueba 9:30 AM
   → Si 9:30 AM está ocupado, prueba 10:00 AM
   → ...continúa cada 30 minutos hasta 5:00 PM
   → Si todo el día está ocupado, pasa al siguiente día desde 9:00 AM

2. **Con día preferido** ("podemos el viernes?")
   → Busca **viernes desde 9:00 AM**
   → Lógica de slots de 30 min (9:00, 9:30, 10:00, etc.)
   → Si viernes está lleno, pasa al siguiente día hábil desde 9:00 AM

3. **Con día y hora** ("podemos el viernes a las 2 pm?")
   → Busca **viernes a las 2:00 PM**
   → Si 2:00 PM ocupado, prueba 2:30 PM
   → Si 2:30 PM ocupado, prueba 3:00 PM
   → ...continúa hasta 5:00 PM
   → Si viernes está lleno después de 2 PM, pasa al siguiente día desde 9:00 AM

**Restricciones:**
- ✅ Solo lunes a viernes (por ahora, hardcoded)
- ✅ Solo 9:00 AM - 5:00 PM (por ahora, hardcoded)
- ✅ Slots de 30 minutos exactos (9:00, 9:30, 10:00... NO 9:52 AM)
- ✅ Mínimo 24 horas de anticipación
- ✅ Verificar que no haya conflictos con eventos existentes en Google Calendar

---

## 🐛 SÍNTOMAS DEL BUG

### Lo que veo en Google Calendar:
- Reunión agendada: **Nov 5, 2025 at 4:30 PM**
- Debería ser: **Oct 30, 2025 at 9:00 AM** (o primer slot disponible mañana)

### Lo que NO puedo ver (porque no sé acceder a los logs):
- ¿Qué slots encontró `getAvailableSlots()`?
- ¿Qué slot seleccionó `findNextAvailableSlot()`?
- ¿Qué fecha/hora se pasó a Google Calendar API?
- ¿Hay errores de conversión de timezone?

### Hipótesis de qué puede estar mal:
1. **`getAvailableSlots()` está generando slots incorrectos** (no en timezone México)
2. **`findNextAvailableSlot()` está seleccionando el slot equivocado**
3. **`scheduleMeeting()` está enviando la fecha incorrecta a Google Calendar API**
4. **Hay un problema con cómo se interpreta el offset GMT-6**
5. **El servidor (Railway) está en timezone diferente y eso afecta**

---

## 📊 ESTRUCTURA DE DATOS

### Tabla `user_config`:
```typescript
{
  id: number
  userId: number
  timezone: string              // "America/Mexico_City"
  searchStartTime: string       // "09:00"
  searchEndTime: string         // "17:00"
  workingDays: string          // "monday,tuesday,wednesday,thursday,friday"
  meetingTitle: string
  meetingDescription: string
  // ... otros campos
}
```

### Tabla `prospects`:
```typescript
{
  id: number
  userId: number
  contactEmail: string
  contactName: string
  status: string                    // "✅ Interested - Schedule!"
  suggestedDays: string | null     // "friday" o null
  suggestedTime: string | null     // "14:00" o null
  suggestedTimezone: string | null // "America/Mexico_City" o null
  meetingTime: Date | null         // fecha agendada
  // ... otros campos
}
```

---

## 🔍 LO QUE NECESITO QUE HAGAS

### Paso 1: Diagnóstico completo
1. **Revisa TODO el flujo** desde que el prospecto responde hasta que se crea el evento en Google Calendar
2. **Identifica EXACTAMENTE dónde se rompe** la conversión de timezone
3. **Explícame en términos simples** qué está pasando

### Paso 2: Solución definitiva
1. **Implementa una solución que FUNCIONE** (probablemente necesitas reescribir `calendar-ultra-simple.ts`)
2. **Usa la librería o método más confiable** (si `date-fns-tz`, `luxon`, o métodos nativos de JS son mejores, úsalos)
3. **Agrega LOGS CLAROS** para que yo pueda ver qué está pasando en Railway

### Paso 3: Guía paso a paso
1. **Dame instrucciones CLARAS** de qué archivos modificar
2. **Usa el formato de edición** que entiende Cursor
3. **Explícame cómo verificar** que funciona
4. **Dime cómo ver los logs** en Railway para debuggear

---

## 💡 CÓDIGO DE REFERENCIA QUE FUNCIONA

Tengo un **MVP en Google Apps Script que funciona perfectamente** con este código:

```javascript
// appsscript.json
{
  "timeZone": "America/Mexico_City",
  // ...
}

// Code.gs
function scheduleMeeting(prospectEmail, meetingTime) {
  const calendar = CalendarApp.getDefaultCalendar();
  
  // Crear fecha local directamente
  const startTime = new Date(2025, 9, 30, 9, 0, 0); // Oct 30, 2025, 9:00 AM
  const endTime = new Date(startTime.getTime() + 30 * 60000);
  
  const event = calendar.createEvent(
    'Reunión con ' + prospectEmail,
    startTime,
    endTime,
    {
      description: 'Reunión de ventas',
      guests: prospectEmail,
      sendInvites: true
    }
  );
  
  return event.getHtmlLink();
}
```

**Esto funciona porque:**
- Google Apps Script usa `timeZone` del proyecto automáticamente
- `new Date(2025, 9, 30, 9, 0, 0)` crea fecha en timezone del proyecto
- No hay conversiones manuales

---

## 🎯 OBJETIVO FINAL

Quiero **publicar RafAgent esta semana** para que vendedores puedan:
1. Visitar la URL: https://rafagent-saas.vercel.app
2. Hacer login con Google
3. Configurar sus horarios
4. Empezar a usar el agente inmediatamente
5. **Las reuniones SE AGENDEN EN LOS HORARIOS CORRECTOS** ⭐️

Una vez funcione, recopilaré feedback de usuarios reales para seguir mejorando.

---

## 🆘 PUNTOS IMPORTANTES

1. **Soy no técnico** - necesito instrucciones paso a paso muy claras
2. **Tengo acceso a:**
   - Cursor IDE (donde edito código)
   - Railway dashboard (donde está el backend)
   - Vercel dashboard (donde está el frontend)
   - Google Cloud Console (para OAuth y APIs)
3. **Puedo seguir instrucciones** para:
   - Editar archivos
   - Ejecutar comandos en terminal
   - Ver logs en Railway
   - Hacer deploy
4. **NO puedo:**
   - Escribir código complejo desde cero
   - Debuggear problemas sin guía
   - Entender conceptos avanzados sin explicación

---

## 📝 ARCHIVOS DE DOCUMENTACIÓN CREADOS

Durante este debugging, se crearon estos archivos (pueden ser útiles):

- `SOLUCION_SIMPLE_TIMEZONE.md` - Primer intento de solución
- `EXPLICACION_PROBLEMA_Y_SOLUCION.md` - Explicación del problema de matemática de timezone
- `test-timezone-fix-final.html` - Archivo de prueba HTML
- `test-timezone-fix-ACTUAL.html` - Otro archivo de prueba

---

## ✅ CRITERIOS DE ÉXITO

La solución será exitosa cuando:

1. ✅ Prospecto responde "claro, platiquemos"
   → Reunión se agenda **mañana a las 9:00 AM hora México** (o primer slot disponible)

2. ✅ Prospecto responde "claro, podemos el viernes?"
   → Reunión se agenda **viernes a las 9:00 AM hora México** (o primer slot disponible ese día)

3. ✅ Prospecto responde "claro, podemos el viernes a las 2 pm?"
   → Reunión se agenda **viernes a las 2:00 PM hora México** (o primer slot disponible después de esa hora)

4. ✅ Los horarios en Google Calendar coinciden **EXACTAMENTE** con los esperados
5. ✅ NO se agenden reuniones en horarios raros (3 AM, 8 AM, 4:30 PM cuando debería ser 9 AM)
6. ✅ Los logs muestran claramente qué está pasando en cada paso

---

## 🙏 SOLICITUD FINAL

Por favor:

1. **Revisa TODO el código relacionado** con scheduling (no asumas que algo está correcto)
2. **Explícame qué está mal** en términos que pueda entender
3. **Dame una solución que FUNCIONE** (si necesitas instalar una librería, dime cómo)
4. **Guíame paso a paso** para implementarla
5. **Ayúdame a verificar** que funciona antes de dar por terminado

**Nota importante:** He intentado resolver esto múltiples veces y sigue fallando. Necesito que seas MUY cuidadoso y minucioso, revisando cada línea de código relacionada con fechas y timezones.

Estoy dispuesto a hacer lo que sea necesario (instalar librerías, reescribir archivos completos, agregar logs, etc.) para que esto funcione.

¡Gracias por tu ayuda! 🙏

