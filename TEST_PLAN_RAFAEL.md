# 🧪 PLAN DE PRUEBAS - Rafael Alvarez

## 📅 Fecha/Hora de Prueba
- **Hoy:** 30 de octubre, 2025
- **Hora actual:** 10:36 AM
- **Timezone:** Central Time (Mexico) GMT-6

## ⚙️ Tu Configuración
- ✅ Working Hours: 9:00 AM - 5:00 PM
- ✅ Working Days: Lunes a Viernes
- ✅ Timezone: Central Time (Mexico)

---

## 🎯 CASOS A PROBAR

### CASO 1: Sin preferencias (respuesta simple)
**Prospecto responde:**
```
"Claro, platiquemos"
```
o
```
"Me interesa, cuando podemos hablar?"
```

**Resultado ESPERADO:**
- 📅 Fecha: **Mañana, 31 de octubre de 2025**
- 🕐 Hora: **11:00 AM** (Ciudad de México)
- ❓ Por qué 11 AM: Porque ahora son 10:36 AM + 24 horas mínimo = mañana después de las 10:36 AM. El sistema buscará el primer slot después de eso, que debería ser 11:00 AM.

---

### CASO 2: Con día preferido (sin hora)
**Prospecto responde:**
```
"Podemos el lunes?"
```
o
```
"Mejor el lunes por favor"
```

**Resultado ESPERADO:**
- 📅 Fecha: **Lunes, 3 de noviembre de 2025**
- 🕐 Hora: **9:00 AM** (Ciudad de México)
- ❓ Por qué 9 AM: Es el primer slot del día según tu configuración (Working Hours empiezan a las 9 AM).

---

### CASO 3: Con día Y hora preferida
**Prospecto responde:**
```
"Podemos el lunes a la 1 pm?"
```
o
```
"El lunes a las 13:00 me viene bien"
```

**Resultado ESPERADO:**
- 📅 Fecha: **Lunes, 3 de noviembre de 2025**
- 🕐 Hora: **1:00 PM** (13:00) (Ciudad de México)
- ❓ Por qué 1 PM: Porque el prospecto lo pidió específicamente.

---

## 📝 CÓMO PROBAR

### Opción A: Agregar Prospecto Manual (MÁS FÁCIL)

1. **Abre tu app:** https://rafagent-saas.vercel.app
2. **Ve a "Prospects"**
3. **Agrega 3 prospectos de prueba:**
   - Caso 1: "Test Sin Preferencias" - tu_email+test1@gmail.com
   - Caso 2: "Test Lunes" - tu_email+test2@gmail.com
   - Caso 3: "Test Lunes 1PM" - tu_email+test3@gmail.com

4. **Para cada uno:**
   - Cambia su status a "✅ Interested - Schedule!"
   - O envíales un email y responde desde tu email con las frases de arriba

### Opción B: Con Email Real (MÁS REALISTA)

1. Envía emails a prospectos reales (o a ti mismo)
2. Responde desde esos emails con las frases de cada caso
3. Espera 2 minutos (el agente corre cada 2 minutos)
4. Observa los logs

---

## 📋 QUÉ COMPARTIR CONMIGO

Para CADA caso de prueba, necesito que me compartas:

### 1️⃣ Screenshot de Google Calendar
Toma screenshot mostrando:
- La reunión creada
- La fecha y hora
- El título de la reunión

### 2️⃣ Logs de Railway
Ve a Railway → Tu servicio → Logs

Busca el bloque que empieza con:
```
🚀 === STARTING MEETING SCHEDULING PROCESS ===
```

Y copia TODO desde ahí hasta:
```
✅ === MEETING SCHEDULING COMPLETED ===
```

**IMPORTANTE:** Necesito ver esta línea específicamente:
```
📅 Start (Local): 2025-10-31T11:00:00
```

### 3️⃣ Info del prospecto
- ¿Qué respondió el prospecto? (la frase exacta)
- ¿A qué hora se programó según Google Calendar?
- ¿Coincide con lo esperado?

---

## ✅ CRITERIOS DE ÉXITO

### CASO 1 - ÉXITO si:
- ✅ Reunión aparece en Google Calendar
- ✅ Fecha: Mañana (Oct 31)
- ✅ Hora: 11:00 AM (Ciudad de México)
- ✅ Logs muestran: "Start (Local): 2025-10-31T11:00:00"

### CASO 2 - ÉXITO si:
- ✅ Reunión aparece en Google Calendar
- ✅ Fecha: Lunes (Nov 3)
- ✅ Hora: 9:00 AM (Ciudad de México)
- ✅ Logs muestran: "Start (Local): 2025-11-03T09:00:00"

### CASO 3 - ÉXITO si:
- ✅ Reunión aparece en Google Calendar
- ✅ Fecha: Lunes (Nov 3)
- ✅ Hora: 1:00 PM (Ciudad de México)
- ✅ Logs muestran: "Start (Local): 2025-11-03T13:00:00"

---

## ❌ SI ALGO FALLA

Si CUALQUIER caso no funciona como esperado:

1. **NO entres en pánico** - lo arreglaremos
2. **Copia los logs** del caso que falló
3. **Toma screenshot** de Google Calendar
4. **Dime exactamente:**
   - Qué esperabas
   - Qué obtuviste
   - La respuesta del prospecto (texto exacto)

---

## 🕐 TIMING

- Después de hacer push: **Espera 2-3 minutos** para que Railway termine el deploy
- Después de que el prospecto responda: **Espera hasta 2 minutos** para que el agente lo procese
- Total por prueba: **~5 minutos**

---

## 💡 TIPS

1. **Usa tu propio email** con el truco de +
   - rafaelalvrzb+test1@gmail.com
   - rafaelalvrzb+test2@gmail.com
   - rafaelalvrzb+test3@gmail.com
   - Todos llegarán a tu inbox pero el sistema los verá como emails diferentes

2. **Mantén Railway logs abiertos** en una pestaña mientras pruebas

3. **Prueba los casos en orden** (1, 2, 3) - no todos a la vez

4. **Si un caso funciona, celebra** 🎉 y pasa al siguiente

---

## 📞 ESTOY PENDIENTE

Cuando empieces a probar, comparte conmigo:
- "Empezando CASO 1" (para que esté atento)
- Resultados inmediatamente después
- Dudas en cualquier momento

¡Vamos a hacer que esto funcione! 💪

