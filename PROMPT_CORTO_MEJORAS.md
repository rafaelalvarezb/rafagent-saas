# 🚀 PROMPT CORTO - RafAgent Mejoras

**Usuario:** Rafael Alvarez (no técnico)  
**Fecha:** 30 octubre 2025  
**Workspace:** `/Users/anaramos/Desktop/RafAgent (from Replit to Cursor)/`

---

## ✅ ESTADO ACTUAL

RafAgent es una **app SaaS de automatización de ventas B2B** que:
- Envía sequences de emails vía Gmail API
- Analiza respuestas con IA (Gemini)
- Programa reuniones automáticamente en Google Calendar
- Todo funcionando perfectamente ✅

**Stack:** React/TypeScript, Node.js/Express, PostgreSQL, Google OAuth

**Deploy:**
- Frontend (Vercel): repo `rafagent-saas` 
- Backend (Railway): repo `rafagent-engine`

---

## 🎯 BUG QUE SE ARREGLÓ HOY

**Problema:** Reuniones se programaban en horarios incorrectos.

**Solución implementada:**
1. ✅ Formato correcto para Google Calendar API (sin 'Z' en timestamps)
2. ✅ Función `cleanEmailForAI()` remueve headers de emails
3. ✅ Respeta Working Days del usuario
4. ✅ Detecta día de la semana en timezone correcto

**Archivos modificados:**
- `server/services/calendar.ts` - Fix de timezone
- `server/services/gmail.ts` - Limpieza de emails
- `server/automation/agent.ts` - Uso de limpieza

**Casos probados (TODOS funcionan ✅):**
- Sin preferencias → agenda siguiente día disponible
- Con día ("el lunes") → agenda ese día a las 9 AM
- Con día y hora ("el lunes a la 1 pm") → agenda exacto

---

## 📂 ARCHIVOS CLAVE

**Backend (lógica principal):**
- `server/services/calendar.ts` - Programación de reuniones
- `server/automation/agent.ts` - Agente que corre cada 30 min
- `server/services/ai.ts` - Análisis con Gemini
- `server/routes.ts` - API endpoints

**Base de datos:**
- `shared/schema.ts` - Schema de PostgreSQL
- Tablas: users, user_config, prospects, sequences, templates

---

## 🎯 PRÓXIMO PASO

Rafael necesita **mejoras** antes de publicar la app.

**Tu trabajo:**
1. Escuchar qué mejoras necesita
2. Implementarlas correctamente
3. Explicar de forma simple (Rafael es no técnico)
4. Hacer deployment correcto (Vercel para frontend, Railway para backend)
5. Probar que funcione

---

## ⚠️ IMPORTANTE RECORDAR

1. **Deployment backend:** Actualizar AMBOS repos (`rafagent-saas` Y `rafagent-engine`)
2. **Rafael es no técnico:** Explicaciones simples, paso a paso
3. **Logs en Railway:** Ahí ves todo lo que pasa en el backend
4. **Todo funciona:** No rompas lo que ya está funcionando
5. **Working Hours actualmente:** 9 AM - 11 PM (configuración del usuario)

---

## 📖 PARA MÁS DETALLES

Lee **`PROMPT_NUEVO_CHAT_MEJORAS.md`** (versión completa con TODO el contexto).

---

**¡Listo para implementar mejoras!** 🚀

