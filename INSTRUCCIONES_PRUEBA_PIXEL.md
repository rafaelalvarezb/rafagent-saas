# 🧪 Cómo Probar el Pixel Tracking con ngrok

## ✅ Todo está configurado

- ✅ ngrok está corriendo: `https://sportular-compulsory-hee.ngrok-free.dev`
- ✅ Archivo `.env` creado con `BASE_URL`
- ✅ Servidor reiniciado

## 🧪 Pasos para probar

### 1. Ve al Dashboard
Abre: http://localhost:3000

### 2. Elimina los prospectos anteriores
Ve a la sección "Prospects" y elimina a Carlos y Max (los que ya habías agregado antes)

**¿Por qué?** Porque esos correos se enviaron con `localhost` en el pixel, no con la URL de ngrok.

### 3. Agrega a Carlos de nuevo
- Email: `carlosalvrzb@gmail.com`
- Nombre: Carlos
- Company: Test Co
- Selecciona una secuencia

### 4. Espera a que el agente envíe el correo
El agente revisa cada minuto aproximadamente. Verás en los logs del terminal cuando envíe el correo.

### 5. Abre el correo en Gmail
Desde otra pestaña de Chrome, ve a https://gmail.com e inicia sesión con `carlosalvrzb@gmail.com`

### 6. Revisa el código fuente del correo
- Abre el correo que recibiste
- Click en los 3 puntos → "Mostrar original"
- Busca `<img src=`
- **Deberías ver**: `https://sportular-compulsory-hee.ngrok-free.dev/api/pixel/...`
- **NO debería decir**: `localhost:3000`

### 7. Abre el correo normalmente
Cierra el código fuente y simplemente abre/lee el correo en Gmail.

### 8. Verifica el Dashboard
Ve al Dashboard de RafAgent y verifica:
- ✅ "Total Opened" debería aumentar a 1
- ✅ En la sección "Prospects", expande a Carlos
- ✅ Debería mostrar "Email Opened" con fecha y hora

## 🔍 Debugging

### Si no funciona:
1. **Verifica que el pixel tenga la URL de ngrok** (no localhost)
2. **Revisa los logs del servidor** en la terminal donde corre `npm run dev`
3. **Revisa los logs de ngrok** en la terminal donde corre `ngrok http 3000`
4. **Espera 30 segundos** después de abrir el correo (el dashboard se actualiza cada 30 segundos)

### Ver logs de ngrok:
En la terminal de ngrok verás las peticiones:
```
POST /api/pixel/abc123... 200 OK
```

### Ver logs del servidor:
En la terminal del servidor verás:
```
GET /api/pixel/abc123... 200
📧 Email opened by prospect: abc123...
```

## 🎯 Resultado esperado

Después de abrir el correo en Gmail deberías ver:
- ✅ Dashboard: "Total Opened" = 1
- ✅ Prospects: Carlos muestra "Opened" con timestamp
- ✅ Logs de ngrok: petición al pixel
- ✅ Logs del servidor: "Email opened"

## ⚠️ Importante

**Mantén la terminal de ngrok abierta** mientras haces las pruebas. Si la cierras, el pixel dejará de funcionar.

## 🚀 Para producción

Cuando despliegues a producción (ej: Vercel, Railway, Render), solo necesitarás cambiar el `.env` a tu dominio real:

```
BASE_URL=https://rafagent.com
```

Y el pixel tracking funcionará automáticamente para todos los usuarios ✨

