import { db } from './index';
import { flights, users } from './schema';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';

const cities = [
  'Москва', 'Санкт-Петербург', 'Сочи', 'Калининград', 
  'Екатеринбург', 'Новосибирск', 'Казань', 'Владивосток',
  'Минск', 'Астана', 'Дубай', 'Стамбул'
];

async function seed() {
  // Создаем админа
  const adminPassword = await bcrypt.hash('AdminSamAero2024!', 10);
  
  const existingAdmin = await db.select().from(users).where(eq(users.email, 'admin@samaero.com'));
  
  if (existingAdmin.length === 0) {
    await db.insert(users).values({
      email: 'admin@samaero.com',
      passwordHash: adminPassword,
      fullName: 'Администратор',
      role: 'admin',
    });
    console.log('Admin user created');
  }

  // Создаем тестовые рейсы
  const existingFlights = await db.select().from(flights);
  
  if (existingFlights.length === 0) {
    for (let i = 0; i < 20; i++) {
      const origin = cities[Math.floor(Math.random() * cities.length)];
      let destination = cities[Math.floor(Math.random() * cities.length)];
      while (destination === origin) {
        destination = cities[Math.floor(Math.random() * cities.length)];
      }

      const depHour = Math.floor(Math.random() * 24);
      const depMin = Math.random() > 0.5 ? '00' : '30';
      const duration = 2 + Math.floor(Math.random() * 8);
      const arrHour = (depHour + duration) % 24;
      
      await db.insert(flights).values({
        flightNumber: `SA${100 + i}`,
        origin,
        destination,
        departureTime: `${depHour.toString().padStart(2, '0')}:${depMin}`,
        arrivalTime: `${arrHour.toString().padStart(2, '0')}:${depMin}`,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2025-12-31'),
        daysOfWeek: [1, 2, 3, 4, 5, 6, 0],
        priceEconomy: 5000 + Math.floor(Math.random() * 15000),
        priceOptimum: 15000 + Math.floor(Math.random() * 20000),
        priceMaximum: 30000 + Math.floor(Math.random() * 25000),
        priceBusiness: 50000 + Math.floor(Math.random() * 50000),
        totalSeats: 180,
      });
    }
    console.log('Test flights created');
  }
}

seed().catch(console.error).finally(() => process.exit(0));
