import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../src/server/models/User.js';
import Interview from '../src/server/models/Interview.js';
import Report from '../src/server/models/Report.js';
import Template from '../src/server/models/Template.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/Resume2Role';

const dummyUsers = [
  {
    name: 'Ankit',
    email: 'ankitadash4656@gmail.com',
    password: '22bcsj43',
    avatarUrl: '/src/assets/profile_img/f1.jpg',
  },
];

const dummyTemplates = [
  {
    title: 'Software Engineer',
    description: 'General software engineering interview covering data structures, algorithms, and system design.',
    role: 'Software Engineer',
    type: 'Technical',
    icon: '💻',
  },
  {
    title: 'Product Manager',
    description: 'Focuses on product sense, strategy, and execution for PM roles.',
    role: 'Product Manager',
    type: 'Behavioral',
    icon: '📊',
  },
  {
    title: 'Frontend Developer',
    description: 'Deep dive into React, CSS, and modern web technologies.',
    role: 'Frontend Developer',
    type: 'Technical',
    icon: '🎨',
  },
];

const seed = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB for seeding...');

    // Seed Users, Interviews, Reports
    for (const userData of dummyUsers) {
      const exists = await User.findOne({ email: userData.email });
      if (!exists) {
        const user = new User(userData);
        await user.save();
        console.log(`User ${userData.email} created.`);

        // Create a dummy interview and report for this user
        const interview = new Interview({
          userId: user._id,
          role: 'Frontend Developer',
          type: 'Technical',
          status: 'completed',
        });
        await interview.save();

        const report = new Report({
          interviewId: interview._id,
          userId: user._id,
          score: 12,
          verdict: 'Not Recommended',
          overallImpression: 'Your responses showed intent but lacked structured examples and strong role-specific impact.',
          breakdown: [
            {
              title: 'Communication Skills',
              score: '5/20',
              bullets: ['Responses lacked structure.', 'Examples were limited.'],
            },
            {
              title: 'Technical Depth',
              score: '4/20',
              bullets: ['Concepts were partially correct.', 'More practical examples needed.'],
            },
          ],
        });
        await report.save();
        console.log(`Dummy report created for ${userData.email}.`);
      } else {
        console.log(`User ${userData.email} already exists, skipping.`);
      }
    }

    // Seed Templates
    for (const templateData of dummyTemplates) {
      const exists = await Template.findOne({ title: templateData.title });
      if (!exists) {
        await new Template(templateData).save();
        console.log(`Template ${templateData.title} created.`);
      } else {
        console.log(`Template ${templateData.title} already exists, skipping.`);
      }
    }

    console.log('Seeding completed.');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seed();
