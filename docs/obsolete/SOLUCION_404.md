# 🚨 SOLUCIÓN RÁPIDA - Actualizar Variable de Entorno en Vercel

## El problema es que falta configurar GOOGLE_REDIRECT_URI

### Pasos para arreglar:

1. **Ve a Vercel Dashboard**
2. **Haz clic en tu proyecto "rafagent-saas"**
3. **Ve a "Settings" → "Environment Variables"**
4. **Busca si existe GOOGLE_REDIRECT_URI**
5. **Si NO existe, agrégala:**
   - Key: `GOOGLE_REDIRECT_URI`
   - Value: `https://rafagent-saas.vercel.app/auth/google/callback`
6. **Si SÍ existe, actualízala** con el valor correcto
7. **Haz clic en "Save"**
8. **Redeploy el proyecto** (Deployments → ... → Redeploy)

### Después:
- Ve a tu RafAgent: https://rafagent-saas.vercel.app
- Haz clic en "Continue with Google"
- ¡Deberías poder hacer login!

---

**La causa del 404 es que el servidor no sabe a qué URL redirigir después de la autenticación de Google.**
