'use server'

import { db } from '@/lib/db';
import { flights, bookings } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { flightSchema } from '@/lib/validators';

export async function createFlight(data: any) {
  const validated = flightSchema.parse(data);
  
  await db.insert(flights).values({
    ...validated,
    startDate: new Date(validated.startDate),
    endDate: new Date(validated.endDate),
  });

  return { success: true };
}

export async function updateFlight(id: number, data: any) {
  const validated = flightSchema.partial().parse(data);
  
  await db.update(flights)
    .set(validated)
    .where(eq(flights.id, id));

  return { success: true };
}

export async function deleteFlight(id: number) {
  await db.delete(flights).where(eq(flights.id, id));
  return { success: true };
}

export async function getAllBookings() {
  return await db.query.bookings.findMany({
    with: {
      flight: true,
      returnFlight: true,
    },
    orderBy: (bookings, { desc }) => [desc(bookings.createdAt)],
  });
}

export async function updateBookingStatus(id: number, status: string) {
  await db.update(bookings)
    .set({ status: status as any })
    .where(eq(bookings.id, id));

  return { success: true };
}
