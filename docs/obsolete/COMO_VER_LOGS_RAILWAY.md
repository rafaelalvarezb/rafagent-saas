# 📋 Cómo Ver Logs en Railway

Esta guía te muestra cómo ver los logs de tu aplicación en Railway para verificar que las reuniones se están programando correctamente.

## 🚀 Pasos para Ver Logs

### 1. Acceder a Railway Dashboard

1. Ve a https://railway.app
2. Haz login con tu cuenta
3. Selecciona tu proyecto "RafAgent" (o como lo hayas nombrado)

### 2. Ver Logs en Tiempo Real

1. En el dashboard, verás una lista de servicios (usualmente uno llamado "backend" o "server")
2. Haz clic en tu servicio
3. En la parte superior, verás varias pestañas:
   - **Deployments** - Lista de deployments
   - **Metrics** - Métricas de uso
   - **Variables** - Variables de entorno
   - **Settings** - Configuración
   - **Logs** ⭐️ - **HAZ CLIC AQUÍ**

### 3. Leer los Logs

Los logs se muestran en tiempo real. Cuando se programe una reunión, verás mensajes como:

```
🚀 === STARTING MEETING SCHEDULING PROCESS ===
👤 User: Tu Nombre (tu@email.com)
👥 Prospect: Nombre Prospecto (prospecto@email.com)

⚙️ Configuration:
   🌍 Timezone: America/Mexico_City
   🕐 Working hours: 9:00 - 17:00
   📅 Working days: monday, tuesday, wednesday, thursday, friday

📅 Search window: 2025-10-31T00:00:00.000Z to 2025-11-30T00:00:00.000Z

🔍 === GETTING AVAILABLE SLOTS ===
📅 Period: 2025-10-31T00:00:00.000Z to 2025-11-30T00:00:00.000Z
🕐 Hours: 9:00 - 17:00
🌍 Timezone: America/Mexico_City
📊 Found 0 busy events
⏰ Minimum time (24h from now): 2025-10-31T00:00:00.000Z
⏰ In America/Mexico_City: 30/10/2025, 18:00:00

📅 Checking jueves, 31 de octubre de 2025
   ✅ 9:00 available
   ✅ 9:30 available
   ✅ 10:00 available
   ...

🔍 === FINDING BEST SLOT ===
📊 Total slots: 120
📅 Preferred days: none
🕐 Preferred time: none
✅ No preferences - using first slot:
   jueves, 31 de octubre de 2025, 09:00

🗓️ === SCHEDULING MEETING ===
📧 Attendee: prospecto@email.com
🌍 Timezone: America/Mexico_City
📅 Start (UTC): 2025-10-31T15:00:00.000Z
📅 End (UTC): 2025-10-31T15:30:00.000Z
📅 Start (Local): 2025-10-31T09:00:00
📅 End (Local): 2025-10-31T09:30:00

✅ Meeting created successfully!
🔗 Calendar link: https://calendar.google.com/...
🔗 Meet link: https://meet.google.com/...

✅ === MEETING SCHEDULING COMPLETED ===
```

### 4. Qué Buscar en los Logs

#### ✅ Señales de que funciona correctamente:

- **"Start (Local):"** muestra la hora que esperas (ej: 09:00:00)
- **"Timezone:"** muestra "America/Mexico_City"
- **"Meeting created successfully!"** aparece al final
- No hay mensajes de error ❌

#### ❌ Señales de problemas:

- Mensajes que empiezan con `❌`
- "Error scheduling meeting"
- "No available slots found"
- La hora en "Start (Local)" no coincide con lo esperado

### 5. Filtrar Logs

Railway te permite buscar en los logs:

1. En la parte superior de la ventana de logs, hay una barra de búsqueda
2. Puedes buscar por:
   - `SCHEDULING MEETING` - Para ver solo logs de programación
   - `❌` - Para ver solo errores
   - El email del prospecto - Para ver logs específicos de un prospecto
   - `Meeting created` - Para ver reuniones exitosas

### 6. Copiar Logs

Si necesitas compartir los logs:

1. Selecciona el texto de los logs que quieres copiar
2. Clic derecho → Copiar
3. Pégalo en un archivo de texto o en un mensaje

## 🔍 Ejemplo: Verificar una Reunión Específica

Digamos que acabas de probar programar una reunión y quieres verificar qué pasó:

1. Ve a los logs en Railway
2. Busca `STARTING MEETING SCHEDULING PROCESS` (el más reciente)
3. Lee desde ahí hasta `MEETING SCHEDULING COMPLETED` o hasta el error
4. Verifica estos puntos clave:
   - ✅ **Timezone correcto**: "America/Mexico_City"
   - ✅ **Hora local correcta**: "Start (Local): 2025-10-31T09:00:00" (debe ser 9 AM si no hay preferencias)
   - ✅ **Reunión creada**: "Meeting created successfully!"

## 📝 Logs que Puedes Ignorar

Railway muestra muchos logs. Puedes ignorar:

- Logs de sistema de Railway (grises, sin emojis)
- Health checks
- Requests HTTP normales (GET /api/...)

**Enfócate en los que tienen emojis** 🎯 - esos son de tu aplicación.

## 🆘 Si Algo Sale Mal

Si ves un error en los logs:

1. **Copia el mensaje completo del error** (desde 🚀 hasta ❌)
2. **Copia también el "Stack trace"** si aparece
3. **Búscame** y comparte los logs para que pueda ayudarte

## 💡 Tip Pro

Deja la ventana de logs abierta en una pestaña separada mientras pruebas la aplicación. Así puedes ver en tiempo real qué está pasando cada vez que se programa una reunión.

---

¿Necesitas ayuda? Los logs son tu mejor amigo para debugging. Si algo no se ve bien en los logs, es más fácil de arreglar que si solo ves el resultado final en Google Calendar.

