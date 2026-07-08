'use server'

import { db } from '@/lib/db';
import { flights, seats, bookings } from '@/lib/db/schema';
import { and, eq, gte, lte, inArray } from 'drizzle-orm';
import { searchSchema } from '@/lib/validators';

export async function searchFlights(formData: FormData) {
  const validated = searchSchema.parse({
    origin: formData.get('origin'),
    destination: formData.get('destination'),
    departureDate: formData.get('departureDate'),
    returnDate: formData.get('returnDate'),
    tripType: formData.get('tripType'),
  });

  const departureDay = new Date(validated.departureDate).getDay();

  const outboundFlights = await db.select()
    .from(flights)
    .where(
      and(
        eq(flights.origin, validated.origin),
        eq(flights.destination, validated.destination),
        lte(flights.startDate, new Date(validated.departureDate)),
        gte(flights.endDate, new Date(validated.departureDate)),
      )
    );

  const filteredOutbound = outboundFlights.filter(f => 
    f.daysOfWeek.includes(departureDay)
  );

  let returnFlights: typeof outboundFlights = [];
  
  if (validated.tripType === 'round-trip' && validated.returnDate) {
    const returnDay = new Date(validated.returnDate).getDay();
    
    returnFlights = await db.select()
      .from(flights)
      .where(
        and(
          eq(flights.origin, validated.destination),
          eq(flights.destination, validated.origin),
          lte(flights.startDate, new Date(validated.returnDate)),
          gte(flights.endDate, new Date(validated.returnDate)),
        )
      );
    
    returnFlights = returnFlights.filter(f => 
      f.daysOfWeek.includes(returnDay)
    );
  }

  return {
    outbound: filteredOutbound,
    return: returnFlights,
  };
}

export async function getFlightById(id: number) {
  const result = await db.select().from(flights).where(eq(flights.id, id));
  return result[0] || null;
}

export async function getAvailableSeats(flightId: number, departureDate: string) {
  const occupiedSeats = await db.select()
    .from(seats)
    .where(
      and(
        eq(seats.flightId, flightId),
        eq(seats.departureDate, new Date(departureDate)),
        eq(seats.isOccupied, true)
      )
    );

  return occupiedSeats.map(s => s.seatNumber);
}
