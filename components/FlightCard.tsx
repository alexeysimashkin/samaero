'use client'

import { useEffect, useState } from 'react';
import { getWeather } from '@/lib/weather';

interface Flight {
  id: number;
  flightNumber: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  priceEconomy: number;
  priceOptimum: number;
  priceMaximum: number;
  priceBusiness: number;
}

interface FlightCardProps {
  flight: Flight;
  onSelect: (flight: Flight) => void;
}

export default function FlightCard({ flight, onSelect }: FlightCardProps) {
  const [weather, setWeather] = useState<any>(null);

  useEffect(() => {
    getWeather(flight.destination).then(setWeather);
  }, [flight.destination]);

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition p-6 border border-gray-100">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-sm font-semibold text-gray-500">{flight.flightNumber}</span>
            <span className="px-2 py-1 bg-lime-100 text-lime-700 rounded-full text-xs">Прямой</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{flight.departureTime}</div>
              <div className="text-gray-600 font-medium">{flight.origin}</div>
            </div>

            <div className="flex-1 flex items-center px-4">
              <div className="h-px flex-1 bg-gray-300"></div>
              <svg className="w-6 h-6 text-lime-500 mx-2 transform rotate-45" fill="currentColor" viewBox="0 0 24 24">
                <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
              </svg>
              <div className="h-px flex-1 bg-gray-300"></div>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold">{flight.arrivalTime}</div>
              <div className="flex items-center gap-2">
                <span className="text-gray-600 font-medium">{flight.destination}</span>
                {weather && (
                  <div className="flex items-center text-sm text-gray-500">
                    <img 
                      src={`https://openweathermap.org/img/wn/${weather.icon}.png`}
                      alt="weather"
                      className="w-6 h-6"
                    />
                    <span>{weather.temp}°C</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end">
          <div className="text-3xl font-bold text-lime-600">
            {flight.priceEconomy.toLocaleString()} ₽
          </div>
          <button
            onClick={() => onSelect(flight)}
            className="mt-3 bg-lime-500 text-white px-6 py-2 rounded-lg hover:bg-lime-600 transition font-medium"
          >
            Выбрать
          </button>
        </div>
      </div>
    </div>
  );
}
