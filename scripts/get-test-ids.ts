import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔍 Fetching Test IDs...\n');

  // Get venues
  const venues = await prisma.venue.findMany({
    select: { id: true, name: true, slug: true },
  });

  console.log('📍 Venues:');
  venues.forEach((venue) => {
    console.log(`  - ${venue.name}`);
    console.log(`    ID: ${venue.id}`);
    console.log(`    Slug: ${venue.slug}\n`);
  });

  // Get users
  const users = await prisma.user.findMany({
    select: { id: true, email: true, firstName: true, lastName: true, role: true },
  });

  console.log('👥 Users:');
  users.forEach((user) => {
    console.log(`  - ${user.firstName} ${user.lastName} (${user.role})`);
    console.log(`    ID: ${user.id}`);
    console.log(`    Email: ${user.email}\n`);
  });

  // Get events
  const events = await prisma.event.findMany({
    select: { id: true, title: true, slug: true, status: true },
  });

  console.log('🎉 Events:');
  events.forEach((event) => {
    console.log(`  - ${event.title} [${event.status}]`);
    console.log(`    ID: ${event.id}`);
    console.log(`    Slug: ${event.slug}\n`);
  });
}

main()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
