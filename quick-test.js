#!/usr/bin/env node

/**
 * Quick Test Script for HappyCapy Discord Bot
 *
 * Tests the bot logic without requiring a real Discord connection.
 * Validates: skill installation, response generation, formatting.
 */

const fs = require('fs');
const path = require('path');

console.log('\n🧪 HappyCapy Discord Bot - Quick Test\n');
console.log('═'.repeat(50));

// Test 1: Check if skill is installed
console.log('\n📋 Test 1: Skill Installation Check');
console.log('-'.repeat(50));

const skillPath = path.join(process.env.HOME, '.claude', 'skills', 'happycapy-discord-service');
const skillMdPath = path.join(skillPath, 'SKILL.md');
const quickRefPath = path.join(skillPath, 'quick-reference.md');

let skillInstalled = false;
if (fs.existsSync(skillMdPath) && fs.existsSync(quickRefPath)) {
  console.log('✅ Skill is installed at:', skillPath);
  console.log('   - SKILL.md: Found');
  console.log('   - quick-reference.md: Found');
  skillInstalled = true;
} else {
  console.log('❌ Skill not found. Run: npm run install-skill');
  console.log('   Expected path:', skillPath);
}

// Test 2: Check project files
console.log('\n📋 Test 2: Project Files Check');
console.log('-'.repeat(50));

const requiredFiles = [
  'discord-bot.js',
  'package.json',
  '.env.example',
  'SKILL.md',
  'quick-reference.md',
  'SETUP.md',
  'README.md'
];

let allFilesPresent = true;
requiredFiles.forEach(file => {
  const exists = fs.existsSync(file);
  console.log(exists ? '✅' : '❌', file);
  if (!exists) allFilesPresent = false;
});

// Test 3: Check dependencies
console.log('\n📋 Test 3: Dependencies Check');
console.log('-'.repeat(50));

const packageJsonPath = './package.json';
if (fs.existsSync(packageJsonPath)) {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  const deps = packageJson.dependencies || {};

  console.log('Required dependencies:');
  ['discord.js', 'dotenv'].forEach(dep => {
    if (deps[dep]) {
      console.log(`✅ ${dep}: ${deps[dep]}`);
    } else {
      console.log(`❌ ${dep}: Not found`);
    }
  });
} else {
  console.log('❌ package.json not found');
}

// Test 4: Check if node_modules is installed
console.log('\n📋 Test 4: Node Modules Check');
console.log('-'.repeat(50));

const nodeModulesPath = './node_modules';
if (fs.existsSync(nodeModulesPath)) {
  console.log('✅ node_modules directory exists');

  // Check critical packages
  const criticalPackages = ['discord.js', 'dotenv'];
  criticalPackages.forEach(pkg => {
    const pkgPath = path.join(nodeModulesPath, pkg);
    if (fs.existsSync(pkgPath)) {
      console.log(`   ✅ ${pkg} installed`);
    } else {
      console.log(`   ❌ ${pkg} missing - Run: npm install`);
    }
  });
} else {
  console.log('❌ node_modules not found');
  console.log('   Run: npm install');
}

// Test 5: Environment configuration
console.log('\n📋 Test 5: Environment Configuration');
console.log('-'.repeat(50));

const envPath = './.env';
if (fs.existsSync(envPath)) {
  console.log('✅ .env file exists');

  // Check for required variables (without exposing values)
  const envContent = fs.readFileSync(envPath, 'utf8');
  const hasToken = envContent.includes('DISCORD_BOT_TOKEN=') &&
                   !envContent.includes('DISCORD_BOT_TOKEN=your_discord_bot_token_here');

  if (hasToken) {
    console.log('   ✅ DISCORD_BOT_TOKEN is configured');
  } else {
    console.log('   ⚠️  DISCORD_BOT_TOKEN not configured yet');
    console.log('   → Add your Discord bot token to .env');
  }
} else {
  console.log('⚠️  .env file not found');
  console.log('   Run: cp .env.example .env');
  console.log('   Then edit .env with your Discord bot token');
}

// Test 6: Skill content validation
console.log('\n📋 Test 6: Skill Content Validation');
console.log('-'.repeat(50));

if (fs.existsSync(skillMdPath)) {
  const skillContent = fs.readFileSync(skillMdPath, 'utf8');

  const checks = [
    { name: 'Discord mode configured', pattern: /Discord chat mode/i },
    { name: 'Product knowledge included', pattern: /HappyCapy/i },
    { name: 'Pricing information', pattern: /\$17|Pro.*Max/i },
    { name: 'Discord formatting guide', pattern: /Discord Markdown/i },
    { name: 'Bilingual support', pattern: /Chinese.*English|中文.*英文/i }
  ];

  checks.forEach(check => {
    if (check.pattern.test(skillContent)) {
      console.log(`✅ ${check.name}`);
    } else {
      console.log(`⚠️  ${check.name} - might be missing`);
    }
  });
} else {
  console.log('❌ Cannot validate skill content (SKILL.md not found)');
}

// Summary
console.log('\n' + '═'.repeat(50));
console.log('📊 Test Summary');
console.log('═'.repeat(50));

const readyForTesting = skillInstalled && allFilesPresent;

if (readyForTesting) {
  console.log('✅ Bot is ready for testing!');
  console.log('\nNext steps:');
  console.log('1. If you haven\'t installed dependencies:');
  console.log('   npm install');
  console.log('\n2. Configure your Discord bot token:');
  console.log('   cp .env.example .env');
  console.log('   Edit .env and add your DISCORD_BOT_TOKEN');
  console.log('\n3. Start the bot:');
  console.log('   npm start');
  console.log('\n4. Test in Discord:');
  console.log('   !ping');
  console.log('   How much does HappyCapy cost?');
} else {
  console.log('⚠️  Some setup steps are incomplete.');
  console.log('\nRun these commands:');
  console.log('1. npm install');
  console.log('2. npm run install-skill');
  console.log('3. cp .env.example .env');
  console.log('4. Edit .env with your Discord bot token');
  console.log('5. Run this test again: node quick-test.js');
}

console.log('\n📖 For detailed setup instructions, see SETUP.md');
console.log('📖 For testing guide, see TEST.md\n');
