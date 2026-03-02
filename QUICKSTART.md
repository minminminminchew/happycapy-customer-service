# 快速开始 - 全自动 Discord 客服 Bot

这是一个**完全自动化**的 Discord 客服机器人，可以：

- ✅ 监听 Discord 消息（@mention 或指定频道）
- ✅ 自动调用 Claude API + Skill 生成智能回复
- ✅ 直接回复 Discord 用户
- ✅ 支持中英文双语
- ✅ 使用 Discord Markdown 格式

---

## 工作流程

```
Discord 用户发送消息
    ↓
Bot 检测到消息 (mention 或指定频道)
    ↓
调用 Claude API + happycapy-discord-service skill
    ↓
Claude 生成客服回复
    ↓
Bot 自动发送回复到 Discord
```

---

## 快速设置（5 分钟）

### 1. 获取 Discord Bot Token

1. 访问：https://discord.com/developers/applications
2. 创建新应用 → 创建 Bot
3. 复制 Bot Token
4. 开启 "MESSAGE CONTENT INTENT"

### 2. 获取 Anthropic API Key

1. 访问：https://console.anthropic.com/
2. 创建 API Key
3. 复制 API Key

### 3. 配置环境变量

```bash
cp .env.example .env
nano .env
```

填入：
```env
DISCORD_BOT_TOKEN=你的_discord_bot_token
ANTHROPIC_API_KEY=你的_anthropic_api_key
AUTO_RESPOND=true
```

### 4. 安装依赖

```bash
npm install
```

### 5. 安装 Skill

```bash
npm run install-skill
```

### 6. 启动 Bot

```bash
npm start
```

期望输出：
```
🚀 Starting HappyCapy Discord bot...
═══════════════════════════════════════════════
✅ HappyCapy Discord Bot is ONLINE
═══════════════════════════════════════════════
🤖 Bot: HappyCapy Support Bot#1234
📢 Auto-respond: ENABLED
📍 Monitoring: All channels
🧠 AI Model: claude-3-5-sonnet-20241022
💬 Skill: happycapy-discord-service
═══════════════════════════════════════════════
🎉 Ready to help customers!
```

---

## 使用方式

### 在 Discord 中测试

#### 方式 1: 直接提问（如果开启 AUTO_RESPOND）
```
How much does HappyCapy cost?
```

Bot 自动回复。

#### 方式 2: @mention Bot
```
@HappyCapyBot HappyCapy 的 Max 计划多少钱？
```

Bot 自动回复。

#### 方式 3: 使用命令
```
!help
!ping
```

---

## 配置选项

### 环境变量

| 变量 | 说明 | 必需 |
|------|------|------|
| `DISCORD_BOT_TOKEN` | Discord bot token | ✅ 必需 |
| `ANTHROPIC_API_KEY` | Anthropic API key | ✅ 必需 |
| `DISCORD_SUPPORT_CHANNEL_ID` | 限制到指定频道 | 可选 |
| `AUTO_RESPOND` | 自动回复所有消息 | 可选 (默认 false) |
| `DISCORD_BOT_PREFIX` | 命令前缀 | 可选 (默认 !) |

### 响应模式

**模式 1: Auto-respond（自动回复所有消息）**
```env
AUTO_RESPOND=true
```
Bot 会回复监控频道中的所有消息。

**模式 2: Mention-only（仅 @mention 时回复）**
```env
AUTO_RESPOND=false
```
Bot 只在被 @mention 时回复。推荐用于活跃的频道。

**模式 3: 指定频道**
```env
DISCORD_SUPPORT_CHANNEL_ID=1234567890123456789
AUTO_RESPOND=true
```
Bot 只在指定频道自动回复。

---

## 测试用例

### 测试 1: 基础命令
```
!ping
```
期望：`🏓 Pong! Latency: 123ms`

### 测试 2: 中文定价问题
```
@Bot Pro 计划多少钱？
```
期望：生成中文回复，包含定价信息和 emoji。

### 测试 3: 英文技术问题
```
Why am I getting API 400 error?
```
期望：生成英文回复，解释问题和解决方案。

### 测试 4: 功能咨询
```
@Bot 可以做什么？
```
期望：列举 HappyCapy 功能，简洁明了。

---

## 架构说明

### 文件说明

- **`discord-bot-auto.js`** - 全自动版本（推荐）
  - 直接调用 Anthropic API
  - 加载 skill 内容作为 system prompt
  - 完全自动化，无需人工干预

- **`discord-bot.js`** - 基础版本
  - 尝试调用 Claude CLI
  - 适合本地开发测试

### 工作原理

1. **Bot 启动**
   - 加载 `~/.claude/skills/happycapy-discord-service/SKILL.md`
   - 连接到 Discord
   - 连接到 Anthropic API

2. **消息处理**
   - Discord 用户发送消息
   - Bot 检测是否应该响应（mention/channel/auto-respond）
   - 构造 prompt：system (skill) + user (问题)
   - 调用 Claude API 生成回复
   - 发送回复到 Discord

3. **Skill 集成**
   - Skill 内容作为 Claude 的 system prompt
   - Claude 遵循 skill 中的指南生成回复
   - 包含产品知识、语气、格式等

---

## 常见问题

### Bot 不回复消息

**检查清单：**
1. Bot 是否在线？运行 `!ping`
2. MESSAGE CONTENT INTENT 是否开启？
3. AUTO_RESPOND 是否设置正确？
4. Bot 是否有消息权限？

### 回复内容不准确

**解决方案：**
1. 编辑 `SKILL.md` 更新知识库
2. 运行 `npm run install-skill`
3. 重启 bot：`npm start`

### API 费用担心

**说明：**
- Claude API 按 token 计费
- 每次回复约 1000-2000 tokens
- 估算：$0.003 - $0.015 per response
- 可以设置 `AUTO_RESPOND=false` 减少费用

### 想要更快的响应

**优化方案：**
1. 使用 `claude-3-haiku` 模型（更快更便宜）
2. 编辑 `discord-bot-auto.js`，修改 `claudeModel`
3. 重启 bot

---

## 进阶配置

### 限制到特定频道

```env
DISCORD_SUPPORT_CHANNEL_ID=1234567890123456789
AUTO_RESPOND=true
```

如何获取频道 ID：
1. Discord 设置 → 高级 → 开启开发者模式
2. 右键频道 → 复制频道 ID

### 使用不同的 Claude 模型

编辑 `discord-bot-auto.js`:
```javascript
claudeModel: 'claude-3-haiku-20240307', // 更快更便宜
// 或
claudeModel: 'claude-opus-4-20250514', // 最强大
```

### 自定义命令

编辑 `discord-bot-auto.js` 中的命令处理部分，添加新命令。

---

## 生产部署

### 使用 PM2（推荐）

```bash
npm install -g pm2
pm2 start npm --name "happycapy-bot" -- start
pm2 startup
pm2 save
```

### 使用 Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run install-skill
CMD ["npm", "start"]
```

构建和运行：
```bash
docker build -t happycapy-discord-bot .
docker run -d --env-file .env --name happycapy-bot happycapy-discord-bot
```

### 云平台

支持部署到：
- Railway.app
- Render.com
- Heroku
- AWS EC2 / Google Cloud / Azure

---

## 更新 Bot

### 更新知识库

```bash
# 编辑 SKILL.md
nano SKILL.md

# 重新安装
npm run install-skill

# 重启 bot
pm2 restart happycapy-bot
```

### 更新代码

```bash
git pull
npm install
npm run install-skill
pm2 restart happycapy-bot
```

---

## 监控和日志

### 查看日志

```bash
# 实时日志
pm2 logs happycapy-bot

# 查看最近日志
pm2 logs happycapy-bot --lines 100
```

### 监控

```bash
pm2 monit
```

---

## 技术支持

- **问题报告:** GitHub Issues
- **HappyCapy 社区:** https://discord.gg/N3vdDbvsF8
- **文档:** 查看 SETUP.md 和 TEST.md

---

## 总结

你现在有一个**完全自动化**的 Discord 客服机器人：

1. ✅ 自动监听 Discord 消息
2. ✅ 自动调用 Claude + Skill 生成回复
3. ✅ 自动发送回复给用户
4. ✅ 支持双语、格式化、emoji
5. ✅ 可定制、可扩展

**立即开始：**
```bash
npm install
npm run install-skill
cp .env.example .env
# 编辑 .env 添加 tokens
npm start
```

🎉 享受自动化客服！
