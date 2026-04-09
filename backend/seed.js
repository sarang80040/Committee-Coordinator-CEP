const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const committees = [
  { id: 'technovanza', name: 'Technovanza' },
  { id: 'sra', name: 'SRA' },
  { id: 'pratibimb', name: 'Pratibimb' },
  { id: 'enthusia', name: 'Enthusia' },
  { id: 'rangawardhan', name: 'Rangawardhan' },
  { id: 'coc', name: 'COC' },
  { id: 'vjti-racing', name: 'VJTI Racing' },
  { id: 'digital-vjti', name: 'Digital VJTI' },
  { id: 'vishwa-vjti', name: 'Vishwa VJTI' },
  { id: 'synergists', name: 'Synergists' },
  { id: 'ecell', name: 'E-Cell' },
  { id: 'alumni', name: 'Alumni Association' },
];

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected for seeding...');

    // Clear existing users
    await User.deleteMany({});
    console.log('Cleared existing users.');

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    const users = [];

    for (const committee of committees) {
      // Create a student for each committee
      users.push({
        username: `${committee.id}-student`,
        password: hashedPassword,
        role: 'student',
        committee: committee.id,
      });

      // Create a teacher for each committee
      users.push({
        username: `${committee.id}-teacher`,
        password: hashedPassword,
        role: 'teacher',
        committee: committee.id,
      });
    }

    await User.insertMany(users);
    console.log(`Seeded ${users.length} users successfully!\n`);

    console.log('=== DUMMY LOGIN CREDENTIALS ===');
    console.log('Password for ALL accounts: password123\n');
    console.log('Committee'.padEnd(20), 'Student Username'.padEnd(30), 'Teacher Username');
    console.log('-'.repeat(80));
    for (const committee of committees) {
      console.log(
        committee.name.padEnd(20),
        `${committee.id}-student`.padEnd(30),
        `${committee.id}-teacher`
      );
    }
    console.log('\n');

    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err.message);
    process.exit(1);
  }
};

seedUsers();
