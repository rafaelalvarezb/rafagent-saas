# 🚀 Instrucciones Simples: Cambiar Railway a rafagent-saas

## ⚠️ Lo Que Necesitas Hacer (Solo 1 cosa)

**No puedo acceder a Railway desde aquí**, así que necesitas hacer este cambio manualmente. Es muy simple, solo 3 pasos:

---

## 📋 PASOS (2 minutos)

### 1️⃣ Abre Railway
Ve a: https://railway.app/project/12223983-ee2d-498c-b05a-f54e8c524844/service/8c3ff196-0f52-4e00-b297-ce477feea350

### 2️⃣ Ve a Settings
- Haz clic en la pestaña **"Settings"** (arriba, junto a Deployments, Variables, Metrics)

### 3️⃣ Cambia el Repositorio
- Busca la sección **"Source"** o **"Repository"**
- Haz clic en **"Change Repository"** o el botón de editar (lápiz)
- Selecciona: **`rafaelalvarezb/rafagent-saas`** (NO rafagent-engine)
- Branch: **`main`**
- Root Directory: **`./`** (o déjalo vacío)
- **Guarda** (botón Save/Update)

### 4️⃣ Espera el Deploy
- Railway automáticamente empezará un nuevo deploy
- Ve a "Deployments" y espera 2-3 minutos
- Deberías ver el commit: `"chore: Force Railway redeploy for mailboxes feature"`

---

## ✅ Después del Deploy

1. **Refresca la página de Mailboxes** en Sendlr.ai
2. **Deberías ver tu mailbox `rafaelalvrzb@gmail.com` automáticamente**

---

## 🆘 Si No Encuentras "Change Repository"

Busca:
- "Source"
- "Repository"  
- "Connect Repository"
- "Edit Source"
- Un botón con ícono de lápiz o engranaje

---

**Eso es todo.** Una vez que cambies el repositorio, Railway se actualizará automáticamente y todo funcionará. 🚀

