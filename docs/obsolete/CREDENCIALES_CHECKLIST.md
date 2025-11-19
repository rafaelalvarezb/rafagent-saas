# ✅ Checklist de Credenciales para RafAgent

## Estado Actual

- ✅ **BASE_URL**: `https://sportular-compulsory-hee.ngrok-free.dev` (ya configurado)
- ⏳ **DATABASE_URL**: Esperando...
- ⏳ **GEMINI_API_KEY**: Pendiente
- ⏳ **GOOGLE_CLIENT_ID**: Pendiente
- ⏳ **GOOGLE_CLIENT_SECRET**: Pendiente
- ⏳ **SESSION_SECRET**: Pendiente
- ✅ **PORT**: `3000` (default)
- ✅ **NODE_ENV**: `development` (default)
- ✅ **GOOGLE_REDIRECT_URI**: `http://localhost:3000/auth/google/callback` (default)

## Formato Esperado

### DATABASE_URL
```
postgresql://usuario:password@ep-xyz-123.us-east-2.aws.neon.tech/neondb?sslmode=require
```

### GEMINI_API_KEY
```
AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

### GOOGLE_CLIENT_ID
```
123456789-abcdefghijklmnop.apps.googleusercontent.com
```

### GOOGLE_CLIENT_SECRET
```
GOCSPX-abcd1234efgh5678ijkl
```

### SESSION_SECRET
```
a8f5f167f44f4964e6c998dee827110c (cualquier string largo)
```

---

## Una vez que tengas todas las credenciales

Pegaré todo en un archivo `.env` y el RafAgent estará listo para funcionar con ngrok ✨

