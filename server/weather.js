import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

// OpenWeatherMap API URLs
const WEATHER_API_KEY = process.env.WEATHER_API_KEY;
const WEATHER_API_URL = "https://api.openweathermap.org/data/2.5/weather";
const REVERSE_GEOCODING_URL = "http://api.openweathermap.org/geo/1.0/reverse";

/**
 * Fetch city name from latitude and longitude using OpenWeatherMap Reverse Geocoding API.
 * @param {number} latitude - The latitude of the location.
 * @param {number} longitude - The longitude of the location.
 * @returns {Promise<string>} - The city name.
 */
export async function getCityName(latitude, longitude) {
  try {
    const response = await axios.get(REVERSE_GEOCODING_URL, {
      params: {
        lat: latitude,
        lon: longitude,
        appid: WEATHER_API_KEY,
      },
    });

    if (response.data.length > 0) {
      return response.data[0].name; // City name
    } else {
      return "Unknown Location";
    }
  } catch (error) {
    console.error("Error fetching city name:", error);
    return "Unknown Location";
  }
}

/**
 * Fetch weather data from latitude and longitude using OpenWeatherMap API.
 * @param {number} latitude - The latitude of the location.
 * @param {number} longitude - The longitude of the location.
 * @returns {Promise<object>} - The weather data.
 */
export async function getWeather(latitude, longitude) {
  try {
    const response = await axios.get(WEATHER_API_URL, {
      params: {
        lat: latitude,
        lon: longitude,
        appid: WEATHER_API_KEY,
        units: "metric",
      },
    });

    const weatherData = response.data;
    return {
      temperature: weatherData.main.temp,
      humidity: weatherData.main.humidity,
      weather: weatherData.weather[0].description,
      min_temperature: weatherData.main.temp_min,
      max_temperature: weatherData.main.temp_max,
    };
  } catch (error) {
    console.error("Error fetching weather data:", error);
    return { error: "Failed to fetch weather data" };
  }
}