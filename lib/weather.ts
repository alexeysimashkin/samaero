interface WeatherData {
  temp: number;
  icon: string;
  description: string;
}

const cache = new Map<string, { data: WeatherData; timestamp: number }>();
const CACHE_DURATION = 60 * 60 * 1000; // 1 час

export async function getWeather(city: string): Promise<WeatherData | null> {
  const cached = cache.get(city);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${process.env.OPENWEATHER_API_KEY}&units=metric&lang=ru`
    );
    
    if (!response.ok) return null;
    
    const data = await response.json();
    const weather: WeatherData = {
      temp: Math.round(data.main.temp),
      icon: data.weather[0].icon,
      description: data.weather[0].description,
    };
    
    cache.set(city, { data: weather, timestamp: Date.now() });
    return weather;
  } catch {
    return null;
  }
}
