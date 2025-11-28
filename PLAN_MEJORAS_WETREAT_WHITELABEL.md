# 🚀 PLAN ESTRATÉGICO: La Mejor Herramienta de Email Outbound del Mundo
## Sendlr.ai - Diciembre 2025

---

## 📋 RESUMEN EJECUTIVO

**Visión:** Convertir Sendlr.ai en **la mejor herramienta de email outbound del mundo** con una experiencia de usuario excepcional, intuitiva, minimalista, estética, moderna y dopamínica.

**Estrategia de Implementación:**
1. **Primero:** Funcionalidad completa para usuario individual (sin multi-tenant)
2. **Segundo:** Resolver verificación de Google OAuth (eliminar warning)
3. **Tercero:** UI/UX excepcional
4. **Cuarto:** Integraciones con CRMs
5. **Finalmente:** Multi-tenant y white-label

**Cliente Objetivo:** WeTreat.io (y sus clientes: 500+ clínicas médicas/spas independientes en Estados Unidos)

**Modelo de Negocio:**
- **Pricing para WeTreat.io:** $5 USD/mes
- **Pricing para clientes de WeTreat:** $10-15 USD/mes (WeTreat decide)
- **Margen para WeTreat:** $5-10 USD/mes por cliente
- **Potencial:** 500 clientes × $5-10 = $2,500-$5,000/mes para WeTreat

**Filosofía:**
- ✅ **Todo debe ser propio** - No depender de servicios externos costosos
- ✅ **Enfoque en Email Outbound** - SMS y llamadas quedan para después
- ✅ **UI/UX excepcional** - La mejor experiencia del mundo
- ✅ **Competitivo en precio** - Funcionalidades gratuitas o propias

---

## 🎯 PLAN DE IMPLEMENTACIÓN POR FASES

**NOTA IMPORTANTE:** Este plan está organizado para que primero funcione perfectamente para un usuario individual (sin multi-tenant), se resuelva la verificación de Google OAuth, y después se agregue multi-tenant y white-label.

---

### **FASE 1: Sistema de Email Outbound Masivo (Usuario Individual)** (8-10 semanas)
**Objetivo:** Sistema completo de email masivo con deliverability garantizada (TODO PROPIO) - Para usuario individual primero

#### 1.1. Sistema de Múltiples Mailboxes
**Archivos nuevos:**
- `shared/schema.ts` - Tabla `mailboxes`
- `server/services/mailbox.ts` - Gestión de mailboxes
- `src/pages/Mailboxes.tsx` - UI para gestionar mailboxes

**Schema:**
```typescript
export const mailboxes = pgTable("mailboxes", {
  id: varchar("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id),
  email: text("email").notNull(),
  displayName: text("display_name"),
  googleAccessToken: text("google_access_token"),
  googleRefreshToken: text("google_refresh_token"),
  isActive: boolean("is_active").default(true),
  dailySendLimit: integer("daily_send_limit").default(25),
  emailsSentToday: integer("emails_sent_today").default(0),
  lastResetDate: timestamp("last_reset_date"),
  warmupStatus: text("warmup_status").default('not_started'), // 'warming', 'ready', 'paused'
  warmupStartDate: timestamp("warmup_start_date"),
  warmupCurrentDay: integer("warmup_current_day").default(0),
  reputationScore: real("reputation_score").default(0), // 0-100
  createdAt: timestamp("created_at").defaultNow(),
});
```

**Features:**
- Agregar múltiples cuentas Gmail (OAuth)
- Rotación automática de mailboxes
- Límite de 25 emails/mailbox/día (configurable)
- Reset diario automático (cron job)
- UI intuitiva para gestionar mailboxes

**Esfuerzo:** 2 semanas

#### 1.2. Email Warmup System (PROPIO)
**Archivos nuevos:**
- `server/services/emailWarmup.ts` - Lógica de warmup
- `server/cron/warmupScheduler.ts` - Scheduler para warmup
- `src/components/WarmupStatus.tsx` - UI de estado de warmup
- `src/pages/Warmup.tsx` - Página de warmup

**Estrategia de Warmup Propio:**

**Fase 1: Warmup Gradual (Días 1-30)**
- Día 1-5: 5 emails/día
- Día 6-10: 10 emails/día
- Día 11-15: 15 emails/día
- Día 16-20: 20 emails/día
- Día 21-30: 25 emails/día (máximo)

**Fase 2: Simulación de Interacciones**
- Enviar emails a cuentas internas controladas
- Simular aperturas (pixel tracking)
- Simular respuestas (auto-reply)
- Simular marcados como importantes
- Simular clicks en links

**Features:**
- Warmup automático al agregar mailbox
- Monitoreo de reputación (bounces, spam reports)
- Alertas si warmup falla
- Pausar warmup si hay problemas
- UI con progress bar y estadísticas

**Esfuerzo:** 3 semanas

#### 1.3. Email Verification System (PROPIO)
**Archivos nuevos:**
- `server/services/emailVerification.ts` - Lógica de verificación
- `src/components/EmailVerificationReport.tsx` - UI de reporte

**Estrategia de Verificación Propia:**

**Nivel 1: Validación de Formato**
- Regex para formato válido
- Validar estructura (usuario@dominio.com)

**Nivel 2: Validación de Dominio**
- Verificar que dominio existe (DNS lookup)
- Verificar MX records
- Verificar que dominio acepta emails

**Nivel 3: Validación de Email (SMTP Check)**
- Conectar al servidor SMTP
- Verificar si email existe (sin enviar email)
- Detectar catch-all domains

**Nivel 4: Listas de Disposable Emails**
- Lista de dominios desechables (10minutemail, etc.)
- Lista de dominios de prueba (test.com, example.com)

**Clasificación:**
- ✅ **Válido:** Formato correcto, dominio existe, MX records OK, SMTP check OK
- ⚠️ **Riesgoso:** Formato correcto, dominio existe, pero SMTP check falló
- ❌ **Inválido:** Formato incorrecto, dominio no existe, o disposable

**Features:**
- Verificación en bulk antes de importar
- Eliminar automáticamente emails inválidos
- Alertar si >5% de emails están "riesgosos"
- Mostrar reporte detallado
- Guardar resultado en base de datos

**Esfuerzo:** 2 semanas

#### 1.4. Spam Score Checker (PROPIO)
**Archivos nuevos:**
- `server/services/spamChecker.ts` - Análisis de copy
- `src/components/SpamScoreAlert.tsx` - Alertas en editor
- `src/components/SpamScoreIndicator.tsx` - Indicador visual

**Estrategia de Spam Checker Propio:**

**Reglas de Spam Detection:**
1. **Palabras Spammy (Alta Prioridad):**
   - "FREE", "GRATIS", "100% garantizado", "ACTÚA AHORA"
   - "OFERTA LIMITADA", "GANA DINERO", "CLICK AQUÍ"
   - "URGENTE", "IMPORTANTE", "NO PIERDAS ESTA OPORTUNIDAD"

2. **Formato Sospechoso:**
   - Muchas mayúsculas (más del 30% del texto)
   - Muchos signos de exclamación (más de 2 por párrafo)
   - Muchos emojis (más de 3 por email)
   - Links acortados sospechosos

3. **Estructura Sospechosa:**
   - Falta de saludo personalizado
   - Falta de firma
   - Muchos links sin contexto
   - Imágenes sin texto alternativo

4. **Spam Score Calculation:**
   - Cada regla tiene un peso
   - Score final: 0-100 (0 = muy spammy, 100 = limpio)
   - Alertas si score < 70

**Features:**
- Análisis en tiempo real mientras escribes
- Indicador visual (verde/amarillo/rojo)
- Sugerencias de mejora específicas
- Preview de score antes de guardar
- Historial de scores por template

**Esfuerzo:** 1.5 semanas

#### 1.5. Spintax System
**Archivos a modificar:**
- `server/services/ai.ts` - Función `processSpintax()`
- `src/pages/Templates.tsx` - Editor con preview de spintax
- `src/components/SpintaxPreview.tsx` - Preview de variaciones

**Features:**
- Sintaxis: `{Hey|Hi|Hello}` → selecciona aleatoriamente
- Anidado: `{Hey|Hi} {there|friend}` → 4 combinaciones posibles
- Preview de variaciones en tiempo real
- Cada email usa una variación diferente
- Contador de variaciones posibles

**Esfuerzo:** 1 semana

#### 1.6. Cálculo Automático de Mailboxes Necesarios
**Archivos nuevos:**
- `server/services/mailboxCalculator.ts` - Lógica de cálculo
- `src/components/MailboxCalculator.tsx` - UI de calculadora

**Features:**
- Input: Número de correos a enviar, frecuencia de followups
- Output: "Necesitas 40 mailboxes para enviar 1000 correos"
- Considera: límite de 25/mailbox/día, followups futuros
- Alertas si no hay suficientes mailboxes
- Sugerencias de cuántos mailboxes agregar

**Esfuerzo:** 1 semana

#### 1.7. Inbox Consolidado
**Archivos nuevos:**
- `server/services/unifiedInbox.ts` - Agregar emails de todos los mailboxes
- `src/pages/Inbox.tsx` - Vista unificada de inbox
- `src/components/InboxMessage.tsx` - Componente de mensaje

**Features:**
- Ver todos los emails de todos los mailboxes en un lugar
- Filtrar por mailbox, prospect, fecha, estado (leído/no leído)
- Responder desde Sendlr.ai (usando Gmail API)
- Threading visual (agrupar por thread)
- Búsqueda avanzada
- Marcar como leído/no leído
- Archivar emails
- UI moderna tipo Gmail/Outlook

**Esfuerzo:** 2 semanas

#### 1.8. Vista de Calendario Mejorada
**Archivos nuevos:**
- `src/pages/Calendar.tsx` - Vista de calendario completa
- `src/components/CalendarView.tsx` - Componente de calendario
- `src/components/CalendarEvent.tsx` - Componente de evento

**Features:**
- Vista mensual/semanal/diaria
- Todos los meetings agendados
- Filtrar por prospect, mailbox, etc.
- Click para ver detalles
- Integración con Google Calendar
- UI moderna tipo calendario

**Esfuerzo:** 1.5 semanas

**Total Fase 1:** 8-10 semanas

---

### **FASE 2: Verificación de Google OAuth** (1-2 semanas)
**Objetivo:** Resolver el warning "Google no ha verificado esta aplicación" para que usuarios puedan usar Sendlr.ai sin advertencias

#### 2.1. Completar OAuth Consent Screen
**Pasos en Google Cloud Console:**

1. **Completar Información Básica:**
   - App name: "Sendlr.ai"
   - User support email: `rafaelalvrzb@gmail.com`
   - Developer contact: `rafaelalvrzb@gmail.com`
   - App logo: Subir logo de Sendlr.ai
   - App home page: `https://rafagent-saas.vercel.app`
   - App privacy policy link: `https://rafagent-saas.vercel.app/privacy`
   - App terms of service link: `https://rafagent-saas.vercel.app/terms`

2. **Agregar Scopes (Permisos):**
   - `https://www.googleapis.com/auth/gmail.send`
   - `https://www.googleapis.com/auth/gmail.readonly`
   - `https://www.googleapis.com/auth/calendar`
   - `https://www.googleapis.com/auth/userinfo.email`
   - `https://www.googleapis.com/auth/userinfo.profile`

3. **Agregar Test Users (Temporal):**
   - Agregar tu email: `rafaelalvrzb@gmail.com`
   - Agregar emails de usuarios de prueba

4. **Solicitar Verificación de Google:**
   - Ir a "OAuth consent screen" → "PUBLISH APP"
   - Completar formulario de verificación
   - Explicar el propósito de la aplicación
   - Proporcionar video demo (opcional pero recomendado)
   - Esperar aprobación de Google (puede tomar 1-2 semanas)

**Requisitos para Verificación:**
- ✅ Privacy Policy completa (ya existe en `/privacy`)
- ✅ Terms of Service completos (ya existen en `/terms`)
- ✅ Logo de la aplicación
- ✅ Descripción clara del propósito
- ✅ Explicación de por qué necesitas los scopes solicitados

**Esfuerzo:** 1 semana (preparación) + 1-2 semanas (espera de Google)

#### 2.2. Mejorar Documentación para Google
**Archivos a crear/modificar:**
- `docs/GOOGLE_OAUTH_VERIFICATION.md` - Documentación del proceso
- Actualizar Privacy Policy si es necesario
- Actualizar Terms of Service si es necesario

**Contenido para Solicitud de Verificación:**
- Descripción clara de qué hace Sendlr.ai
- Por qué necesita acceso a Gmail (enviar emails automatizados)
- Por qué necesita acceso a Calendar (agendar meetings)
- Cómo se protegen los datos del usuario
- Política de privacidad y términos de servicio

**Esfuerzo:** 3 días

**Total Fase 2:** 1-2 semanas (preparación) + 1-2 semanas (espera de Google)

---

### **FASE 3: UI/UX Excepcional** (4-5 semanas)
**Objetivo:** La mejor experiencia de usuario del mundo para email outbound

#### 3.1. Rediseño de Dashboard
**Archivos a modificar:**
- `src/pages/Dashboard.tsx` - Rediseño completo
- `src/components/DashboardStats.tsx` - Stats mejoradas

**Features:**
- Vista moderna tipo Notion/Monday.com
- Cards con hover effects
- Animaciones suaves
- Métricas visuales (gráficos, progress bars)
- Dark mode compatible
- Responsive design

**Esfuerzo:** 1 semana

#### 3.2. Mejora de Página de Prospects
**Archivos a modificar:**
- `src/pages/Prospects.tsx` - Rediseño completo

**Features:**
- Vista tipo tabla moderna
- Filtros avanzados
- Búsqueda instantánea
- Bulk actions
- Vista de cards (alternativa)
- Animaciones al agregar/editar
- Feedback visual inmediato

**Esfuerzo:** 1.5 semanas

#### 3.3. Editor de Templates Mejorado
**Archivos a modificar:**
- `src/pages/Templates.tsx` - Editor mejorado
- `src/components/TemplateEditor.tsx` - Nuevo componente

**Features:**
- Editor tipo Notion (rich text)
- Preview en tiempo real
- Spam score indicator en tiempo real
- Spintax preview
- Variables autocomplete
- Snippets de templates
- Historial de cambios

**Esfuerzo:** 1.5 semanas

#### 3.4. Microinteracciones y Animaciones
**Archivos nuevos:**
- `src/lib/animations.ts` - Utilidades de animación
- `src/components/ui/animations.tsx` - Componentes animados

**Features:**
- Toast notifications mejoradas
- Loading states elegantes
- Transiciones suaves
- Hover effects
- Skeleton loaders
- Progress indicators
- Confetti en éxitos (opcional, dopamínico)

**Esfuerzo:** 1 semana

**Total Fase 3:** 4-5 semanas

---

### **FASE 4: Integración con CRMs (Unidireccional)** (3-4 semanas)
**Objetivo:** Sincronización Sendlr.ai → CRM (HubSpot, Salesforce, Attio)

#### 4.1. Schema para CRM Integrations
**Archivos a modificar:**
- `shared/schema.ts` - Tabla `crm_integrations`, `crm_activities`

**Schema:**
```typescript
export const crmIntegrations = pgTable("crm_integrations", {
  id: varchar("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id),
  crmType: text("crm_type").notNull(), // 'hubspot', 'salesforce', 'attio'
  accessToken: text("access_token").notNull(),
  refreshToken: text("refresh_token"),
  tokenExpiry: timestamp("token_expiry"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const crmActivities = pgTable("crm_activities", {
  id: varchar("id").primaryKey(),
  integrationId: varchar("integration_id").references(() => crmIntegrations.id),
  prospectId: varchar("prospect_id").references(() => prospects.id),
  activityType: text("activity_type").notNull(), // 'email_sent', 'email_opened', 'email_replied', 'meeting_scheduled'
  crmContactId: text("crm_contact_id"),
  crmActivityId: text("crm_activity_id"),
  syncedAt: timestamp("synced_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});
```

**Esfuerzo:** 1 semana

#### 4.2. Integración con HubSpot (Prioridad #1)
**Archivos nuevos:**
- `server/services/crm/hubspot.ts` - Integración con HubSpot API
- `src/pages/Configuration.tsx` - Sección "CRM Integrations"

**Features:**
- OAuth con HubSpot
- Registrar actividades:
  - Email enviado → HubSpot email activity
  - Email abierto → HubSpot email open event
  - Email respondido → HubSpot email reply event
  - Meeting agendado → HubSpot meeting activity
- Sincronización automática en background
- UI para conectar/desconectar

**Esfuerzo:** 1.5 semanas

#### 4.3. Integración con Salesforce
**Archivos nuevos:**
- `server/services/crm/salesforce.ts` - Integración con Salesforce API

**Features:**
- OAuth con Salesforce
- Registrar actividades como Tasks o Events
- Sincronización automática

**Esfuerzo:** 1 semana

#### 4.4. Integración con Attio
**Archivos nuevos:**
- `server/services/crm/attio.ts` - Integración con Attio API

**Features:**
- OAuth con Attio
- Registrar actividades
- Sincronización automática

**Esfuerzo:** 1 semana

**Total Fase 4:** 3-4 semanas

---

### **FASE 5: Multi-Tenant y White-Label** (5-6 semanas)
**Objetivo:** Construir la base para white-label con dominio personalizado (SOLO DESPUÉS de que todo funcione para usuario individual)

#### 5.1. Schema de Base de Datos Multi-Tenant
**Archivos a modificar:**
- `shared/schema.ts` - Agregar tablas:
  - `organizations` (para white-label clients)
  - `organization_settings` (customización: logo, colores, dominio)
  - `subscriptions` (facturación básica)

**Schema:**
```typescript
// Nueva tabla: organizations
export const organizations = pgTable("organizations", {
  id: varchar("id").primaryKey(),
  name: text("name").notNull(),
  whiteLabelClientId: varchar("white_label_client_id"), // Si es cliente de WeTreat
  customDomain: text("custom_domain"), // ej: "app.wetreat.io"
  logoUrl: text("logo_url"),
  primaryColor: text("primary_color"),
  secondaryColor: text("secondary_color"),
  isActive: boolean("is_active").default(true),
  subscriptionTier: text("subscription_tier").default('basic'), // 'basic', 'pro'
  createdAt: timestamp("created_at").defaultNow(),
});

// Modificar users para soportar multi-tenant
export const users = pgTable("users", {
  // ... campos existentes
  organizationId: varchar("organization_id").references(() => organizations.id),
  role: text("role").default('user'), // 'admin', 'user', 'org_admin'
});
```

**Esfuerzo:** 1 semana

#### 5.2. Sistema de Autenticación Multi-Tenant
**Archivos a modificar:**
- `server/middleware/auth.ts` - Verificar organización
- `server/routes.ts` - Filtrar por organización
- `server/storage.ts` - Todas las queries deben filtrar por `organizationId`

**Features:**
- Middleware para detectar organización desde dominio
- Verificar acceso a organización
- Sistema de roles (admin, user, org_admin)

**Esfuerzo:** 1 semana

#### 5.3. Configuración de Dominio Personalizado
**Archivos nuevos:**
- `server/services/domain.ts` - Gestión de dominios personalizados
- `server/middleware/domain.ts` - Middleware para detectar dominio

**Features:**
- Detectar organización desde `app.wetreat.io`
- Configuración de DNS (CNAME)
- Certificados SSL automáticos (usar Let's Encrypt o similar)
- Redirección automática al dominio personalizado

**Esfuerzo:** 1.5 semanas

#### 5.4. UI White-Label Dinámica
**Archivos a modificar:**
- `src/App.tsx` - Cargar configuración de organización
- `src/components/AppSidebar.tsx` - Logo y colores dinámicos
- `src/lib/config.ts` - Configuración de organización
- `src/index.css` - Variables CSS dinámicas

**Features:**
- Logo personalizado en sidebar y header
- Colores personalizados (primary, secondary) aplicados en toda la UI
- Favicon personalizado
- Título de página personalizado
- Carga dinámica desde API

**Esfuerzo:** 1 semana

#### 5.5. Panel de Administración para White-Label Clients
**Archivos nuevos:**
- `src/pages/WhiteLabel/OrganizationSettings.tsx` - Configuración de marca
- `src/pages/WhiteLabel/UsersManagement.tsx` - Gestión de usuarios
- `src/pages/WhiteLabel/DomainSettings.tsx` - Configuración de dominio
- `src/pages/WhiteLabel/Billing.tsx` - Facturación básica

**Features:**
- Gestión de usuarios de la organización
- Configuración de marca (logo, colores, dominio)
- Métricas de uso (emails enviados, mailboxes, etc.)
- Facturación básica ($5/mes)

**Esfuerzo:** 1.5 semanas

**Total Fase 5:** 5-6 semanas

---

## 📅 CRONOGRAMA ESTIMADO

### **Timeline Total: 21-28 semanas (5-7 meses)**

| Fase | Duración | Dependencias |
|------|----------|--------------|
| **Fase 1: Email Outbound Masivo** | 8-10 semanas | Ninguna |
| **Fase 2: Verificación Google OAuth** | 1-2 semanas (prep) + 1-2 semanas (espera) | Fase 1 |
| **Fase 3: UI/UX Excepcional** | 4-5 semanas | Fase 1 |
| **Fase 4: CRM Integrations** | 3-4 semanas | Fase 1 |
| **Fase 5: Multi-Tenant & White-Label** | 5-6 semanas | Fases 1-4 completas |

**Nota:** Las fases 2, 3 y 4 pueden desarrollarse en paralelo después de completar la Fase 1. La Fase 5 solo se hace después de que todo funcione perfectamente para usuario individual.

---

## 🎯 PRIORIZACIÓN RECOMENDADA (MVP)

### **MVP para Usuario Individual (10-12 semanas):**

1. **Fase 1.1-1.3: Múltiples Mailboxes + Warmup + Verificación** (7 semanas) ✅ CRÍTICO
2. **Fase 1.4-1.5: Spam Checker + Spintax** (2.5 semanas) ✅ IMPORTANTE
3. **Fase 1.6: Calculadora de Mailboxes** (1 semana) ✅ IMPORTANTE
4. **Fase 2: Verificación Google OAuth** (1-2 semanas) ✅ CRÍTICO
5. **Fase 3.1-3.2: UI/UX Básico** (2.5 semanas) ✅ IMPORTANTE

**Total MVP:** 10-12 semanas (2.5-3 meses)

**Después del MVP:**
- Fase 1.7-1.8: Inbox Consolidado + Calendario (3.5 semanas)
- Fase 3.3-3.4: Editor mejorado + Microinteracciones (2.5 semanas)
- Fase 4: CRM Integrations (3-4 semanas)
- Fase 5: Multi-Tenant & White-Label (5-6 semanas)

---

## 💰 CONSIDERACIONES DE COSTOS

### Servicios Externos (Mínimos):

1. **Email Verification:**
   - **Propio (recomendado)** - $0/mes

2. **Infraestructura:**
   - Vercel: Gratis (Hobby)
   - Railway: $5/mes
   - Neon PostgreSQL: $5/mes
   - **Total:** $10/mes

### Costos de Desarrollo:
- **Tiempo estimado:** 5-7 meses de desarrollo
- **Recursos:** 1 desarrollador full-time
- **Costo estimado:** $30,000-$60,000 (si se contrata)

### Modelo de Negocio:
- **Pricing para WeTreat:** $5/mes
- **Pricing para clientes de WeTreat:** $10-15/mes
- **Potencial:** 500 clientes × $5-10 = $2,500-$5,000/mes para WeTreat
- **ROI:** Positivo después de 6-12 meses

---

## 🎨 PRINCIPIOS DE UI/UX

### 1. **Minimalismo**
- Interfaz limpia, sin clutter
- Espacios en blanco generosos
- Tipografía clara y legible

### 2. **Modernidad**
- Diseño tipo Notion/Monday.com
- Cards con sombras suaves
- Colores modernos y vibrantes

### 3. **Dopamínico**
- Feedback visual inmediato
- Animaciones suaves
- Celebración de éxitos (confetti, badges)
- Progress bars animadas

### 4. **Intuitivo**
- Navegación clara
- Iconos descriptivos
- Tooltips informativos
- Onboarding guiado

### 5. **Estético**
- Paleta de colores coherente
- Iconos consistentes
- Espaciado uniforme
- Responsive design

---

## 📋 CHECKLIST DE IMPLEMENTACIÓN

### Fase 1: Email Outbound Masivo
- [ ] Schema de mailboxes
- [ ] UI para gestionar mailboxes
- [ ] Rotación automática de mailboxes
- [ ] Límites de envío por mailbox
- [ ] Sistema de warmup PROPIO
- [ ] Sistema de verificación PROPIO
- [ ] Spam score checker PROPIO
- [ ] Sistema de spintax
- [ ] Calculadora de mailboxes necesarios
- [ ] Inbox consolidado
- [ ] Vista de calendario mejorada

### Fase 2: Verificación Google OAuth
- [ ] Completar OAuth Consent Screen en Google Cloud Console
- [ ] Agregar logo de Sendlr.ai
- [ ] Agregar links a Privacy Policy y Terms of Service
- [ ] Explicar propósito de la aplicación
- [ ] Solicitar verificación de Google
- [ ] Esperar aprobación de Google

### Fase 3: UI/UX Excepcional
- [ ] Rediseño de Dashboard
- [ ] Mejora de Página de Prospects
- [ ] Editor de Templates mejorado
- [ ] Microinteracciones y animaciones
- [ ] Dark mode (opcional)
- [ ] Responsive design completo

### Fase 4: CRM Integrations
- [ ] Schema para CRM integrations
- [ ] OAuth con HubSpot
- [ ] Sincronización de actividades con HubSpot
- [ ] OAuth con Salesforce
- [ ] Sincronización con Salesforce
- [ ] OAuth con Attio
- [ ] Sincronización con Attio
- [ ] UI para gestionar integraciones CRM

### Fase 5: Multi-Tenant & White-Label
- [ ] Schema de base de datos (organizations, organization_settings, etc.)
- [ ] Migración de datos existentes (asignar usuarios a organización default)
- [ ] Middleware de autenticación multi-tenant
- [ ] Modificar todas las queries para filtrar por organizationId
- [ ] Configuración de dominio personalizado
- [ ] UI white-label (logo, colores dinámicos)
- [ ] Panel de administración para white-label clients
- [ ] Sistema de roles (admin, user, org_admin)

---

## 🚨 RIESGOS Y MITIGACIONES

### Riesgo 1: Verificación de Google OAuth
**Mitigación:** 
- Completar toda la información requerida
- Proporcionar video demo si es posible
- Tener Privacy Policy y Terms of Service completos
- Explicar claramente el propósito de la aplicación

### Riesgo 2: Deliverability de Emails
**Mitigación:**
- Warmup gradual y cuidadoso (propio)
- Límites conservadores (25/mailbox/día)
- Monitoreo constante de reputación
- Sistema de alertas si hay problemas

### Riesgo 3: Verificación de Emails (SMTP Check)
**Mitigación:**
- Empezar con validación básica (formato, DNS, MX)
- SMTP check opcional (más lento pero más preciso)
- Rate limiting para evitar bloqueos
- Cache de resultados

### Riesgo 4: Warmup Propio
**Mitigación:**
- Empezar con warmup simple (gradual)
- Monitorear métricas (bounces, spam reports)
- Ajustar estrategia según resultados
- Documentar proceso

### Riesgo 5: Complejidad de Multi-Tenant
**Mitigación:** 
- Hacerlo SOLO después de que todo funcione para usuario individual
- Empezar simple (schema por organización)
- Migrar datos existentes cuidadosamente
- Testing exhaustivo

---

## 🎉 CONCLUSIÓN

Este plan transformará Sendlr.ai en **la mejor herramienta de email outbound del mundo** con:

✅ **Todo propio** - Sin dependencia de servicios externos costosos  
✅ **UI/UX excepcional** - La mejor experiencia del mundo  
✅ **Verificación de Google OAuth** - Sin warnings para usuarios  
✅ **Funcionalidades completas** - Warmup, verificación, spam checker, todo propio  
✅ **White-label completo** - Dominio personalizado (app.wetreat.io) - AL FINAL  

**Próximos Pasos:**
1. Revisar este plan
2. Empezar con Fase 1 (Email Outbound Masivo)
3. Resolver verificación de Google OAuth (Fase 2)
4. Mejorar UI/UX (Fase 3)
5. Agregar CRMs (Fase 4)
6. Finalmente: Multi-tenant y white-label (Fase 5)

**¿Listo para construir la mejor herramienta de email outbound del mundo?** 🚀
