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
    isLiveClass: false
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
    <div className="add-product-container">
      <h1>Add New Product</h1>

      <form
        onSubmit={handleSubmit}
      >
        {/* Product Name */}
        <div className="form-group">
          <label>
            Product Name:
          </label>
          <input
            type="text"
            name="name"
            value={product.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>
            Category:
          </label>
          <select
            name="category"
            value={product.category}
            onChange={handleChange}
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
          </>
        )}

        <div className="form-group">
          <label>
            Description:
          </label>
          <textarea
            name="description"
            value={product.description}
            onChange={handleChange}
            required
            rows="4"
          />
        </div>

        <div className="form-group">
          <label>
            Price (RM):
          </label>
          <input
            type="number"
            name="price"
            step="0.01"
            value={product.price}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>
            Product Image:
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            required
          />
          {product.images && (
            <div>
              <img
                src={product.images}
                alt="Preview"
              />
            </div>
          )}
        </div>

        <button
          type="submit"
        >
          Add Product
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
