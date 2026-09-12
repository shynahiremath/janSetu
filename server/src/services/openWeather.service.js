import axios from "axios";

const BASE_URL = "https://api.openweathermap.org/data/2.5";

export async function getCurrentWeather(lat, lon) {
  const { data } = await axios.get(`${BASE_URL}/weather`, {
    params: { lat, lon, appid: process.env.OPENWEATHER_API_KEY, units: "metric" },
  });
  return {
    temp: data.main.temp,
    condition: data.weather[0].main,
    description: data.weather[0].description,
    humidity: data.main.humidity,
    windSpeed: data.wind.speed,
  };
}

export async function getForecast(lat, lon) {
  const { data } = await axios.get(`${BASE_URL}/forecast`, {
    params: { lat, lon, appid: process.env.OPENWEATHER_API_KEY, units: "metric" },
  });
  const byDay = {};
  data.list.forEach((entry) => {
    const day = entry.dt_txt.split(" ")[0];
    if (!byDay[day]) byDay[day] = entry;
  });
  return Object.values(byDay).slice(0, 5).map((e) => ({
    date: e.dt_txt.split(" ")[0],
    temp: e.main.temp,
    condition: e.weather[0].main,
    rainProbability: e.pop,
  }));
}