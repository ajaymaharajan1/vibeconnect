import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/cities - List Supported Active & Coming Soon Cities
export const getCities = async (req: Request, res: Response): Promise<void> => {
  try {
    const activeCities = await prisma.city.findMany({
      where: { status: 'ACTIVE' },
      orderBy: { name: 'asc' },
    });

    const comingSoonCities = [
      { name: 'Hyderabad', state: 'Telangana', country: 'India', status: 'COMING_SOON' },
      { name: 'Mumbai', state: 'Maharashtra', country: 'India', status: 'COMING_SOON' },
      { name: 'Delhi NCR', state: 'Delhi', country: 'India', status: 'COMING_SOON' },
      { name: 'Pune', state: 'Maharashtra', country: 'India', status: 'COMING_SOON' },
    ];

    res.json({
      success: true,
      activeCities,
      comingSoonCities,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch cities' });
  }
};

// PATCH /api/users/city - Update Physical & Selected Discovery City
export const updateCityPreferences = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.id || 'demo-user-id';
    const { physicalCityId, discoveryCityId, neighborhood, permissionStatus } = req.body;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    let discoveryCity = null;
    if (discoveryCityId) {
      discoveryCity = await prisma.city.findUnique({ where: { id: discoveryCityId } });
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(physicalCityId && { cityId: physicalCityId }),
        ...(discoveryCityId && { selectedDiscoveryCityId: discoveryCityId }),
        ...(discoveryCity && { city: discoveryCity.name }),
        ...(neighborhood && { neighborhood }),
        ...(permissionStatus && { locationPermissionStatus: permissionStatus }),
      },
      include: {
        physicalCity: true,
        discoveryCity: true,
      },
    });

    res.json({
      success: true,
      message: 'Location preferences updated successfully',
      user: {
        id: updated.id,
        city: updated.city,
        neighborhood: updated.neighborhood,
        physicalCity: updated.physicalCity,
        discoveryCity: updated.discoveryCity,
        permissionStatus: updated.locationPermissionStatus,
      },
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to update city preferences' });
  }
};
