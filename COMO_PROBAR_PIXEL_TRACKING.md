# Cómo Probar el Pixel Tracking en Localhost

## 📧 Tu Situación

- **Tu correo RafAgent**: `rafaelalvrzb@gmail.com`
- **Correo de prueba**: `carlosalvrzb@gmail.com` (tienes acceso)
- **Entorno**: localhost (antes de producción)

## ✅ Cómo Hacer la Prueba

### Paso 1: Configurar el Prospecto

1. Ve a http://localhost:3000/prospects
2. Haz click en "Add Prospect"
3. Llena los datos:
   - **Name**: Carlos
   - **Email**: `carlosalvrzb@gmail.com`
   - **Company**: (lo que quieras)
   - **Active Sequence**: ✅ Activado
4. Click en "Add Prospect"

### Paso 2: Enviar el Email

**Opción A - Automático**:
1. Espera a que el agente se ejecute automáticamente (configurado para 1 minuto)
2. El agente enviará el email automáticamente

**Opción B - Manual**:
1. Click en "Execute AI Agent Now"
2. El agente enviará el email inmediatamente

### Paso 3: Abrir el Email y Verificar Pixel Tracking

1. **Abre Gmail** en el MISMO navegador donde tienes localhost
2. Ve a la cuenta `carlosalvrzb@gmail.com`
3. **IMPORTANTE**: Asegúrate de que las imágenes estén habilitadas:
   - En Gmail web: Debería estar habilitado por defecto
   - Si no: Settings → General → Images → "Always display external images"
4. **Abre el email** que te envió RafAgent

### Paso 4: Verificar que se Registró

**En el Dashboard**:
1. Ve a http://localhost:3000/
2. Espera 30 segundos (el dashboard se actualiza automáticamente)
3. Verifica que "Total Opened" cambie de 0 a 1

**En Prospects**:
1. Ve a http://localhost:3000/prospects
2. Haz click en la fila de Carlos (se expandirá)
3. Verifica que en la sección "Email Opened" aparezca:
   - ✅ Opened
   - Fecha y hora exacta

**En la Consola del Servidor**:
1. Ve a la terminal donde corre el servidor
2. Busca el mensaje:
   ```
   Email opened by prospect: carlosalvrzb@gmail.com
   ```

## 🔍 ¿Por Qué Funciona en Localhost?

El código tiene un fallback automático:

```javascript
const pixelTracking = prospectId 
  ? `<img src="${process.env.BASE_URL || 'http://localhost:3000'}/api/pixel/${prospectId}" ...`
  : '';
```

Cuando `BASE_URL` no está configurado, usa `http://localhost:3000` automáticamente.

### ¿Cuándo se Detecta la Apertura?

1. Gmail descarga el pixel desde `http://localhost:3000/api/pixel/[prospectId]`
2. El endpoint `/api/pixel/:prospectId` en el servidor registra:
   - `emailOpened = true`
   - `emailOpenedAt = fecha/hora actual`
3. El Dashboard se actualiza automáticamente

## ⚠️ Limitación Importante en Localhost

**El pixel tracking SOLO funcionará si**:
- Abres el email en el MISMO navegador donde tienes localhost corriendo
- Por ejemplo: Chrome con localhost:3000 abierto

**NO funcionará si**:
- Abres el email en otro dispositivo (teléfono, otra computadora)
- Abres el email en otro navegador que no tenga acceso a localhost:3000

Esto es porque `http://localhost:3000` solo existe en TU computadora local.

## 📱 Para Producción (Después)

Cuando despliegues a producción:

1. El pixel será: `https://rafagent.com/api/pixel/[prospectId]`
2. Funcionará en CUALQUIER dispositivo/navegador
3. Cualquier persona que abra el email será rastreada

---

## 🧪 Prueba Completa Paso a Paso

### 1. Enviar Email
```
1. Add Prospect: carlosalvrzb@gmail.com ✅
2. Activate sequence ✅
3. Execute AI Agent Now
4. Verifica en logs: "Email sent to carlosalvrzb@gmail.com"
```

### 2. Abrir Email (mismo navegador)
```
1. Gmail web en Chrome (donde tienes localhost)
2. Login como carlosalvrzb@gmail.com
3. Abrir el email de RafAgent
4. Imágenes deben estar habilitadas
```

### 3. Verificar Tracking
```
✅ Dashboard → Total Opened: 1
✅ Prospects → Click en Carlos → Email Opened ✅
✅ Consola del servidor → "Email opened by prospect: carlosalvrzb@gmail.com"
```

### 4. Responder Email
```
1. Responder al email con interés
2. Execute AI Agent Now
3. Verifica en Prospects:
   - Status cambia a "Interested"
   - Sección "Replied" muestra ✅
```

### 5. Verificar Meeting
```
1. Si respondiste con interés + horario
2. El agente agendará automáticamente
3. Verifica:
   - Dashboard → Meetings Scheduled: 1
   - Prospects → Carlos → Meeting Scheduled ✅
   - Google Calendar → Meeting creado
```

## 🎯 Resumen

| Métrica | Cómo Verificar | Dónde Ver |
|---------|----------------|-----------|
| **Email Sent** | Logs del servidor | Dashboard: Total Sent |
| **Email Opened** | Abrir en mismo navegador | Dashboard: Total Opened, Prospects (expandir) |
| **Replied** | Responder al email | Dashboard: Total Replied, Prospects (expandir) |
| **Meeting** | Responder con interés | Dashboard: Meetings Scheduled, Prospects (expandir) |

## 💡 Tips

1. **Usa el mismo navegador** para localhost y Gmail
2. **Verifica imágenes habilitadas** en Gmail
3. **Espera 30 segundos** para que el dashboard se actualice
4. **Revisa los logs** del servidor para debugging
5. **Usa "Execute AI Agent Now"** para pruebas rápidas

---

## ❓ Troubleshooting

### "Total Opened" no se actualiza

**Verifica**:
1. ¿Abriste el email en el mismo navegador?
2. ¿Imágenes están habilitadas en Gmail?
3. ¿Viste el mensaje en la consola?

**Solución**:
- Refresca Gmail
- Cierra y abre el email de nuevo
- Verifica logs: `http://localhost:3000` debe estar corriendo

### "Total Replied" no se actualiza

**Verifica**:
1. ¿Esperaste a que el agente se ejecute?
2. ¿Respondiste al email (no solo lo abriste)?

**Solución**:
- Click en "Execute AI Agent Now"
- Verifica que el prospecto tenga un threadId

### El email no llega

**Verifica**:
1. ¿Estás autenticado con Google?
2. ¿El prospecto tiene sequence activado?
3. ¿Estás dentro de working hours?

**Solución**:
- Ve a Configuration → Working Hours → Enable all days
- Configuration → Agent Frequency → 1 minute
- Execute AI Agent Now

---

**¡Listo!** Ahora puedes probar completamente el pixel tracking en localhost antes de ir a producción.

