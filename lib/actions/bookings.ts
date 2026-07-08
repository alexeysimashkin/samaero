'use server'

import { db } from '@/lib/db';
import { bookings, seats } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { bookingSchema, checkInSchema } from '@/lib/validators';
import { auth } from '@/auth';
import { nanoid } from 'nanoid';

export async function createBooking(data: any) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('Необходимо авторизоваться');
  }

  const validated = bookingSchema.parse(data);
  
  const bookingReference = nanoid(10).toUpperCase();
  
  let totalPrice = 0;
  const flight = await db.query.flights.findFirst({
    where: eq(flights.id, validated.flightId)
  });
  
  if (!flight) throw new Error('Рейс не найден');
  
  const priceField = `price${validated.tariff.charAt(0).toUpperCase() + validated.tariff.slice(1)}` as keyof typeof flight;
  totalPrice = flight[priceField] as number;
  
  if (validated.extraBaggage) {
    totalPrice += 3000;
  }
  
  if (validated.returnFlightId) {
    const returnFlight = await db.query.flights.findFirst({
      where: eq(flights.id, validated.returnFlightId)
    });
    if (returnFlight) {
      totalPrice += returnFlight[priceField] as number;
    }
  }

  const [booking] = await db.insert(bookings).values({
    userId: parseInt(session.user.id),
    flightId: validated.flightId,
    departureDate: new Date(validated.departureDate),
    returnFlightId: validated.returnFlightId,
    returnDepartureDate: validated.returnDepartureDate ? new Date(validated.returnDepartureDate) : null,
    tariff: validated.tariff,
    seatNumber: validated.seatNumber,
    mealType: validated.mealType,
    extraBaggage: validated.extraBaggage,
    status: 'pending',
    bookingReference,
    passengerFullName: validated.passenger.fullName,
    passengerBirthDate: new Date(validated.passenger.birthDate),
    passengerPassport: validated.passenger.passport,
    contactEmail: validated.passenger.email,
    contactPhone: validated.passenger.phone,
    totalPrice,
  }).returning();

  // Занять место
  if (validated.seatNumber) {
    await db.insert(seats).values({
      flightId: validated.flightId,
      departureDate: new Date(validated.departureDate),
      seatNumber: validated.seatNumber,
      bookingId: booking.id,
      isOccupied: true,
    });
  }

  return booking;
}

export async function getUserBookings(userId: number) {
  return await db.select()
    .from(bookings)
    .where(eq(bookings.userId, userId))
    .orderBy(bookings.createdAt);
}

export async function getBookingByReference(reference: string) {
  const result = await db.select()
    .from(bookings)
    .where(eq(bookings.bookingReference, reference));
  return result[0] || null;
}

export async function checkIn(formData: FormData) {
  const validated = checkInSchema.parse({
    bookingReference: formData.get('bookingReference'),
    lastName: formData.get('lastName'),
  });

  const booking = await db.query.bookings.findFirst({
    where: eq(bookings.bookingReference, validated.bookingReference),
  });

  if (!booking) {
    throw new Error('Бронь не найдена');
  }

  const lastName = booking.passengerFullName.split(' ')[0];
  if (lastName.toLowerCase() !== validated.lastName.toLowerCase()) {
    throw new Error('Неверная фамилия');
  }

  await db.update(bookings)
    .set({ status: 'checked_in' })
    .where(eq(bookings.id, booking.id));

  return { success: true, booking };
}
