'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const cities = [
  'Москва', 'Санкт-Петербург', 'Сочи', 'Калининград',
  'Екатеринбург', 'Новосибирск', 'Казань', 'Владивосток',
  'Минск', 'Астана', 'Дубай', 'Стамбул'
]

export default function SearchForm() {
  const router = useRouter()
  const [tripType, setTripType] = useState<'one-way' | 'round-trip'>('one-way')
  const [origin, setOrigin] = useState('')
  const [destination, setDestination] = useState('')
  const [departureDate, setDepartureDate] = useState('')
  const [returnDate, setReturnDate] = useState('')
  const [showOrigin, setShowOrigin] = useState(false)
  const [showDestination, setShowDestination] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams({
      origin,
      destination,
      departureDate,
      tripType,
      ...(returnDate && { returnDate }),
    })
    router.push(`/search?${params.toString()}`)
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-2xl p-6 max-w-4xl mx-auto">
      <div className="flex gap-4 mb-6">
        <button
          type="button"
          onClick={() => setTripType('one-way')}
          className={`px-6 py-2 rounded-lg font-medium transition ${
            tripType === 'one-way' ? 'bg-lime-500 text-white' : 'bg-gray-100 text-gray-600'
          }`}
        >
          В одну сторону
        </button>
        <button
          type="button"
          onClick={() => setTripType('round-trip')}
          className={`px-6 py-2 rounded-lg font-medium transition ${
            tripType === 'round-trip' ? 'bg-lime-500 text-white' : 'bg-gray-100 text-gray-600'
          }`}
        >
          Туда-обратно
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">Откуда</label>
          <input
            type="text"
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            onFocus={() => setShowOrigin(true)}
            onBlur={() => setTimeout(() => setShowOrigin(false), 200)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-transparent"
            placeholder="Город отправления"
          />
          {showOrigin && origin.length > 0 && (
            <div className="absolute z-10 w-full bg-white border border-gray-200 rounded-lg mt-1 max-h-48 overflow-y-auto shadow-lg">
              {cities
                .filter(c => c.toLowerCase().includes(origin.toLowerCase()))
                .map(city => (
                  <div
                    key={city}
                    className="px-4 py-2 hover:bg-lime-50 cursor-pointer"
                    onClick={() => { setOrigin(city); setShowOrigin(false) }}
                  >
                    {city}
                  </div>
                ))}
            </div>
          )}
        </div>

        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">Куда</label>
          <input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            onFocus={() => setShowDestination(true)}
            onBlur={() => setTimeout(() => setShowDestination(false), 200)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-transparent"
            placeholder="Город назначения"
          />
          {showDestination && destination.length > 0 && (
            <div className="absolute z-10 w-full bg-white border border-gray-200 rounded-lg mt-1 max-h-48 overflow-y-auto shadow-lg">
              {cities
                .filter(c => c.toLowerCase().includes(destination.toLowerCase()))
                .map(city => (
                  <div
                    key={city}
                    className="px-4 py-2 hover:bg-lime-50 cursor-pointer"
                    onClick={() => { setDestination(city); setShowDestination(false) }}
                  >
                    {city}
                  </div>
                ))}
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Дата вылета</label>
          <input
            type="date"
            value={departureDate}
            onChange={(e) => setDepartureDate(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-transparent"
          />
        </div>

        {tripType === 'round-trip' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Дата возвращения</label>
            <input
              type="date"
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-transparent"
            />
          </div>
        )}
      </div>

      <button
        type="submit"
        className="w-full mt-6 bg-lime-500 text-white py-4 rounded-xl font-bold text-lg hover:bg-lime-600 transition shadow-lg hover:shadow-xl"
      >
        Найти рейсы
      </button>
    </form>
  )
}
