import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load env from server/.env
dotenv.config({ path: join(__dirname, '../.env') });

const makeAdmin = async (email) => {
  if (!email) {
    console.error('Please provide an email address.');
    console.log('Usage: node scripts/makeAdmin.js <user-email>');
    process.exit(1);
  }

  try {
    const MONGODB_URI = process.env.MONGODB_URI;
    if (!MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in .env file');
    }

    console.log('Connecting to database...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected successfully.');

    // Dynamic import of the User model to ensure mongoose is connected first
    const { default: User } = await import('../src/models/User.js');

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      console.error(`User with email ${email} not found.`);
      process.exit(1);
    }

    user.role = 'admin';
    user.adminRole = 'super_admin';
    
    await user.save();
    
    console.log('==============================================');
    console.log(`✅ Success! User ${user.name} (${user.email}) is now an Admin!`);
    console.log(`   Role: ${user.role}`);
    console.log(`   Admin Role: ${user.adminRole}`);
    console.log('==============================================');
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

const emailArg = process.argv[2];
makeAdmin(emailArg);
