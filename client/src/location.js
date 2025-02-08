import React, { useState, useEffect } from "react";



function GetLocation (setCity, setTemperature, setWeather) {
    // const [location, setLocation] = useState(null);
    const [error, setError] = useState(null);
    // const [weather, setWeather] = useState(null);
  
    useEffect(() => {
        if ("geolocation" in navigator) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              const { latitude, longitude } = position.coords;
              // setLocation({ latitude, longitude });
    
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
        // setWeather(result.weather);
        console.log("City name:", result.city);
        console.log("Tempreture data:", result.temperature);
        console.log("Humidity data:", result.humidity);
        console.log("Weather data:", result.weather);
        setCity(result.city);
        setTemperature(result.temperature);
        setWeather(result.weather);
        // return {'city': result.city, 'temperature': result.temperature, 'weather': result.weather};
        
      }
    } catch (error) {
      console.error("Weather fetch failed:", error);
      setError("Failed to fetch weather data.");
    }
  }
  
    // return (
    //   <div>
    //       <h2>Your Current Location</h2>
    //       {location && <p>Latitude: {location.latitude}, Longitude: {location.longitude}</p>}
    //       {error && <p style={{ color: "red" }}>{error}</p>}
    //     <h2>Weather Information</h2>
    //     {weather && <p>{weather}</p>}
    //   </div>
    // );
    // return json object
  }
  
export { GetLocation };