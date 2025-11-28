# 🚀 Cambiar Railway a rafagent-saas (3 Pasos Simples)

## ✅ Lo Que Ya Está Listo

- ✅ Código actualizado en `rafagent-saas`
- ✅ Migración de base de datos aplicada
- ✅ Todo funcionando en Vercel

## 📋 PASOS (Solo 3, muy simples)

### PASO 1: Ir a Railway Settings

1. **Abre Railway en tu navegador:**
   ```
   https://railway.app/project/12223983-ee2d-498c-b05a-f54e8c524844/service/8c3ff196-0f52-4e00-b297-ce477feea350
   ```

2. **Haz clic en la pestaña "Settings"** (arriba, junto a "Deployments", "Variables", "Metrics")

### PASO 2: Cambiar el Repositorio

1. **Busca la sección "Source"** o **"Repository"** (debería estar cerca del inicio de la página)

2. **Haz clic en el botón "Change Repository"** o en el ícono de lápiz (editar) que esté al lado

3. **Selecciona el repositorio:**
   - Busca y selecciona: **`rafaelalvarezb/rafagent-saas`**
   - (No `rafagent-engine`, sino `rafagent-saas`)

4. **Branch:** `main` (debería estar seleccionado por defecto)

5. **Root Directory:** Déjalo vacío o pon `./` (punto y barra)

6. **Haz clic en "Save"** o "Update" o el botón de guardar

### PASO 3: Esperar el Deploy

1. Railway automáticamente detectará el cambio y empezará un nuevo deploy

2. **Ve a la pestaña "Deployments"** (arriba)

3. **Deberías ver un nuevo deploy** con el commit más reciente:
   - `"chore: Force Railway redeploy for mailboxes feature"`
   - `"fix: Auto-sync user main mailbox..."`
   - `"feat: Add multiple mailboxes system..."`

4. **Espera 2-3 minutos** a que termine (verás un spinner o "Building...")

5. **Cuando termine, debería decir "Deployment successful"** (verde)

---

## ✅ Verificación

Una vez que el deploy termine:

1. **Refresca la página de Mailboxes en Sendlr.ai**
2. **Deberías ver tu mailbox `rafaelalvrzb@gmail.com` automáticamente**

---

## 🐛 Si Algo No Funciona

### No encuentro "Change Repository"
- Busca "Source" o "Repository" en Settings
- O busca "Connect Repository" o "Edit Source"

### El deploy falla
- Ve a "Deployments" → Haz clic en el deploy fallido → "Deploy Logs"
- Copia las últimas 20-30 líneas y envíamelas

### Railway sigue mostrando el commit antiguo
- Haz clic en "Redeploy" manualmente (botón en la parte superior)
- O espera 5 minutos (a veces Railway tarda en detectar cambios)

---

## 📝 Nota

Una vez que Railway esté conectado a `rafagent-saas`:
- ✅ Todos los cambios futuros se desplegarán automáticamente
- ✅ No necesitarás sincronizar entre repos
- ✅ Railway y Vercel usarán el mismo código

---

**¿Listo?** Sigue los 3 pasos y avísame cuando Railway muestre el deploy correcto! 🚀

