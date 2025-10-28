# 🚀 RafAgent SaaS - AI-Powered B2B Sales Automation

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/rafagent-saas)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**RafAgent** es una plataforma SaaS profesional que automatiza el proceso de ventas B2B utilizando inteligencia artificial para gestionar secuencias de emails, analizar respuestas y programar reuniones automáticamente.

## ✨ Características Principales

- 🤖 **Automatización Inteligente**: Envío automático de secuencias de emails basado en horarios de trabajo
- 📧 **Integración Gmail**: Conexión directa con Gmail para envío y seguimiento de emails
- 🧠 **Análisis AI**: Clasificación automática de respuestas usando Google Gemini AI
- 📅 **Programación de Reuniones**: Integración con Google Calendar para agendar reuniones automáticamente
- 📊 **Analytics Avanzados**: Tracking de aperturas de emails y métricas de conversión
- 🎯 **Gestión de Prospectos**: CRM integrado para gestionar leads y oportunidades
- 🔄 **Email Threading**: Seguimiento inteligente de conversaciones por hilo

## 🏗️ Arquitectura Técnica

### Frontend
- **React 18** con TypeScript
- **Vite** para build y desarrollo
- **Radix UI** + **Tailwind CSS** para componentes
- **TanStack Query** para estado del servidor
- **Wouter** para routing ligero

### Backend
- **Express.js** con TypeScript
- **Node.js** con ES Modules
- **Socket.io** para WebSockets en tiempo real
- **Drizzle ORM** para base de datos

### Base de Datos
- **PostgreSQL** (Neon Database - Serverless)
- Esquema optimizado para escalabilidad

### Servicios Externos
- **Google Gmail API** para envío de emails
- **Google Calendar API** para programación de reuniones
- **Google Gemini AI** para análisis de respuestas
- **Google OAuth 2.0** para autenticación

## 🚀 Deployment en Producción

### Stack de Producción (Serverless)
- **Hosting**: Vercel (Frontend + Backend)
- **Base de Datos**: Neon Database (PostgreSQL Serverless)
- **Autenticación**: Google OAuth 2.0
- **CDN**: Vercel Edge Network

### Costos Estimados
- **Vercel**: $0/mes (plan gratuito hasta 100GB)
- **Neon Database**: $0/mes (plan gratuito hasta 3GB)
- **Google APIs**: $0/mes (quota gratuita)
- **Total**: **$0/mes** hasta escalar significativamente

## 📋 Guía de Instalación

### Prerrequisitos
- Node.js 18+
- Cuenta de Google Cloud Console
- Cuenta de Neon Database
- Cuenta de Vercel

### Instalación Local

1. **Clonar el repositorio**
```bash
git clone https://github.com/your-username/rafagent-saas.git
cd rafagent-saas
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp ENV_TEMPLATE.txt .env
# Editar .env con tus credenciales
```

4. **Ejecutar migraciones de base de datos**
```bash
npm run db:push
```

5. **Iniciar en modo desarrollo**
```bash
npm run dev
```

### Deployment en Producción

Sigue la [Guía de Deployment Completa](./DEPLOYMENT_GUIDE.md) para configurar:
- Google Cloud Console
- Neon Database
- Vercel deployment
- Variables de entorno de producción

## 🔧 Scripts Disponibles

```bash
# Desarrollo
npm run dev              # Servidor de desarrollo
npm run build            # Build para producción
npm run start            # Servidor de producción

# Base de datos
npm run db:push          # Aplicar migraciones

# Vercel
npm run vercel-build     # Build para Vercel
npm run vercel-dev       # Desarrollo con Vercel

# Versionamiento
npm run version:patch    # Nueva versión patch
npm run version:minor    # Nueva versión minor
npm run version:major    # Nueva versión major

# Deployment
npm run deploy:production # Deploy a producción
npm run deploy:preview    # Deploy preview
```

## 📊 Estructura del Proyecto

```
rafagent-saas/
├── client/                 # Frontend React
│   ├── src/
│   │   ├── components/     # Componentes UI
│   │   ├── pages/         # Páginas de la aplicación
│   │   ├── hooks/         # Custom hooks
│   │   └── lib/           # Utilidades
├── server/                 # Backend Express
│   ├── automation/        # Lógica de automatización
│   ├── middleware/         # Middleware de Express
│   ├── services/          # Servicios externos
│   └── utils/             # Utilidades del servidor
├── shared/                 # Código compartido
│   └── schema.ts          # Esquema de base de datos
├── migrations/             # Migraciones de DB
└── dist/                   # Build de producción
```

## 🔐 Variables de Entorno

### Desarrollo (.env)
```env
DATABASE_URL=postgresql://...
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
GOOGLE_REDIRECT_URI=http://localhost:3000/auth/google/callback
GEMINI_API_KEY=your_gemini_key
SESSION_SECRET=your_session_secret
NODE_ENV=development
```

### Producción (Vercel)
Ver [ENV_PRODUCTION_TEMPLATE.txt](./ENV_PRODUCTION_TEMPLATE.txt) para la configuración completa.

## 🎯 Roadmap Futuro

### Versión 1.1 (Próxima)
- [ ] Integración con Stripe para monetización
- [ ] Planes de suscripción (Free, Pro, Enterprise)
- [ ] Límites por plan
- [ ] Dashboard de analytics mejorado

### Versión 1.2
- [ ] Integración con CRM externos (HubSpot, Salesforce)
- [ ] Templates de email más avanzados
- [ ] Automatización de seguimiento post-reunión
- [ ] API pública para integraciones

### Versión 2.0
- [ ] Multi-tenant architecture
- [ ] White-label solution
- [ ] Mobile app (React Native)
- [ ] Advanced AI features

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver [LICENSE](LICENSE) para más detalles.

## 📞 Soporte

- 📧 Email: support@rafagent.com
- 📖 Documentación: [docs.rafagent.com](https://docs.rafagent.com)
- 🐛 Issues: [GitHub Issues](https://github.com/your-username/rafagent-saas/issues)

## 🙏 Agradecimientos

- [Vercel](https://vercel.com/) por el hosting serverless
- [Neon](https://neon.tech/) por la base de datos PostgreSQL
- [Google Cloud](https://cloud.google.com/) por las APIs
- [Radix UI](https://www.radix-ui.com/) por los componentes

---

**Hecho con ❤️ para automatizar las ventas B2B**
