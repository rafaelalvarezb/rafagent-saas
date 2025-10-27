# 🤖 RafAgent Persistent Automation Engine

Este es el motor persistente de RafAgent que maneja todas las tareas de automatización que requieren ejecución continua, evitando los límites de tiempo de las funciones serverless.

## 🎯 Propósito

- **Ejecución Persistente**: Corre 24/7 sin límites de tiempo
- **Automatización de Emails**: Envío automático de secuencias
- **Análisis AI**: Clasificación automática de respuestas
- **Programación de Reuniones**: Agendamiento automático
- **Cron Jobs**: Tareas programadas (recordatorios, seguimientos)

## 🏗️ Arquitectura

```
rafagent-engine/
├── src/
│   ├── automation/          # Motor principal de automatización
│   │   ├── agent.ts         # Motor de secuencias de email
│   │   ├── scheduler.ts      # Scheduler principal
│   │   └── reminderScheduler.ts # Scheduler de recordatorios
│   ├── services/            # Servicios externos
│   │   ├── gmail.ts         # Envío de emails
│   │   ├── ai.ts            # Análisis AI
│   │   ├── calendar.ts     # Programación de reuniones
│   │   └── websocket.ts     # Notificaciones en tiempo real
│   ├── utils/              # Utilidades
│   │   ├── workingHours.ts # Lógica de horarios
│   │   └── timezone.ts     # Conversión de zonas horarias
│   ├── auth.ts             # Autenticación Google OAuth
│   ├── storage.ts          # Acceso a base de datos
│   ├── db.ts              # Configuración de DB
│   └── index.ts           # Servidor principal
├── shared/                 # Código compartido
│   └── schema.ts          # Esquema de base de datos
└── package.json           # Dependencias del motor
```

## 🚀 Deployment

### Railway (Recomendado)
1. Conecta tu repositorio de GitHub
2. Configura las variables de entorno
3. Deploy automático

### Render
1. Conecta tu repositorio de GitHub
2. Configura las variables de entorno
3. Deploy automático

## 🔧 Variables de Entorno

```env
DATABASE_URL=postgresql://...
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
GEMINI_API_KEY=your_gemini_key
PORT=3001
NODE_ENV=production
```

## 📊 Endpoints

- `GET /health` - Health check
- `GET /api/status` - Estado del motor
- `POST /api/agent/run/:userId` - Ejecutar motor manualmente

## 🔄 Integración con Frontend

El frontend (Vercel) se conecta a este motor para:
- Iniciar secuencias de email
- Obtener estado de automatización
- Recibir notificaciones en tiempo real

## 💰 Costos Estimados

- **Railway**: $5/mes (plan básico)
- **Render**: $7/mes (plan básico)
- **Total**: ~$5-7/mes para 1000+ usuarios

---

**Motor diseñado para escalar a 1000+ vendedores sin problemas de timeout**
