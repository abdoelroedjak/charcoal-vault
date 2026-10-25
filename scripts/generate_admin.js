#!/usr/bin/env node

/**
 * CHARCOAL VAULT — Admin User Generator
 * Creates or updates an administrative user with bcrypt-hashed credentials.
 *
 * Usage:
 *   node scripts/generate_admin.js --email admin@example.com --password "your-secure-password"
 *   OR via environment variables:
 *   ADMIN_EMAIL=admin@example.com ADMIN_PASSWORD="your-secure-password" node scripts/generate_admin.js
 */

const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be provided in the environment.');
  process.exit(1);
}

// Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const parsed = {};
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--email' && args[i + 1]) {
      parsed.email = args[i + 1];
      i++;
    } else if (args[i] === '--password' && args[i + 1]) {
      parsed.password = args[i + 1];
      i++;
    } else if (args[i] === '--role' && args[i + 1]) {
      parsed.role = args[i + 1];
      i++;
    }
  }
  return parsed;
}

async function main() {
  const cliArgs = parseArgs();
  const email = (cliArgs.email || process.env.ADMIN_EMAIL || '').trim().toLowerCase();
  const password = cliArgs.password || process.env.ADMIN_PASSWORD || '';
  const role = cliArgs.role || process.env.ADMIN_ROLE || 'admin';

  if (!email || !password) {
    console.error('❌ Error: Both email and password are required.');
    console.error('Usage: node scripts/generate_admin.js --email admin@example.com --password "your-secure-password"');
    process.exit(1);
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    console.error('❌ Error: Invalid email format.');
    process.exit(1);
  }

  if (password.length < 8) {
    console.error('❌ Error: Password must be at least 8 characters long for production security.');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false },
  });

  console.log(`🔐 Hashing password for admin [${email}] with bcrypt (cost factor 12)...`);
  const saltRounds = 12;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  // Check if admin already exists
  const { data: existingUser, error: checkError } = await supabase
    .from('admin_users')
    .select('id, email')
    .eq('email', email)
    .maybeSingle();

  if (checkError) {
    console.error('❌ Database error checking admin user:', checkError.message);
    process.exit(1);
  }

  if (existingUser) {
    console.log(`⚠️ User [${email}] already exists. Updating password hash and ensuring active status...`);
    const { error: updateError } = await supabase
      .from('admin_users')
      .update({
        password_hash: passwordHash,
        is_active: true,
        role: role,
        updated_at: new Date().toISOString(),
      })
      .eq('id', existingUser.id);

    if (updateError) {
      console.error('❌ Failed to update admin credentials:', updateError.message);
      process.exit(1);
    }
    console.log(`✅ Admin user credentials updated successfully for [${email}]!`);
  } else {
    console.log(`✨ Creating new admin user record for [${email}]...`);
    const { data: newUser, error: insertError } = await supabase
      .from('admin_users')
      .insert({
        email: email,
        password_hash: passwordHash,
        role: role,
        is_active: true,
      })
      .select('id, email, role, created_at')
      .single();

    if (insertError) {
      console.error('❌ Failed to create admin user:', insertError.message);
      process.exit(1);
    }
    console.log(`✅ Admin user created successfully! ID: ${newUser.id}, Email: ${newUser.email}`);
  }

  console.log('🔒 Security Notice: The plain text password was not logged or persisted.');
}

main().catch((err) => {
  console.error('Fatal execution error:', err);
  process.exit(1);
});
