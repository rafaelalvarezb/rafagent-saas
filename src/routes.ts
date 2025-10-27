import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertProspectSchema, insertTemplateSchema, insertUserConfigSchema, insertActivityLogSchema, insertSequenceSchema } from "@shared/schema";
import { sendEmail, getThreadMessages, getMessageBody } from "./services/gmail";
import { classifyResponse, replaceTemplateVariables } from "./services/ai";
import { getAvailableSlots, findNextAvailableSlot, scheduleMeeting } from "./services/calendar";
import { getAuthUrl, getTokensFromCode, getUserInfo } from "./auth";
import { requireAuth, getCurrentUserId } from "./middleware/auth";
import { generateToken, authenticateJWT, optionalAuth } from "./middleware/jwt";
import { runAgent } from "./automation/agent";
import { createDefaultTemplates, createDefaultUserConfig } from "./automation/defaultTemplates";
import { isWithinWorkingHours, getWorkingHoursFromConfig, debugWorkingHours } from "./utils/workingHours";
import { ensureCurrentUserDefaults } from "./utils/ensureDefaults";

/**
 * Get template name for touchpoint number
 * Initial = 1, Second Touch = 2, Third Touch = 3, Fourth Touch = 4, Fifth Touch = 5, etc.
 */
function getTemplateNameForTouchpoint(touchpointNumber: number): string {
  const names = ['Initial', 'Second Touch', 'Third Touch', 'Fourth Touch', 'Fifth Touch', 'Sixth Touch', 'Seventh Touch', 'Eighth Touch'];
  return names[touchpointNumber - 1] || `Touch ${touchpointNumber}`;
}

export async function registerRoutes(app: Express): Promise<Server> {
  
  // ===== AUTHENTICATION =====
  app.get("/api/auth/google", (req, res) => {
    const authUrl = getAuthUrl();
    res.json({ authUrl });
  });

  // Direct redirect endpoint (more robust for some browsers / ad-blockers)
  app.get("/api/auth/google/redirect", (_req, res) => {
    try {
      const authUrl = getAuthUrl();
      return res.redirect(authUrl);
    } catch (e: any) {
      return res.status(500).send(`Failed to start Google OAuth: ${e.message}`);
    }
  });

  app.get("/api/auth/google/callback", async (req, res) => {
    try {
      const code = req.query.code as string;
      
      if (!code) {
        return res.status(400).send('Authorization code not provided');
      }

      // Exchange code for tokens
      const tokens = await getTokensFromCode(code);
      
      if (!tokens.access_token) {
        throw new Error('No access token received');
      }

      // Get user info from Google
      const userInfo = await getUserInfo(tokens.access_token, tokens.refresh_token);
      
      if (!userInfo.email) {
        throw new Error('Email not provided by Google');
      }

      // Find or create user in database
      let user = await storage.getUserByEmail(userInfo.email);
      let isNewUser = false;
      
      if (!user) {
        user = await storage.createUser({
          email: userInfo.email,
          name: userInfo.name || userInfo.email,
          timezone: 'America/Mexico_City'
        });
        isNewUser = true;
      }

      // Update OAuth tokens
      await storage.updateUser(user.id, {
        googleAccessToken: tokens.access_token,
        googleRefreshToken: tokens.refresh_token,
        googleTokenExpiry: tokens.expiry_date ? new Date(tokens.expiry_date) : undefined
      });

      // If new user, create default templates and config
      if (isNewUser) {
        try {
          await createDefaultTemplates(user.id);
          await createDefaultUserConfig(user.id);
          console.log(`Setup completed for new user: ${user.email}`);
        } catch (error) {
          console.error('Error creating defaults for new user:', error);
        }
      }

      // Generate JWT token
      const token = generateToken(user.id, user.email);
        
      // Redirect to frontend with token as query parameter
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      console.log(`✅ Authentication successful for ${user.email}, redirecting to ${frontendUrl}/dashboard`);
      res.redirect(`${frontendUrl}/dashboard?token=${token}`);
    } catch (error: any) {
      console.error('OAuth callback error:', error);
      res.status(500).send(`Authentication failed: ${error.message}`);
    }
  });

  app.get("/api/auth/status", optionalAuth, async (req, res) => {
    const user = (req as any).user;
    
    if (!user) {
      return res.json({ authenticated: false });
    }

    try {
      const userData = await storage.getUser(user.id);
      if (!userData) {
        return res.json({ authenticated: false });
      }

      // Always ensure user has default sequences and config
      try {
        await ensureCurrentUserDefaults(userData.id);
        
        // Also create default sequences if none exist
        const sequences = await storage.getSequencesByUser(userData.id);
        if (sequences.length === 0) {
          console.log(`No sequences found for user ${userData.email}, creating defaults...`);
          await createDefaultTemplates(userData.id);
          await createDefaultUserConfig(userData.id);
        }
      } catch (error) {
        console.error('Error ensuring defaults for user:', error);
      }

      res.json({
        authenticated: true,
        user: {
          id: userData.id,
          email: userData.email,
          name: userData.name,
          timezone: userData.timezone
        }
      });
    } catch (error) {
      res.json({ authenticated: false });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    // With JWT, logout is handled on the client side by removing the token
    // No server-side session to destroy
      res.json({ success: true });
  });

  // ===== PROSPECTS =====
  app.get("/api/prospects", requireAuth, async (req, res) => {
    try {
      const userId = getCurrentUserId(req)!;
      const prospects = await storage.getProspectsByUser(userId);
      res.json(prospects);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/prospects/:id", requireAuth, async (req, res) => {
    try {
      const prospect = await storage.getProspect(req.params.id);
      if (!prospect) {
        return res.status(404).json({ error: "Prospect not found" });
      }
      // Verify prospect belongs to current user
      const userId = getCurrentUserId(req)!;
      if (prospect.userId !== userId) {
        return res.status(403).json({ error: "Access denied" });
      }
      res.json(prospect);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/prospects", requireAuth, async (req, res) => {
    try {
      const userId = getCurrentUserId(req)!;
      
      // If no sequenceId provided, assign the default sequence
      let sequenceId = req.body.sequenceId;
      if (!sequenceId) {
        const sequences = await storage.getSequencesByUser(userId);
        const defaultSequence = sequences.find(s => s.isDefault);
        if (defaultSequence) {
          sequenceId = defaultSequence.id;
        }
      }
      
      const prospectData = insertProspectSchema.parse({ ...req.body, userId, sequenceId });
      const prospect = await storage.createProspect(prospectData);
      
      // Log activity
      await storage.createActivityLog({
        userId,
        prospectId: prospect.id,
        action: 'Prospect Created',
        detail: `New prospect added: ${prospect.contactName} (${prospect.contactEmail})`
      });

      // Auto-send initial email if sendSequence is true
      if (prospect.sendSequence) {
        const userConfig = await storage.getUserConfig(userId);
        const workingHours = getWorkingHoursFromConfig(userConfig);
        
        // Debug logging
        const debugInfo = debugWorkingHours(workingHours);
        console.log('Working hours debug:', debugInfo);
        
        if (isWithinWorkingHours(workingHours)) {
          // Send immediately
          try {
            const user = await storage.getUser(userId);
            if (user?.googleAccessToken) {
              // Get the sequence for this prospect
              const sequence = prospect.sequenceId 
                ? await storage.getSequence(prospect.sequenceId)
                : await storage.getDefaultSequence(userId);
              
              if (!sequence) {
                throw new Error('No sequence found for prospect');
              }

              // Get template from the prospect's specific sequence
              const template = await storage.getTemplateBySequenceAndName(sequence.id, 'Initial');
              if (template) {
                const subject = replaceTemplateVariables(template.subject, {
                  externalCid: prospect.externalCid || '',
                  contactName: prospect.contactName,
                  companyName: prospect.companyName || '',
                  contactTitle: prospect.contactTitle || '',
                  industry: prospect.industry || '',
                  yourName: user.name || ''
                });
                
                const body = replaceTemplateVariables(template.body, {
                  externalCid: prospect.externalCid || '',
                  contactName: prospect.contactName,
                  companyName: prospect.companyName || '',
                  contactTitle: prospect.contactTitle || '',
                  industry: prospect.industry || '',
                  yourName: user.name || ''
                });

                const result = await sendEmail(
                  user.googleAccessToken,
                  prospect.contactEmail,
                  subject,
                  body,
                  undefined,
                  user.googleRefreshToken,
                  user.id,
                  undefined,
                  undefined,
                  prospect.id // Add prospectId for pixel tracking
                );

                await storage.updateProspect(prospect.id, {
                  status: 'following_up',
                  threadId: result.threadId,
                  touchpointsSent: 1,
                  lastContactDate: new Date()
                });

                await storage.createActivityLog({
                  userId,
                  prospectId: prospect.id,
                  action: 'Initial Email Sent',
                  detail: `Initial email sent to ${prospect.contactName}`
                });
              }
            }
          } catch (emailError) {
            console.error('Error sending initial email:', emailError);
            await storage.updateProspect(prospect.id, { status: 'new' });
          }
        } else {
          // Set status to waiting for working hours
          await storage.updateProspect(prospect.id, { status: 'waiting_working_hours' });
        }
      } else {
        // Set default status for prospects without sequence
        await storage.updateProspect(prospect.id, { status: 'new' });
      }
      
      res.json(prospect);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.patch("/api/prospects/:id", requireAuth, async (req, res) => {
    try {
      const userId = getCurrentUserId(req)!;
      const existing = await storage.getProspect(req.params.id);
      
      if (!existing) {
        return res.status(404).json({ error: "Prospect not found" });
      }
      
      if (existing.userId !== userId) {
        return res.status(403).json({ error: "Access denied" });
      }
      
      // Handle sendSequence toggle
      if (req.body.sendSequence !== undefined) {
        if (req.body.sendSequence === false) {
          // User manually stopped the sequence
          req.body.status = 'paused';
        } else if (req.body.sendSequence === true && existing.status === 'paused') {
          // User resumed the sequence
          const userConfig = await storage.getUserConfig(userId);
          const workingHours = getWorkingHoursFromConfig(userConfig);
          
          if (isWithinWorkingHours(workingHours)) {
            req.body.status = 'following_up';
          } else {
            req.body.status = 'waiting_working_hours';
          }
        }
      }
      
      // Convert lastContactDate string to Date object if provided
      if (req.body.lastContactDate && typeof req.body.lastContactDate === 'string') {
        req.body.lastContactDate = new Date(req.body.lastContactDate);
      }
      
      const prospect = await storage.updateProspect(req.params.id, req.body);
      res.json(prospect);
    } catch (error: any) {
      console.error('Error updating prospect:', error);
      res.status(400).json({ error: error.message });
    }
  });

  app.delete("/api/prospects/:id", requireAuth, async (req, res) => {
    try {
      const userId = getCurrentUserId(req)!;
      const existing = await storage.getProspect(req.params.id);
      
      if (!existing) {
        return res.status(404).json({ error: "Prospect not found" });
      }
      
      if (existing.userId !== userId) {
        return res.status(403).json({ error: "Access denied" });
      }
      
      const deleted = await storage.deleteProspect(req.params.id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ===== TEMPLATES =====
  app.get("/api/templates", requireAuth, async (req, res) => {
    try {
      const userId = getCurrentUserId(req)!;
      const templates = await storage.getTemplatesByUser(userId);
      res.json(templates);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/templates/:id", requireAuth, async (req, res) => {
    try {
      const userId = getCurrentUserId(req)!;
      const template = await storage.getTemplate(req.params.id);
      if (!template) {
        return res.status(404).json({ error: "Template not found" });
      }
      if (template.userId !== userId) {
        return res.status(403).json({ error: "Access denied" });
      }
      res.json(template);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/templates", requireAuth, async (req, res) => {
    try {
      const userId = getCurrentUserId(req)!;
      const templateData = insertTemplateSchema.parse({ ...req.body, userId });
      const template = await storage.createTemplate(templateData);
      res.json(template);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.patch("/api/templates/:id", requireAuth, async (req, res) => {
    try {
      const userId = getCurrentUserId(req)!;
      const existing = await storage.getTemplate(req.params.id);
      
      if (!existing) {
        return res.status(404).json({ error: "Template not found" });
      }
      
      if (existing.userId !== userId) {
        return res.status(403).json({ error: "Access denied" });
      }
      
      // Simple validation - just check required fields
      const { templateName, subject, body, isActive } = req.body;
      
      if (templateName && typeof templateName !== 'string') {
        return res.status(400).json({ error: "Template name must be a string" });
      }
      
      if (subject && typeof subject !== 'string') {
        return res.status(400).json({ error: "Subject must be a string" });
      }
      
      if (body && typeof body !== 'string') {
        return res.status(400).json({ error: "Body must be a string" });
      }
      
      if (isActive !== undefined && typeof isActive !== 'boolean') {
        return res.status(400).json({ error: "isActive must be a boolean" });
      }
      
      const template = await storage.updateTemplate(req.params.id, req.body);
      res.json(template);
    } catch (error: any) {
      console.error('Template update error:', error);
      res.status(400).json({ error: error.message });
    }
  });

  app.delete("/api/templates/:id", requireAuth, async (req, res) => {
    try {
      const userId = getCurrentUserId(req)!;
      const existing = await storage.getTemplate(req.params.id);
      
      if (!existing) {
        return res.status(404).json({ error: "Template not found" });
      }
      
      if (existing.userId !== userId) {
        return res.status(403).json({ error: "Access denied" });
      }
      
      const deleted = await storage.deleteTemplate(req.params.id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ===== USER CONFIG =====
  app.get("/api/config", requireAuth, async (req, res) => {
    try {
      const userId = getCurrentUserId(req)!;
      let config = await storage.getUserConfig(userId);
      
      if (!config) {
        config = await storage.createUserConfig({ userId });
      }
      
      res.json(config);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.patch("/api/config", requireAuth, async (req, res) => {
    try {
      const userId = getCurrentUserId(req)!;
      const configData = req.body;
      
      // Convert workingDays array to comma-separated string if it's an array
      if (configData.workingDays && Array.isArray(configData.workingDays)) {
        configData.workingDays = configData.workingDays.join(',');
      }
      
      // Ensure numeric fields are properly converted
      if (configData.agentFrequencyHours !== undefined) {
        configData.agentFrequencyHours = parseFloat(configData.agentFrequencyHours);
      }
      if (configData.daysBetweenFollowups !== undefined) {
        configData.daysBetweenFollowups = parseInt(configData.daysBetweenFollowups);
      }
      if (configData.numberOfTouchpoints !== undefined) {
        configData.numberOfTouchpoints = parseInt(configData.numberOfTouchpoints);
      }
      
      const config = await storage.updateUserConfig(userId, configData);
      res.json(config);
    } catch (error: any) {
      console.error('Config update error:', error);
      res.status(400).json({ error: error.message });
    }
  });

  // ===== ACTIVITY LOGS =====
  app.get("/api/activities", requireAuth, async (req, res) => {
    try {
      const userId = getCurrentUserId(req)!;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
      const activities = await storage.getActivityLogsByUser(userId, limit);
      res.json(activities);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/activities/prospect/:prospectId", requireAuth, async (req, res) => {
    try {
      const userId = getCurrentUserId(req)!;
      // Verify prospect belongs to user
      const prospect = await storage.getProspect(req.params.prospectId);
      if (!prospect || prospect.userId !== userId) {
        return res.status(403).json({ error: "Access denied" });
      }
      
      const activities = await storage.getActivityLogsByProspect(req.params.prospectId);
      res.json(activities);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ===== EMAIL ACTIONS =====
  app.post("/api/prospects/:id/send-initial", requireAuth, async (req, res) => {
    try {
      const userId = getCurrentUserId(req)!;
      const prospect = await storage.getProspect(req.params.id);
      
      if (!prospect) {
        return res.status(404).json({ error: "Prospect not found" });
      }

      if (prospect.userId !== userId) {
        return res.status(403).json({ error: "Access denied" });
      }

      const user = await storage.getUser(userId);
      if (!user?.googleAccessToken) {
        return res.status(400).json({ error: "Google account not connected" });
      }

      // Start status transition: Drafting → Sending → Following up
      await storage.updateProspect(prospect.id, { status: '📝 Drafting next touch' });
      
      const template = await storage.getTemplateByName(userId, 'Initial');
      if (!template) {
        throw new Error("Initial template not found");
      }

      const subject = replaceTemplateVariables(template.subject, {
        externalCid: prospect.externalCid || '',
        contactName: prospect.contactName,
        companyName: prospect.companyName || '',
        contactTitle: prospect.contactTitle || '',
        industry: prospect.industry || '',
        yourName: user?.name || ''
      });

      const body = replaceTemplateVariables(template.body, {
        externalCid: prospect.externalCid || '',
        contactName: prospect.contactName,
        companyName: prospect.companyName || '',
        contactTitle: prospect.contactTitle || '',
        industry: prospect.industry || '',
        yourName: user?.name || ''
      });

      // Wait for dopaminic effect
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Move to sending state
      await storage.updateProspect(prospect.id, { status: '📤 Sending next touch' });

      const htmlBody = body.replace(/\n/g, '<br>');
      const result = await sendEmail(
        user.googleAccessToken,
        prospect.contactEmail,
        subject,
        htmlBody,
        undefined,
        user.googleRefreshToken || undefined
      );

      const threadLink = `https://mail.google.com/mail/u/0/#thread/${result.threadId}`;

      // Wait before final state
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Final state: Following up
      await storage.updateProspect(prospect.id, {
        status: 'Following up',
        threadId: result.threadId,
        threadLink: threadLink,
        touchpointsSent: 1,
        lastContactDate: new Date()
      });

      await storage.createActivityLog({
        userId,
        prospectId: prospect.id,
        action: 'Initial Email Sent',
        detail: `Email sent to ${prospect.contactEmail}`
      });

      res.json({ success: true, threadId: result.threadId });
    } catch (error: any) {
      const prospect = await storage.getProspect(req.params.id);
      if (prospect) {
        await storage.updateProspect(prospect.id, {
          status: `❌ Error: ${error.message}`
        });
      }
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/prospects/:id/send-followup", async (req, res) => {
    try {
      const userId = "temp-user-id";
      const prospect = await storage.getProspect(req.params.id);
      
      if (!prospect) {
        return res.status(404).json({ error: "Prospect not found" });
      }

      if (!prospect.threadId) {
        return res.status(400).json({ error: "No thread ID found" });
      }

      const nextTouchpoint = (prospect.touchpointsSent || 0) + 1;
      const templateName = getTemplateNameForTouchpoint(nextTouchpoint);
      await storage.updateProspect(prospect.id, {
        status: `🤖 Drafting ${templateName}...`
      });

      const template = await storage.getTemplateByName(userId, templateName);
      if (!template) {
        throw new Error(`${templateName} template not found`);
      }

      const user = await storage.getUser(userId);
      const body = replaceTemplateVariables(template.body, {
        externalCid: prospect.externalCid || '',
        contactName: prospect.contactName,
        companyName: prospect.companyName || '',
        contactTitle: prospect.contactTitle || '',
        industry: prospect.industry || '',
        yourName: user?.name || ''
      });

      const subject = replaceTemplateVariables(template.subject, {
        externalCid: prospect.externalCid || '',
        contactName: prospect.contactName,
        companyName: prospect.companyName || '',
        contactTitle: prospect.contactTitle || '',
        industry: prospect.industry || '',
        yourName: user?.name || ''
      });

      const htmlBody = body.replace(/\n/g, '<br>');
      await sendEmail(prospect.contactEmail, subject, htmlBody, prospect.threadId);

      await storage.updateProspect(prospect.id, {
        status: 'Following up',
        touchpointsSent: nextTouchpoint,
        lastContactDate: new Date()
      });

      await storage.createActivityLog({
        userId,
        prospectId: prospect.id,
        action: `Follow-up #${nextTouchpoint}`,
        detail: `Follow-up sent to ${prospect.contactEmail}`
      });

      res.json({ success: true });
    } catch (error: any) {
      const prospect = await storage.getProspect(req.params.id);
      if (prospect) {
        await storage.updateProspect(prospect.id, {
          status: `❌ Follow-up Error: ${error.message}`
        });
      }
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/prospects/:id/analyze-response", async (req, res) => {
    try {
      const userId = "temp-user-id";
      const prospect = await storage.getProspect(req.params.id);
      
      if (!prospect || !prospect.threadId) {
        return res.status(404).json({ error: "Prospect or thread not found" });
      }

      await storage.updateProspect(prospect.id, { status: '🧐 Analyzing response...' });

      const messages = await getThreadMessages(prospect.threadId);
      if (messages.length === 0) {
        throw new Error("No messages found in thread");
      }

      const lastMessage = messages[messages.length - 1];
      const from = lastMessage.payload?.headers?.find((h: any) => h.name.toLowerCase() === 'from')?.value || '';

      if (from.toLowerCase().includes('mailer-daemon') || from.toLowerCase().includes('postmaster')) {
        await storage.updateProspect(prospect.id, { status: 'Bounce - Invalid Email' });
        await storage.createActivityLog({
          userId,
          prospectId: prospect.id,
          action: 'Bounce Response',
          detail: 'Automatic bounce message detected'
        });
        return res.json({ classification: 'BOUNCE' });
      }

      const body = await getMessageBody(lastMessage);
      const classification = await classifyResponse(body);

      let newStatus = '';
      switch (classification.category) {
        case 'INTERESTED':
          newStatus = '✅ Interested - Schedule!';
          break;
        case 'NOT_INTERESTED':
          newStatus = '❌ Not Interested';
          break;
        case 'REFERRAL':
          // Pause sequence; user will handle referral manually
          newStatus = classification.referredEmail
            ? `🤝 Referred to ${classification.referredEmail}`
            : '🤝 Referral (Email not found)';
          break;
        case 'BOUNCE':
          newStatus = 'Bounce - Invalid Email';
          break;
        case 'WRONG_EMAIL':
          newStatus = '🤷‍♂️ Wrong Email';
          break;
        case 'OUT_OF_OFFICE':
          newStatus = 'Contact is OOO, manual FUP';
          break;
        case 'SIMPLE_QUESTION':
          newStatus = '❓ Question / Neutral';
          break;
      }

      await storage.updateProspect(prospect.id, {
        status: newStatus,
        suggestedDays: classification.suggestedDays?.join(', '),
        suggestedTime: classification.suggestedTime,
        suggestedWeek: classification.suggestedWeek
      });

      await storage.createActivityLog({
        userId,
        prospectId: prospect.id,
        action: 'Response Analysis',
        detail: `Classification: ${classification.category}`
      });

      res.json(classification);
    } catch (error: any) {
      const prospect = await storage.getProspect(req.params.id);
      if (prospect) {
        await storage.updateProspect(prospect.id, {
          status: `❌ Analysis Error: ${error.message}`
        });
      }
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/prospects/:id/schedule-meeting", async (req, res) => {
    try {
      const userId = "temp-user-id";
      const prospect = await storage.getProspect(req.params.id);
      
      if (!prospect) {
        return res.status(404).json({ error: "Prospect not found" });
      }

      await storage.updateProspect(prospect.id, { status: '🤖 Creating event...' });

      const config = await storage.getUserConfig(userId);
      const user = await storage.getUser(userId);
      
      if (!config) {
        throw new Error("User configuration not found");
      }

      const workStartHour = parseInt(config.searchStartTime?.split(':')[0] || '9');
      const workEndHour = parseInt(config.searchEndTime?.split(':')[0] || '17');

      let searchStartDate = new Date();
      searchStartDate.setHours(searchStartDate.getHours() + 24);
      
      const minutes = searchStartDate.getMinutes();
      if (minutes > 30) {
        searchStartDate.setHours(searchStartDate.getHours() + 1);
        searchStartDate.setMinutes(0, 0, 0);
      } else if (minutes > 0) {
        searchStartDate.setMinutes(30, 0, 0);
      }

      const searchEndDate = new Date(searchStartDate);
      searchEndDate.setDate(searchEndDate.getDate() + 30);

      const availableSlots = await getAvailableSlots(
        searchStartDate,
        searchEndDate,
        workStartHour,
        workEndHour,
        user?.timezone || 'America/Mexico_City'
      );

      const preferredDays = prospect.suggestedDays?.split(',').map(d => d.trim());
      const selectedSlot = findNextAvailableSlot(
        availableSlots,
        preferredDays,
        prospect.suggestedTime || undefined,
        prospect.suggestedWeek || undefined
      );

      if (!selectedSlot) {
        throw new Error("No available slots found in the configured time range");
      }

      const endTime = new Date(selectedSlot.getTime() + 30 * 60000);

      // Get the sequence for this prospect to use its meeting templates
      const sequence = prospect.sequenceId 
        ? await storage.getSequence(prospect.sequenceId)
        : await storage.getDefaultSequence(userId);
      
      // Use sequence meeting templates if available, otherwise fall back to config
      const meetingTitle = sequence?.meetingTitle || config.meetingTitle || '${companyName} & ${yourName}';
      const meetingDescription = sequence?.meetingDescription || config.meetingDescription || '';

      const title = replaceTemplateVariables(meetingTitle, {
        externalCid: prospect.externalCid || '',
        contactName: prospect.contactName,
        companyName: prospect.companyName || '',
        contactTitle: prospect.contactTitle || '',
        industry: prospect.industry || '',
        yourName: user?.name || ''
      });

      const description = replaceTemplateVariables(meetingDescription, {
        externalCid: prospect.externalCid || '',
        contactName: prospect.contactName,
        companyName: prospect.companyName || '',
        contactTitle: prospect.contactTitle || '',
        industry: prospect.industry || '',
        yourName: user?.name || ''
      });

      await scheduleMeeting({
        attendeeEmail: prospect.contactEmail,
        title: title || `${prospect.companyName || 'Meeting'} & Google`,
        description: description || '',
        startTime: selectedSlot,
        endTime: endTime
      });

      await storage.updateProspect(prospect.id, {
        status: '✅ Meeting Scheduled 🗓️',
        threadLink: 'Check Calendar'
      });

      await storage.createActivityLog({
        userId,
        prospectId: prospect.id,
        action: 'Meeting Scheduled',
        detail: `Meeting created with ${prospect.contactEmail} at ${selectedSlot.toLocaleTimeString()}`
      });

      res.json({ success: true, scheduledTime: selectedSlot });
    } catch (error: any) {
      const prospect = await storage.getProspect(req.params.id);
      if (prospect) {
        await storage.updateProspect(prospect.id, {
          status: `❌ Scheduling Error: ${error.message}`
        });
      }
      res.status(500).json({ error: error.message });
    }
  });

  // ===== DASHBOARD STATS =====
  app.get("/api/stats", requireAuth, async (req, res) => {
    try {
      const userId = getCurrentUserId(req)!;
      const prospects = await storage.getProspectsByUser(userId);
      
      const stats = {
        totalProspects: prospects.length,
        activeSequences: prospects.filter(p => p.sendSequence && p.status === 'Following up').length,
        interested: prospects.filter(p => p.status?.includes('Interested')).length,
        scheduled: prospects.filter(p => p.status?.includes('Meeting Scheduled')).length,
        notInterested: prospects.filter(p => p.status?.includes('Not Interested')).length,
        bounced: prospects.filter(p => p.status?.includes('Bounce')).length
      };
      
      res.json(stats);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ===== AUTOMATION AGENT =====
  app.post("/api/agent/run", requireAuth, async (req, res) => {
    try {
      const userId = getCurrentUserId(req)!;
      const result = await runAgent(userId);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ===== ENGINE STATUS ENDPOINTS =====
  app.get("/api/engine/status", async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      const activeUsers = users.filter(u => u.googleAccessToken);
      
      res.json({
        status: "running",
        activeUsers: activeUsers.length,
        totalUsers: users.length,
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/engine/health", async (req, res) => {
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'rafagent-engine'
    });
  });

  // ===== SEQUENCES =====
  app.get("/api/sequences", requireAuth, async (req, res) => {
    try {
      const userId = getCurrentUserId(req)!;
      const sequences = await storage.getSequencesByUser(userId);
      res.json(sequences);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/sequences/:id", requireAuth, async (req, res) => {
    try {
      const sequence = await storage.getSequence(req.params.id);
      if (!sequence) {
        return res.status(404).json({ error: "Sequence not found" });
      }
      res.json(sequence);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/sequences/:id/templates", requireAuth, async (req, res) => {
    try {
      const templates = await storage.getTemplatesBySequence(req.params.id);
      res.json(templates);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/sequences", requireAuth, async (req, res) => {
    try {
      const userId = getCurrentUserId(req)!;
      const sequenceData = insertSequenceSchema.parse({
        ...req.body,
        userId,
        isDefault: false
      });
      const sequence = await storage.createSequence(sequenceData);
      
      // Create default templates for this sequence
      const templateNames = ['Initial', 'Second Touch', 'Third Touch', 'Fourth Touch'];
      for (let i = 0; i < templateNames.length; i++) {
        await storage.createTemplate({
          userId,
          sequenceId: sequence.id,
          templateName: templateNames[i],
          subject: i === 0 ? `Quick intro about ${req.body.name}` : '', // Only Initial has subject
          body: `This is the ${templateNames[i]} template for ${req.body.name} sequence.\n\nEdit this template to customize your message.`,
          isActive: true,
          orderIndex: i
        });
      }
      
      res.json(sequence);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.patch("/api/sequences/:id", requireAuth, async (req, res) => {
    try {
      const sequence = await storage.updateSequence(req.params.id, req.body);
      if (!sequence) {
        return res.status(404).json({ error: "Sequence not found" });
      }
      res.json(sequence);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.delete("/api/sequences/:id", requireAuth, async (req, res) => {
    try {
      const sequence = await storage.getSequence(req.params.id);
      if (!sequence) {
        return res.status(404).json({ error: "Sequence not found" });
      }
      if (sequence.isDefault) {
        return res.status(400).json({ error: "Cannot delete default sequence" });
      }
      await storage.deleteSequence(req.params.id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/sequences/:id/clone", requireAuth, async (req, res) => {
    try {
      const userId = getCurrentUserId(req)!;
      const { name } = req.body;
      if (!name) {
        return res.status(400).json({ error: "Name is required" });
      }
      const newSequence = await storage.cloneSequence(req.params.id, userId, name);
      res.json(newSequence);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ===== ANALYTICS =====
  app.get("/api/analytics", requireAuth, async (req, res) => {
    try {
      const userId = getCurrentUserId(req)!;
      const analytics = await storage.getAnalytics(userId);
      res.json(analytics);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Pixel tracking endpoint for email opens
  app.get("/api/pixel/:prospectId", async (req, res) => {
    try {
      const { prospectId } = req.params;
      const prospect = await storage.getProspect(prospectId);
      
      if (prospect && !prospect.emailOpened) {
        await storage.updateProspect(prospectId, {
          emailOpened: true,
          emailOpenedAt: new Date()
        });
        console.log(`Email opened by prospect: ${prospect.contactEmail}`);
      }
      
      // Return 1x1 transparent pixel
      const pixel = Buffer.from(
        'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
        'base64'
      );
      res.writeHead(200, {
        'Content-Type': 'image/gif',
        'Content-Length': pixel.length,
        'Cache-Control': 'no-store, no-cache, must-revalidate, private',
        'Pragma': 'no-cache'
      });
      res.end(pixel);
    } catch (error: any) {
      console.error('Pixel tracking error:', error);
      // Still return pixel even on error
      const pixel = Buffer.from(
        'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
        'base64'
      );
      res.writeHead(200, { 'Content-Type': 'image/gif' });
      res.end(pixel);
    }
  });

  // ===== DIAGNOSTIC ENDPOINTS =====
  app.post("/api/diagnostic/create-defaults", requireAuth, async (req, res) => {
    try {
      const userId = getCurrentUserId(req)!;
      console.log(`Creating default sequences and templates for user ${userId}`);
      
      // Create default templates and config
      await createDefaultTemplates(userId);
      await createDefaultUserConfig(userId);
      
      res.json({ 
        success: true, 
        message: 'Default sequences and templates created successfully' 
      });
    } catch (error: any) {
      console.error('Error creating defaults:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // ===== BULK IMPORT =====
  app.post("/api/prospects/bulk", requireAuth, async (req, res) => {
    try {
      const userId = getCurrentUserId(req)!;
      const { prospects: prospectsData, sequenceId } = req.body;
      
      if (!Array.isArray(prospectsData) || prospectsData.length === 0) {
        return res.status(400).json({ error: "Invalid prospects data" });
      }

      if (!sequenceId) {
        return res.status(400).json({ error: "Sequence ID is required" });
      }

      const createdProspects = [];
      const errors = [];

      for (const prospectData of prospectsData) {
        try {
          const prospect = insertProspectSchema.parse({
            userId,
            sequenceId: sequenceId,
            contactName: prospectData.contactName,
            contactEmail: prospectData.contactEmail,
            companyName: prospectData.companyName || null,
            contactTitle: prospectData.contactTitle || null,
            industry: prospectData.industry || null,
            externalCid: prospectData.externalCid || null,
            sendSequence: false // User must activate manually
          });
          
          const created = await storage.createProspect(prospect);
          createdProspects.push(created);
        } catch (error: any) {
          errors.push({
            email: prospectData.contactEmail,
            error: error.message
          });
        }
      }

      res.json({
        success: true,
        created: createdProspects.length,
        errors: errors.length,
        errorDetails: errors
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
