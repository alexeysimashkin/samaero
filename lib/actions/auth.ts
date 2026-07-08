'use server'

import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { registerSchema, loginSchema } from '@/lib/validators';
import { signIn, signOut } from '@/auth';

export async function register(formData: FormData) {
  const validated = registerSchema.parse({
    email: formData.get('email'),
    password: formData.get('password'),
    fullName: formData.get('fullName'),
    phone: formData.get('phone'),
  });

  const existing = await db.select().from(users).where(eq(users.email, validated.email));
  
  if (existing.length > 0) {
    throw new Error('Пользователь с таким email уже существует');
  }

  const passwordHash = await bcrypt.hash(validated.password, 10);
  
  await db.insert(users).values({
    email: validated.email,
    passwordHash,
    fullName: validated.fullName,
    phone: validated.phone,
    role: 'user',
  });

  return { success: true };
}

export async function login(formData: FormData) {
  const validated = loginSchema.parse({
    email: formData.get('email'),
    password: formData.get('password'),
  });

  await signIn('credentials', {
    email: validated.email,
    password: validated.password,
    redirect: false,
  });

  return { success: true };
}

export async function logout() {
  await signOut({ redirect: false });
}
