'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    
    try {
      const response = await fetch('/api/auth/callback/credentials', {
        method: 'POST',
        body: JSON.stringify({
          email: formData.get('email'),
          password: formData.get('password'),
        }),
        headers: { 'Content-Type': 'application/json' },
      })
      
      if (response.ok) {
        router.push('/')
        router.refresh()
      } else {
        setError('Неверный email или пароль')
      }
    } catch (err) {
      setError('Ошибка при входе')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <svg className="w-16 h-16 mx-auto text-lime-500 transform rotate-12" viewBox="0 0 24 24" fill="currentColor">
            <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
          </svg>
          <h2 className="mt-4 text-3xl font-bold">Вход в SamAero</h2>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Пароль</label>
            <input
              type="password"
              name="password"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-lime-500 text-white py-3 rounded-lg font-medium hover:bg-lime-600 transition"
          >
            Войти
          </button>
        </form>

        <p className="text-center mt-4 text-gray-600">
          Нет аккаунта?{' '}
          <Link href="/auth/register" className="text-lime-600 hover:text-lime-700">
            Зарегистрироваться
          </Link>
        </p>
      </div>
    </div>
  )
}
