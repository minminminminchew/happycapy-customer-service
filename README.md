# HappyCapy Discord Customer Service Bot

🤖 Automated Discord customer service bot for HappyCapy, powered by Claude Code.

This bot provides intelligent, context-aware responses to customer inquiries in Discord, using AI to understand questions and generate helpful answers about HappyCapy products and features.

---

## ✨ Features

- 🌍 **Bilingual Support** - Auto-detects and responds in Chinese or English
- 💬 **Real-time Responses** - Monitors Discord channels and auto-responds to customer questions
- 🧠 **Intelligent AI** - Uses Claude Code skill with comprehensive product knowledge
- 📝 **Discord Formatting** - Properly formatted messages with code blocks, bold, emoji, etc.
- ⚡ **Fast & Reliable** - Typical response time: 2-5 seconds
- 🛠️ **Easy to Customize** - Update product knowledge by editing SKILL.md
- 🔒 **Secure** - Environment-based configuration, no hardcoded secrets

---

## 🚀 Quick Start

**New to Discord bots? Start here:** [📖 Discord 接入完整指南](./DISCORD_SETUP.md)

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env
# Edit .env and add your DISCORD_BOT_TOKEN and ANTHROPIC_API_KEY
```

### 3. Install Claude Code Skill
```bash
npm run install-skill
```

### 4. Start the Bot
```bash
npm start
```

**Need help?** See:
- [DISCORD_SETUP.md](./DISCORD_SETUP.md) - Complete Discord integration guide
- [QUICKSTART.md](./QUICKSTART.md) - 5-minute automated setup
- [SETUP.md](./SETUP.md) - Detailed technical setup

---

## 📁 Files

- **`discord-bot.js`** - Main bot script (Discord.js + Claude Code integration)
- **`SKILL.md`** - AI skill definition with product knowledge and response guidelines
- **`quick-reference.md`** - Quick reference for common support scenarios
- **`SETUP.md`** - Complete setup guide with troubleshooting
- **`package.json`** - Node.js dependencies and scripts
- **`.env.example`** - Environment variable template

---

## 🎯 How It Works

```
1. User posts message in Discord
   ↓
2. Bot detects message via Discord.js
   ↓
3. Message passed to Claude Code skill
   ↓
4. AI generates intelligent response using SKILL.md knowledge
   ↓
5. Bot sends response back to Discord channel
```

The bot uses the **happycapy-discord-service** Claude Code skill to generate responses. This skill contains:
- Complete HappyCapy product knowledge
- Pricing information
- Technical troubleshooting guides
- Response tone and formatting guidelines
- Common customer scenarios and solutions

---

## 🔧 Configuration

### Environment Variables

Create a `.env` file with these variables:

```env
# Required
DISCORD_BOT_TOKEN=your_discord_bot_token

# Optional
DISCORD_SUPPORT_CHANNEL_ID=  # Restrict to specific channel
DISCORD_BOT_PREFIX=!         # Command prefix
AUTO_RESPOND=true            # Auto-respond to all messages
```

### Bot Commands

- `!help` - Show help message
- `!ping` - Check if bot is online
- Just ask naturally - bot auto-responds to questions!

---

## 📚 Customization

### Update Product Knowledge

Edit `SKILL.md` to update:
- Product features and pricing
- Technical troubleshooting steps
- Response tone and guidelines
- Common scenarios and templates

Then reinstall the skill:
```bash
npm run install-skill
```

### Modify Bot Behavior

Edit `discord-bot.js` to:
- Change message filtering logic
- Add custom commands
- Modify response formatting
- Integrate with other services

---

## 🐛 Troubleshooting

### Bot doesn't respond
1. Check bot is online: `!ping`
2. Verify `DISCORD_BOT_TOKEN` in `.env`
3. Ensure bot has "Read Messages" and "Send Messages" permissions
4. Check logs for errors

### "Missing Intents" error
Enable "MESSAGE CONTENT INTENT" in Discord Developer Portal:
- https://discord.com/developers/applications
- Your App → Bot tab → Privileged Gateway Intents

### Response is incorrect
1. Update `SKILL.md` with correct information
2. Run `npm run install-skill`
3. Restart the bot

See [SETUP.md](./SETUP.md) for more troubleshooting help.

---

## 🚢 Production Deployment

### Using PM2
```bash
npm install -g pm2
pm2 start discord-bot.js --name happycapy-bot
pm2 startup
pm2 save
```

### Using Docker
```bash
docker build -t happycapy-discord-bot .
docker run -d --env-file .env --name happycapy-bot happycapy-discord-bot
```

### Cloud Platforms
Deploy to Railway, Render, Heroku, AWS, etc. See [SETUP.md](./SETUP.md) for details.

---

## 📖 About HappyCapy

**HappyCapy** is an agent-native computer that runs in the browser, powered by Claude Code.

- 🎨 Generate images and videos
- 📄 Process documents (Word, Excel, PPT, PDF)
- 🌐 Build websites and apps
- 📚 Write papers and reports
- ⚡ Automate workflows

**No technical knowledge required** - just describe what you need and Capy does it.

### Pricing Plans

| Plan | Price | Claude Code | Models | Sandbox |
|------|-------|-------------|--------|---------|
| Free | $0 | Limited | Basic | Basic |
| Pro | $17/mo | 2,000 credits/mo | 150+ via skills | 2c/4GB/50GB |
| Max | $167/mo | Unlimited | Unlimited | 4c/8GB/200GB |

### Community

- **Discord:** https://discord.gg/N3vdDbvsF8
- **Website:** https://happycapy.ai/
- **Walkthrough:** https://calendly.com/trickle-booking/happycapy-walkthrough

---

## 📄 License

MIT License - feel free to use and modify for your needs.

---

## 🤝 Contributing

Contributions welcome! Feel free to:
- Report bugs via GitHub Issues
- Submit feature requests
- Open pull requests
- Share your improvements

---

## 🙋 Support

- **Bot Issues:** Open an issue on GitHub
- **HappyCapy Questions:** https://discord.gg/N3vdDbvsF8
- **Discord.js Help:** https://discord.js.org/

---

## 🎉 Credits

Built with:
- [Discord.js](https://discord.js.org/) - Discord bot framework
- [Claude Code](https://www.anthropic.com/) - AI-powered customer service
- [Node.js](https://nodejs.org/) - Runtime environment

Maintained by the HappyCapy team 🐾

---

**Ready to get started?** Check out [SETUP.md](./SETUP.md) for detailed instructions!
