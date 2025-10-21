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

  console.log('Creating venues (5 venues)...');
  const venues = await Promise.all([
    prisma.venue.create({ data: { name: 'Berliner Messehalle', slug: 'berliner-messehalle', address: 'Messedamm 22', city: 'Berlin', state: 'Berlin', country: 'Deutschland', postalCode: '14055', latitude: 52.5058, longitude: 13.2813, capacity: 5000, amenities: ['Parkplatz', 'WLAN', 'Barrierefreiheit', 'Garderobe', 'Gastronomie', 'Klimaanlage'] } }),
    prisma.venue.create({ data: { name: 'Münchner Kulturzentrum', slug: 'muenchner-kulturzentrum', address: 'Leopoldstraße 45', city: 'München', state: 'Bayern', country: 'Deutschland', postalCode: '80802', latitude: 48.1549, longitude: 11.5804, capacity: 3000, amenities: ['WLAN', 'Barrierefreiheit', 'Garderobe', 'Gastronomie', 'Outdoor-Bereich'] } }),
    prisma.venue.create({ data: { name: 'Hamburger Konzerthaus', slug: 'hamburger-konzerthaus', address: 'Große Bleichen 30', city: 'Hamburg', state: 'Hamburg', country: 'Deutschland', postalCode: '20354', latitude: 53.5527, longitude: 9.9901, capacity: 2000, amenities: ['Parkplatz', 'WLAN', 'Barrierefreiheit', 'Garderobe', 'Bar'] } }),
    prisma.venue.create({ data: { name: 'Frankfurter Festhalle', slug: 'frankfurter-festhalle', address: 'Ludwig-Erhard-Anlage 1', city: 'Frankfurt am Main', state: 'Hessen', country: 'Deutschland', postalCode: '60327', latitude: 50.1109, longitude: 8.6821, capacity: 1000, amenities: ['WLAN', 'Barrierefreiheit', 'Gastronomie', 'Klimaanlage'] } }),
    prisma.venue.create({ data: { name: 'Stuttgarter Liederhalle', slug: 'stuttgarter-liederhalle', address: 'Berliner Platz 1-3', city: 'Stuttgart', state: 'Baden-Württemberg', country: 'Deutschland', postalCode: '70174', latitude: 48.7758, longitude: 9.1829, capacity: 500, amenities: ['Parkplatz', 'WLAN', 'Barrierefreiheit', 'Garderobe'] } }),
  ]);
  console.log(`✅ Created ${venues.length} venues`);

  console.log('Creating tags (15 tags)...');
  const tags = await Promise.all([
    prisma.tag.create({ data: { name: 'Live Musik', slug: 'live-musik' } }),
    prisma.tag.create({ data: { name: 'Outdoor', slug: 'outdoor' } }),
    prisma.tag.create({ data: { name: 'Familienfreundlich', slug: 'familienfreundlich' } }),
    prisma.tag.create({ data: { name: 'Indoor', slug: 'indoor' } }),
    prisma.tag.create({ data: { name: 'Wochenende', slug: 'wochenende' } }),
    prisma.tag.create({ data: { name: 'Abendveranstaltung', slug: 'abendveranstaltung' } }),
    prisma.tag.create({ data: { name: 'Klassische Musik', slug: 'klassische-musik' } }),
    prisma.tag.create({ data: { name: 'Pop & Rock', slug: 'pop-rock' } }),
    prisma.tag.create({ data: { name: 'Jazz', slug: 'jazz' } }),
    prisma.tag.create({ data: { name: 'Food & Drinks', slug: 'food-drinks' } }),
    prisma.tag.create({ data: { name: 'Workshop', slug: 'workshop' } }),
    prisma.tag.create({ data: { name: 'Networking', slug: 'networking' } }),
    prisma.tag.create({ data: { name: 'Sport', slug: 'sport' } }),
    prisma.tag.create({ data: { name: 'Kultur', slug: 'kultur' } }),
    prisma.tag.create({ data: { name: 'Bildung', slug: 'bildung' } }),
  ]);
  console.log(`✅ Created ${tags.length} tags`);

  console.log('Creating events (50 events, this may take a moment)...');
  const events: any[] = [];
  const now = new Date();

  const eventTemplates = [
    { title: 'Berliner Philharmoniker - Klassik Konzert', category: 'MUSIC', desc: 'Ein unvergesslicher Abend mit den Berliner Philharmonikern. Erleben Sie klassische Meisterwerke.', price: 75 },
    { title: 'Rock am Ring Festival', category: 'FESTIVAL', desc: 'Deutschlands größtes Rockfestival mit internationalen Top-Acts.', price: 299 },
    { title: 'Jazz Nacht München', category: 'MUSIC', desc: 'Eine Nacht voller Jazz mit lokalen und internationalen Künstlern.', price: 45 },
    { title: 'Electronic Music Festival Hamburg', category: 'FESTIVAL', desc: 'Die besten DJs der elektronischen Musikszene.', price: 65 },
    { title: 'Acoustic Live Session', category: 'MUSIC', desc: 'Unplugged-Konzert mit Singer-Songwritern.', price: 25 },
    { title: 'Fußball Bundesliga: Bayern vs. Dortmund', category: 'SPORTS', desc: 'Das Spitzenspiel der Bundesliga!', price: 120 },
    { title: 'Berlin Marathon', category: 'SPORTS', desc: 'Der größte Marathon Deutschlands.', price: 0 },
    { title: 'Basketball Bundesliga Finals', category: 'SPORTS', desc: 'Die entscheidenden Spiele der Basketball Bundesliga.', price: 45 },
    { title: 'Tennis Masters Stuttgart', category: 'SPORTS', desc: 'Internationale Tennis-Stars kämpfen um den Titel.', price: 80 },
    { title: 'Handball Champions League', category: 'SPORTS', desc: 'Europas beste Handballteams im Kampf.', price: 35 },
    { title: 'Tech Summit Berlin 2025', category: 'CONFERENCE', desc: 'Die führende Technologiekonferenz Deutschlands.', price: 499 },
    { title: 'Digital Marketing Konferenz', category: 'CONFERENCE', desc: 'Lernen Sie die neuesten Trends kennen.', price: 299 },
    { title: 'Startup Pitch Day München', category: 'CONFERENCE', desc: 'Startups präsentieren ihre Ideen vor Investoren.', price: 0 },
    { title: 'Nachhaltigkeits-Kongress', category: 'CONFERENCE', desc: 'Diskussionen über Nachhaltigkeit und Klimaschutz.', price: 150 },
    { title: 'AI & Machine Learning Summit', category: 'CONFERENCE', desc: 'Die Zukunft der Künstlichen Intelligenz.', price: 399 },
    { title: 'Fotografie Workshop für Anfänger', category: 'WORKSHOP', desc: 'Lernen Sie die Grundlagen der Fotografie.', price: 120 },
    { title: 'Coding Bootcamp: Python', category: 'WORKSHOP', desc: 'Intensiver 2-Tages-Workshop für Python-Programmierung.', price: 450 },
    { title: 'Yoga & Meditation Retreat', category: 'WORKSHOP', desc: 'Ein Wochenende für Körper und Geist.', price: 280 },
    { title: 'Kochkurs: Italienische Küche', category: 'WORKSHOP', desc: 'Lernen Sie authentische italienische Gerichte zu kochen.', price: 95 },
    { title: 'Business English Workshop', category: 'WORKSHOP', desc: 'Verbessern Sie Ihr Business-Englisch.', price: 199 },
    { title: 'Faust - Deutsches Theater', category: 'THEATER', desc: 'Goethes Klassiker neu interpretiert.', price: 55 },
    { title: 'Musical: Das Phantom der Oper', category: 'THEATER', desc: 'Andrew Lloyd Webbers Meisterwerk live auf der Bühne.', price: 89 },
    { title: 'Comedy Night Hamburg', category: 'THEATER', desc: 'Die besten deutschen Comedians auf einer Bühne.', price: 35 },
    { title: 'Shakespeares Hamlet', category: 'THEATER', desc: 'Eine klassische Aufführung von Hamlet.', price: 48 },
    { title: 'Improvisationstheater Show', category: 'THEATER', desc: 'Spontan, witzig, einzigartig! Jede Show ist anders.', price: 22 },
    { title: 'Moderne Kunst Ausstellung', category: 'EXHIBITION', desc: 'Zeitgenössische Kunstwerke von nationalen und internationalen Künstlern.', price: 15 },
    { title: 'Historisches Museum: Römisches Reich', category: 'EXHIBITION', desc: 'Eine Reise in die Antike mit Artefakten aus dem Römischen Reich.', price: 12 },
    { title: 'Fotografie Ausstellung: Urban Life', category: 'EXHIBITION', desc: 'Eindrucksvolle Fotografien des urbanen Lebens.', price: 8 },
    { title: 'Dinosaurier Ausstellung', category: 'EXHIBITION', desc: 'Für die ganze Familie! Lebensgroße Dinosaurier-Modelle.', price: 18 },
    { title: 'Design & Innovation Expo', category: 'EXHIBITION', desc: 'Die neuesten Trends in Design und Produktinnovation.', price: 0 },
    { title: 'Oktoberfest München', category: 'FESTIVAL', desc: 'Das größte Volksfest der Welt! Bier, Brezeln und bayerische Gemütlichkeit.', price: 0 },
    { title: 'Weihnachtsmarkt Berlin', category: 'FESTIVAL', desc: 'Traditioneller Weihnachtsmarkt mit Glühwein und Kunsthandwerk.', price: 0 },
    { title: 'Street Food Festival Hamburg', category: 'FESTIVAL', desc: 'Kulinarische Weltreise! Food Trucks aus aller Welt.', price: 0 },
    { title: 'Karneval der Kulturen', category: 'FESTIVAL', desc: 'Ein buntes Fest der Vielfalt mit Musik und Tanz.', price: 0 },
    { title: 'Jazz & Blues Festival', category: 'FESTIVAL', desc: 'Drei Tage Jazz und Blues unter freiem Himmel.', price: 85 },
    { title: 'Weinverkostung: Deutsche Weine', category: 'OTHER', desc: 'Entdecken Sie die Vielfalt deutscher Weine.', price: 45 },
    { title: 'Flohmärkte & Antiquitäten', category: 'OTHER', desc: 'Stöbern Sie nach Schätzen auf dem größten Flohmarkt.', price: 0 },
    { title: 'Buchlesung: Bestseller Autor', category: 'OTHER', desc: 'Der Bestseller-Autor liest aus seinem neuen Roman.', price: 15 },
    { title: 'Charity Gala', category: 'OTHER', desc: 'Ein glamouröser Abend für den guten Zweck.', price: 250 },
    { title: 'Poetry Slam Night', category: 'OTHER', desc: 'Talentierte Poeten kämpfen um die Gunst des Publikums.', price: 10 },
    { title: 'CrossFit Championship', category: 'SPORTS', desc: 'Die stärksten Athleten Deutschlands im Wettkampf.', price: 25 },
    { title: 'Weinwanderung durch die Pfalz', category: 'OTHER', desc: 'Wandern Sie durch malerische Weinberge.', price: 65 },
    { title: 'Salsa Dance Night', category: 'MUSIC', desc: 'Heißblütige lateinamerikanische Rhythmen.', price: 18 },
    { title: 'Minecraft Building Workshop', category: 'WORKSHOP', desc: 'Für Kinder und Jugendliche. Kreatives Bauen in Minecraft.', price: 35 },
    { title: 'Film Festival: Independent Cinema', category: 'EXHIBITION', desc: 'Die besten unabhängigen Filme des Jahres.', price: 20 },
    { title: 'Business Networking Breakfast', category: 'CONFERENCE', desc: 'Frühstücken und netzwerken mit Unternehmern.', price: 30 },
    { title: 'Orchesterkonzert: Filmmusik', category: 'MUSIC', desc: 'Die schönsten Filmmelodien live vom Orchester.', price: 52 },
    { title: 'Stand-Up Paddling Kurs', category: 'WORKSHOP', desc: 'Lernen Sie Stand-Up Paddling auf dem See.', price: 75 },
    { title: 'Fashion Week Berlin', category: 'EXHIBITION', desc: 'Die neuesten Modetrends auf dem Laufsteg.', price: 180 },
    { title: 'Biergarten Festival', category: 'FESTIVAL', desc: 'Traditionelle bayerische Musik, Bier und gute Laune.', price: 0 },
  ];

  for (let i = 0; i < eventTemplates.length; i++) {
    const tmpl = eventTemplates[i];
    const venue = venues[getRandomInt(0, venues.length - 1)];
    const organizer = organizerUsers[getRandomInt(0, organizerUsers.length - 1)];

    let startDate: Date, endDate: Date, status: string;
    if (i < 15) {
      const daysAgo = getRandomInt(30, 180);
      startDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
      endDate = new Date(startDate.getTime() + getRandomInt(2, 8) * 60 * 60 * 1000);
      status = 'COMPLETED';
    } else if (i < 35) {
      const daysAhead = getRandomInt(1, 90);
      startDate = new Date(now.getTime() + daysAhead * 24 * 60 * 60 * 1000);
      endDate = new Date(startDate.getTime() + getRandomInt(2, 8) * 60 * 60 * 1000);
      status = 'PUBLISHED';
    } else if (i < 45) {
      const daysAhead = getRandomInt(30, 120);
      startDate = new Date(now.getTime() + daysAhead * 24 * 60 * 60 * 1000);
      endDate = new Date(startDate.getTime() + getRandomInt(2, 8) * 60 * 60 * 1000);
      status = 'DRAFT';
    } else {
      const daysAhead = getRandomInt(10, 60);
      startDate = new Date(now.getTime() + daysAhead * 24 * 60 * 60 * 1000);
      endDate = new Date(startDate.getTime() + getRandomInt(2, 8) * 60 * 60 * 1000);
      status = 'CANCELLED';
    }

    const capacity = getRandomInt(50, venue.capacity);
    const bookedCount = status === 'PUBLISHED' ? getRandomInt(0, capacity) : status === 'COMPLETED' ? capacity : 0;

    const slug = tmpl.title
      .toLowerCase()
      .replace(/ä/g, 'ae')
      .replace(/ö/g, 'oe')
      .replace(/ü/g, 'ue')
      .replace(/ß/g, 'ss')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .substring(0, 100) + '-' + (i + 1);

    const event = await prisma.event.create({
      data: {
        title: tmpl.title,
        slug,
        description: tmpl.desc,
        category: tmpl.category as any,
        venueId: venue.id,
        capacity,
        bookedCount,
        price: tmpl.price,
        currency: 'EUR',
        startDate,
        endDate,
        status: status as any,
        organizerId: organizer.id,
        publishedAt: status === 'PUBLISHED' || status === 'COMPLETED' ? startDate : null,
        imageUrl: `https://picsum.photos/seed/event${i + 1}/800/600`,
      },
    });
    events.push(event);
  }
  console.log(`✅ Created ${events.length} events`);

  console.log('Creating event-tag associations...');
  let tagCount = 0;
  for (const event of events) {
    const randomTags = getRandomItems(tags, getRandomInt(2, 4));
    for (const tag of randomTags) {
      await prisma.eventTag.create({ data: { eventId: event.id, tagId: tag.id } });
      tagCount++;
    }
  }
  console.log(`✅ Created ${tagCount} event-tag associations`);

  console.log('Creating bookings (40 bookings)...');
  const publishedEvents = events.filter(e => e.status === 'PUBLISHED');
  const bookingStatuses = ['CONFIRMED', 'CONFIRMED', 'CONFIRMED', 'PENDING', 'CANCELLED'];
  const bookings = [];
  
  for (let i = 0; i < 40; i++) {
    const user = regularUsers[getRandomInt(0, regularUsers.length - 1)];
    const event = publishedEvents[getRandomInt(0, publishedEvents.length - 1)];
    const seats = getRandomInt(1, 8);
    const totalPrice = parseFloat(event.price.toString()) * seats;
    const status = bookingStatuses[getRandomInt(0, bookingStatuses.length - 1)];

    const booking = await prisma.booking.create({
      data: {
        userId: user.id,
        eventId: event.id,
        seats,
        totalPrice,
        status: status as any,
        paymentId: status === 'CONFIRMED' ? `PAY-${Date.now()}-${i}` : null,
      },
    });
    bookings.push(booking);
  }
  console.log(`✅ Created ${bookings.length} bookings`);

  console.log('Creating content pages (5 pages)...');
  const contentPages = await Promise.all([
    prisma.contentPage.create({ data: { slug: 'home', title: 'Willkommen bei BOH Events', metaDescription: 'Entdecken Sie die besten Veranstaltungen in Deutschland.', status: 'PUBLISHED', authorId: adminUsers[0].id, publishedAt: new Date() } }),
    prisma.contentPage.create({ data: { slug: 'about', title: 'Über Uns', metaDescription: 'Erfahren Sie mehr über BOH Events.', status: 'PUBLISHED', authorId: adminUsers[0].id, publishedAt: new Date() } }),
    prisma.contentPage.create({ data: { slug: 'contact', title: 'Kontakt', metaDescription: 'Nehmen Sie Kontakt mit uns auf.', status: 'PUBLISHED', authorId: adminUsers[1].id, publishedAt: new Date() } }),
    prisma.contentPage.create({ data: { slug: 'privacy', title: 'Datenschutzerklärung', metaDescription: 'Unsere Datenschutzerklärung.', status: 'PUBLISHED', authorId: adminUsers[1].id, publishedAt: new Date() } }),
    prisma.contentPage.create({ data: { slug: 'terms', title: 'Allgemeine Geschäftsbedingungen', metaDescription: 'Lesen Sie unsere AGB.', status: 'PUBLISHED', authorId: adminUsers[0].id, publishedAt: new Date() } }),
  ]);
  console.log(`✅ Created ${contentPages.length} content pages`);

  console.log('Creating content sections (15+ sections)...');
  await Promise.all([
    prisma.contentSection.create({ data: { pageId: contentPages[0].id, type: 'HERO', position: 0, visible: true, data: { heading: 'Erleben Sie unvergessliche Events', subheading: 'Die besten Konzerte, Festivals, Workshops und mehr', backgroundImage: 'https://picsum.photos/seed/hero1/1920/1080', ctaText: 'Events entdecken', ctaLink: '/events', alignment: 'center' } } }),
    prisma.contentSection.create({ data: { pageId: contentPages[0].id, type: 'TEXT', position: 1, visible: true, data: { content: '<h2>Willkommen bei BOH Events</h2><p>Ihre Plattform für die besten Veranstaltungen in ganz Deutschland.</p>', alignment: 'center' } } }),
    prisma.contentSection.create({ data: { pageId: contentPages[0].id, type: 'EVENT_LIST', position: 2, visible: true, data: { numberOfEvents: 6, categoryFilter: null, sortOrder: 'startDate', displayStyle: 'grid' } } }),
    prisma.contentSection.create({ data: { pageId: contentPages[0].id, type: 'GALLERY', position: 3, visible: true, data: { images: [{ url: 'https://picsum.photos/seed/gallery1/800/600', caption: 'Konzert in Berlin', altText: 'Live Konzert' }, { url: 'https://picsum.photos/seed/gallery2/800/600', caption: 'Festival', altText: 'Festival' }], columns: 2, spacing: 'medium' } } }),
    prisma.contentSection.create({ data: { pageId: contentPages[1].id, type: 'TEXT', position: 0, visible: true, data: { content: '<h1>Über BOH Events</h1><p>Seit 2020 Ihre Anlaufstelle für Events aller Art in Deutschland.</p>', alignment: 'left' } } }),
    prisma.contentSection.create({ data: { pageId: contentPages[1].id, type: 'IMAGE', position: 1, visible: true, data: { imageUrl: 'https://picsum.photos/seed/about1/1200/800', caption: 'Unser Team bei der Arbeit', altText: 'BOH Events Team', alignment: 'center', width: '100%' } } }),
    prisma.contentSection.create({ data: { pageId: contentPages[1].id, type: 'TEXT', position: 2, visible: true, data: { content: '<h2>Unsere Mission</h2><p>Wir wollen jedem den Zugang zu großartigen Events ermöglichen.</p>', alignment: 'left' } } }),
    prisma.contentSection.create({ data: { pageId: contentPages[1].id, type: 'VIDEO', position: 3, visible: true, data: { videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', thumbnailUrl: 'https://picsum.photos/seed/video1/800/450', caption: 'Erfahren Sie mehr über BOH Events' } } }),
    prisma.contentSection.create({ data: { pageId: contentPages[2].id, type: 'TEXT', position: 0, visible: true, data: { content: '<h1>Kontaktieren Sie uns</h1><p>Haben Sie Fragen? Wir sind für Sie da!</p>', alignment: 'center' } } }),
    prisma.contentSection.create({ data: { pageId: contentPages[2].id, type: 'CONTACT_FORM', position: 1, visible: true, data: { fields: [{ name: 'name', type: 'text', label: 'Name', required: true }, { name: 'email', type: 'email', label: 'E-Mail', required: true }, { name: 'subject', type: 'text', label: 'Betreff', required: true }, { name: 'message', type: 'textarea', label: 'Nachricht', required: true }], submitButtonText: 'Nachricht senden', recipientEmail: 'kontakt@boh.de', successMessage: 'Vielen Dank! Wir melden uns in Kürze.' } } }),
    prisma.contentSection.create({ data: { pageId: contentPages[2].id, type: 'TEXT', position: 2, visible: true, data: { content: '<h2>Weitere Kontaktmöglichkeiten</h2><p><strong>Telefon:</strong> +49 30 12345678<br><strong>E-Mail:</strong> kontakt@boh.de<br><strong>Adresse:</strong> Musterstraße 123, 10115 Berlin</p>', alignment: 'left' } } }),
    prisma.contentSection.create({ data: { pageId: contentPages[3].id, type: 'TEXT', position: 0, visible: true, data: { content: '<h1>Datenschutzerklärung</h1><h2>1. Datenschutz auf einen Blick</h2><p>Die folgenden Hinweise geben einen Überblick darüber, was mit Ihren personenbezogenen Daten passiert.</p>', alignment: 'left' } } }),
    prisma.contentSection.create({ data: { pageId: contentPages[4].id, type: 'TEXT', position: 0, visible: true, data: { content: '<h1>Allgemeine Geschäftsbedingungen</h1><h2>§1 Geltungsbereich</h2><p>Diese AGB gelten für alle Verträge über die Nutzung der BOH Events Plattform.</p>', alignment: 'left' } } }),
  ]);
  const sectionCount = await prisma.contentSection.count();
  console.log(`✅ Created ${sectionCount} content sections`);

  console.log('Creating site settings (10 settings)...');
  const settings = await Promise.all([
    prisma.siteSetting.create({ data: { key: 'site_name', value: 'BOH Events', type: 'TEXT', group: 'GENERAL', description: 'Name der Website', isPublic: true } }),
    prisma.siteSetting.create({ data: { key: 'site_description', value: 'Deutschlands führende Event-Plattform', type: 'TEXT', group: 'GENERAL', description: 'Beschreibung der Website', isPublic: true } }),
    prisma.siteSetting.create({ data: { key: 'contact_email', value: 'kontakt@boh.de', type: 'TEXT', group: 'CONTACT', description: 'Haupt-Kontakt E-Mail', isPublic: true } }),
    prisma.siteSetting.create({ data: { key: 'contact_phone', value: '+49 30 12345678', type: 'TEXT', group: 'CONTACT', description: 'Kontakt Telefonnummer', isPublic: true } }),
    prisma.siteSetting.create({ data: { key: 'contact_address', value: 'Musterstraße 123, 10115 Berlin, Deutschland', type: 'TEXT', group: 'CONTACT', description: 'Geschäftsadresse', isPublic: true } }),
    prisma.siteSetting.create({ data: { key: 'facebook_url', value: 'https://facebook.com/bohevents', type: 'TEXT', group: 'SOCIAL_MEDIA', description: 'Facebook Seite URL', isPublic: true } }),
    prisma.siteSetting.create({ data: { key: 'instagram_url', value: 'https://instagram.com/bohevents', type: 'TEXT', group: 'SOCIAL_MEDIA', description: 'Instagram Profil URL', isPublic: true } }),
    prisma.siteSetting.create({ data: { key: 'twitter_url', value: 'https://twitter.com/bohevents', type: 'TEXT', group: 'SOCIAL_MEDIA', description: 'Twitter/X Profil URL', isPublic: true } }),
    prisma.siteSetting.create({ data: { key: 'default_meta_description', value: 'Finden Sie die besten Events in Deutschland', type: 'TEXT', group: 'SEO', description: 'Standard Meta-Beschreibung für SEO', isPublic: false } }),
    prisma.siteSetting.create({ data: { key: 'primary_color', value: '#3B82F6', type: 'TEXT', group: 'APPEARANCE', description: 'Primäre Markenfarbe (Hex)', isPublic: true } }),
  ]);
  console.log(`✅ Created ${settings.length} site settings`);

  console.log('Creating media files (3 sample files)...');
  const media = await Promise.all([
    prisma.mediaFile.create({ data: { filename: 'hero-image-1.jpg', originalName: 'concert-crowd.jpg', mimeType: 'image/jpeg', fileSize: 2048576, width: 1920, height: 1080, url: 'https://picsum.photos/seed/media1/1920/1080', thumbnailUrl: 'https://picsum.photos/seed/media1/400/300', altText: 'Konzertpublikum', uploadedById: adminUsers[0].id, folder: 'events' } }),
    prisma.mediaFile.create({ data: { filename: 'festival-stage-2.jpg', originalName: 'festival-stage.jpg', mimeType: 'image/jpeg', fileSize: 3145728, width: 2400, height: 1600, url: 'https://picsum.photos/seed/media2/2400/1600', thumbnailUrl: 'https://picsum.photos/seed/media2/400/300', altText: 'Festival Bühne', uploadedById: adminUsers[1].id, folder: 'events' } }),
    prisma.mediaFile.create({ data: { filename: 'workshop-room-3.jpg', originalName: 'workshop.jpg', mimeType: 'image/jpeg', fileSize: 1572864, width: 1600, height: 1200, url: 'https://picsum.photos/seed/media3/1600/1200', thumbnailUrl: 'https://picsum.photos/seed/media3/400/300', altText: 'Workshop Raum', uploadedById: organizerUsers[0].id, folder: 'general' } }),
  ]);
  console.log(`✅ Created ${media.length} media files`);

  console.log('\n✅ Database seeding completed successfully!\n');
  console.log('Summary:');
  console.log(`- Users: ${allUsers.length} (2 ADMIN, 3 ORGANIZER, 15 USER)`);
  console.log(`- Venues: ${venues.length}`);
  console.log(`- Events: ${events.length}`);
  console.log(`- Tags: ${tags.length}`);
  console.log(`- Event-Tag Associations: ${tagCount}`);
  console.log(`- Bookings: ${bookings.length}`);
  console.log(`- Content Pages: ${contentPages.length}`);
  console.log(`- Content Sections: ${sectionCount}`);
  console.log(`- Site Settings: ${settings.length}`);
  console.log(`- Media Files: ${media.length}`);
  console.log('\nAll passwords: Password123!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
