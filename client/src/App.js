import React, { useState, useRef } from "react";

function ImageUploader() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [originalImageUrl, setOriginalImageUrl] = useState(null); // Stores the original image
  const [clothingItems, setClothingItems] = useState([]); // Store parsed clothing list
  const [newImageSelected, setNewImageSelected] = useState(false); // Track if a new image was chosen
  const fileInputRef = useRef(null); // Reference to input file to clear selection

  // Handles file selection
  const handleImageChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(file);
      setPreviewUrl(imageUrl);
      setNewImageSelected(true); // Mark that a new image was selected

      // If this is the first image, store it as the original image
      if (!originalImageUrl) {
        setOriginalImageUrl(imageUrl);
      }
    } else {
      // If no new file is selected, restore the original image
      setPreviewUrl(originalImageUrl);
      setNewImageSelected(false); // No new image selected
    }
  };

  // Handles file upload
  const handleUpload = async () => {
    if (!selectedImage || !newImageSelected) return;

    const formData = new FormData();
    formData.append("image", selectedImage);

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

      // Mark upload complete, reset new image tracking
      setNewImageSelected(false);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Upload failed!");
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh", padding: "20px" }}>
      {/* Left Side - Image Upload */}
      <div style={{ flex: 3, textAlign: "center" }}>
        <h2>Upload an Image</h2>

        {/* Hidden file input */}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          ref={fileInputRef}
          style={{ display: "none" }}
        />

        {/* Custom Select Image Button */}
        <button
          onClick={() => fileInputRef.current.click()} // Opens file input on button click
          style={{
            padding: "10px",
            cursor: "pointer",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "5px",
            marginBottom: "10px",
          }}
        >
          Select Image
        </button>

        <br />
        {previewUrl && (
          <div style={{ marginTop: "20px" }}>
            <img
              src={previewUrl}
              alt="Preview"
              width="300px"
              style={{ borderRadius: "10px", border: "2px solid #ccc" }}
            />
          </div>
        )}
        <br />
        <button
          onClick={handleUpload}
          style={{
            padding: "10px",
            cursor: newImageSelected ? "pointer" : "not-allowed",
            opacity: newImageSelected ? "1" : "0.5",
            backgroundColor: newImageSelected ? "#4CAF50" : "#cccccc",
            color: "white",
            border: "none",
            borderRadius: "5px",
          }}
          disabled={!newImageSelected} // Disable button if no new file is selected
        >
          Upload
        </button>
      </div>

      {/* Right Side - Clothing List */}
      <div
        style={{
          flex: 1,
          padding: "20px",
          borderLeft: "2px solid #ccc",
          overflowY: "auto",
          background: "#f9f9f9",
        }}
      >
        <h3 style={{ marginBottom: "10px", textAlign: "center" }}>👕 What You're Wearing:</h3>
        <ul style={{ listStyleType: "none", padding: 0 }}>
          {clothingItems.map((item, index) => (
            <li
              key={index}
              style={{
                background: "#fff",
                marginBottom: "5px",
                padding: "8px",
                borderRadius: "5px",
                boxShadow: "1px 1px 5px rgba(0, 0, 0, 0.1)",
              }}
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default ImageUploader;
