export interface WeatherData {
  temp: number;
  condition: string;
  icon: string;
  location: string;
  humidity: number;
  updatedAt: string;
}

interface OpenMeteoResponse {
  current: {
    temperature_2m: number;
    relative_humidity_2m: number;
    weather_code: number;
  };
}

const WEATHER_CODE_MAP: Record<number, { label: string; icon: string }> = {
  0: { label: 'Trời quang', icon: '☀️' },
  1: { label: 'Ít mây', icon: '⛅' },
  2: { label: 'Ít mây', icon: '⛅' },
  3: { label: 'Ít mây', icon: '⛅' },
  45: { label: 'Sương mù', icon: '🌫️' },
  48: { label: 'Sương mù', icon: '🌫️' },
  51: { label: 'Mưa phùn', icon: '🌦️' },
  53: { label: 'Mưa phùn', icon: '🌦️' },
  55: { label: 'Mưa phùn', icon: '🌦️' },
  56: { label: 'Mưa phùn', icon: '🌦️' },
  57: { label: 'Mưa phùn', icon: '🌦️' },
  61: { label: 'Mưa', icon: '🌧️' },
  63: { label: 'Mưa', icon: '🌧️' },
  65: { label: 'Mưa', icon: '🌧️' },
  66: { label: 'Mưa', icon: '🌧️' },
  67: { label: 'Mưa', icon: '🌧️' },
  71: { label: 'Tuyết', icon: '❄️' },
  73: { label: 'Tuyết', icon: '❄️' },
  75: { label: 'Tuyết', icon: '❄️' },
  77: { label: 'Tuyết', icon: '❄️' },
  80: { label: 'Mưa rào', icon: '🌧️' },
  81: { label: 'Mưa rào', icon: '🌧️' },
  82: { label: 'Mưa rào', icon: '🌧️' },
  95: { label: 'Giông bão', icon: '⛈️' },
  96: { label: 'Giông bão', icon: '⛈️' },
  99: { label: 'Giông bão', icon: '⛈️' },
};

function getWeatherInfo(code: number): { label: string; icon: string } {
  return WEATHER_CODE_MAP[code] || { label: 'Không xác định', icon: '🌡️' };
}

export async function getWeatherByCoords(lat: number, lon: number): Promise<WeatherData> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code&timezone=Asia/Ho_Chi_Minh`;
  
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Weather API error: ${response.status}`);
  }
  
  const data: OpenMeteoResponse = await response.json();
  const weatherInfo = getWeatherInfo(data.current.weather_code);
  
  return {
    temp: Math.round(data.current.temperature_2m),
    condition: weatherInfo.label,
    icon: weatherInfo.icon,
    location: `${lat.toFixed(2)}, ${lon.toFixed(2)}`,
    humidity: data.current.relative_humidity_2m,
    updatedAt: new Date().toISOString(),
  };
}
