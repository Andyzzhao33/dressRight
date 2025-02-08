import React, { useState, useRef, useEffect } from "react";
import Webcam from "react-webcam";
import { GetLocation } from "./location"; // Location component import

function ImageUploader() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [clothingItems, setClothingItems] = useState([]); // Store parsed clothing list
  const [newImageSelected, setNewImageSelected] = useState(false);
  const [useWebcam, setUseWebcam] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const fileInputRef = useRef(null);
  const webcamRef = useRef(null);

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

  // Countdown Timer for Webcam Capture
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && isCapturing) {
      captureImage();
    }
  }, [countdown, isCapturing]);

  // Start Countdown and Capture Image
  const handleCapture = () => {
    setCountdown(3); // Start countdown from 3
    setIsCapturing(true);
  };

  // Capture Image from Webcam when countdown reaches 0
  const captureImage = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      setCapturedImage(imageSrc);
      setPreviewUrl(imageSrc);
      setNewImageSelected(true);
      setIsCapturing(false);
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
        setClothingItems(result.clothingItems);
      } else {
        setClothingItems(["No clothing description available."]);
      }

      setNewImageSelected(false);
      setCapturedImage(null);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Upload failed!");
    }
  };

  return (
    <div>
      {/* Header */}
      <header style={headerStyle}>
        <h1>DressRight</h1>
      </header>

      {/* Main Content */}
      <div style={{ display: "flex", height: "100vh", padding: "20px" }}>
        {/* Left Column - Location & Image Upload */}
        <div style={{ flex: 3, textAlign: "center", paddingRight: "20px" }}>
          {/* Display Location Component */}
          <GetLocation />

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
              <div style={{ position: "relative", display: "inline-block" }}>
                <Webcam ref={webcamRef} screenshotFormat="image/png" style={webcamStyle} />
                {countdown > 0 && <div style={countdownStyle}>{countdown}</div>}
              </div>
              <br />
              <button onClick={handleCapture} disabled={isCapturing} style={captureButtonStyle(isCapturing)}>
                {isCapturing ? "Capturing..." : "Take Photo (3s Timer)"}
              </button>
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
            </>
          )}

          {previewUrl && (
            <div style={{ marginTop: "20px" }}>
              <img src={previewUrl} alt="Preview" style={imagePreviewStyle} />
            </div>
          )}

          <button onClick={handleUpload} disabled={!newImageSelected} style={uploadButtonStyle(newImageSelected)}>
            Upload
          </button>
        </div>

        {/* Right Column - Clothing List */}
        <div style={clothingListContainerStyle}>
          <h3 style={{ marginBottom: "10px", textAlign: "center" }}>👕 What You're Wearing:</h3>
          <ul style={{ listStyleType: "none", padding: 0 }}>
            {clothingItems.map((item, index) => (
              <li key={index} style={clothingItemStyle}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

/* Styled Components */
const headerStyle = {
  color: "black",
  textAlign: "center",
  padding: "15px",
  fontSize: "24px",
  fontWeight: "bold",
};

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
  padding: "20px",
  borderLeft: "2px solid #ccc",
  overflowY: "auto",
  background: "#f9f9f9",
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

export default ImageUploader;
