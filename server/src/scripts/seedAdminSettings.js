import connectDB from '../config/db.js';
import AdminSettings from '../models/AdminSettings.js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../../.env') });

const seedAdminSettings = async () => {
  await connectDB();
  console.log('Connected to MongoDB');

  let settings = await AdminSettings.findOne();

  if (!settings) {
    settings = new AdminSettings();
  }

  settings.aiEnabled = true;
  settings.aiJobRecommendations = true;
  settings.aiFreelancerRecommendations = true;
  settings.aiProposalGeneration = true;
  settings.aiMatchScoreEnhancement = true;
  settings.aiProvider = 'gemini';

  await settings.save();

  console.log('\n✅ Admin settings updated:');
  console.log('   aiEnabled:                  ', settings.aiEnabled);
  console.log('   aiProposalGeneration:        ', settings.aiProposalGeneration);
  console.log('   aiJobRecommendations:        ', settings.aiJobRecommendations);
  console.log('   aiFreelancerRecommendations: ', settings.aiFreelancerRecommendations);
  console.log('   aiMatchScoreEnhancement:     ', settings.aiMatchScoreEnhancement);
  console.log('   aiProvider:                  ', settings.aiProvider);

  process.exit(0);
};

seedAdminSettings().catch((err) => {
  console.error('❌ Failed:', err);
  process.exit(1);
});
