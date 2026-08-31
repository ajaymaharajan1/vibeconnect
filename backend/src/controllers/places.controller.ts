import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/places/nearby - 10 Social Categories, Sorting, City Filter
export const getNearbyPlaces = async (req: Request, res: Response): Promise<void> => {
  try {
    const category = (req.query.category as string) || 'ALL';
    const cityName = (req.query.city as string) || 'Chennai';
    const sortBy = (req.query.sortBy as string) || 'distance'; // distance, rating, popularity, open_now

    // Find target city
    const city = await prisma.city.findFirst({
      where: { name: { equals: cityName } },
    });

    const whereClause: any = {};
    if (city) {
      whereClause.cityId = city.id;
    }
    if (category !== 'ALL') {
      whereClause.category = category.toUpperCase();
    }

    let places = await prisma.place.findMany({
      where: whereClause,
      include: { city: { select: { name: true, state: true } } },
    });

    // Fallback dynamic places generator if DB cache is small
    if (places.length < 3) {
      places = generateDynamicFallbackPlaces(cityName, category);
    }

    // Sorting
    if (sortBy === 'rating') {
      places.sort((a: any, b: any) => b.rating - a.rating);
    } else if (sortBy === 'popularity') {
      places.sort((a: any, b: any) => b.userRatingsTotal - a.userRatingsTotal);
    } else if (sortBy === 'open_now') {
      places = places.filter((p: any) => p.isOpenNow);
    }

    res.json({
      success: true,
      city: cityName,
      category,
      count: places.length,
      places,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to discover nearby places' });
  }
};

// GET /api/places/:id - Place Details & Google Maps Navigation Link
export const getPlaceDetails = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const place = await prisma.place.findUnique({
      where: { id },
      include: { city: true },
    });

    if (!place) {
      res.status(404).json({ error: 'Place not found' });
      return;
    }

    res.json({
      success: true,
      place,
      googleMapsNavigationUrl: place.googleMapsUrl,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch place details' });
  }
};

function generateDynamicFallbackPlaces(cityName: string, category: string): any[] {
  const isBengaluru = cityName.toLowerCase() === 'bengaluru';
  return [
    {
      id: `dyn_place_1`,
      googlePlaceId: `dyn_g_1`,
      name: isBengaluru ? 'Third Wave Coffee Roasters' : 'Blue Tokai Coffee Roasters',
      category: 'CAFES',
      address: isBengaluru ? '100 Feet Rd, Indiranagar, Bengaluru' : 'Khader Nawaz Khan Rd, Nungambakkam, Chennai',
      lat: isBengaluru ? 12.9784 : 13.0624,
      lng: isBengaluru ? 77.6408 : 80.2435,
      rating: 4.7,
      userRatingsTotal: 1240,
      isOpenNow: true,
      photoUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=600&q=80',
      googleMapsUrl: `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
        isBengaluru ? 'Third Wave Coffee Indiranagar' : 'Blue Tokai Nungambakkam'
      )}`,
    },
    {
      id: `dyn_place_2`,
      googlePlaceId: `dyn_g_2`,
      name: isBengaluru ? 'Phoenix Marketcity' : 'Express Avenue Mall',
      category: 'MALLS',
      address: isBengaluru ? 'Whitefield, Bengaluru' : 'Royapettah, Chennai',
      lat: isBengaluru ? 12.9958 : 13.0587,
      lng: isBengaluru ? 77.6964 : 80.2642,
      rating: 4.6,
      userRatingsTotal: 4300,
      isOpenNow: true,
      photoUrl: 'https://images.unsplash.com/photo-1519567241046-7f570eee3ce6?auto=format&fit=crop&w=600&q=80',
      googleMapsUrl: `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
        isBengaluru ? 'Phoenix Marketcity Whitefield' : 'Express Avenue Mall'
      )}`,
    },
  ];
}
