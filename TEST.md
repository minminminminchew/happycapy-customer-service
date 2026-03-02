# Discord Bot 测试指南

这个文档帮助你验证 Discord 客服 bot 是否正常工作。

## 方法 1: 本地测试 Skill（最简单）

在部署 Discord bot 之前，先测试 skill 是否能正确生成回复。

### 步骤：

1. **安装 skill 到 Claude Code**
```bash
cd happycapy-discord-service
npm run install-skill
```

2. **验证 skill 已安装**
```bash
ls ~/.claude/skills/happycapy-discord-service/
# 应该看到 SKILL.md 和 quick-reference.md
```

3. **在 Claude Code 中测试**

在 Claude Code 中说：
```
discord客服，帮我回复这个客户：

"HappyCapy 的 Max 计划多少钱？有什么优势？"
```

或者：
```
discord bot，客户问：How much does the Pro plan cost?
```

**期望结果：**
- Skill 被触发
- 生成简短的 Discord 风格回复（2-4 句话）
- 使用 Discord Markdown 格式
- 包含 1-2 个 emoji
- 回复内容准确（Max $167/月，Pro $17/月）

### 测试用例：

#### 测试 1: 中文定价问题
```
discord客服：客户问"Pro 计划多少钱？"
```

**期望回复示例：**
```
**Pro** 计划是 $17/月（年付）或 $20/月，包含 2,000 Claude Code 积分/月，还能用 150+ AI 模型。需要更多积分的话可以按需购买（+750/$10 或 +1500/$20）。✨

想要无限使用的话，可以看看 **Max** 计划（$167/月年付），完全不用担心积分问题！🚀

详细对比：https://happycapy.ai/pricing
```

#### 测试 2: 英文技术问题
```
discord bot: Customer asks "Why am I getting API 400 error when switching models?"
```

**期望回复示例：**
```
This happens when switching models within the same conversation. Try running `/compact` first, or start a fresh desktop with your desired model.

Different models use different context formats, which causes the incompatibility. 💡
```

#### 测试 3: 功能咨询
```
discord客服：用户问"HappyCapy 可以做什么？"
```

**期望回复示例：**
```
HappyCapy 是一个浏览器里的 AI 电脑，可以帮你做很多事：

🎨 生成图片和视频
📄 处理文档（Word/Excel/PPT/PDF）
🌐 做网站和应用
📚 写论文和报告
⚡ 自动化工作流程

不需要技术知识，告诉 Capy 你想做什么就行！https://happycapy.ai/
```

---

## 方法 2: 测试 Discord Bot 脚本（模拟模式）

在不连接真实 Discord 的情况下测试 bot 逻辑。

### 步骤：

1. **创建测试脚本**（我会帮你创建）

2. **运行测试**
```bash
node test-bot-logic.js
```

这会模拟：
- 接收 Discord 消息
- 调用 skill 生成回复
- 输出结果

---

## 方法 3: 完整 Discord Bot 测试（真实环境）

部署到真实的 Discord 服务器进行端到端测试。

### 前提条件：
- 有一个 Discord 服务器（测试用）
- 创建了 Discord bot（按照 SETUP.md 第 1 步）

### 步骤：

#### 1. 安装依赖
```bash
cd happycapy-discord-service
npm install
```

#### 2. 配置环境变量
```bash
cp .env.example .env
nano .env  # 或使用你喜欢的编辑器
```

填入：
```env
DISCORD_BOT_TOKEN=你的_discord_bot_token
DISCORD_SUPPORT_CHANNEL_ID=你的_频道_ID（可选）
AUTO_RESPOND=true
```

#### 3. 启动 bot
```bash
npm start
```

**期望输出：**
```
🚀 Starting HappyCapy Discord bot...
✅ Bot logged in as HappyCapy Support Bot#1234
📢 Auto-respond: ENABLED
📍 Monitoring: All channels and DMs
🤖 Bot is ready to help customers!
```

#### 4. 在 Discord 中测试

**基础测试：**
```
!ping
```
期望回复：`🏓 Pong! Bot is online.`

**帮助命令：**
```
!help
```
期望回复：显示 bot 帮助信息

**真实问题测试：**
```
How much does HappyCapy cost?
```
期望：Bot 自动生成智能回复

#### 5. 测试用例清单

- [ ] Bot 上线成功（`!ping` 有响应）
- [ ] 帮助命令工作（`!help`）
- [ ] 英文问题能正确回复
- [ ] 中文问题能正确回复
- [ ] 回复格式是 Discord Markdown
- [ ] 回复长度适中（2-4 句话）
- [ ] 包含适当的 emoji（1-2 个）
- [ ] 链接能正确显示
- [ ] 对于长回复会自动分段
- [ ] Bot 不会回复自己的消息
- [ ] 只在配置的频道响应（如果设置了）

---

## 方法 4: 快速验证（推荐新手）

### 使用 Mock 测试（无需真实 Discord）

我可以为你创建一个简单的测试脚本，模拟完整流程：

```bash
node quick-test.js
```

这会：
1. ✅ 检查 skill 是否安装
2. ✅ 模拟客户消息
3. ✅ 生成 AI 回复
4. ✅ 验证回复格式
5. ✅ 输出测试结果

---

## 常见问题排查

### Skill 没有被触发
**原因：** Skill 文件未正确安装

**解决：**
```bash
npm run install-skill
ls ~/.claude/skills/happycapy-discord-service/
```

### Bot 启动失败
**原因：** 缺少 DISCORD_BOT_TOKEN

**解决：**
1. 检查 `.env` 文件是否存在
2. 确认 token 正确复制（无空格）
3. 验证 token 有效性（在 Discord Developer Portal）

### Bot 不回复消息
**可能原因：**
1. 未开启 MESSAGE CONTENT INTENT
2. Bot 权限不足
3. AUTO_RESPOND 设置为 false 且未 @bot

**解决：**
1. 在 Discord Developer Portal 开启 "MESSAGE CONTENT INTENT"
2. 检查 bot 在频道中有 "Read Messages" 和 "Send Messages" 权限
3. 设置 `.env` 中 `AUTO_RESPOND=true`

### 回复内容不准确
**原因：** Skill 知识需要更新

**解决：**
1. 编辑 `SKILL.md` 更新产品信息
2. 运行 `npm run install-skill`
3. 无需重启 bot（skill 会自动重新加载）

---

## 下一步

选择你想要的测试方法：

1. **方法 1**（最简单）- 我可以帮你在 Claude Code 中直接测试 skill
2. **方法 2** - 我可以创建一个测试脚本给你
3. **方法 3** - 如果你已经有 Discord bot token，我们可以部署真实环境
4. **方法 4** - 我可以创建一个一键测试脚本

你想用哪种方法？或者需要我帮你设置 Discord bot？
