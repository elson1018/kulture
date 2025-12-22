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
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: value,
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
    };

    try {
      const response = await fetch(
        "http://localhost:8082/MappingServlets-1.0-SNAPSHOT/api/products",
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
            <option value="Dances">Dances</option>
          </select>
        </div>

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
