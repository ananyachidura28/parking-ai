const prisma = require('../config/prisma');
const bcrypt = require('bcryptjs');

async function seedDatabase() {
  try {
    const locationCount = await prisma.parkingLocation.count();
    if (locationCount > 0) {
      return;
    }

    console.log('🌱 Auto-seeding initial parking locations into database...');

    const hashedPassword = await bcrypt.hash('password123', 10);

    const admin = await prisma.user.upsert({
      where: { email: 'admin@parksmart.ai' },
      update: {},
      create: {
        email: 'admin@parksmart.ai',
        password: hashedPassword,
        fullName: 'Alex Vance (Admin)',
        phone: '+91 9876543210',
        role: 'ADMINISTRATOR',
        loyaltyPoints: 1200,
        walletBalance: 2500.0,
        membershipTier: 'Platinum',
      },
    });

    const customer = await prisma.user.upsert({
      where: { email: 'user@parksmart.ai' },
      update: {},
      create: {
        email: 'user@parksmart.ai',
        password: hashedPassword,
        fullName: 'Sarah Jenkins',
        phone: '+91 9812345678',
        role: 'CUSTOMER',
        loyaltyPoints: 340,
        walletBalance: 850.0,
        membershipTier: 'Gold',
      },
    });

    await prisma.vehicle.upsert({
      where: { plateNumber: 'KA-01-MJ-4092' },
      update: {},
      create: {
        userId: customer.id,
        plateNumber: 'KA-01-MJ-4092',
        make: 'Tesla',
        model: 'Model 3 EV',
        color: 'Pearl White',
        isEV: true,
      },
    });

    const locationsData = [
      {
        name: 'Phoenix Marketcity Mega Mall',
        slug: 'phoenix-marketcity-mall',
        category: 'MALL',
        address: 'Whitefield Main Road, Mahadevapura',
        city: 'Bengaluru',
        state: 'Karnataka',
        zipCode: '560048',
        latitude: 12.9958,
        longitude: 77.6964,
        totalSlots: 120,
        hourlyRate: 60.0,
        evChargingRate: 30.0,
        valetFee: 150.0,
        rating: 4.9,
        imageUrl: 'https://images.unsplash.com/photo-1519567241046-7f570eee3ce6?w=800&auto=format&fit=crop&q=80',
        description: 'Premier shopping hub featuring 4 sub-basement parking levels, ultra-fast 150kW EV charging, automated valet tag drop, and direct multiplex access.',
        hasValet: true,
        hasEVCharging: true,
        hasDisabledAccess: true,
      },
      {
        name: 'Apollo Super Speciality Hospital',
        slug: 'apollo-super-speciality-hospital',
        category: 'HOSPITAL',
        address: '154/11 Bannerghatta Road, Opposite IIM',
        city: 'Bengaluru',
        state: 'Karnataka',
        zipCode: '560076',
        latitude: 12.8964,
        longitude: 77.5986,
        totalSlots: 90,
        hourlyRate: 40.0,
        evChargingRate: 20.0,
        valetFee: 80.0,
        rating: 4.8,
        imageUrl: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=800&auto=format&fit=crop&q=80',
        description: 'Dedicated healthcare parking with priority emergency entrance access, step-free wheelchair bays, 24/7 medical valet assistance, and direct OPD elevator connect.',
        hasValet: true,
        hasEVCharging: true,
        hasDisabledAccess: true,
      },
      {
        name: 'Select CITYWALK Mall',
        slug: 'select-citywalk-mall',
        category: 'MALL',
        address: 'A-3, District Centre, Saket',
        city: 'New Delhi',
        state: 'Delhi',
        zipCode: '110017',
        latitude: 28.5285,
        longitude: 77.2195,
        totalSlots: 100,
        hourlyRate: 70.0,
        evChargingRate: 35.0,
        valetFee: 200.0,
        rating: 4.9,
        imageUrl: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=800&auto=format&fit=crop&q=80',
        description: 'Luxury shopping center featuring Tesla Superchargers, priority VIP valet lounges, and direct access to high-end fashion arcades.',
        hasValet: true,
        hasEVCharging: true,
        hasDisabledAccess: true,
      },
      {
        name: 'Fortis Memorial Research Institute',
        slug: 'fortis-memorial-research-institute',
        category: 'HOSPITAL',
        address: 'Sector 44, Opposite HUDA City Centre',
        city: 'Gurugram',
        state: 'Haryana',
        zipCode: '122002',
        latitude: 28.4595,
        longitude: 77.0724,
        totalSlots: 80,
        hourlyRate: 45.0,
        evChargingRate: 25.0,
        valetFee: 100.0,
        rating: 4.7,
        imageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&auto=format&fit=crop&q=80',
        description: 'State-of-the-art medical center parking with express patient drop-off, dedicated ambulance bay clearance, and indoor navigation to OPD & ICU blocks.',
        hasValet: true,
        hasEVCharging: true,
        hasDisabledAccess: true,
      },
      {
        name: 'DLF Cyber Hub Tech Park',
        slug: 'dlf-cyber-hub-it-park',
        category: 'IT_PARK',
        address: 'DLF Cyber City, Phase 2',
        city: 'Gurugram',
        state: 'Haryana',
        zipCode: '122002',
        latitude: 28.4950,
        longitude: 77.0895,
        totalSlots: 150,
        hourlyRate: 50.0,
        evChargingRate: 25.0,
        valetFee: 120.0,
        rating: 4.8,
        imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80',
        description: 'Modern corporate hub parking equipped with smart License Plate Recognition (ANPR), EV charging hubs, and seamless monthly subscriptions.',
        hasValet: true,
        hasEVCharging: true,
        hasDisabledAccess: true,
      },
    ];

    for (const locData of locationsData) {
      const location = await prisma.parkingLocation.upsert({
        where: { slug: locData.slug },
        update: locData,
        create: locData,
      });

      const floor = await prisma.floor.create({
        data: {
          locationId: location.id,
          name: 'Basement Level 1',
          level: -1,
        },
      });

      const zones = ['Zone A (East Elevator)', 'Zone B (Main Entrance)', 'Zone C (EV Charger Bay)'];
      for (let i = 1; i <= 18; i++) {
        const isEV = i <= 6;
        await prisma.slot.create({
          data: {
            locationId: location.id,
            floorId: floor.id,
            slotNumber: `B1-${i < 10 ? '0' + i : i}`,
            zone: zones[i % zones.length],
            type: isEV ? 'EV_CHARGING' : (i % 5 === 0 ? 'ACCESSIBLE' : 'REGULAR'),
            status: i % 4 === 0 ? 'OCCUPIED' : (i % 7 === 0 ? 'RESERVED' : 'AVAILABLE'),
            hourlyPrice: locData.hourlyRate,
            isEVCharger: isEV,
            chargerKw: isEV ? 150 : 0,
          },
        });
      }
    }

    console.log('🎉 Auto-seeding completed successfully!');
  } catch (error) {
    console.error('Auto-seed error:', error.message);
  }
}

module.exports = { seedDatabase };
