# 系统架构说明

## 整体架构

```
┌─────────────────────────────────────────────────────────────────┐
│                        Discord Server                           │
│  ┌──────────────┐         ┌──────────────┐                     │
│  │   User 1     │         │   User 2     │                     │
│  │ "How much    │         │ "@Bot help"  │                     │
│  │  does it     │         │              │                     │
│  │  cost?"      │         │              │                     │
│  └──────┬───────┘         └──────┬───────┘                     │
│         │                        │                              │
│         └────────────┬───────────┘                              │
└──────────────────────┼──────────────────────────────────────────┘
                       │
                       │ Discord Gateway
                       │
                       ▼
┌──────────────────────────────────────────────────────────────────┐
│              discord-bot-auto.js (Node.js)                       │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Message Handler                                           │ │
│  │  - Detect mentions                                         │ │
│  │  - Filter channels                                         │ │
│  │  - Check AUTO_RESPOND setting                             │ │
│  └───────────────────┬────────────────────────────────────────┘ │
│                      │                                           │
│                      ▼                                           │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Skill Loader                                              │ │
│  │  - Load ~/.claude/skills/happycapy-discord-service/       │ │
│  │  - Read SKILL.md content                                   │ │
│  └───────────────────┬────────────────────────────────────────┘ │
│                      │                                           │
│                      ▼                                           │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Response Generator                                        │ │
│  │  - Construct system prompt (skill content)                │ │
│  │  - Construct user prompt (customer message)               │ │
│  │  - Call Anthropic API                                     │ │
│  └───────────────────┬────────────────────────────────────────┘ │
└────────────────────────┼─────────────────────────────────────────┘
                         │
                         │ HTTPS
                         │
                         ▼
┌──────────────────────────────────────────────────────────────────┐
│                  Anthropic API (Claude)                          │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  System Prompt:                                            │ │
│  │  "You are HappyCapy Discord customer service bot...       │ │
│  │   [Full SKILL.md content]                                 │ │
│  │   Product knowledge, pricing, guidelines, tone..."        │ │
│  └────────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  User Prompt:                                              │ │
│  │  "Discord user asks: How much does HappyCapy cost?"       │ │
│  └────────────────────────────────────────────────────────────┘ │
│                      │                                           │
│                      │ Claude 3.5 Sonnet Processing             │
│                      │                                           │
│  ┌───────────────────▼───────────────────────────────────────┐ │
│  │  Generated Response:                                       │ │
│  │  "**Pro** is $17/mo (annual), includes 2,000 Claude       │ │
│  │   Code credits/mo. **Max** is $167/mo (annual) with       │ │
│  │   unlimited usage! ✨"                                     │ │
│  └────────────────────────────────────────────────────────────┘ │
└───────────────────────┬──────────────────────────────────────────┘
                        │
                        │ Response
                        │
                        ▼
┌──────────────────────────────────────────────────────────────────┐
│              discord-bot-auto.js (Node.js)                       │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Response Sender                                           │ │
│  │  - Format message for Discord                             │ │
│  │  - Split if > 2000 chars                                  │ │
│  │  - Send reply to original message                         │ │
│  └───────────────────┬────────────────────────────────────────┘ │
└────────────────────────┼─────────────────────────────────────────┘
                         │
                         │ Discord Gateway
                         │
                         ▼
┌──────────────────────────────────────────────────────────────────┐
│                        Discord Server                            │
│  ┌──────────────┐                                               │
│  │   Bot Reply  │                                               │
│  │ "**Pro** is  │                                               │
│  │  $17/mo..."  │                                               │
│  └──────────────┘                                               │
└──────────────────────────────────────────────────────────────────┘
```

---

## 数据流

### 1. 用户发送消息

```javascript
Discord User: "@HappyCapyBot Pro 计划多少钱？"
    ↓
Discord Gateway → Bot (discord.js)
    ↓
Event: messageCreate
```

### 2. Bot 处理消息

```javascript
// 检查是否应该响应
shouldRespond(message) {
  - 是 bot 自己的消息？ → No
  - 是 DM？ → Yes
  - 被 @mention？ → Yes  ← 本例中
  - 在支持频道且 AUTO_RESPOND=true？ → Check
}
    ↓
决定: 应该响应 ✓
```

### 3. 加载 Skill

```javascript
// 从文件系统加载 skill
const skillContent = fs.readFileSync(
  '~/.claude/skills/happycapy-discord-service/SKILL.md',
  'utf8'
);

// skillContent 包含:
// - 产品知识 (HappyCapy 功能、定价)
// - 响应指南 (语气、格式、长度)
// - Discord 格式化规则
// - 常见问题处理
```

### 4. 构造 API 请求

```javascript
const systemPrompt = `
${skillContent}

You are operating as the HappyCapy Discord customer service bot.
Generate responses following the guidelines above.

IMPORTANT:
- Output ONLY the Discord message content
- Keep responses short (2-4 sentences)
- Use Discord Markdown formatting
- Include 1-2 emoji max
- Auto-detect language and respond in that language
`;

const userPrompt = `Discord user asks: "Pro 计划多少钱？"

Generate a helpful customer service response.`;
```

### 5. 调用 Claude API

```javascript
const response = await anthropic.messages.create({
  model: 'claude-3-5-sonnet-20241022',
  max_tokens: 1024,
  system: systemPrompt,  // ← Skill + 指令
  messages: [
    {
      role: 'user',
      content: userPrompt  // ← 用户问题
    }
  ]
});

// Claude 返回:
const aiResponse = response.content[0].text;
// "**Pro** 计划是 $17/月（年付）或 $20/月，包含 2,000 Claude Code..."
```

### 6. 发送回复

```javascript
// 分割长消息（如果需要）
const chunks = splitMessage(aiResponse, 1900);

// 发送第一条作为回复
await message.reply(chunks[0]);

// 发送剩余部分（如果有）
for (let i = 1; i < chunks.length; i++) {
  await message.channel.send(chunks[i]);
}
```

---

## 核心组件

### discord-bot-auto.js

主要功能模块：

```javascript
┌─────────────────────────────────────────┐
│       discord-bot-auto.js               │
├─────────────────────────────────────────┤
│                                         │
│  [1] Configuration Loading              │
│      - Load .env variables              │
│      - Validate required config         │
│                                         │
│  [2] Skill Loading                      │
│      - loadSkillContent()               │
│      - Read SKILL.md from filesystem    │
│                                         │
│  [3] Client Initialization              │
│      - Discord client (discord.js)      │
│      - Anthropic client (@anthropic-ai) │
│                                         │
│  [4] Event Handlers                     │
│      - on('ready') → Bot online         │
│      - on('messageCreate') → New msg    │
│      - on('error') → Error handling     │
│                                         │
│  [5] Message Processing                 │
│      - shouldRespond()                  │
│      - generateResponse()               │
│      - sendResponse()                   │
│                                         │
│  [6] Utilities                          │
│      - splitMessage()                   │
│      - Error handling                   │
│                                         │
└─────────────────────────────────────────┘
```

### SKILL.md

Skill 文件结构：

```markdown
┌─────────────────────────────────────────┐
│       SKILL.md (系统提示词)              │
├─────────────────────────────────────────┤
│                                         │
│  [1] Bot Mode                           │
│      - Discord chat mode                │
│      - Response characteristics         │
│                                         │
│  [2] Core Principles                    │
│      - Language matching                │
│      - Tone guidelines                  │
│      - Length constraints               │
│                                         │
│  [3] Product Knowledge                  │
│      - What is HappyCapy                │
│      - Features                         │
│      - Pricing (Free/Pro/Max)           │
│      - Technical details                │
│                                         │
│  [4] Response Guidelines                │
│      - Capabilities questions           │
│      - Pricing questions                │
│      - Technical issues                 │
│      - Common scenarios                 │
│                                         │
│  [5] Discord Formatting                 │
│      - Markdown syntax                  │
│      - Emoji usage                      │
│      - Code blocks                      │
│                                         │
│  [6] Technical Knowledge                │
│      - Architecture                     │
│      - Common issues                    │
│      - Troubleshooting                  │
│                                         │
└─────────────────────────────────────────┘
```

---

## 配置选项

### 响应模式对比

| 配置 | AUTO_RESPOND | CHANNEL_ID | 行为 |
|------|--------------|------------|------|
| 模式 1 | `true` | 未设置 | 回复所有频道的所有消息 |
| 模式 2 | `false` | 未设置 | 仅回复 @mention 和 DM |
| 模式 3 | `true` | 已设置 | 仅在指定频道自动回复 |
| 模式 4 | `false` | 已设置 | 仅在指定频道被 @mention 时回复 |

### 决策流程

```
收到消息
    ↓
是 bot 自己的消息？
    ├─ Yes → 忽略
    └─ No → 继续
         ↓
是 DM（私信）？
    ├─ Yes → 响应 ✓
    └─ No → 继续
         ↓
被 @mention？
    ├─ Yes → 响应 ✓
    └─ No → 继续
         ↓
设置了 CHANNEL_ID？
    ├─ No → 检查 AUTO_RESPOND
    │        ├─ true → 响应 ✓
    │        └─ false → 忽略
    └─ Yes → 在指定频道吗？
                ├─ No → 忽略
                └─ Yes → 检查 AUTO_RESPOND
                         ├─ true → 响应 ✓
                         └─ false → 忽略
```

---

## 技术栈

```
┌─────────────────────────────────────────┐
│          Technology Stack               │
├─────────────────────────────────────────┤
│                                         │
│  Runtime:                               │
│  └─ Node.js 18+                         │
│                                         │
│  Core Dependencies:                     │
│  ├─ discord.js@14.14.1                  │
│  │  └─ Discord bot framework            │
│  ├─ @anthropic-ai/sdk@0.32.1            │
│  │  └─ Claude API client                │
│  └─ dotenv@16.4.1                       │
│     └─ Environment variables            │
│                                         │
│  AI Model:                              │
│  └─ Claude 3.5 Sonnet (20241022)        │
│     ├─ 200K context window              │
│     ├─ Bilingual support                │
│     └─ Fast response time               │
│                                         │
│  Skill System:                          │
│  └─ ~/.claude/skills/                   │
│     └─ happycapy-discord-service/       │
│        ├─ SKILL.md                      │
│        └─ quick-reference.md            │
│                                         │
└─────────────────────────────────────────┘
```

---

## 部署架构

### 开发环境

```
Developer's Machine
    ├─ Node.js
    ├─ discord-bot-auto.js
    ├─ .env (local config)
    └─ ~/.claude/skills/
```

### 生产环境（推荐）

```
Cloud Server (AWS/GCP/Azure)
    ├─ PM2 Process Manager
    │  └─ discord-bot-auto.js (auto-restart)
    ├─ Environment Variables (secure)
    ├─ Log Rotation
    └─ Monitoring Dashboard
```

---

## 性能指标

| 指标 | 值 |
|------|---|
| 平均响应时间 | 2-5 秒 |
| Claude API 延迟 | 1-3 秒 |
| Discord 消息延迟 | < 1 秒 |
| 内存占用 | ~100MB |
| CPU 占用 | < 5% (空闲) |
| 并发处理 | 异步，无限制 |

---

## 安全性

### 敏感信息保护

```
✓ Bot Token 存储在 .env (不提交 Git)
✓ API Key 存储在 .env (不提交 Git)
✓ .gitignore 配置正确
✓ 环境变量验证
✓ 错误信息不泄露敏感数据
```

### 权限最小化

```
Discord Bot 权限:
✓ 仅请求必需的权限
✓ 不请求管理员权限
✓ 不访问语音频道
✓ 不修改服务器设置
```

---

## 扩展性

### 添加新功能

1. **新命令**
   - 编辑 `discord-bot-auto.js`
   - 在 `messageCreate` 事件中添加命令处理

2. **更新知识库**
   - 编辑 `SKILL.md`
   - 运行 `npm run install-skill`
   - 重启 bot

3. **切换 AI 模型**
   - 修改 `claudeModel` 配置
   - 重启 bot

4. **多服务器支持**
   - 无需修改代码
   - 使用相同的邀请链接添加到多个服务器

---

## 监控和日志

### 日志级别

```javascript
console.log('📨 Message from user...')   // Info
console.log('✅ Response sent...')        // Success
console.error('❌ Error: ...')            // Error
```

### 关键事件

- Bot 启动/停止
- 消息接收
- API 调用
- 响应发送
- 错误发生

---

## 未来改进

可能的扩展方向：

- [ ] 添加斜杠命令 (Slash Commands)
- [ ] 支持消息编辑历史
- [ ] 添加对话上下文记忆
- [ ] 集成更多 AI 模型
- [ ] 添加使用统计和分析
- [ ] 支持图片/文件处理
- [ ] 多语言支持（不仅中英文）
- [ ] 自定义响应模板
- [ ] Web 管理面板

---

想了解更多？查看：
- [DISCORD_SETUP.md](./DISCORD_SETUP.md) - 完整接入指南
- [QUICKSTART.md](./QUICKSTART.md) - 快速开始
- [README.md](./README.md) - 项目总览
