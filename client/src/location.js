import React, { useState, useEffect } from "react";



function GetLocation () {
    const [location, setLocation] = useState(null);
    const [error, setError] = useState(null);
  
    useEffect(() => {
        if ("geolocation" in navigator) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              const { latitude, longitude } = position.coords;
              setLocation({ latitude, longitude });
    
              // Call an async function to fetch weather data
              fetchWeather(latitude, longitude);
            },
            (error) => {
              setError(error.message);
            }
          );
        } else {
          setError("Geolocation is not available.");
        }
      }, []);

      // Fetch weather data from the server
  async function fetchWeather(latitude, longitude) {
    try {
      const response = await fetch("http://localhost:8000/location", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ latitude, longitude }),
      });

      const result = await response.json();

      if (result.weather) {
        setWeather(result.weather);
        console.log("Weather data:", result.weather);
      } else {
        setWeather("No weather information available.");
      }
    } catch (error) {
      console.error("Weather fetch failed:", error);
      setError("Failed to fetch weather data.");
    }
  }
  
    return (
      <div>
          <h2>Your Current Location</h2>
          {location && <p>Latitude: {location.latitude}, Longitude: {location.longitude}</p>}
          {error && <p style={{ color: "red" }}>{error}</p>}
      </div>
    );
  }
  
export { GetLocation };