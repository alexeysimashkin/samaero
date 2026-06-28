import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email('Неверный формат email'),
  password: z.string().min(6, 'Пароль должен быть минимум 6 символов'),
  fullName: z.string().min(2, 'Имя должно быть минимум 2 символа'),
  phone: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const searchSchema = z.object({
  origin: z.string().min(1, 'Выберите город отправления'),
  destination: z.string().min(1, 'Выберите город назначения'),
  departureDate: z.string().min(1, 'Выберите дату'),
  returnDate: z.string().optional(),
  tripType: z.enum(['one-way', 'round-trip']),
});

export const passengerSchema = z.object({
  fullName: z.string()
    .min(2, 'Имя должно быть минимум 2 символа')
    .regex(/^[a-zA-Z\s]+$/, 'Только латиница'),
  birthDate: z.string().min(1, 'Укажите дату рождения'),
  passport: z.string()
    .min(6, 'Номер паспорта должен быть минимум 6 символов')
    .regex(/^[a-zA-Z0-9]+$/, 'Только латиница и цифры'),
  email: z.string().email('Неверный email'),
  phone: z.string().min(10, 'Неверный номер телефона'),
});

export const bookingSchema = z.object({
  flightId: z.number(),
  departureDate: z.string(),
  returnFlightId: z.number().optional(),
  returnDepartureDate: z.string().optional(),
  tariff: z.enum(['economy', 'optimum', 'maximum', 'business']),
  seatNumber: z.string().optional(),
  mealType: z.enum(['regular', 'vegetarian', 'child']),
  extraBaggage: z.boolean(),
  passenger: passengerSchema,
});

export const checkInSchema = z.object({
  bookingReference: z.string().length(10),
  lastName: z.string().min(2),
});

export const flightSchema = z.object({
  flightNumber: z.string().min(3).max(10),
  origin: z.string().min(1),
  destination: z.string().min(1),
  departureTime: z.string().regex(/^\d{2}:\d{2}$/),
  arrivalTime: z.string().regex(/^\d{2}:\d{2}$/),
  startDate: z.string(),
  endDate: z.string(),
  daysOfWeek: z.array(z.number().min(0).max(6)),
  priceEconomy: z.number().positive(),
  priceOptimum: z.number().positive(),
  priceMaximum: z.number().positive(),
  priceBusiness: z.number().positive(),
  totalSeats: z.number().int().positive(),
});
