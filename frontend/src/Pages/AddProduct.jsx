import React, { useState } from "react";
import "../CSS/AddProduct.css";

const AddProduct = () => {
  const [product, setProduct] = useState({
    name: "",
    category: "Souvenirs",
    description: "",
    price: "",
    images: "",
    imageFile: null,
    instructor: '',
    isLiveClass: false,
    videoUrl: ""
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProduct((prev) => ({
          ...prev,
          images: reader.result, // base64 string
          imageFile: file, // keep file reference for filename
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const generateThumbnail = (videoUrl) => {
    // Check for YouTube URL first
    const youtubeRegExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    if (youtubeRegExp.test(videoUrl)) {
      console.log("YouTube URL detected. Auto-thumbnail skipped.");
      alert("YouTube URL detected. Please upload a cover image manually as we cannot auto-generate thumbnails from YouTube.");
      return;
    }

    const video = document.getElementById('thumbnail-generator');
    if (!video) return;

    video.src = videoUrl;

    video.onloadeddata = () => {
      // Wait a bit ensuring seek frame is ready
      setTimeout(() => {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        try {
          const dataURL = canvas.toDataURL('image/jpeg');
          setProduct(prev => ({
            ...prev,
            images: dataURL // Set as product image
          }));
          console.log("Thumbnail generated successfully!");
        } catch (e) {
          console.error("Thumbnail generation failed (likely CORS):", e);
          alert("Could not auto-generate thumbnail due to browser security (CORS) on this URL. Please upload a cover image manually.");
        }
      }, 500);
    };

    video.onerror = () => {
      console.error("Error loading video for thumbnail");
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Extract filename from the file or generate one
    const fileName = product.imageFile
      ? product.imageFile.name
      : `product_${Date.now()}.jpg`;

    // Prepare product data matching backend Product class structure
    const productData = {
      name: product.name,
      category: product.category,
      description: product.description,
      price: parseFloat(product.price),
      images: [product.images], // Backend expects List<String> - we'll send base64 for now
      rating: 0.0,
      company: "Kulture",
      imageFileName: fileName, // Pass filename separately for backend to use
      instructor: product.instructor,
      isLiveClass: product.isLiveClass,
      videoUrl: product.videoUrl
    };

    const endpoint = product.category === "Tutorials"
      ? "http://localhost:8082/MappingServlets-1.0-SNAPSHOT/api/tutorials"
      : "http://localhost:8082/MappingServlets-1.0-SNAPSHOT/api/products";

    try {
      const response = await fetch(
        endpoint,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(productData),
        }
      );

      const result = await response.json();

      if (response.ok && result.status === "success") {
        alert("Product Added Successfully!");
        // Reset form
        setProduct({
          name: "",
          category: "Souvenirs",
          description: "",
          price: "",
          images: "",
          imageFile: null,
          instructor: '',
          isLiveClass: false
        });
        // Reset file input
        const fileInput = document.querySelector('input[type="file"]');
        if (fileInput) fileInput.value = "";
      } else {
        alert(
          "Error adding product: " +
          (result.message || result.error || "Unknown error")
        );
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to connect to the server. Is Tomcat running?");
    }
  };

  return (
    <div
      className="add-product-container"
      style={{ padding: "40px", maxWidth: "600px", margin: "0 auto" }}
    >
      <h1
        style={{ textAlign: "center", marginBottom: "30px", color: "#4A3C34" }}
      >
        Add New Product
      </h1>

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "20px" }}
      >
        {/* Product Name */}
        <div className="form-group">
          <label
            style={{
              display: "block",
              marginBottom: "8px",
              fontWeight: "bold",
            }}
          >
            Product Name:
          </label>
          <input
            type="text"
            name="name"
            value={product.name}
            onChange={handleChange}
            required
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
          />
        </div>

        <div className="form-group">
          <label
            style={{
              display: "block",
              marginBottom: "8px",
              fontWeight: "bold",
            }}
          >
            Category:
          </label>
          <select
            name="category"
            value={product.category}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
          >
            <option value="Souvenirs">Souvenirs</option>
            <option value="Food">Food</option>
            <option value="Instruments">Instruments</option>
            <option value="Tutorials">Tutorials</option>
          </select>
        </div>

        {/* Tutorials Field */}
        {product.category === "Tutorials" && (
          <>
            <div className="form-group">
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>
                Instructor:
              </label>
              <input
                type="text"
                name="instructor"
                value={product.instructor}
                onChange={handleChange}
                required
                style={{ width: "100%", padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
              />
            </div>
            <div className="form-group" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <input
                type="checkbox"
                name="isLiveClass"
                checked={product.isLiveClass}
                onChange={handleChange}
                id="isLiveClass"
              />
              <label htmlFor="isLiveClass" style={{ fontWeight: "bold", cursor: "pointer" }}>
                Is this a Live Class?
              </label>
            </div>
            {/* Video URL Input and Auto-Thumbnail */}
            {!product.isLiveClass && (
              <div className="form-group">
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>
                  Video URL (Direct MP4 link):
                </label>
                <input
                  type="text"
                  name="videoUrl"
                  placeholder="https://example.com/video.mp4 OR https://www.youtube.com/watch?v=..."
                  value={product.videoUrl}
                  onChange={(e) => {
                    const url = e.target.value;
                    setProduct(prev => ({ ...prev, videoUrl: url }));
                  }}
                  onBlur={(e) => {
                    // Trigger thumbnail generation when user leaves the field
                    const url = e.target.value;
                    if (url) generateThumbnail(url);
                  }}
                  style={{ width: "100%", padding: "10px", borderRadius: "5px", border: "1px solid #ccc", marginBottom: "10px" }}
                />
                <p style={{ fontSize: '0.8em', color: '#666' }}>
                  * Enter a direct video URL or YouTube Link. For YouTube, please upload an image manually.
                </p>
                {/* Hidden Video Element for Thumbnail Generation */}
                <video
                  id="thumbnail-generator"
                  crossOrigin="anonymous"
                  style={{ display: 'none' }}
                  preload="metadata"
                  muted
                >
                </video>
              </div>
            )}
          </>
        )}

        <div className="form-group">
          <label
            style={{
              display: "block",
              marginBottom: "8px",
              fontWeight: "bold",
            }}
          >
            Description:
          </label>
          <textarea
            name="description"
            value={product.description}
            onChange={handleChange}
            required
            rows="4"
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
          />
        </div>

        <div className="form-group">
          <label
            style={{
              display: "block",
              marginBottom: "8px",
              fontWeight: "bold",
            }}
          >
            Price (RM):
          </label>
          <input
            type="number"
            name="price"
            step="0.01"
            value={product.price}
            onChange={handleChange}
            required
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
          />
        </div>

        <div className="form-group">
          <label
            style={{
              display: "block",
              marginBottom: "8px",
              fontWeight: "bold",
            }}
          >
            Product Image:
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            required
            style={{ marginBottom: "10px" }}
          />
          {product.images && (
            <div
              style={{
                marginTop: "10px",
                border: "1px solid #ddd",
                padding: "5px",
                display: "inline-block",
              }}
            >
              <img
                src={product.images}
                alt="Preview"
                style={{ width: "150px", height: "150px", objectFit: "cover" }}
              />
            </div>
          )}
        </div>

        <button
          type="submit"
          style={{
            padding: "15px",
            backgroundColor: "#D9944E",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "16px",
            fontWeight: "bold",
            cursor: "pointer",
            marginTop: "20px",
          }}
        >
          Add Product
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
