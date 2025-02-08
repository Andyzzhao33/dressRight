import React, { useState, useRef, useEffect } from "react";
import Webcam from "react-webcam";
import { GetLocation } from "./location"; // Location component import

function ImageUploader() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [webcamUrl, setWebcamUrl] = useState(null);
  const [clothingItems, setClothingItems] = useState([]); // Store parsed clothing list
  // const [lastClothingItem, setLastClothingItem] = useState(null); // Last extracted clothing item
  const [newImageSelected, setNewImageSelected] = useState(false);
  const [useWebcam, setUseWebcam] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isCapturing, setIsCapturing] = useState(false);
  // const [hasCaptured, setHasCaptured] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const fileInputRef = useRef(null);
  const webcamRef = useRef(null);
  const [city, setCity] = useState("");
  const [temperature, setTemperature] = useState("");
  const [weather, setWeather] = useState("");
  const [suggestions, setSuggestions] = useState(false);
  const [suggestActive, setSuggestActive] = useState(false);
  const [dressInput, setDressInput] = useState("");


  const handleAddItem = () => {
    if (dressInput.trim() === "") return; // Ignore empty inputs
    setClothingItems([...clothingItems, dressInput.trim()]); // Add to list
    setDressInput(""); // Clear input field
  };

  const handleResetItems = () => {
    setClothingItems([]);
    setSuggestActive(false);
  };

  const handleDeleteItem = (indexToRemove) => {
    setClothingItems(prevItems => prevItems.filter((_, index) => index !== indexToRemove));
  };

  // Handles file selection
  const handleImageChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(file);
      setPreviewUrl(imageUrl);
      setNewImageSelected(true);
    }
  };
  // call the GetLocation function
  GetLocation(setCity, setTemperature, setWeather);
  
  // Countdown Timer for Webcam Capture
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && isCapturing) {
      captureImage();
    }
  }, [countdown, isCapturing]);

  useEffect(() => {
    // Enable button when clothingItems changes and is not empty
    setSuggestActive(clothingItems.length > 0);
  }, [clothingItems]);

  // Start Countdown and Capture Image
  const handleCapture = () => {
    setCountdown(3); // Start countdown from 3
    setIsCapturing(true);
    // setHasCaptured(false);
  };

  // Capture Image from Webcam when countdown reaches 0
  const captureImage = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      setCapturedImage(imageSrc);
      setWebcamUrl(imageSrc);
      setNewImageSelected(true);
      setIsCapturing(false);
      // setHasCaptured(true);
    }
  };

  // Handles file upload
  const handleUpload = async () => {
    if (!newImageSelected) return;

    const formData = new FormData();

    if (capturedImage) {
      // Convert base64 image to Blob
      const byteCharacters = atob(capturedImage.split(",")[1]);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const imageBlob = new Blob([byteArray], { type: "image/png" });
      formData.append("image", imageBlob, "webcam.png");
      // formData.append("image", capturedImage);
    } else if (selectedImage) {
      formData.append("image", selectedImage);
    }

    try {
      const response = await fetch("http://localhost:8000/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.clothingItems) {
        // setClothingItems(result.clothingItems);
        setClothingItems(prevItems => [...prevItems, ...result.clothingItems]);
        // setLastClothingItem(result.clothingItems[result.clothingItems.length - 1] || "No item detected.");
      } else {
        // setClothingItems(["No clothing description available."]);
        // setLastClothingItem(null);
        alert("No clothing description available.");
      }

      setNewImageSelected(false);
      setCapturedImage(null);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Upload failed!");
    }
  };

  const handleSuggestions = async () => {
    if (!clothingItems || clothingItems.length === 0) return;
  
    console.log("Sending clothingItems:", clothingItems);
  
    try {
      const response = await fetch("http://localhost:8000/suggestions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Set JSON content type
        },
        body: JSON.stringify({ dressItems: clothingItems }), // Send as JSON
      });
  
      const result = await response.json();
  
      if (result.suggestions) {
        setSuggestions(result.suggestions);
        setSuggestActive(false);
      } else {
        setSuggestions("No suggestions available.");
      }
    } catch (error) {
      console.error("Suggestions failed:", error);
      alert("Suggestions failed!");
    }
  };
  

  return (
    <div>
      {/* Header */}
      <header style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "15px" }}>
        <img src="/header.png" alt="Website Header" style={{ width: "30%", height: "auto" }} />
      </header>

  
      {/* Main Content */}
      <div style={{ display: "flex", height: "100vh", padding: "20px" }}>
        {/* Left Column - Location & Image Upload */}
        <div style={{ flex: 3, textAlign: "center", paddingRight: "20px" }}>
          {/* Display Location Component */}
          {/* <GetLocation /> */}
  
          <h2>Choose an Option</h2>
  
          <div style={{ marginBottom: "10px" }}>
            <button onClick={() => setUseWebcam(false)} style={buttonStyle(!useWebcam)}>
              Upload Image
            </button>
            <button onClick={() => setUseWebcam(true)} style={buttonStyle(useWebcam)}>
              Use Webcam
            </button>
          </div>
  
          {useWebcam ? (
            <>
            <div style={{ display: "flex", justifyContent: "center", gap: "20px", alignItems: "center", marginTop: "20px" }}>
              {/* Webcam Container */}
              <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center" }}>
                <button onClick={handleCapture} disabled={isCapturing} style={captureButtonStyle(isCapturing)}>
                  {isCapturing ? "Capturing..." : "Take Photo (3s Timer)"}
                </button>
                <div style={{ position: "relative", marginTop: "10px" }}>
                  <Webcam ref={webcamRef} screenshotFormat="image/png" style={webcamStyle} />
                  {countdown > 0 && <div style={countdownStyle}>{countdown}</div>}
                </div>
              </div>
          
              {/* Captured Image Container */}
              {webcamUrl && (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <button onClick={handleUpload} disabled={isCapturing} style={uploadButtonStyle(newImageSelected)}>
                    Upload
                  </button>
                  <div style={{ marginTop: "10px" }}>
                    <img src={webcamUrl} alt="Preview" style={imagePreviewStyle} />
                  </div>
                </div>
              )}
            </div>
          </>
          
          ) : (
            <>
              {/* Hidden file input */}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                ref={fileInputRef}
                style={{ display: "none" }}
              />
  
              {/* Custom Select Image Button */}
              <button onClick={() => fileInputRef.current.click()} style={buttonStyle(true)}>
                Select Image
              </button>
  
              <button onClick={handleUpload} disabled={!newImageSelected} style={uploadButtonStyle(newImageSelected)}>
                Upload
              </button>

               {/* Show Preview Only if Webcam is NOT Enabled */}
               {previewUrl && !useWebcam && (
                <div style={{ marginTop: "20px" }}>
                  <img src={previewUrl} alt="Preview" style={imagePreviewStyle} />
                </div>
              )}
            </>
          )}
        </div>
  
        {/* Right Column - Clothing List */}
        <div style={clothingListContainerStyle}>
          <div style={cityStyle}>
            <h3 style={{ marginBottom: "10px", textAlign: "center" }}>🌍 Your Location:</h3>
              {city && (<p style={{ marginTop: "0.01em"}}>🏠City: {city}</p>)}
              {temperature && (<p style={{ marginTop: "0.01em"}}>🌡Temperature: {temperature}°C</p>)}
              {weather && (<p style={{ marginTop: "0.01em"}}>🌦Weather: {weather}</p>)}
          </div>
          <h3 style={{ marginBottom: "10px", textAlign: "center" }}>👕 What You're Wearing:</h3>
          <ul style={{ listStyleType: "none", padding: 0 }}>
            {clothingItems.map((item, index) => (
              <li key={index} style={clothingItemStyle}>
                {item}
                  <button onClick={() => handleDeleteItem(index)} style={{ marginLeft: "10px" }}>
                    ❌
                  </button>
              </li>
            ))}
          </ul>
          {/* Input box for manually entering clothing items */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "10px" }}>
            <input
              type="text"
              value={dressInput}
              onChange={(e) => setDressInput(e.target.value)}
              placeholder="Enter clothing item..."
              style={{ padding: "1em", width: "80%", borderRadius: "0.2em" }}
            />
            <button onClick={handleAddItem} style={{ padding: "0.7em", borderRadius: "0.2em"}}>
              ➕
            </button>
          </div>

          <button onClick={handleResetItems} style={{ padding: "1em", width: "100%", borderRadius: "0.2em", marginTop: "1em" }}>
          Reset🔄
          </button>

          {/* Suggestions Button */}
          <button onClick={handleSuggestions} style={buttonStyle(suggestActive)} disabled={!suggestActive}> 
            Get Suggestions
          </button>
  
          {/* Last Extracted Clothing Item Section */}
          {suggestions && (
            <div style={lastItemContainerStyle}>
              <h4 style={{ marginTop: "0.01em" }}>🌴Suggestions</h4>
              <p style={lastItemStyle}>{suggestions}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
  
}

/* Styled Components */
// const headerStyle = {
//   textAlign: "center",
//   padding: "15px",
// };

const buttonStyle = (isActive) => ({
  margin: "5px",
  padding: "10px",
  cursor: "pointer",
  backgroundColor: isActive ? "#007bff" : "#cccccc",
  color: "white",
  border: "none",
  borderRadius: "5px",
});

const captureButtonStyle = (isCapturing) => ({
  marginTop: "10px",
  padding: "10px",
  cursor: isCapturing ? "not-allowed" : "pointer",
  opacity: isCapturing ? "0.5" : "1",
  backgroundColor: "#4CAF50",
  color: "white",
  border: "none",
  borderRadius: "5px",
});

const uploadButtonStyle = (enabled) => ({
  marginTop: "10px",
  padding: "10px",
  cursor: enabled ? "pointer" : "not-allowed",
  opacity: enabled ? "1" : "0.5",
  backgroundColor: enabled ? "#4CAF50" : "#cccccc",
  color: "white",
  border: "none",
  borderRadius: "5px",
});

const webcamStyle = {
  width: "300px",
  height: "250px",
  borderRadius: "10px",
  border: "2px solid #ccc",
};

const imagePreviewStyle = {
  borderRadius: "10px",
  border: "2px solid #ccc",
  width: "300px",
};

const clothingListContainerStyle = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  padding: "20px",
  borderLeft: "2px solid #ccc",
  overflowY: "auto",
  background: "#f9f9f9",
  position: "relative",
};


const clothingItemStyle = {
  background: "#fff",
  marginBottom: "5px",
  padding: "8px",
  borderRadius: "5px",
  boxShadow: "1px 1px 5px rgba(0, 0, 0, 0.1)",
};

const countdownStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  background: "rgba(0, 0, 0, 0.5)",
  color: "white",
  fontSize: "40px",
  fontWeight: "bold",
  padding: "20px",
  borderRadius: "10px",
};

const lastItemContainerStyle = {
  marginTop: "1em", // Pushes it to the bottom
  padding: "10px",
  background: "#e3f2fd",
  borderRadius: "5px",
  textAlign: "center",
  background: "#fff",
  boxShadow: "1px 1px 5px rgba(0, 0, 0, 0.1)",
};

const cityStyle = {
  marginTop: "5px", 
  padding: "10px",
  background: "#e3f2fd",
  borderRadius: "5px",
  textAlign: "center",
  background: "#fff",
  boxShadow: "1px 1px 5px rgba(0, 0, 0, 0.1)",
};

const lastItemStyle = {
  fontSize: "16px",
};


export default ImageUploader;
