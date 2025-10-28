# 📄 CHEAT SHEET - RafAgent (Imprime esto)

## 🔗 URLs IMPORTANTES

| Qué | URL |
|-----|-----|
| **Tu RafAgent** | https://rafagent-saas.vercel.app |
| **Railway Dashboard** | https://railway.app/project/12223983-ee2d-498c-b05a-f54e8c524844 |
| **Vercel Dashboard** | https://vercel.com/rafael-alvarezs-projects-43d604b9/rafagent-saas |
| **Neon Dashboard** | https://console.neon.tech/ |
| **Google Cloud** | https://console.cloud.google.com/ |

---

## ✅ LOS 3 PASOS FINALES

### 1️⃣ Verifica Railway (2 min)
```
https://railway.app/project/12223983-ee2d-498c-b05a-f54e8c524844
→ rafagent-engine → Deployments
→ Debe estar VERDE (ACTIVE)
```

### 2️⃣ Agrega Variable en Vercel (3 min)
```
https://vercel.com/rafael-alvarezs-projects-43d604b9/rafagent-saas
→ Settings → Environment Variables → Add New
→ Name: VITE_API_URL
→ Value: https://rafagent-engine-production.up.railway.app
→ Save → Deployments → ... → Redeploy
```

### 3️⃣ Prueba Login (5 min)
```
https://rafagent-saas.vercel.app
→ Continue with Google
→ rafaelalvrzb@gmail.com
→ Autorizar
→ ✅ Ver Dashboard
```

---

## 🆘 SOLUCIÓN RÁPIDA DE PROBLEMAS

| Problema | Solución |
|----------|----------|
| **Railway en ROJO** | Lee: `SOLUCION_RAILWAY_CRASHES.md` |
| **Login da 404** | Verifica PASO 2 (VITE_API_URL) |
| **No hay secuencias** | Cierra sesión y vuelve a login |
| **Cualquier error** | F12 → Console → Copia error en rojo |

---

## 🔐 CREDENCIALES RÁPIDAS

```
Google OAuth:
- Client ID: [CONFIGURADO EN VARIABLES DE ENTORNO]
- Client Secret: [CONFIGURADO EN VARIABLES DE ENTORNO]

Gemini AI:
- API Key: [CONFIGURADO EN VARIABLES DE ENTORNO]

Neon Database:
- Connection: [CONFIGURADO EN VARIABLES DE ENTORNO]

GitHub:
- Usuario: rafaelalvarezb
- Email: rafaelalvrzb@gmail.com
```

---

## 📊 ARQUITECTURA EN 3 LÍNEAS

```
Frontend (Vercel - $0) → Backend (Railway - $5) → DB (Neon - $0)
Usuario ve UI          → API + Motor 24/7       → PostgreSQL
```

---

## 🔧 VERIFICAR QUE TODO FUNCIONA

```bash
# En Terminal:
cd "/Users/anaramos/Desktop/RafAgent (from Replit to Cursor)"
./verificar-configuracion.sh
```

---

## 📚 DOCUMENTACIÓN ESENCIAL

| Lee esto si... | Archivo |
|----------------|---------|
| **Estás empezando** | `START_AQUI.md` |
| **Vas a hacer los pasos** | `PASOS_FINALES_SIMPLES.md` |
| **Railway crasheó** | `SOLUCION_RAILWAY_CRASHES.md` |
| **Necesitas una URL** | `ACCESOS_RAPIDOS.md` |
| **Quieres entender** | `COMO_FUNCIONA_VISUAL.md` |

---

## 💰 COSTOS MENSUALES

```
Vercel:   $0
Railway:  $5
Neon:     $0
Google:   $0
--------
TOTAL:    $5/mes
```

**Capacidad:** 1000+ usuarios

---

## 🚨 NÚMEROS DE EMERGENCIA

```bash
# Ver logs de Railway (si crashea):
# Ve a Railway → rafagent-engine → Deployments → Deploy Logs

# Ver logs de Vercel (si frontend falla):
# Ve a Vercel → Deployments → Click en deployment → Logs

# Verificar base de datos:
# Ve a Neon → rafagent-production → Tables
```

---

## ⚡ COMANDOS ÚTILES

```bash
# Verificar configuración:
./verificar-configuracion.sh

# Ver status de Git:
git status

# Ver repositorio remoto:
git remote -v

# Ver últimos commits:
git log --oneline -5
```

---

## 📞 WORKFLOW DE AYUDA

```
1. Identifica el problema
2. Lee el archivo de documentación correspondiente
3. Si no funciona, copia el error completo
4. Pide ayuda con: Paso + Screenshot + Error
```

---

## ✅ CHECKLIST DIARIO

- [ ] Railway está ACTIVE (verde)
- [ ] Vercel está deployado sin errores
- [ ] Login funciona
- [ ] Motor envía emails

**Si alguno falla:** Revisa los logs

---

## 🎯 MÉTRICAS CLAVE

**Verifica en dashboards:**
- Railway: Uptime, Memory, CPU
- Vercel: Bandwidth, Function Duration
- Neon: Storage Used, Connections

---

## 🔄 FLUJO DE DEPLOYMENT

```
1. Cambios en código local
2. git add . && git commit -m "..."
3. git push origin main
4. Railway y Vercel auto-deploy
5. Esperar 2-3 minutos
6. Verificar que funciona
```

---

## 💡 TIPS PRO

- 🔐 Nunca compartas tus API keys
- 📊 Revisa logs semanalmente
- 💰 Verifica factura de Railway mensualmente
- 🔄 Haz backups de tu código
- 📝 Documenta cambios importantes

---

**Última actualización:** Octubre 27, 2025
**Version:** 1.0.0
**Estado:** Listo para producción (después de 3 pasos)

---

**🖨️ IMPRIME ESTA PÁGINA Y TENLA CERCA DE TU COMPUTADORA 🖨️**

