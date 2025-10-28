# 🚀 Cómo Probar el Pixel Tracking con ngrok

## ✅ ngrok ya está instalado

## Paso 1: Exponer tu servidor local

En una **NUEVA terminal**, corre:
```bash
ngrok http 3000
```

Verás algo como esto:
```
Session Status                online
Account                       [tu cuenta]
Forwarding                    https://abc123.ngrok.io -> http://localhost:3000
```

## Paso 2: Copiar la URL de ngrok

Copia la URL que dice `https://XXXXXX.ngrok.io` (algo como `https://abc123.ngrok.io`)

## Paso 3: Crear archivo .env

Crea un archivo llamado `.env` en la raíz del proyecto con:

```
BASE_URL=https://TU-URL-DE-NGROK.ngrok.io
```

Reemplaza `TU-URL-DE-NGROK` con la URL que copiaste (SIN la barra final `/`)

Ejemplo:
```
BASE_URL=https://abc123.ngrok.io
```

## Paso 4: Reiniciar el servidor

1. Detén el servidor actual (Ctrl+C en la terminal donde corre `npm run dev`)
2. Vuelve a iniciar: `npm run dev`

## Paso 5: Probar

1. Agrega un nuevo prospecto con el email `carlosalvrzb@gmail.com`
2. Espera a que el agente envíe el correo
3. Abre el correo en Gmail
4. ¡Debería registrarse el "opened"!

## 📋 Verificación

Para verificar que todo funciona:
1. Revisa el correo recibido
2. En el código fuente del correo busca: `<img src="https://abc123.ngrok.io/api/pixel/..."`
3. Debería decir tu URL de ngrok (NO localhost)

## ⚠️ Importante

- La URL de ngrok cambia cada vez que reinicias ngrok (a menos que tengas cuenta premium)
- Cuando cambies la URL, debes actualizar el `.env` y reiniciar el servidor
- Mantén la terminal de ngrok abierta mientras pruebes

## 🎉 Cuando esté en producción

En producción usarás tu dominio real en el `.env`:
```
BASE_URL=https://tudominio.com
```

Y el pixel tracking funcionará automáticamente para todos los usuarios.

