#!/usr/bin/env node

/**
 * Script to switch between development and production modes
 * Usage: node switch-mode.js [dev|prod]
 */

const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env');

function updateEnvFile(mode) {
  try {
    let envContent = fs.readFileSync(envPath, 'utf8');

    if (mode === 'dev') {
      envContent = envContent.replace(/DEV_MODE=false/g, 'DEV_MODE=true');
      console.log('🔧 Switched to Development Mode');
      console.log('📍 MongoDB: Local Database (localhost:27017)');
      console.log('💳 Razorpay: Development Mode (bypassed)');
    } else if (mode === 'prod') {
      envContent = envContent.replace(/DEV_MODE=true/g, 'DEV_MODE=false');
      console.log('🔧 Switched to Production Mode');
      console.log('📍 MongoDB: Cloud Database (Atlas)');
      console.log('💳 Razorpay: Live Payment Processing');
    } else {
      console.error('❌ Invalid mode. Use "dev" or "prod"');
      process.exit(1);
    }

    fs.writeFileSync(envPath, envContent);
    console.log('✅ Configuration updated successfully');
    console.log('🔄 Please restart the server to apply changes');

  } catch (error) {
    console.error('❌ Error updating .env file:', error.message);
    process.exit(1);
  }
}

function showCurrentMode() {
  try {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const devModeMatch = envContent.match(/DEV_MODE=(true|false)/);

    if (devModeMatch) {
      const isDev = devModeMatch[1] === 'true';
      console.log('📋 Current Configuration:');
      console.log(`🔧 Mode: ${isDev ? 'Development' : 'Production'}`);
      console.log(`📍 MongoDB: ${isDev ? 'Local Database' : 'Cloud Database'}`);
      console.log(`💳 Razorpay: ${isDev ? 'Development (bypassed)' : 'Live Processing'}`);
    } else {
      console.log('❌ DEV_MODE not found in .env file');
    }
  } catch (error) {
    console.error('❌ Error reading .env file:', error.message);
  }
}

// Main execution
const args = process.argv.slice(2);

if (args.length === 0) {
  console.log('🎛️  Environment Mode Switcher');
  console.log('');
  showCurrentMode();
  console.log('');
  console.log('Usage:');
  console.log('  node switch-mode.js dev   # Switch to development mode');
  console.log('  node switch-mode.js prod  # Switch to production mode');
} else {
  updateEnvFile(args[0]);
}