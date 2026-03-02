# Discord Bot 接入完整指南

从零开始，手把手教你将 bot 接入到 Discord 服务器。

---

## 第一步：创建 Discord Application

### 1. 访问 Discord Developer Portal

打开浏览器，访问：
```
https://discord.com/developers/applications
```

使用你的 Discord 账号登录。

### 2. 创建新应用

1. 点击右上角的 **"New Application"** 按钮
2. 输入应用名称，例如：`HappyCapy Support Bot`
3. 勾选同意服务条款
4. 点击 **"Create"**

✅ 现在你已经创建了一个 Discord Application！

---

## 第二步：创建 Bot 用户

### 1. 进入 Bot 设置

在左侧菜单中，点击 **"Bot"**

### 2. 添加 Bot

1. 点击 **"Add Bot"** 按钮
2. 在弹出窗口中点击 **"Yes, do it!"**

✅ Bot 用户已创建！

### 3. 获取 Bot Token

这是最重要的一步：

1. 在 "TOKEN" 部分，点击 **"Reset Token"**
2. 点击 **"Yes, do it!"** 确认
3. **复制显示的 Token**（只显示一次！）

⚠️ **重要：**
- 立即保存这个 Token 到安全的地方
- 不要分享给任何人
- 不要提交到 Git
- 如果泄露，立即 Reset Token

### 4. 配置 Bot 权限

在同一页面向下滚动：

#### A. Privileged Gateway Intents（必需）

找到 "Privileged Gateway Intents" 部分，开启：

- ✅ **PRESENCE INTENT** (可选)
- ✅ **SERVER MEMBERS INTENT** (可选)
- ✅ **MESSAGE CONTENT INTENT** ⚠️ **必须开启！**

⚠️ **MESSAGE CONTENT INTENT 是必需的**，否则 bot 无法读取消息内容！

#### B. 其他设置

- **PUBLIC BOT**: 关闭（除非你想让其他人也能邀请你的 bot）
- **REQUIRE OAUTH2 CODE GRANT**: 保持关闭

点击底部的 **"Save Changes"** 保存。

---

## 第三步：生成邀请链接

### 1. 进入 OAuth2 设置

在左侧菜单中，点击 **"OAuth2"** → **"URL Generator"**

### 2. 选择 Scopes

在 "SCOPES" 部分，勾选：

- ✅ **bot**
- ✅ **applications.commands** (用于斜杠命令，可选)

### 3. 选择 Bot Permissions

在 "BOT PERMISSIONS" 部分，勾选以下权限：

**Text Permissions（文本权限）**
- ✅ **Send Messages** - 发送消息
- ✅ **Send Messages in Threads** - 在线程中发送消息
- ✅ **Embed Links** - 嵌入链接
- ✅ **Attach Files** - 附加文件
- ✅ **Read Message History** - 读取消息历史
- ✅ **Add Reactions** - 添加反应
- ✅ **Use External Emojis** - 使用外部 emoji

**General Permissions（一般权限）**
- ✅ **View Channels** - 查看频道

### 4. 复制生成的 URL

滚动到底部，复制 "GENERATED URL"。

URL 应该类似这样：
```
https://discord.com/api/oauth2/authorize?client_id=1234567890&permissions=274877959168&scope=bot
```

---

## 第四步：邀请 Bot 到服务器

### 1. 打开邀请链接

在浏览器中打开刚才复制的 URL。

### 2. 选择服务器

1. 在下拉菜单中选择你要添加 bot 的服务器
   - ⚠️ 你必须在该服务器有 "管理服务器" 权限
2. 点击 **"继续"**

### 3. 确认权限

1. 检查 bot 请求的权限
2. 点击 **"授权"**
3. 完成验证码（如果有）

✅ Bot 已成功加入你的服务器！

你会在服务器的成员列表中看到 bot（通常标记为 "BOT"）。

---

## 第五步：配置 Bot 环境

现在回到你的项目代码。

### 1. 创建 .env 文件

```bash
cd happycapy-discord-service
cp .env.example .env
```

### 2. 编辑 .env 文件

```bash
nano .env
# 或使用你喜欢的编辑器
```

填入以下内容：

```env
# 粘贴你在第二步获取的 Bot Token
DISCORD_BOT_TOKEN=your_actual_discord_bot_token_here

# 粘贴你的 Anthropic API Key
ANTHROPIC_API_KEY=your_actual_anthropic_api_key_here

# 可选：限制到特定频道（见下一步）
DISCORD_SUPPORT_CHANNEL_ID=

# 可选：命令前缀
DISCORD_BOT_PREFIX=!

# 自动回复模式
AUTO_RESPOND=true
```

保存并关闭文件。

### 3. 获取频道 ID（可选）

如果你想限制 bot 只在特定频道工作：

#### A. 开启 Discord 开发者模式

1. 打开 Discord
2. 用户设置（齿轮图标）→ **高级** → 开启 **"开发者模式"**

#### B. 复制频道 ID

1. 右键点击你的客服频道
2. 点击 **"复制频道 ID"**
3. 将 ID 粘贴到 `.env` 文件的 `DISCORD_SUPPORT_CHANNEL_ID`

---

## 第六步：安装依赖

```bash
npm install
```

这会安装：
- `discord.js` - Discord bot 框架
- `@anthropic-ai/sdk` - Claude API
- `dotenv` - 环境变量管理

---

## 第七步：安装 Skill

```bash
npm run install-skill
```

这会将 skill 文件复制到 `~/.claude/skills/happycapy-discord-service/`

---

## 第八步：启动 Bot

```bash
npm start
```

你应该看到：

```
🚀 Starting HappyCapy Discord bot...
📦 Loading skill and connecting to Discord...

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

✅ Bot 现在正在运行！

---

## 第九步：测试 Bot

在你的 Discord 服务器中测试：

### 测试 1: Ping 命令

在任意文本频道输入：
```
!ping
```

Bot 应该回复：
```
🏓 Pong! Latency: 123ms
```

### 测试 2: 帮助命令

```
!help
```

Bot 应该显示帮助信息。

### 测试 3: 提问测试（中文）

```
@HappyCapy Support Bot HappyCapy 的 Pro 计划多少钱？
```

Bot 应该生成智能回复，包含定价信息。

### 测试 4: 提问测试（英文）

```
@HappyCapy Support Bot How much does HappyCapy cost?
```

Bot 应该用英文回复定价信息。

### 测试 5: 技术问题

```
Why am I getting API 400 error when switching models?
```

Bot 应该解释问题并提供解决方案。

---

## 常见问题排查

### ❌ Bot 不上线

**错误信息：**
```
❌ Failed to login: Request failed with status code 401
```

**原因：** Bot Token 错误或失效

**解决：**
1. 返回 Discord Developer Portal
2. 重新 Reset Token
3. 更新 `.env` 文件中的 `DISCORD_BOT_TOKEN`
4. 重启 bot

---

### ❌ Bot 在线但不回复

**可能原因 1：** 未开启 MESSAGE CONTENT INTENT

**解决：**
1. Discord Developer Portal → Bot
2. 开启 "MESSAGE CONTENT INTENT"
3. 点击 "Save Changes"
4. 重启 bot

**可能原因 2：** Bot 没有频道权限

**解决：**
1. 在 Discord 服务器设置中检查 bot 的角色权限
2. 确保 bot 可以 "查看频道" 和 "发送消息"

**可能原因 3：** AUTO_RESPOND 设置错误

**解决：**
- 如果设置了 `AUTO_RESPOND=false`，bot 只在被 @mention 时回复
- 尝试 `@BotName 你的问题`

---

### ❌ Anthropic API 错误

**错误信息：**
```
❌ Error: ANTHROPIC_API_KEY is required
```

**解决：**
1. 获取 API Key: https://console.anthropic.com/
2. 更新 `.env` 文件中的 `ANTHROPIC_API_KEY`
3. 重启 bot

**错误信息：**
```
❌ Error: Invalid API key
```

**解决：**
1. 检查 API Key 是否正确复制（无空格）
2. 检查 API Key 是否有效（未过期）
3. 确认 Anthropic 账户有可用余额

---

### ❌ Skill 未找到

**错误信息：**
```
❌ Skill not found at: ~/.claude/skills/...
```

**解决：**
```bash
npm run install-skill
```

---

## 进阶配置

### 配置 1: 仅在特定频道响应

```env
DISCORD_SUPPORT_CHANNEL_ID=1234567890123456789
AUTO_RESPOND=true
```

Bot 只会在指定频道自动回复。

### 配置 2: 仅 @mention 时响应

```env
AUTO_RESPOND=false
```

Bot 只在被 @mention 时回复，适合活跃的频道。

### 配置 3: 多频道支持

编辑 `discord-bot-auto.js`，修改 `shouldRespond` 函数：

```javascript
function shouldRespond(message) {
  // 支持多个频道
  const supportChannels = [
    '1234567890123456789',
    '9876543210987654321',
  ];

  if (supportChannels.includes(message.channel.id) && CONFIG.autoRespond) {
    return true;
  }

  // 其他逻辑...
}
```

---

## 生产部署

### 使用 PM2（推荐）

```bash
# 安装 PM2
npm install -g pm2

# 启动 bot
pm2 start npm --name "happycapy-bot" -- start

# 查看日志
pm2 logs happycapy-bot

# 设置开机自启
pm2 startup
pm2 save

# 重启 bot
pm2 restart happycapy-bot

# 停止 bot
pm2 stop happycapy-bot
```

### 使用 nohup（简单方式）

```bash
nohup npm start > bot.log 2>&1 &

# 查看日志
tail -f bot.log

# 停止 bot
ps aux | grep node
kill <PID>
```

---

## 监控和维护

### 查看实时日志

```bash
pm2 logs happycapy-bot --lines 100
```

### 监控 Bot 状态

```bash
pm2 monit
```

### 更新 Skill 知识

```bash
# 编辑 SKILL.md
nano SKILL.md

# 重新安装
npm run install-skill

# 重启 bot
pm2 restart happycapy-bot
```

---

## 完整流程总结

1. ✅ 创建 Discord Application
2. ✅ 创建 Bot 用户并获取 Token
3. ✅ 开启 MESSAGE CONTENT INTENT
4. ✅ 生成邀请链接
5. ✅ 邀请 Bot 到服务器
6. ✅ 配置 `.env` 文件
7. ✅ 安装依赖 (`npm install`)
8. ✅ 安装 Skill (`npm run install-skill`)
9. ✅ 启动 Bot (`npm start`)
10. ✅ 在 Discord 中测试

---

## 需要帮助？

- **Discord 设置问题：** https://discord.com/developers/docs
- **Bot 代码问题：** 查看 GitHub Issues
- **HappyCapy 社区：** https://discord.gg/N3vdDbvsF8

---

## 视频教程

如果你更喜欢看视频，可以搜索：
- "How to create a Discord bot"
- "Discord bot tutorial"

基本流程是一样的！

---

🎉 **恭喜！你的 Discord 客服机器人已经上线了！**
