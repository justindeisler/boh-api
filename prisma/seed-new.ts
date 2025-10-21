import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

function getRandomItems<T>(array: T[], count: number): T[] {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function main() {
  console.log('🌱 Starting database seed...');
  console.log('Clearing existing data...');
  
  await prisma.booking.deleteMany({});
  await prisma.eventTag.deleteMany({});
  await prisma.contentSection.deleteMany({});
  await prisma.contentPage.deleteMany({});
  await prisma.mediaFile.deleteMany({});
  await prisma.siteSetting.deleteMany({});
  await prisma.event.deleteMany({});
  await prisma.tag.deleteMany({});
  await prisma.venue.deleteMany({});
  await prisma.user.deleteMany({});

  console.log('Creating users (20 users)...');
  const hashedPassword = await hashPassword('Password123!');

  const adminUsers = await Promise.all([
    prisma.user.create({ data: { email: 'admin@boh.de', passwordHash: hashedPassword, firstName: 'Anna', lastName: 'Schmidt', phone: '+49 30 12345678', role: 'ADMIN', emailVerified: true } }),
    prisma.user.create({ data: { email: 'manager@boh.de', passwordHash: hashedPassword, firstName: 'Michael', lastName: 'Müller', phone: '+49 89 98765432', role: 'ADMIN', emailVerified: true } }),
  ]);

  const organizerUsers = await Promise.all([
    prisma.user.create({ data: { email: 'organizer1@boh.de', passwordHash: hashedPassword, firstName: 'Thomas', lastName: 'Weber', phone: '+49 40 11223344', role: 'ORGANIZER', emailVerified: true } }),
    prisma.user.create({ data: { email: 'organizer2@boh.de', passwordHash: hashedPassword, firstName: 'Sarah', lastName: 'Fischer', phone: '+49 69 55667788', role: 'ORGANIZER', emailVerified: true } }),
    prisma.user.create({ data: { email: 'organizer3@boh.de', passwordHash: hashedPassword, firstName: 'Markus', lastName: 'Becker', role: 'ORGANIZER', emailVerified: true } }),
  ]);

  const regularUsers = await Promise.all([
    prisma.user.create({ data: { email: 'user1@boh.de', passwordHash: hashedPassword, firstName: 'Julia', lastName: 'Schneider', phone: '+49 711 22334455', role: 'USER', emailVerified: true } }),
    prisma.user.create({ data: { email: 'user2@boh.de', passwordHash: hashedPassword, firstName: 'Leon', lastName: 'Wagner', role: 'USER', emailVerified: true } }),
    prisma.user.create({ data: { email: 'user3@boh.de', passwordHash: hashedPassword, firstName: 'Emma', lastName: 'Hoffmann', phone: '+49 30 66778899', role: 'USER', emailVerified: true } }),
    prisma.user.create({ data: { email: 'user4@boh.de', passwordHash: hashedPassword, firstName: 'Felix', lastName: 'Richter', role: 'USER', emailVerified: true } }),
    prisma.user.create({ data: { email: 'user5@boh.de', passwordHash: hashedPassword, firstName: 'Sophie', lastName: 'Klein', phone: '+49 89 33445566', role: 'USER', emailVerified: true } }),
    prisma.user.create({ data: { email: 'user6@boh.de', passwordHash: hashedPassword, firstName: 'Lukas', lastName: 'Koch', role: 'USER', emailVerified: true } }),
    prisma.user.create({ data: { email: 'user7@boh.de', passwordHash: hashedPassword, firstName: 'Mia', lastName: 'Schröder', phone: '+49 40 77889900', role: 'USER', emailVerified: true } }),
    prisma.user.create({ data: { email: 'user8@boh.de', passwordHash: hashedPassword, firstName: 'Jonas', lastName: 'Neumann', role: 'USER', emailVerified: true } }),
    prisma.user.create({ data: { email: 'user9@boh.de', passwordHash: hashedPassword, firstName: 'Hannah', lastName: 'Zimmermann', phone: '+49 69 44556677', role: 'USER', emailVerified: true } }),
    prisma.user.create({ data: { email: 'user10@boh.de', passwordHash: hashedPassword, firstName: 'David', lastName: 'Braun', role: 'USER', emailVerified: true } }),
    prisma.user.create({ data: { email: 'user11@boh.de', passwordHash: hashedPassword, firstName: 'Lena', lastName: 'Krüger', phone: '+49 711 88990011', role: 'USER', emailVerified: true } }),
    prisma.user.create({ data: { email: 'user12@boh.de', passwordHash: hashedPassword, firstName: 'Paul', lastName: 'Hartmann', role: 'USER', emailVerified: true } }),
    prisma.user.create({ data: { email: 'user13@boh.de', passwordHash: hashedPassword, firstName: 'Laura', lastName: 'Lange', phone: '+49 30 99001122', role: 'USER', emailVerified: true } }),
    prisma.user.create({ data: { email: 'user14@boh.de', passwordHash: hashedPassword, firstName: 'Tim', lastName: 'Schmitt', role: 'USER', emailVerified: true } }),
    prisma.user.create({ data: { email: 'user15@boh.de', passwordHash: hashedPassword, firstName: 'Lisa', lastName: 'Werner', phone: '+49 89 11223344', role: 'USER', emailVerified: true } }),
  ]);

  const allUsers = [...adminUsers, ...organizerUsers, ...regularUsers];
  console.log(`✅ Created ${allUsers.length} users`);
  console.log('See full seed output for details...');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.();
  });