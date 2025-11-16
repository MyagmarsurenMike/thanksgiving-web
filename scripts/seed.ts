import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Message from '../models/Message';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/thanksgiving_messages';

const seedMessages = [
  {
    name: 'Sarah Johnson',
    message: 'I am so grateful for my family and the wonderful memories we create together every year. This Thanksgiving, I especially appreciate having everyone healthy and happy.',
    emoji: '🦃',
    status: 'approved',
    createdAt: new Date('2024-11-10')
  },
  {
    name: 'Mike Chen',
    message: 'Thankful for my amazing job, supportive colleagues, and the opportunity to learn and grow every day. Grateful for the roof over my head and food on my table.',
    emoji: '🙏',
    status: 'approved',
    createdAt: new Date('2024-11-12')
  },
  {
    name: 'Emily Rodriguez',
    message: 'This year I am incredibly grateful for my health, my education, and the chance to pursue my dreams. Thank you to everyone who has supported me along the way!',
    emoji: '❤️',
    status: 'approved',
    createdAt: new Date('2024-11-14')
  },
  {
    name: 'David Thompson',
    message: 'Grateful for good friends, warm hugs, delicious food, and the simple joys in life. Thanksgiving reminds me to appreciate all the little things that make life beautiful.',
    emoji: '🍂',
    status: 'approved',
    createdAt: new Date('2024-11-15')
  },
  {
    name: 'Lisa Park',
    message: 'I am thankful for the gift of another year, for laughter shared with loved ones, and for the strength to overcome challenges. Wishing everyone a blessed Thanksgiving!',
    emoji: '🥧',
    status: 'pending',
    createdAt: new Date('2024-11-16')
  }
];

async function seedDatabase() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing messages
    await Message.deleteMany({});
    console.log('Cleared existing messages');

    // Insert seed data
    await Message.insertMany(seedMessages);
    console.log(`Successfully seeded ${seedMessages.length} messages`);

    console.log('Seed data inserted successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

if (require.main === module) {
  seedDatabase();
}

export default seedDatabase;