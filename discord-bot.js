#!/usr/bin/env node

/**
 * HappyCapy Discord Customer Service Bot
 *
 * Automated customer service bot that uses Claude Code skill
 * to provide intelligent responses to customer inquiries in Discord.
 *
 * Setup:
 * 1. npm install discord.js dotenv
 * 2. Copy .env.example to .env and configure
 * 3. Run: node discord-bot.js
 */

const { Client, GatewayIntentBits, Partials } = require('discord.js');
const { spawn } = require('child_process');
const fs = require('fs');
require('dotenv').config();

// Configuration
const CONFIG = {
  botToken: process.env.DISCORD_BOT_TOKEN,
  supportChannelId: process.env.DISCORD_SUPPORT_CHANNEL_ID,
  botPrefix: process.env.DISCORD_BOT_PREFIX || '!',
  autoRespond: process.env.AUTO_RESPOND === 'true',
  skillName: 'happycapy-discord-service',
  // Max message length (Discord limit is 2000)
  maxMessageLength: 1900,
};

// Validate required config
if (!CONFIG.botToken) {
  console.error('❌ Error: DISCORD_BOT_TOKEN is required in .env file');
  process.exit(1);
}

// Initialize Discord client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages,
  ],
  partials: [Partials.Channel],
});

/**
 * Generate customer service response using Claude Code skill
 */
async function generateResponse(customerMessage, context = {}) {
  return new Promise((resolve, reject) => {
    const prompt = `Customer message in Discord:\n\n${customerMessage}\n\nGenerate a helpful response following HappyCapy Discord customer service guidelines.`;

    // Create temporary file for the prompt
    const tempFile = `/tmp/discord-prompt-${Date.now()}.txt`;
    fs.writeFileSync(tempFile, prompt);

    // Call Claude Code with the skill
    // Note: This assumes Claude Code CLI is available in PATH
    // Adjust the command based on your Claude Code setup
    const claudeProcess = spawn('claude', [
      'code',
      '--skill', CONFIG.skillName,
      '--input', tempFile
    ]);

    let output = '';
    let errorOutput = '';

    claudeProcess.stdout.on('data', (data) => {
      output += data.toString();
    });

    claudeProcess.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });

    claudeProcess.on('close', (code) => {
      // Clean up temp file
      fs.unlinkSync(tempFile);

      if (code === 0) {
        resolve(output.trim());
      } else {
        reject(new Error(`Claude Code error: ${errorOutput}`));
      }
    });

    // Timeout after 30 seconds
    setTimeout(() => {
      claudeProcess.kill();
      reject(new Error('Response generation timed out'));
    }, 30000);
  });
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
 * Handle incoming messages
 */
client.on('messageCreate', async (message) => {
  // Ignore bot's own messages
  if (message.author.bot) return;

  // Check if message is in support channel (if configured)
  if (CONFIG.supportChannelId && message.channel.id !== CONFIG.supportChannelId) {
    // Only respond in DMs or support channel
    if (!message.channel.isDMBased()) return;
  }

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
        `• Just ask your question naturally!\n\n` +
        `Learn more: https://happycapy.ai/`
      );
      return;
    }

    if (command === 'ping') {
      await message.reply('🏓 Pong! Bot is online.');
      return;
    }
  }

  // Auto-respond to regular messages (if enabled)
  if (CONFIG.autoRespond || message.mentions.has(client.user)) {
    console.log(`📨 Received message from ${message.author.tag}: ${message.content}`);

    // Show typing indicator
    await message.channel.sendTyping();

    try {
      // Generate response
      const response = await generateResponse(message.content, {
        author: message.author.tag,
        channelId: message.channel.id,
        messageId: message.id,
      });

      console.log(`✅ Generated response: ${response.substring(0, 100)}...`);

      // Send response
      await sendResponse(message, response);

    } catch (error) {
      console.error('❌ Error generating response:', error);

      // Send fallback message
      await message.reply(
        `Sorry, I encountered an error processing your question. ` +
        `Please try again or reach out to the team directly.\n\n` +
        `Discord: https://discord.gg/N3vdDbvsF8`
      );
    }
  }
});

/**
 * Bot ready event
 */
client.on('ready', () => {
  console.log(`✅ Bot logged in as ${client.user.tag}`);
  console.log(`📢 Auto-respond: ${CONFIG.autoRespond ? 'ENABLED' : 'DISABLED'}`);
  if (CONFIG.supportChannelId) {
    console.log(`📍 Monitoring channel: ${CONFIG.supportChannelId}`);
  } else {
    console.log(`📍 Monitoring: All channels and DMs`);
  }
  console.log(`🤖 Bot is ready to help customers!`);
});

/**
 * Error handling
 */
client.on('error', (error) => {
  console.error('❌ Discord client error:', error);
});

process.on('unhandledRejection', (error) => {
  console.error('❌ Unhandled promise rejection:', error);
});

// Login
console.log('🚀 Starting HappyCapy Discord bot...');
client.login(CONFIG.botToken).catch((error) => {
  console.error('❌ Failed to login:', error);
  process.exit(1);
});
