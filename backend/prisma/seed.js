const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting ParkSmart AI Database Seeding with Verified Images...');

  // 1. Create Users
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

  const operator = await prisma.user.upsert({
    where: { email: 'operator@parksmart.ai' },
    update: {},
    create: {
      email: 'operator@parksmart.ai',
      password: hashedPassword,
      fullName: 'David Miller (Manager)',
      phone: '+91 9765432109',
      role: 'PARKING_OPERATOR',
    },
  });

  const valet = await prisma.user.upsert({
    where: { email: 'valet@parksmart.ai' },
    update: {},
    create: {
      email: 'valet@parksmart.ai',
      password: hashedPassword,
      fullName: 'Ravi Kumar (Valet Lead)',
      phone: '+91 9988776655',
      role: 'VALET_STAFF',
    },
  });

  console.log('✅ Users Created');

  // 2. Create Demo Vehicles
  const vehicle1 = await prisma.vehicle.upsert({
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

  console.log('✅ Vehicles Created');

  // 3. Create Parking Locations (High-Res Verified Images)
  const phoenixMall = await prisma.parkingLocation.upsert({
    where: { slug: 'phoenix-marketcity-mall' },
    update: {
      imageUrl: 'https://images.unsplash.com/photo-1519567241046-7f570eee3ce6?w=800&auto=format&fit=crop&q=80',
    },
    create: {
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
  });

  const apolloHospital = await prisma.parkingLocation.upsert({
    where: { slug: 'apollo-super-speciality-hospital' },
    update: {
      imageUrl: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=800&auto=format&fit=crop&q=80',
    },
    create: {
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
  });

  const citywalkMall = await prisma.parkingLocation.upsert({
    where: { slug: 'select-citywalk-mall' },
    update: {
      imageUrl: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=800&auto=format&fit=crop&q=80',
    },
    create: {
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
  });

  const fortisHospital = await prisma.parkingLocation.upsert({
    where: { slug: 'fortis-memorial-research-institute' },
    update: {
      imageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&auto=format&fit=crop&q=80',
    },
    create: {
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
  });

  const cyberHub = await prisma.parkingLocation.upsert({
    where: { slug: 'dlf-cyber-hub-it-park' },
    update: {
      imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80',
    },
    create: {
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
  });

  console.log('✅ High-Resolution Verified Locations Updated');

  // Floors & Slots check
  const b1Mall = await prisma.floor.findFirst({ where: { locationId: phoenixMall.id } });
  if (!b1Mall) {
    const newFloor = await prisma.floor.create({
      data: {
        locationId: phoenixMall.id,
        name: 'Basement 1 (Hypermarket & EV Zone)',
        level: -1,
      },
    });

    const zonesB1 = ['Zone A (East Elevator)', 'Zone B (West Gate)', 'Zone C (EV Hub)'];
    for (let i = 1; i <= 18; i++) {
      const isEV = i <= 6;
      await prisma.slot.create({
        data: {
          locationId: phoenixMall.id,
          floorId: newFloor.id,
          slotNumber: `B1-${i < 10 ? '0' + i : i}`,
          zone: zonesB1[i % zonesB1.length],
          type: isEV ? 'EV_CHARGING' : 'REGULAR',
          status: 'AVAILABLE',
          hourlyPrice: 60,
          isEVCharger: isEV,
          chargerKw: isEV ? 150 : 0,
        },
      });
    }
  }

  console.log('🎉 ParkSmart AI Seeding Completed Successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
