import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  // Create Admin
  const admin = await prisma.user.upsert({
    where: { email: 'admin@nicevision.bi' },
    update: {},
    create: {
      email: 'admin@nicevision.bi',
      name: 'Kim Gérard',
      role: 'ADMIN',
    },
  })

  // Create Packages
  const packages = [
    {
      name: 'Wedding Story',
      description: 'Cinematic wedding coverage',
      price: 1200,
      depositAmount: 300,
      duration: 480,
      includedPhotos: 400,
      deliveryDays: 14,
      category: 'Wedding',
      features: ['2 Photographers', 'Engagements', 'Photo Film'],
    },
    {
      name: 'Classic Portrait',
      description: 'Professional studio session',
      price: 300,
      depositAmount: 100,
      duration: 120,
      includedPhotos: 20,
      deliveryDays: 5,
      category: 'Portrait',
      features: ['1 Photographer', '2 Wardrobe changes'],
    },
  ]

  for (const pkg of packages) {
    await prisma.package.create({
      data: pkg,
    })
  }

  console.log('Seed data created!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
