# Guía de Pixel Tracking - RafAgent

## ¿Cómo Funciona el Pixel Tracking?

El RafAgent utiliza **pixel tracking** para detectar cuando un prospecto abre un correo electrónico. Esta es una técnica estándar utilizada por la mayoría de las plataformas de email marketing (Mailchimp, HubSpot, etc.).

### Tecnología

El sistema inserta una imagen invisible de 1x1 píxel al final de cada email. Cuando el prospecto abre el correo con imágenes habilitadas, su cliente de email descarga automáticamente esta imagen desde nuestro servidor, y registramos ese evento.

```html
<img src="https://tu-dominio.com/api/pixel/[prospectId]" width="1" height="1" style="display:none;" />
```

## Configuración Requerida

### 1. Variable de Entorno `BASE_URL`

**CRÍTICO**: Para que el pixel tracking funcione, debes configurar la variable de entorno `BASE_URL` con la URL pública de tu aplicación.

#### En Desarrollo Local:
```bash
BASE_URL=http://localhost:3000
```

#### En Producción:
```bash
BASE_URL=https://tu-dominio.com
```

O si usas Replit, Railway, Vercel, etc.:
```bash
BASE_URL=https://tu-app.replit.app
# o
BASE_URL=https://tu-app.railway.app
# o
BASE_URL=https://tu-dominio.vercel.app
```

### 2. ¿Dónde Configurar BASE_URL?

#### Replit:
1. Ve a "Secrets" (icono de candado en el sidebar izquierdo)
2. Agrega una nueva secret:
   - Key: `BASE_URL`
   - Value: `https://tu-app.replit.app` (reemplaza con tu URL real)

#### Railway:
1. Ve a tu proyecto → Settings → Variables
2. Agrega nueva variable:
   - Key: `BASE_URL`
   - Value: `https://tu-app.railway.app`

#### Vercel:
1. Ve a Project Settings → Environment Variables
2. Agrega nueva variable:
   - Key: `BASE_URL`
   - Value: `https://tu-dominio.vercel.app`

#### Local (.env file):
```bash
# .env
BASE_URL=http://localhost:3000
```

## ¿Por Qué NO Funciona el Pixel Tracking en Gmail?

Hay varias razones por las que el pixel tracking puede no funcionar:

### 1. **Imágenes Deshabilitadas**
Gmail y otros clientes de email permiten deshabilitar la descarga automática de imágenes. Si el prospecto tiene esta opción activada, el pixel nunca se descargará.

**Solución**: No hay solución técnica para esto. Es una limitación inherente del pixel tracking. Sin embargo, la mayoría de los usuarios tienen imágenes habilitadas por defecto.

### 2. **Gmail Proxy/Caché**
Gmail usa servidores proxy para descargar imágenes. Esto significa que:
- Gmail descarga la imagen UNA VEZ y la cachea
- Si el prospecto abre el email múltiples veces, Gmail puede mostrar la imagen cacheada sin volver a descargarla
- Por lo tanto, solo detectaremos la PRIMERA apertura

**Esto es NORMAL** y todas las plataformas de email marketing tienen esta misma limitación con Gmail.

### 3. **BASE_URL No Configurada**
Si `BASE_URL` no está configurada o está mal configurada, el pixel tendrá una URL inválida y no funcionará.

**Verifica**:
```javascript
// En server/services/gmail.ts línea 73:
const pixelTracking = prospectId 
  ? `<img src="${process.env.BASE_URL || 'http://localhost:3000'}/api/pixel/${prospectId}" width="1" height="1" style="display:none;" />`
  : '';
```

### 4. **Bloqueadores de Contenido**
Algunos clientes de email (Apple Mail con Mail Privacy Protection, Outlook con protecciones avanzadas) precargan las imágenes en sus servidores antes de que el usuario abra el email. Esto puede causar:
- Falsos positivos (se registra como "abierto" antes de que el usuario lo vea)
- Múltiples registros de apertura

## Cómo Verificar que Funciona

### 1. Revisa los Logs del Servidor
Cuando alguien abre un email, deberías ver en la consola:
```
Email opened by prospect: carlos@example.com
```

### 2. Revisa la Base de Datos
Verifica que el campo `emailOpened` se actualice a `true` y `emailOpenedAt` tenga una fecha:

```sql
SELECT contact_email, email_opened, email_opened_at 
FROM prospects 
WHERE email_opened = true;
```

### 3. Prueba Manual
1. Envía un email a ti mismo usando RafAgent
2. Abre el email en Gmail con imágenes habilitadas
3. Verifica que el Dashboard muestre "Total Opened: 1"
4. Expande la fila del prospecto en la sección Prospects
5. Deberías ver "Email Opened" con la fecha y hora

## Limitaciones del Pixel Tracking

Es importante entender que el pixel tracking tiene limitaciones inherentes:

### ❌ No Funciona Si:
- El cliente de email bloquea imágenes externas
- El usuario usa un bloqueador de contenido
- El email es leído en un preview pane sin cargar imágenes
- Gmail cachea la imagen y el usuario abre el email múltiples veces

### ✅ Funciona Si:
- El cliente de email tiene imágenes habilitadas por defecto
- BASE_URL está correctamente configurada
- El prospecto abre el email con una conexión a internet

## Alternativas y Mejoras Futuras

Si necesitas tracking más preciso, considera:

1. **Link Tracking**: Agregar parámetros UTM a los links en los emails
2. **Gmail Read Receipts API**: Requiere que el prospecto tenga Gmail y habilite read receipts
3. **Engagement Tracking**: Rastrear clics en links específicos del email

## Debugging

Si el pixel tracking no funciona:

1. **Verifica BASE_URL**:
   ```bash
   echo $BASE_URL
   # Debería mostrar tu URL pública
   ```

2. **Verifica que el endpoint funcione**:
   ```bash
   curl https://tu-dominio.com/api/pixel/test-id
   # Debería devolver una imagen GIF de 1x1 píxel
   ```

3. **Inspecciona el HTML del email enviado**:
   - Abre el email en Gmail
   - Click derecho → "Show Original"
   - Busca la etiqueta `<img src=` con `/api/pixel/`
   - Verifica que la URL sea correcta

4. **Revisa los logs del servidor**:
   ```bash
   # Deberías ver logs como:
   GET /api/pixel/[prospectId] 200
   Email opened by prospect: carlos@example.com
   ```

## Resumen

El pixel tracking es una solución estándar de la industria que funciona en la mayoría de los casos, pero no es 100% confiable debido a limitaciones técnicas y de privacidad de los clientes de email modernos.

**Para que funcione en RafAgent**:
1. ✅ Configura `BASE_URL` con tu URL pública
2. ✅ El prospecto debe tener imágenes habilitadas en su cliente de email
3. ✅ El endpoint `/api/pixel/:prospectId` ya está implementado
4. ✅ La imagen invisible se inserta automáticamente en todos los emails

**Recuerda**: Incluso las plataformas empresariales más caras (HubSpot, Salesforce) tienen estas mismas limitaciones con el pixel tracking. Es la mejor solución disponible sin requerir acceso especial a las APIs de Gmail.

