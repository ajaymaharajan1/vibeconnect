import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seed() {
  console.log('Seeding Multi-City and Google Places Data...');

  // 1. Seed Cities (Chennai, Bengaluru)
  const chennai = await prisma.city.upsert({
    where: { name: 'Chennai' },
    update: {},
    create: {
      name: 'Chennai',
      state: 'Tamil Nadu',
      country: 'India',
      lat: 13.0827,
      lng: 80.2707,
      status: 'ACTIVE',
    },
  });

  const bengaluru = await prisma.city.upsert({
    where: { name: 'Bengaluru' },
    update: {},
    create: {
      name: 'Bengaluru',
      state: 'Karnataka',
      country: 'India',
      lat: 12.9716,
      lng: 77.5946,
      status: 'ACTIVE',
    },
  });

  console.log(`Cities seeded: ${chennai.name} (${chennai.id}), ${bengaluru.name} (${bengaluru.id})`);

  // 2. Seed Places for Chennai & Bengaluru across 10 Categories
  const placesData = [
    // Chennai Places
    {
      googlePlaceId: 'place_ch_cafe_1',
      name: 'Blue Tokai Coffee Roasters',
      category: 'CAFES',
      address: 'Nungambakkam, Chennai, Tamil Nadu',
      cityId: chennai.id,
      lat: 13.0624,
      lng: 80.2435,
      rating: 4.6,
      userRatingsTotal: 840,
      isOpenNow: true,
      photoUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=600&q=80',
      googleMapsUrl: 'https://www.google.com/maps/dir/?api=1&destination=Blue+Tokai+Coffee+Nungambakkam+Chennai',
    },
    {
      googlePlaceId: 'place_ch_mall_1',
      name: 'Express Avenue Mall',
      category: 'MALLS',
      address: 'Royapettah, Chennai, Tamil Nadu',
      cityId: chennai.id,
      lat: 13.0587,
      lng: 80.2642,
      rating: 4.5,
      userRatingsTotal: 3400,
      isOpenNow: true,
      photoUrl: 'https://images.unsplash.com/photo-1519567241046-7f570eee3ce6?auto=format&fit=crop&w=600&q=80',
      googleMapsUrl: 'https://www.google.com/maps/dir/?api=1&destination=Express+Avenue+Mall+Chennai',
    },
    {
      googlePlaceId: 'place_ch_cinema_1',
      name: 'PVR Heritage Cinema',
      category: 'THEATRES',
      address: 'Ecr Road, Chennai, Tamil Nadu',
      cityId: chennai.id,
      lat: 12.9812,
      lng: 80.2589,
      rating: 4.7,
      userRatingsTotal: 1200,
      isOpenNow: true,
      photoUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80',
      googleMapsUrl: 'https://www.google.com/maps/dir/?api=1&destination=PVR+Heritage+Cinema+Chennai',
    },
    {
      googlePlaceId: 'place_ch_sports_1',
      name: 'Gamepoint Badminton & Turf',
      category: 'SPORTS',
      address: 'Velachery, Chennai, Tamil Nadu',
      cityId: chennai.id,
      lat: 12.9754,
      lng: 80.2212,
      rating: 4.8,
      userRatingsTotal: 450,
      isOpenNow: true,
      photoUrl: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=600&q=80',
      googleMapsUrl: 'https://www.google.com/maps/dir/?api=1&destination=Gamepoint+Badminton+Velachery+Chennai',
    },
    // Bengaluru Places
    {
      googlePlaceId: 'place_blr_cafe_1',
      name: 'Third Wave Coffee',
      category: 'CAFES',
      address: 'Indiranagar, Bengaluru, Karnataka',
      cityId: bengaluru.id,
      lat: 12.9784,
      lng: 77.6408,
      rating: 4.7,
      userRatingsTotal: 1420,
      isOpenNow: true,
      photoUrl: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=600&q=80',
      googleMapsUrl: 'https://www.google.com/maps/dir/?api=1&destination=Third+Wave+Coffee+Indiranagar+Bengaluru',
    },
    {
      googlePlaceId: 'place_blr_mall_1',
      name: 'Phoenix Marketcity',
      category: 'MALLS',
      address: 'Whitefield, Bengaluru, Karnataka',
      cityId: bengaluru.id,
      lat: 12.9958,
      lng: 77.6964,
      rating: 4.6,
      userRatingsTotal: 5800,
      isOpenNow: true,
      photoUrl: 'https://images.unsplash.com/photo-1567449303078-57ad995bd301?auto=format&fit=crop&w=600&q=80',
      googleMapsUrl: 'https://www.google.com/maps/dir/?api=1&destination=Phoenix+Marketcity+Whitefield+Bengaluru',
    },
    {
      googlePlaceId: 'place_blr_gaming_1',
      name: 'Smaaash Gaming & Bowling Arena',
      category: 'GAMING',
      address: '1 MG-Lido Mall, MG Road, Bengaluru',
      cityId: bengaluru.id,
      lat: 12.9734,
      lng: 77.6198,
      rating: 4.5,
      userRatingsTotal: 920,
      isOpenNow: true,
      photoUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=600&q=80',
      googleMapsUrl: 'https://www.google.com/maps/dir/?api=1&destination=Smaaash+MG+Road+Bengaluru',
    },
  ];

  for (const place of placesData) {
    await prisma.place.upsert({
      where: { googlePlaceId: place.googlePlaceId },
      update: {},
      create: place,
    });
  }

  console.log(`Seeded ${placesData.length} places for Chennai and Bengaluru.`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
