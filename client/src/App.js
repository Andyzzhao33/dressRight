import React, { useState } from "react";

function ImageUploader() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file)); // Create a preview
    }
  };

  const handleUpload = async () => {
    if (!selectedImage) {
      alert("Please select an image first!");
      return;
    }

    const formData = new FormData();
    formData.append("image", selectedImage);

    try {
      const response = await fetch("http://localhost:8000/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      alert(`Upload Success: ${result.message}`);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Upload failed!");
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>Upload an Image</h2>
      <input type="file" accept="image/*" onChange={handleImageChange} />
      <br />
      {previewUrl && (
        <div style={{ marginTop: "20px" }}>
          <img src={previewUrl} alt="Preview" width="300px" />
        </div>
      )}
      <br />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
}

export default ImageUploader;
