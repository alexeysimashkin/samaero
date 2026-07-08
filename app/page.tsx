import SearchForm from '@/components/SearchForm'

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-lime-400 via-lime-500 to-green-600 text-white py-20">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full mix-blend-overlay filter blur-xl animate-pulse" />
          <div className="absolute bottom-10 right-10 w-72 h-72 bg-white rounded-full mix-blend-overlay filter blur-xl animate-pulse delay-1000" />
        </div>
        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              Откройте мир с SamAero
            </h1>
            <p className="text-xl md:text-2xl text-lime-100">
              Путешествуйте с комфортом по лучшим ценам
            </p>
          </div>
          <SearchForm />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Почему выбирают нас</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Лучшие цены',
                description: 'Гарантируем низкие цены на все направления',
                icon: '💰',
              },
              {
                title: 'Удобное бронирование',
                description: 'Простой процесс бронирования за 5 минут',
                icon: '✈️',
              },
              {
                title: 'Поддержка 24/7',
                description: 'Всегда на связи для решения ваших вопросов',
                icon: '🎧',
              },
            ].map((feature) => (
              <div key={feature.title} className="text-center p-6">
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
