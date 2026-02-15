# OpenRouter 客服回复示例

## 示例 1: OpenRouter 基础咨询（中文）

**客户问：** "HappyCapy 支持 OpenRouter 吗？"

**回复：**
```
当然支持！HappyCapy 可以集成 OpenRouter，让你使用自己的 API key 访问 200+ 种模型 🔑

**两种使用方式：**

1️⃣ **直接使用（推荐新手）**
- 不需要任何 API key
- 开箱即用，零配置
- Max Plan 提供无限使用

2️⃣ **连接 OpenRouter（适合高级用户）**
- 在设置中添加你的 OpenRouter API key
- 访问更多模型选择
- 使用你自己的账户额度
- 查看详细的使用统计

**OpenRouter 的优势：**
- 🎯 一个 key 访问所有主流模型（Claude、GPT-4、Gemini、Llama 等）
- 💰 按使用付费，成本可控
- 📊 内置用量分析
- 🔄 自动故障切换

**如何获取 OpenRouter key：**
1. 访问 https://openrouter.ai/
2. 注册并充值
3. 生成 API key
4. 在 HappyCapy 设置中连接

**选择建议：**
- 💡 如果你经常用，Max Plan 更划算（无限使用，不用担心费用）
- 💡 如果你想精细控制成本或使用特定模型，用 OpenRouter

有任何问题随时问我！试试看：https://happycapy.ai/
```

---

## 示例 2: 成本对比（英文）

**Customer asks:** "I have OpenRouter credits. Should I use them or buy Max Plan?"

**Response:**
```
Great question! Let me help you decide based on your usage 💰

**Use Your OpenRouter Credits If:**
- ✅ You use HappyCapy occasionally (< 500K tokens/month)
- ✅ You want pay-as-you-go flexibility
- ✅ You already have OpenRouter credits
- ✅ You want detailed cost tracking
- ✅ You're testing HappyCapy for the first time

**Upgrade to Max Plan If:**
- ✅ You use HappyCapy daily
- ✅ You process >2M tokens per month
- ✅ You don't want to worry about token counts
- ✅ You want unlimited usage with no anxiety
- ✅ You value predictable monthly costs

**Cost Examples:**

📊 **Light User (200K tokens/month)**
- OpenRouter: ~$0.60/month
- Max Plan: Overkill

📊 **Regular User (1M tokens/month)**
- OpenRouter: ~$3/month
- Max Plan: Better value

📊 **Heavy User (5M+ tokens/month)**
- OpenRouter: $15+/month
- Max Plan: Much better value + no limits!

**My Recommendation:**
Start with your OpenRouter credits. HappyCapy makes it super easy to connect. If you find yourself checking token usage or limiting your queries, that's when Max Plan becomes worth it 😊

**Connecting OpenRouter is Easy:**
1. Go to HappyCapy settings
2. Add your OpenRouter API key
3. Start using immediately

Try HappyCapy: https://happycapy.ai/
```

---

## 示例 3: 技术对比（中文）

**客户问：** "OpenRouter 和直接用 OpenAI API 有什么区别？"

**回复：**
```
好问题！让我详细对比一下 📊

**OpenRouter 的优势：**

🔑 **一个 key 搞定所有**
- OpenRouter：一个 API key 访问 200+ 模型
- 直接用：需要分别申请 OpenAI、Anthropic、Google 等多个账户

💰 **成本更优**
- OpenRouter：统一计费，通常比官方便宜 10-30%
- 直接用：各家单独计费，管理麻烦

🔄 **自动故障切换**
- OpenRouter：某个模型挂了自动切换备用
- 直接用：需要自己写代码处理失败

📊 **统一监控**
- OpenRouter：一个地方看所有模型的用量和费用
- 直接用：需要分别登录各家平台查看

🚀 **新模型更快**
- OpenRouter：新模型一发布就能用
- 直接用：可能需要等待 API 访问权限

⚡ **无限制访问**
- OpenRouter：没有 rate limit 困扰
- 直接用：经常遇到限流，高峰期更严重

**什么时候直接用 API？**
- 只用一家的模型（比如只用 GPT-4）
- 有特殊的企业合作或折扣
- 需要某些官方独家功能

**在 HappyCapy 中的体验：**
- 无论你选择哪种方式，HappyCapy 都帮你处理好技术细节
- 你只需要说出需求，不用管底层用的是什么 API
- Max Plan 用户甚至不需要考虑这些，直接用就行 😊

推荐先试试 HappyCapy 的 Max Plan，体验一下零焦虑的 AI 使用。如果之后想精细控制，再考虑接入 OpenRouter。

试试看：https://happycapy.ai/
```

---

## 示例 4: 开发者技术咨询（英文）

**Customer (Developer):** "As a developer, what are the technical details of OpenRouter integration?"

**Response:**
```
Great to have a developer here! Let me give you the technical details 🔧

**OpenRouter Technical Specs:**

**API Compatibility:**
- ✅ OpenAI-compatible API (drop-in replacement)
- ✅ Same endpoint structure: `/chat/completions`, `/completions`, `/embeddings`
- ✅ Standard request/response format
- ✅ Streaming support with SSE

**Base Configuration:**
```javascript
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const BASE_URL = 'https://openrouter.ai/api/v1';

const response = await fetch(`${BASE_URL}/chat/completions`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
    'HTTP-Referer': 'https://happycapy.ai',
    'X-Title': 'HappyCapy',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    model: 'anthropic/claude-3.5-sonnet',
    messages: [{role: 'user', content: 'Hello!'}]
  })
});
```

**Available Models (200+):**
- Anthropic: `anthropic/claude-3.5-sonnet`, `anthropic/claude-3-opus`
- OpenAI: `openai/gpt-4`, `openai/gpt-4-turbo`, `openai/gpt-3.5-turbo`
- Google: `google/gemini-pro`, `google/gemini-ultra`
- Meta: `meta-llama/llama-3-70b`, `meta-llama/llama-2-70b`
- Mistral: `mistralai/mistral-large`, `mistralai/mixtral-8x7b`
- And many more...

**Advanced Features:**

**1. Automatic Failover:**
```javascript
{
  "models": ["anthropic/claude-3.5-sonnet", "openai/gpt-4"],
  // Falls back to GPT-4 if Claude is unavailable
}
```

**2. Model Routing (let OpenRouter choose):**
```javascript
{
  "model": "openai/gpt-4",
  "route": "fallback" // Auto-fallback to similar models
}
```

**3. Cost Controls:**
```javascript
{
  "max_tokens": 1000,
  "transforms": ["middle-out"], // Compression for long contexts
}
```

**4. Usage Tracking:**
All requests include cost metadata in response headers:
```
X-OpenRouter-Generation-ID: ...
X-OpenRouter-Model: anthropic/claude-3.5-sonnet
X-OpenRouter-Tokens-Prompt: 100
X-OpenRouter-Tokens-Completion: 50
X-OpenRouter-Cost: 0.0015
```

**HappyCapy Integration:**

When you connect OpenRouter to HappyCapy:
1. We handle auth and headers
2. Automatic retry with exponential backoff
3. Streaming response parsing
4. Error handling and user-friendly messages
5. Token counting and cost estimation
6. Model selection based on task type

**Environment Variables:**
```bash
OPENROUTER_API_KEY=sk-or-...
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
```

**Rate Limits:**
- Much more generous than direct APIs
- Typically 100+ requests/minute
- Scales with usage patterns

**Security:**
- API keys are encrypted at rest
- HTTPS only
- Optional IP whitelisting
- Request signing available

**Monitoring:**
- Real-time dashboard at https://openrouter.ai/activity
- Per-model cost breakdown
- Usage analytics and trends

**Why HappyCapy + OpenRouter Works Well:**
- You get flexibility (your own keys, your models)
- HappyCapy handles complexity (UX, error handling, optimization)
- Best of both worlds: control + convenience

Want to see the integration in action? Try HappyCapy: https://happycapy.ai/
```

---

## 示例 5: 模型选择建议（中文）

**客户问：** "OpenRouter 有这么多模型，我该怎么选？"

**回复：**
```
确实，200+ 模型选择可能让人眼花缭乱！让我帮你简化一下 🎯

**按任务类型选择：**

📝 **文本生成和写作**
推荐：
- Claude 3.5 Sonnet (`anthropic/claude-3.5-sonnet`) - 最佳选择
- GPT-4 Turbo (`openai/gpt-4-turbo`) - 备选

特点：长文本理解好，创意写作强

💬 **日常对话和问答**
推荐：
- GPT-3.5 Turbo (`openai/gpt-3.5-turbo`) - 性价比高
- Mistral Medium - 开源替代

特点：快速响应，成本低

💻 **代码生成和调试**
推荐：
- Claude 3.5 Sonnet - 代码理解最强
- GPT-4 - 代码生成好

特点：支持多种编程语言，能解释代码

🔬 **数据分析和推理**
推荐：
- Claude 3 Opus (`anthropic/claude-3-opus`) - 深度推理
- GPT-4 - 数学能力强

特点：逻辑严密，适合复杂任务

🎨 **创意内容和营销**
推荐：
- GPT-4 - 创意丰富
- Claude 3.5 Sonnet - 风格多样

特点：能适应不同语气和风格

**按成本选择：**

💰 **预算紧张**
- GPT-3.5 Turbo: $0.5/1M tokens
- Llama 3 70B: $0.6/1M tokens

💵 **标准预算**
- Claude 3.5 Sonnet: $3/1M tokens
- GPT-4 Turbo: $10/1M tokens

💎 **旗舰体验**
- Claude 3 Opus: $15/1M tokens
- GPT-4: $30/1M tokens

**好消息：在 HappyCapy 中，你不需要选！**

HappyCapy 会根据你的任务自动选择最合适的模型：
- 写代码 → 自动用 Claude 3.5 Sonnet
- 简单问答 → 自动用 GPT-3.5 Turbo 节省成本
- 复杂推理 → 自动用 Claude Opus 或 GPT-4

**如果你用 Max Plan：**
- 不用考虑成本，随便用
- 系统自动优化模型选择
- 专注于做事，不是选模型

**如果你用 OpenRouter：**
- 可以手动指定模型
- 也可以让 HappyCapy 自动选择
- 在设置中配置模型偏好

我的建议：先用 HappyCapy 的自动选择，体验一下。如果有特殊需求，再手动指定模型。

试试看：https://happycapy.ai/
```

---

## 示例 6: 故障排查（英文）

**Customer:** "I connected my OpenRouter key but getting errors. Help?"

**Response:**
```
No worries, let's troubleshoot this together! 🔧

**Common Issues & Solutions:**

**1. API Key Format Error**
❌ Wrong: `or-v1-abcd1234...` (missing prefix)
✅ Correct: `sk-or-v1-abcd1234...`

**Fix:** Copy the full API key from OpenRouter dashboard

---

**2. Insufficient Credits**
Error: "Insufficient credits" or 402 status

**Fix:**
1. Check balance at https://openrouter.ai/credits
2. Add more credits
3. Try again

---

**3. Model Not Available**
Error: "Model not found" or 404

**Fix:**
- Verify model name exactly (case-sensitive!)
- Check https://openrouter.ai/models for available models
- Some models require special access

---

**4. Rate Limiting**
Error: "Rate limit exceeded" or 429

**Fix:**
- Wait a few seconds and retry
- OpenRouter has generous limits (usually not this)
- Check if you're making too many parallel requests

---

**5. Network Issues**
Error: "Connection timeout" or "Network error"

**Fix:**
- Check your internet connection
- Verify OpenRouter is up: https://status.openrouter.ai/
- Try again in a moment

---

**6. Invalid Request Format**
Error: "Invalid request" or 400

**Fix:**
- Make sure request follows OpenAI format
- Check that all required fields are present
- Verify JSON syntax

---

**How to Test Your Key:**

Try this simple test:
```bash
curl https://openrouter.ai/api/v1/models \
  -H "Authorization: Bearer YOUR_API_KEY"
```

Should return a list of available models.

---

**If Still Not Working:**

1. **Double-check in HappyCapy settings:**
   - Is the key saved correctly?
   - Is OpenRouter integration enabled?
   - Try disconnecting and reconnecting

2. **Check OpenRouter Dashboard:**
   - https://openrouter.ai/activity
   - See if requests are reaching OpenRouter
   - Check error logs

3. **Try a Different Model:**
   - Some models might be temporarily unavailable
   - Switch to a different model and test

4. **Contact Support:**
   - If nothing works, reach out to us
   - Include error message and when it started
   - We'll help you debug!

**Pro Tip:**
HappyCapy's default integration (without your own key) always works. If you're having trouble, you can always fall back to that while we debug your OpenRouter connection 😊

Need more help? Let me know the specific error message you're seeing!

Try HappyCapy: https://happycapy.ai/
```

---

## 使用指南

这些示例涵盖了：
- ✅ OpenRouter 基础介绍
- ✅ 成本对比和选择建议
- ✅ 技术细节（开发者向）
- ✅ 模型选择指导
- ✅ 故障排查步骤
- ✅ 中英文双语

根据客户的具体问题，选择合适的回复模板并调整。记住始终保持友好、专业、有帮助的语气！
