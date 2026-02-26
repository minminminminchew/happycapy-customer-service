# Setup Guide for HappyCapy Discord Bot

Complete setup instructions for the automated Discord customer service bot.

## Prerequisites

- Node.js 18+ installed
- Discord account with server admin permissions
- Claude Code installed (for skill integration)
- Git (for cloning the repository)

---

## Step 1: Create Discord Bot

### 1.1 Go to Discord Developer Portal
Visit: https://discord.com/developers/applications

### 1.2 Create New Application
1. Click "New Application"
2. Name it "HappyCapy Support Bot" (or your preferred name)
3. Click "Create"

### 1.3 Create Bot User
1. Go to "Bot" tab in left sidebar
2. Click "Add Bot" → "Yes, do it!"
3. Under "Token" section, click "Reset Token" and copy it
   - ⚠️ **IMPORTANT:** Save this token securely, you'll need it later
   - Never share your bot token publicly

### 1.4 Configure Bot Permissions
Scroll down to "Privileged Gateway Intents" and enable:
- ✅ MESSAGE CONTENT INTENT
- ✅ SERVER MEMBERS INTENT (optional, for better user tracking)

### 1.5 Get Bot Invite Link
1. Go to "OAuth2" → "URL Generator"
2. Select scopes:
   - `bot`
   - `applications.commands`
3. Select bot permissions:
   - `Send Messages`
   - `Read Messages/View Channels`
   - `Read Message History`
   - `Embed Links`
   - `Attach Files`
   - `Add Reactions`
   - `Use Slash Commands`
4. Copy the generated URL at the bottom
5. Open the URL in your browser and invite the bot to your server

---

## Step 2: Install the Skill

### 2.1 Clone the Repository
```bash
git clone https://github.com/minminminminchew/happycapy-discord-service.git
cd happycapy-discord-service
```

### 2.2 Install Skill to Claude Code
```bash
npm run install-skill
```

Or manually:
```bash
mkdir -p ~/.claude/skills/happycapy-discord-service
cp SKILL.md quick-reference.md ~/.claude/skills/happycapy-discord-service/
```

### 2.3 Verify Installation
Check that the skill is installed:
```bash
ls ~/.claude/skills/happycapy-discord-service/
```

You should see `SKILL.md` and `quick-reference.md`.

---

## Step 3: Install Bot Dependencies

```bash
npm install
```

This will install:
- `discord.js` - Discord bot framework
- `dotenv` - Environment variable management

---

## Step 4: Configure Environment

### 4.1 Create `.env` File
```bash
cp .env.example .env
```

### 4.2 Edit `.env` File
Open `.env` in your text editor and configure:

```env
# Required: Your Discord bot token from Step 1.3
DISCORD_BOT_TOKEN=your_discord_bot_token_here

# Optional: Specific support channel ID
# To get channel ID: Right-click channel → "Copy Channel ID"
# (Enable "Developer Mode" in Discord Settings → Advanced)
DISCORD_SUPPORT_CHANNEL_ID=1234567890123456789

# Optional: Command prefix (default: !)
DISCORD_BOT_PREFIX=!

# Optional: Auto-respond to all messages (default: true)
# Set to 'false' to only respond when bot is mentioned
AUTO_RESPOND=true
```

### 4.3 Get Channel ID (Optional)
If you want to restrict the bot to a specific support channel:

1. Enable Developer Mode in Discord:
   - Settings → Advanced → Developer Mode (toggle on)
2. Right-click your support channel
3. Click "Copy Channel ID"
4. Paste the ID in `.env` for `DISCORD_SUPPORT_CHANNEL_ID`

---

## Step 5: Test the Bot

### 5.1 Start the Bot
```bash
npm start
```

You should see:
```
🚀 Starting HappyCapy Discord bot...
✅ Bot logged in as HappyCapy Support Bot#1234
📢 Auto-respond: ENABLED
📍 Monitoring: All channels and DMs
🤖 Bot is ready to help customers!
```

### 5.2 Test in Discord
Go to your Discord server and type:
```
!ping
```

The bot should respond with:
```
🏓 Pong! Bot is online.
```

### 5.3 Test Customer Service
Ask a question:
```
How much does HappyCapy cost?
```

The bot should generate an intelligent response about HappyCapy pricing.

---

## Step 6: Production Deployment (Optional)

For 24/7 operation, deploy to a server or cloud service.

### Option A: PM2 (Process Manager)
```bash
# Install PM2
npm install -g pm2

# Start bot with PM2
pm2 start discord-bot.js --name happycapy-bot

# View logs
pm2 logs happycapy-bot

# Auto-start on system reboot
pm2 startup
pm2 save
```

### Option B: Docker
Create `Dockerfile`:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
CMD ["node", "discord-bot.js"]
```

Build and run:
```bash
docker build -t happycapy-discord-bot .
docker run -d --env-file .env --name happycapy-bot happycapy-discord-bot
```

### Option C: Cloud Platforms
Deploy to:
- **Railway.app** - Simple, git-based deployment
- **Render.com** - Free tier available
- **Heroku** - Classic PaaS option
- **AWS EC2 / Google Cloud / Azure** - Full control

---

## Troubleshooting

### Bot doesn't respond
1. **Check bot is online:**
   ```
   !ping
   ```
   If no response, check logs for errors.

2. **Check permissions:**
   - Bot needs "Read Messages" and "Send Messages" permissions
   - Check channel-specific permissions

3. **Check configuration:**
   - Verify `DISCORD_BOT_TOKEN` is correct
   - Check `DISCORD_SUPPORT_CHANNEL_ID` if set

4. **Check logs:**
   ```bash
   # If running with npm start
   # Logs show in terminal

   # If running with PM2
   pm2 logs happycapy-bot
   ```

### Bot responds but message is wrong
1. **Update skill knowledge:**
   Edit `SKILL.md` to update product info, then reinstall:
   ```bash
   npm run install-skill
   ```

2. **Check skill is loaded:**
   ```bash
   ls ~/.claude/skills/happycapy-discord-service/
   ```

### "Missing Intents" error
Enable "MESSAGE CONTENT INTENT" in Discord Developer Portal:
1. Go to https://discord.com/developers/applications
2. Select your app → Bot tab
3. Enable "MESSAGE CONTENT INTENT"

### Rate limiting issues
If bot gets rate-limited, it will automatically handle retries. Consider:
- Reducing response frequency
- Using queue system for high-volume channels

---

## Updating the Bot

### Update skill content
```bash
git pull origin main
npm run install-skill
# Restart bot if running
```

### Update bot code
```bash
git pull origin main
npm install
# Restart bot
pm2 restart happycapy-bot  # if using PM2
# or
npm start  # if running directly
```

---

## Security Best Practices

1. **Never commit `.env` file** - Already in `.gitignore`
2. **Rotate bot token** if compromised
3. **Use environment variables** for all secrets
4. **Restrict channel access** - Use `DISCORD_SUPPORT_CHANNEL_ID`
5. **Monitor bot activity** - Check logs regularly
6. **Update dependencies** regularly:
   ```bash
   npm update
   ```

---

## Support

For issues with:
- **Bot setup:** Check this guide or open an issue on GitHub
- **HappyCapy product:** https://discord.gg/N3vdDbvsF8
- **Discord.js:** https://discord.js.org/

---

## Architecture Overview

```
Discord Message
    ↓
Discord.js Bot (discord-bot.js)
    ↓
Claude Code Skill (happycapy-discord-service)
    ↓
Response Generation (using SKILL.md knowledge)
    ↓
Discord Message Reply
```

The bot listens for messages, passes them to the Claude Code skill, and sends the AI-generated response back to Discord.

---

## Next Steps

1. ✅ Bot is running and responding
2. Customize `SKILL.md` for your specific needs
3. Set up monitoring and logging
4. Deploy to production server
5. Train team on how to update bot knowledge

Happy bot building! 🚀
