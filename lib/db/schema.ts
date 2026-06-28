import { 
  pgTable, 
  serial, 
  varchar, 
  text, 
  integer, 
  timestamp, 
  date, 
  jsonb,
  boolean,
  real,
  pgEnum
} from 'drizzle-orm/pg-core';

export const tariffEnum = pgEnum('tariff', ['economy', 'optimum', 'maximum', 'business']);
export const mealTypeEnum = pgEnum('meal_type', ['regular', 'vegetarian', 'child']);
export const bookingStatusEnum = pgEnum('booking_status', [
  'pending', 
  'confirmed', 
  'cancelled', 
  'checked_in',
  'completed'
]);
export const roleEnum = pgEnum('role', ['user', 'admin']);

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  fullName: varchar('full_name', { length: 255 }),
  phone: varchar('phone', { length: 20 }),
  role: roleEnum('role').default('user').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const flights = pgTable('flights', {
  id: serial('id').primaryKey(),
  flightNumber: varchar('flight_number', { length: 10 }).notNull().unique(),
  origin: varchar('origin', { length: 100 }).notNull(),
  destination: varchar('destination', { length: 100 }).notNull(),
  departureTime: varchar('departure_time', { length: 5 }).notNull(), // HH:mm
  arrivalTime: varchar('arrival_time', { length: 5 }).notNull(),
  startDate: date('start_date').notNull(),
  endDate: date('end_date').notNull(),
  daysOfWeek: integer('days_of_week').array().notNull(), // 0-6, где 0 = воскресенье
  priceEconomy: real('price_economy').notNull(),
  priceOptimum: real('price_optimum').notNull(),
  priceMaximum: real('price_maximum').notNull(),
  priceBusiness: real('price_business').notNull(),
  totalSeats: integer('total_seats').default(180).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const bookings = pgTable('bookings', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  flightId: integer('flight_id').references(() => flights.id).notNull(),
  departureDate: date('departure_date').notNull(),
  returnFlightId: integer('return_flight_id').references(() => flights.id),
  returnDepartureDate: date('return_departure_date'),
  tariff: tariffEnum('tariff').notNull(),
  seatNumber: varchar('seat_number', { length: 10 }),
  mealType: mealTypeEnum('meal_type').default('regular'),
  extraBaggage: boolean('extra_baggage').default(false),
  status: bookingStatusEnum('status').default('pending').notNull(),
  bookingReference: varchar('booking_reference', { length: 10 }).notNull().unique(),
  passengerFullName: varchar('passenger_full_name', { length: 255 }).notNull(),
  passengerBirthDate: date('passenger_birth_date').notNull(),
  passengerPassport: varchar('passenger_passport', { length: 50 }).notNull(),
  contactEmail: varchar('contact_email', { length: 255 }).notNull(),
  contactPhone: varchar('contact_phone', { length: 20 }).notNull(),
  totalPrice: real('total_price').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const seats = pgTable('seats', {
  id: serial('id').primaryKey(),
  flightId: integer('flight_id').references(() => flights.id).notNull(),
  departureDate: date('departure_date').notNull(),
  seatNumber: varchar('seat_number', { length: 10 }).notNull(),
  bookingId: integer('booking_id').references(() => bookings.id),
  isOccupied: boolean('is_occupied').default(false).notNull(),
});
