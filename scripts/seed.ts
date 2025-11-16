import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Message from '../models/Message';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/thanksgiving_messages';

const seedMessages = [
  {
    fromName: 'Батбаяр',
    toName: 'Эх эцэг',
    message: 'Энэ жил би гэр бүл, эрүүл мэнд, найз нөхдөө маш их талархаж байна. Бидний хамтдаа өнгөрүүлсэн цагуудад талархал илэрхийлье.',
    emoji: '🦃',
    status: 'approved',
    createdAt: new Date('2024-11-10')
  },
  {
    fromName: 'Сарангэрэл',
    toName: 'Хамт олон',
    message: 'Миний ажил, дэмжлэг үзүүлсэн хамтран ажиллагсад, өдөр бүр суралцаж хөгжих боломжид талархаж байна. Толгой дээрээ орон, ширээн дээр хоол байгаад баяртай байна.',
    emoji: '🙏',
    status: 'approved',
    createdAt: new Date('2024-11-12')
  },
  {
    fromName: 'Өлзийбаяр',
    toName: 'Бүх хүмүүс',
    message: 'Энэ жил би эрүүл мэнд, боловсрол, мөрөөдлөө хэрэгжүүлэх боломжтой байгаадаа үнэхээр талархаж байна. Намайг дэмжсэн бүх хүмүүст баярлалаа!',
    emoji: '❤️',
    status: 'approved',
    createdAt: new Date('2024-11-14')
  },
  {
    fromName: 'Мөнхбаяр',
    toName: 'Найз нөхөд',
    message: 'Сайн найзууд, дулаан тэврэлт, амттай хоол, амьдралын энгийн баяр баясгалангуудад талархаж байна. Талархлын баяр бидэнд амьдралын бага зүйлсийг үнэлэхийг сануулдаг.',
    emoji: '🍂',
    status: 'approved',
    createdAt: new Date('2024-11-15')
  },
  {
    fromName: 'Цэцэгмаа',
    toName: 'Гэр бүл',
    message: 'Би дахин нэг жилийн бэлэг, хайртай хүмүүстэйгээ хуваалцсан инээд, бэрхшээлийг даван туулах хүч чадалд талархаж байна. Бүх хүмүүст адислалтай Талархлын баяр болтугай!',
    emoji: '🥧',
    status: 'pending',
    createdAt: new Date('2024-11-16')
  },
  {
    fromName: 'Болормаа',
    toName: 'Багш нар',
    message: 'Энэ жил надад заасан багш нар, дэмжлэг үзүүлсэн ааж ээж, найз нөхдөдөө гүн талархал илэрхийлж байна. Та бүхэн миний амьдралыг баяжуулсан.',
    emoji: '📚',
    status: 'approved',
    createdAt: new Date('2024-11-13')
  },
  {
    fromName: 'Гантулга',
    toName: 'Ах эгч нар',
    message: 'Хүүхдийн инээд, гэр бүлийн дулаан уур амьсгал, эрүүл мэндээр өдөр бүрийг өнгөрүүлж байгаадаа баяртай байна. Энэ бүхэн үнэхээр их баялаг.',
    emoji: '👶',
    status: 'approved',
    createdAt: new Date('2024-11-11')
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