# 使用 HappyCapy AI Gateway

使用 HappyCapy 的 AI Gateway，无需单独的 Anthropic API key，直接使用你的 HappyCapy 用量。

---

## 优势

✅ **无需额外 API Key** - 使用你的 HappyCapy 账户积分
✅ **统一计费** - 所有 AI 使用在一个账单中
✅ **更简单的设置** - 少一个环境变量要配置
✅ **与 HappyCapy 集成** - 在 HappyCapy 环境中无缝运行

---

## 设置方法

### 方式 1：在 HappyCapy 环境中运行（推荐）

如果你的 Discord bot 在 HappyCapy 的 sandbox 中运行，`AI_GATEWAY_API_KEY` 已经自动设置好了。

#### 1. 创建 .env 文件

```bash
cp .env.example .env
```

#### 2. 编辑 .env

只需要设置 Discord Bot Token：

```env
DISCORD_BOT_TOKEN=your_discord_bot_token_here
AUTO_RESPOND=true
```

**不需要设置 AI_GATEWAY_API_KEY**！它会自动从环境变量读取。

#### 3. 安装依赖并启动

```bash
npm install
npm run install-skill
npm start
```

✅ Bot 会自动使用 HappyCapy 的 AI Gateway！

---

### 方式 2：在本地或其他服务器运行

如果你想在 HappyCapy 外部运行 bot，但仍使用 HappyCapy 的 AI Gateway：

#### 1. 获取 AI Gateway API Key

在 HappyCapy 中运行：

```bash
echo $AI_GATEWAY_API_KEY
```

复制显示的 key。

#### 2. 配置 .env

```env
DISCORD_BOT_TOKEN=your_discord_bot_token_here
AI_GATEWAY_API_KEY=your_happycapy_ai_gateway_key
AUTO_RESPOND=true
```

#### 3. 启动

```bash
npm start
```

---

## 文件说明

项目现在包含三个 bot 脚本：

| 文件 | 用途 | 需要的 API Key |
|------|------|----------------|
| `discord-bot-happycapy.js` | 使用 HappyCapy AI Gateway | `AI_GATEWAY_API_KEY` (可选) |
| `discord-bot-auto.js` | 使用 Anthropic API | `ANTHROPIC_API_KEY` |
| `discord-bot.js` | 基础版本 | 需要本地 Claude CLI |

### 默认行为

`npm start` 现在默认运行 `discord-bot-happycapy.js`

### 切换到 Anthropic API

如果你想使用直接的 Anthropic API：

```bash
npm run start:anthropic
```

并在 `.env` 中设置：

```env
ANTHROPIC_API_KEY=your_anthropic_api_key
```

---

## 工作原理

### HappyCapy Gateway 版本

```
Discord Message
    ↓
discord-bot-happycapy.js
    ↓
HappyCapy AI Gateway (https://api.happycapy.ai/v1/messages)
    ↓
Claude API (via HappyCapy)
    ↓
Response → Discord
```

### Anthropic 直连版本

```
Discord Message
    ↓
discord-bot-auto.js
    ↓
Anthropic API (https://api.anthropic.com/v1/messages)
    ↓
Claude API (direct)
    ↓
Response → Discord
```

---

## API 兼容性

HappyCapy AI Gateway 完全兼容 Anthropic API 格式：

- 相同的请求格式
- 相同的响应格式
- 支持所有 Claude 模型
- 支持 system prompts、max_tokens 等参数

这意味着代码可以在两种模式下无缝切换！

---

## 费用说明

### 使用 HappyCapy Gateway

- 使用你的 HappyCapy 账户积分
- Pro 计划：2,000 credits/月
- Max 计划：无限使用
- 每次对话约消耗 10-30 credits

### 使用 Anthropic 直连

- 单独的 Anthropic 账户计费
- Claude 3.5 Sonnet: ~$0.003-$0.015 per response
- 需要单独充值

---

## 环境变量优先级

Bot 会按以下顺序查找 API key：

1. `AI_GATEWAY_API_KEY` （优先使用）
2. `ANTHROPIC_API_KEY` （回退选项）
3. 如果都没有，bot 会以 command-only 模式运行

---

## 示例配置

### 配置 1：HappyCapy 环境（推荐）

```env
DISCORD_BOT_TOKEN=MTIzNDU2Nzg5MA...
# AI_GATEWAY_API_KEY 自动从环境获取
AUTO_RESPOND=true
```

### 配置 2：外部服务器 + HappyCapy Gateway

```env
DISCORD_BOT_TOKEN=MTIzNDU2Nzg5MA...
AI_GATEWAY_API_KEY=hcai_1234567890abcdef
AUTO_RESPOND=true
```

### 配置 3：使用 Anthropic 直连

```env
DISCORD_BOT_TOKEN=MTIzNDU2Nzg5MA...
ANTHROPIC_API_KEY=sk-ant-api03-abcdef...
AUTO_RESPOND=true
```

---

## 故障排查

### ❌ "AI responses are not configured"

**原因：** 没有设置任何 API key

**解决：**
- 在 HappyCapy 环境中：bot 应该自动检测到 `$AI_GATEWAY_API_KEY`
- 在其他环境：在 `.env` 中设置 `AI_GATEWAY_API_KEY`

### ❌ "401 Unauthorized" 或 "Invalid API key"

**原因：** API key 错误或过期

**解决：**
1. 检查 `.env` 中的 key 是否正确
2. 确认 HappyCapy 账户有可用积分
3. 重新获取 key：`echo $AI_GATEWAY_API_KEY`

### ❌ "Connection timeout"

**原因：** 网络问题或 Gateway 不可达

**解决：**
1. 检查网络连接
2. 确认 `AI_GATEWAY_URL` 设置正确（或留空使用默认）
3. 检查防火墙设置

---

## 性能对比

| 指标 | HappyCapy Gateway | Anthropic 直连 |
|------|-------------------|----------------|
| 响应时间 | 2-5 秒 | 1-3 秒 |
| 稳定性 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| 设置难度 | ⭐ 简单 | ⭐⭐ 中等 |
| 费用 | HappyCapy 积分 | 单独计费 |
| 推荐场景 | HappyCapy 用户 | 需要直连 API |

---

## 总结

✅ **推荐配置：**
- 如果你是 HappyCapy 用户 → 使用 HappyCapy Gateway
- 设置更简单，费用统一管理
- 在 HappyCapy 环境中零配置

✅ **备选方案：**
- 如果需要更低延迟 → 使用 Anthropic 直连
- 如果不是 HappyCapy 用户 → 使用 Anthropic 直连

两种方式代码完全兼容，可以随时切换！🎉
