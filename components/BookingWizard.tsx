'use client'

import { useState } from 'react';
import { createBooking } from '@/lib/actions/bookings';

const steps = [
  'Выбор рейсов',
  'Выбор тарифа',
  'Данные пассажиров',
  'Выбор места',
  'Дополнительно',
  'Подтверждение'
];

export default function BookingWizard({ outboundFlight, returnFlight }: any) {
  const [currentStep, setCurrentStep] = useState(0);
  const [bookingData, setBookingData] = useState<any>({
    flightId: outboundFlight?.id,
    departureDate: '',
    returnFlightId: returnFlight?.id || null,
    returnDepartureDate: '',
    tariff: 'economy',
    seatNumber: null,
    mealType: 'regular',
    extraBaggage: false,
    passenger: {
      fullName: '',
      birthDate: '',
      passport: '',
      email: '',
      phone: '',
    }
  });

  const generateSeats = () => {
    const seats = [];
    const occupiedCount = Math.floor(180 * 0.97); // 97% занято
    const occupiedSeats = new Set<string>();
    
    for (let i = 0; i < occupiedCount; i++) {
      const row = Math.floor(Math.random() * 30) + 1;
      const col = String.fromCharCode(65 + Math.floor(Math.random() * 6));
      occupiedSeats.add(`${row}${col}`);
    }

    for (let row = 1; row <= 30; row++) {
      for (let col = 0; col < 6; col++) {
        const seatNum = `${row}${String.fromCharCode(65 + col)}`;
        if (!occupiedSeats.has(seatNum)) {
          seats.push(seatNum);
        }
      }
    }
    return seats;
  };

  const availableSeats = generateSeats();

  const handleSubmit = async () => {
    try {
      const booking = await createBooking(bookingData);
      alert(`Бронирование успешно! Номер брони: ${booking.bookingReference}`);
      window.location.href = '/profile';
    } catch (error: any) {
      alert(error.message);
    }
  };

  const updateBookingData = (field: string, value: any) => {
    setBookingData((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          {steps.map((step, index) => (
            <div
              key={step}
              className={`text-sm font-medium ${
                index <= currentStep ? 'text-lime-600' : 'text-gray-400'
              }`}
            >
              {step}
            </div>
          ))}
        </div>
        <div className="h-2 bg-gray-200 rounded-full">
          <div
            className="h-full bg-lime-500 rounded-full transition-all duration-300"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Step Content */}
      <div className="mb-8">
        {currentStep === 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Выбранные рейсы</h2>
            {outboundFlight && (
              <div className="bg-lime-50 p-4 rounded-lg mb-4">
                <h3 className="font-semibold">Туда</h3>
                <p>{outboundFlight.origin} → {outboundFlight.destination}</p>
                <p>Рейс: {outboundFlight.flightNumber}</p>
                <input
                  type="date"
                  value={bookingData.departureDate}
                  onChange={(e) => updateBookingData('departureDate', e.target.value)}
                  className="mt-2 px-4 py-2 border rounded-lg"
                />
              </div>
            )}
            {returnFlight && (
              <div className="bg-lime-50 p-4 rounded-lg">
                <h3 className="font-semibold">Обратно</h3>
                <p>{returnFlight.origin} → {returnFlight.destination}</p>
                <p>Рейс: {returnFlight.flightNumber}</p>
                <input
                  type="date"
                  value={bookingData.returnDepartureDate}
                  onChange={(e) => updateBookingData('returnDepartureDate', e.target.value)}
                  className="mt-2 px-4 py-2 border rounded-lg"
                />
              </div>
            )}
          </div>
        )}

        {currentStep === 1 && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Выберите тариф</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {['economy', 'optimum', 'maximum', 'business'].map(tariff => (
                <div
                  key={tariff}
                  onClick={() => updateBookingData('tariff', tariff)}
                  className={`p-6 rounded-xl border-2 cursor-pointer transition ${
                    bookingData.tariff === tariff
                      ? 'border-lime-500 bg-lime-50'
                      : 'border-gray-200 hover:border-lime-300'
                  }`}
                >
                  <h3 className="text-xl font-bold capitalize">{tariff}</h3>
                  <p className="text-2xl font-bold text-lime-600 mt-2">
                    {tariff === 'economy' && `${outboundFlight?.priceEconomy} ₽`}
                    {tariff === 'optimum' && `${outboundFlight?.priceOptimum} ₽`}
                    {tariff === 'maximum' && `${outboundFlight?.priceMaximum} ₽`}
                    {tariff === 'business' && `${outboundFlight?.priceBusiness} ₽`}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Данные пассажира</h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="ФИО (латиницей)"
                value={bookingData.passenger.fullName}
                onChange={(e) => updateBookingData('passenger', {
                  ...bookingData.passenger,
                  fullName: e.target.value
                })}
                className="w-full px-4 py-3 border rounded-lg"
              />
              <input
                type="date"
                placeholder="Дата рождения"
                value={bookingData.passenger.birthDate}
                onChange={(e) => updateBookingData('passenger', {
                  ...bookingData.passenger,
                  birthDate: e.target.value
                })}
                className="w-full px-4 py-3 border rounded-lg"
              />
              <input
                type="text"
                placeholder="Номер паспорта"
                value={bookingData.passenger.passport}
                onChange={(e) => updateBookingData('passenger', {
                  ...bookingData.passenger,
                  passport: e.target.value
                })}
                className="w-full px-4 py-3 border rounded-lg"
              />
              <input
                type="email"
                placeholder="Email"
                value={bookingData.passenger.email}
                onChange={(e) => updateBookingData('passenger', {
                  ...bookingData.passenger,
                  email: e.target.value
                })}
                className="w-full px-4 py-3 border rounded-lg"
              />
              <input
                type="tel"
                placeholder="Телефон"
                value={bookingData.passenger.phone}
                onChange={(e) => updateBookingData('passenger', {
                  ...bookingData.passenger,
                  phone: e.target.value
                })}
                className="w-full px-4 py-3 border rounded-lg"
              />
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Выбор места</h2>
            <div className="grid grid-cols-6 gap-2 max-w-md mx-auto">
              {availableSeats.map(seat => (
                <button
                  key={seat}
                  onClick={() => updateBookingData('seatNumber', seat)}
                  className={`p-2 rounded border text-sm ${
                    bookingData.seatNumber === seat
                      ? 'bg-lime-500 text-white border-lime-500'
                      : 'border-gray-300 hover:border-lime-500'
                  }`}
                >
                  {seat}
                </button>
              ))}
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Дополнительные услуги</h2>
            <div className="space-y-4">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={bookingData.extraBaggage}
                  onChange={(e) => updateBookingData('extraBaggage', e.target.checked)}
                  className="w-5 h-5 text-lime-500"
                />
                <span>Дополнительный багаж (+3000 ₽)</span>
              </label>
              <div>
                <label className="block mb-2 font-medium">Питание</label>
                <select
                  value={bookingData.mealType}
                  onChange={(e) => updateBookingData('mealType', e.target.value)}
                  className="w-full px-4 py-3 border rounded-lg"
                >
                  <option value="regular">Обычное</option>
                  <option value="vegetarian">Вегетарианское</option>
                  <option value="child">Детское</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {currentStep === 5 && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Подтверждение заказа</h2>
            <div className="bg-gray-50 p-6 rounded-xl space-y-3">
              <p><strong>Рейс:</strong> {outboundFlight?.flightNumber}</p>
              <p><strong>Маршрут:</strong> {outboundFlight?.origin} → {outboundFlight?.destination}</p>
              <p><strong>Дата:</strong> {bookingData.departureDate}</p>
              <p><strong>Тариф:</strong> {bookingData.tariff}</p>
              <p><strong>Пассажир:</strong> {bookingData.passenger.fullName}</p>
              <p><strong>Место:</strong> {bookingData.seatNumber}</p>
              <p><strong>Багаж:</strong> {bookingData.extraBaggage ? 'Да' : 'Нет'}</p>
              <p><strong>Питание:</strong> {bookingData.mealType}</p>
              <p className="text-xl font-bold text-lime-600">
                Итого: {outboundFlight?.[`price${bookingData.tariff.charAt(0).toUpperCase() + bookingData.tariff.slice(1)}` as keyof any]?.toLocaleString()} ₽
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        {currentStep > 0 && (
          <button
            onClick={() => setCurrentStep(prev => prev - 1)}
            className="px-6 py-3 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
          >
            Назад
          </button>
        )}
        {currentStep < steps.length - 1 ? (
          <button
            onClick={() => setCurrentStep(prev => prev + 1)}
            className="px-6 py-3 bg-lime-500 text-white rounded-lg hover:bg-lime-600 transition ml-auto"
          >
            Далее
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            className="px-8 py-3 bg-lime-500 text-white rounded-lg hover:bg-lime-600 transition ml-auto font-bold text-lg"
          >
            Оплатить (Демо)
          </button>
        )}
      </div>
    </div>
  );
}
