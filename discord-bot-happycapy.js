#!/usr/bin/env node

/**
 * HappyCapy Discord Customer Service Bot - HappyCapy Gateway Version
 *
 * This version uses HappyCapy's AI Gateway instead of direct Anthropic API.
 * No need for separate Anthropic API key - uses your HappyCapy credits.
 *
 * Setup:
 * 1. npm install discord.js dotenv axios
 * 2. Configure .env with DISCORD_BOT_TOKEN only
 * 3. Run: node discord-bot-happycapy.js
 */

const { Client, GatewayIntentBits, Partials } = require('discord.js');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Configuration
const CONFIG = {
  botToken: process.env.DISCORD_BOT_TOKEN,
  aiGatewayApiKey: process.env.AI_GATEWAY_API_KEY || process.env.ANTHROPIC_API_KEY, // 使用 HappyCapy 的 AI Gateway
  aiGatewayUrl: process.env.AI_GATEWAY_URL || 'https://api.happycapy.ai/v1/messages', // HappyCapy AI Gateway
  supportChannelId: process.env.DISCORD_SUPPORT_CHANNEL_ID,
  botPrefix: process.env.DISCORD_BOT_PREFIX || '!',
  autoRespond: process.env.AUTO_RESPOND === 'true',
  skillName: 'happycapy-discord-service',
  maxMessageLength: 1900,
  claudeModel: 'claude-3-5-sonnet-20241022',
};

// Validate required config
if (!CONFIG.botToken) {
  console.error('❌ Error: DISCORD_BOT_TOKEN is required in .env file');
  process.exit(1);
}

// Check if AI Gateway API key is available
const useAIGateway = !!CONFIG.aiGatewayApiKey;

if (!useAIGateway) {
  console.log('⚠️  No API key found. Bot will run in command-only mode.');
  console.log('   To enable AI responses, set AI_GATEWAY_API_KEY in .env');
}

// Initialize Discord client
const discordClient = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages,
  ],
  partials: [Partials.Channel],
});

// Load skill content
function loadSkillContent() {
  const skillPath = path.join(process.env.HOME, '.claude', 'skills', CONFIG.skillName, 'SKILL.md');

  if (!fs.existsSync(skillPath)) {
    console.error(`❌ Skill not found at: ${skillPath}`);
    console.error('   Run: npm run install-skill');
    process.exit(1);
  }

  const skillContent = fs.readFileSync(skillPath, 'utf8');
  console.log('✅ Loaded skill from:', skillPath);
  return skillContent;
}

const SKILL_CONTENT = loadSkillContent();

/**
 * Generate customer service response using HappyCapy AI Gateway
 */
async function generateResponse(customerMessage, context = {}) {
  if (!useAIGateway) {
    return "Sorry, AI responses are not configured. Please set AI_GATEWAY_API_KEY in .env file.";
  }

  try {
    const systemPrompt = `${SKILL_CONTENT}

You are operating as the HappyCapy Discord customer service bot. Generate responses following the guidelines above.

IMPORTANT:
- Output ONLY the Discord message content, no meta-commentary
- Keep responses short (2-4 sentences)
- Use Discord Markdown formatting
- Include 1-2 emoji max
- Auto-detect language (Chinese/English) and respond in that language`;

    const userPrompt = `Discord user asks: "${customerMessage}"

Generate a helpful customer service response.`;

    console.log('🤖 Generating response via HappyCapy AI Gateway...');

    // Call HappyCapy AI Gateway (compatible with Anthropic API format)
    const response = await axios.post(
      CONFIG.aiGatewayUrl,
      {
        model: CONFIG.claudeModel,
        max_tokens: 1024,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: userPrompt,
          },
        ],
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': CONFIG.aiGatewayApiKey,
          'anthropic-version': '2023-06-01',
        },
        timeout: 30000,
      }
    );

    const aiResponse = response.data.content[0].text.trim();
    console.log('✅ Generated response:', aiResponse.substring(0, 100) + '...');

    return aiResponse;

  } catch (error) {
    console.error('❌ Error generating response:', error.message);

    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Data:', error.response.data);
    }

    // Fallback response
    return `Sorry, I encountered an error processing your question. Please try again or reach out to the team directly.\n\nDiscord: https://discord.gg/N3vdDbvsF8`;
  }
}

/**
 * Split long messages into chunks (Discord 2000 char limit)
 */
function splitMessage(text, maxLength = CONFIG.maxMessageLength) {
  if (text.length <= maxLength) return [text];

  const chunks = [];
  let remaining = text;

  while (remaining.length > 0) {
    if (remaining.length <= maxLength) {
      chunks.push(remaining);
      break;
    }

    // Try to split at newline
    let splitAt = remaining.lastIndexOf('\n', maxLength);
    if (splitAt === -1 || splitAt < maxLength / 2) {
      // Try to split at space
      splitAt = remaining.lastIndexOf(' ', maxLength);
    }
    if (splitAt === -1 || splitAt < maxLength / 2) {
      // Force split
      splitAt = maxLength;
    }

    chunks.push(remaining.substring(0, splitAt));
    remaining = remaining.substring(splitAt).trim();
  }

  return chunks;
}

/**
 * Send response to Discord (handles long messages)
 */
async function sendResponse(message, responseText) {
  const chunks = splitMessage(responseText);

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    const isLast = i === chunks.length - 1;

    try {
      if (i === 0) {
        // Reply to original message
        await message.reply(chunk);
      } else {
        // Send follow-up in channel
        await message.channel.send(chunk);
      }

      // Small delay between chunks
      if (!isLast) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    } catch (error) {
      console.error(`❌ Error sending chunk ${i + 1}:`, error);
      throw error;
    }
  }
}

/**
 * Check if bot should respond to this message
 */
function shouldRespond(message) {
  // Don't respond to own messages
  if (message.author.bot) return false;

  // Always respond to DMs
  if (message.channel.isDMBased()) return true;

  // Always respond if mentioned
  if (message.mentions.has(discordClient.user)) return true;

  // If support channel is configured, only respond there
  if (CONFIG.supportChannelId) {
    return message.channel.id === CONFIG.supportChannelId && CONFIG.autoRespond;
  }

  // Otherwise respond if auto-respond is enabled
  return CONFIG.autoRespond;
}

/**
 * Handle incoming messages
 */
discordClient.on('messageCreate', async (message) => {
  // Check if we should respond
  if (!shouldRespond(message)) return;

  // Handle commands
  if (message.content.startsWith(CONFIG.botPrefix)) {
    const command = message.content.slice(CONFIG.botPrefix.length).trim().split(' ')[0];

    if (command === 'help') {
      await message.reply(
        `🤖 **HappyCapy Discord Support Bot**\n\n` +
        `I'm here to help with HappyCapy questions!\n\n` +
        `**Commands:**\n` +
        `• \`${CONFIG.botPrefix}help\` - Show this help message\n` +
        `• \`${CONFIG.botPrefix}ping\` - Check if bot is alive\n` +
        `• Just @mention me or ask your question naturally!\n\n` +
        `Learn more: https://happycapy.ai/`
      );
      return;
    }

    if (command === 'ping') {
      const startTime = Date.now();
      const reply = await message.reply('🏓 Pong!');
      const latency = Date.now() - startTime;
      await reply.edit(`🏓 Pong! Latency: ${latency}ms`);
      return;
    }

    // Unknown command
    return;
  }

  // Only process AI responses if AI Gateway is configured
  if (!useAIGateway) {
    await message.reply(
      `Sorry, AI responses are not configured yet. To enable:\n\n` +
      `1. Get your HappyCapy AI Gateway API key\n` +
      `2. Add to .env: \`AI_GATEWAY_API_KEY=your_key\`\n` +
      `3. Restart the bot`
    );
    return;
  }

  // Process customer question
  console.log(`📨 Message from ${message.author.tag}: ${message.content}`);

  // Show typing indicator
  await message.channel.sendTyping();

  try {
    // Generate response using HappyCapy AI Gateway
    const response = await generateResponse(message.content, {
      author: message.author.tag,
      channelId: message.channel.id,
      messageId: message.id,
    });

    // Send response
    await sendResponse(message, response);

    console.log(`✅ Response sent to ${message.author.tag}`);

  } catch (error) {
    console.error('❌ Error processing message:', error);

    // Send error message
    try {
      await message.reply(
        `Sorry, I encountered an error. Please try again or reach out to the team.\n\n` +
        `Discord: https://discord.gg/N3vdDbvsF8`
      );
    } catch (replyError) {
      console.error('❌ Failed to send error message:', replyError);
    }
  }
});

/**
 * Bot ready event
 */
discordClient.on('ready', () => {
  console.log('\n' + '═'.repeat(50));
  console.log('✅ HappyCapy Discord Bot is ONLINE');
  console.log('═'.repeat(50));
  console.log(`🤖 Bot: ${discordClient.user.tag}`);
  console.log(`📢 Auto-respond: ${CONFIG.autoRespond ? 'ENABLED' : 'DISABLED (mention only)'}`);
  if (CONFIG.supportChannelId) {
    console.log(`📍 Support Channel: ${CONFIG.supportChannelId}`);
  } else {
    console.log(`📍 Monitoring: All channels`);
  }
  console.log(`🧠 AI Provider: ${useAIGateway ? 'HappyCapy AI Gateway' : 'Not configured'}`);
  console.log(`💬 Skill: ${CONFIG.skillName}`);
  console.log('═'.repeat(50));
  console.log('🎉 Ready to help customers!\n');
});

/**
 * Error handling
 */
discordClient.on('error', (error) => {
  console.error('❌ Discord client error:', error);
});

process.on('unhandledRejection', (error) => {
  console.error('❌ Unhandled promise rejection:', error);
});

process.on('SIGINT', () => {
  console.log('\n👋 Shutting down bot...');
  discordClient.destroy();
  process.exit(0);
});

// Login
console.log('🚀 Starting HappyCapy Discord bot...');
console.log('📦 Loading skill and connecting to Discord...\n');

discordClient.login(CONFIG.botToken).catch((error) => {
  console.error('❌ Failed to login:', error.message);
  console.error('\nTroubleshooting:');
  console.error('1. Check DISCORD_BOT_TOKEN in .env file');
  console.error('2. Verify token is valid in Discord Developer Portal');
  console.error('3. Ensure MESSAGE CONTENT INTENT is enabled');
  process.exit(1);
});
