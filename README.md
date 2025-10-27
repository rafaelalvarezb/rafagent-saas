# 🎯 RafAgent - Plataforma de Outbound Sales

> **Transforma tu prospección de ventas con inteligencia artificial**

RafAgent es una plataforma profesional de CRM diseñada para automatizar secuencias de email outbound, clasificar respuestas con IA, y programar reuniones inteligentemente.

---

## ✨ **Características Principales**

- 🤖 **Automatización Inteligente**: Secuencias de 4 touchpoints con seguimiento automático
- 🧠 **Clasificación con Gemini AI**: Analiza respuestas y categoriza prospectos automáticamente
- 📧 **Integración Gmail**: Envía emails nativamente desde tu cuenta
- 📅 **Smart Scheduling**: Programa reuniones en Google Calendar con buffer de 24h
- 🎨 **UI Profesional**: Diseño minimalista inspirado en Salesforce Lightning
- 🌍 **Multi-timezone**: Soporte para diferentes zonas horarias
- 📊 **Analytics**: Dashboard con métricas de rendimiento en tiempo real

---

## 🚀 **Inicio Rápido**

### **1. Pre-requisitos**
- Node.js 20+ instalado
- Una cuenta de Google (Gmail)
- API Key de Gemini AI

### **2. Configuración**

Sigue la **[Guía de Configuración Completa](./SETUP_GUIDE.md)** que incluye:
- ✅ Configurar base de datos PostgreSQL (Neon - gratis)
- ✅ Configurar Gemini AI
- ✅ Configurar Google Cloud OAuth
- ✅ Instalar dependencias
- ✅ Variables de entorno
- ✅ Iniciar la aplicación

### **3. Comandos Básicos**

```bash
# Instalar dependencias
npm install

# Crear tablas en la base de datos
npm run db:push

# Iniciar en modo desarrollo
npm run dev

# Construir para producción
npm run build

# Iniciar en producción
npm start
```

---

## 📁 **Estructura del Proyecto**

```
rafagent/
├── client/               # Frontend React + TypeScript
│   ├── src/
│   │   ├── components/  # Componentes UI reutilizables
│   │   ├── pages/       # Páginas de la aplicación
│   │   ├── lib/         # Utilidades y configuración
│   │   └── hooks/       # React hooks personalizados
│   └── index.html
├── server/              # Backend Express + TypeScript
│   ├── services/        # Lógica de negocio
│   │   ├── ai.ts       # Integración Gemini AI
│   │   ├── gmail.ts    # Integración Gmail
│   │   └── calendar.ts # Integración Google Calendar
│   ├── routes.ts        # Endpoints de la API
│   ├── storage.ts       # Capa de acceso a datos
│   └── index.ts         # Punto de entrada del servidor
├── shared/              # Código compartido
│   └── schema.ts        # Schema de base de datos (Drizzle)
├── SETUP_GUIDE.md       # 📖 Guía de configuración paso a paso
└── ENV_TEMPLATE.txt     # Plantilla de variables de entorno
```

---

## 🎨 **Stack Tecnológico**

### **Frontend**
- **React 18** + TypeScript
- **Tailwind CSS** + shadcn/ui (componentes)
- **TanStack Query** (gestión de estado)
- **Wouter** (routing)
- **Vite** (build tool)

### **Backend**
- **Express.js** + TypeScript
- **Drizzle ORM** (PostgreSQL)
- **Google APIs** (Gmail + Calendar)
- **Gemini AI** (clasificación de respuestas)

### **Base de Datos**
- **PostgreSQL** (via Neon/Supabase)

---

## 🔐 **Seguridad**

- ✅ Variables de entorno nunca se suben a Git
- ✅ OAuth 2.0 para autenticación con Google
- ✅ Conexiones SSL/TLS a la base de datos
- ✅ Session management con express-session

---

## 📊 **Casos de Uso**

### **Para Sales Development Reps (SDRs)**
- Automatiza secuencias de prospección
- Reduce tiempo de respuesta a leads interesados
- Mantén todos tus prospectos organizados

### **Para Equipos de Ventas**
- Visibilidad centralizada del pipeline
- Métricas de rendimiento por campaña
- Seguimiento de actividad automatizado

### **Para Fundadores/Solopreneurs**
- Escala tu outbound sin contratar
- IA clasifica respuestas 24/7
- Programa reuniones automáticamente

---

## 🛠️ **Desarrollo**

### **Comandos de Desarrollo**

```bash
# Verificar errores de TypeScript
npm run check

# Sincronizar schema de BD
npm run db:push

# Modo desarrollo con hot-reload
npm run dev
```

### **Variables de Entorno**

Consulta `ENV_TEMPLATE.txt` para ver todas las variables necesarias.

---

## 📈 **Roadmap**

- [x] Core de automatización de emails
- [x] Clasificación de respuestas con IA
- [x] Scheduling inteligente
- [x] Dashboard profesional
- [ ] Autenticación multi-usuario
- [ ] Importación bulk de CSV
- [ ] Webhooks para integraciones
- [ ] App móvil (React Native)
- [ ] Templates de email con A/B testing

---

## 🤝 **Contribuir**

Este es un proyecto privado en desarrollo activo. Si tienes sugerencias o encuentras bugs, documéntalos para revisión.

---

## 📄 **Licencia**

Código propietario - Todos los derechos reservados

---

## 💬 **Soporte**

¿Problemas con la configuración? Consulta primero:
1. **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** - Guía paso a paso completa
2. **[design_guidelines.md](./design_guidelines.md)** - Principios de diseño
3. **[replit.md](./replit.md)** - Documentación técnica del proyecto

---

<div align="center">
  
**Hecho con ❤️ para modernizar el outbound sales**

[Documentación](./SETUP_GUIDE.md) · [Reportar Bug](#) · [Solicitar Feature](#)

</div>

