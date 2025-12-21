import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../CSS/SupplierDashboard.css";

const SupplierDashboard = ({ user }) => {
  const [myProducts, setMyProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyProducts = async () => {
      try {
        const response = await fetch(
          "http://localhost:8082/MappingServlets-1.0-SNAPSHOT/api/products"
        );
        if (response.ok) {
          const data = await response.json();
          setMyProducts(data);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMyProducts();
  }, []);

  return (
    <div className="supplier-dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Welcome, {user?.username || "Admin"}!</h1>
          <p>Manage your products and view your sales.</p>
        </div>
        <button
          className="add-product-button"
          onClick={() => navigate("/add-product")}
        >
          + Add New Product
        </button>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Total Products</h3>
          <p>{myProducts.length}</p>
        </div>
        <div className="stat-card">
          <h3>Total Sales</h3>
          <p>RM 0.00</p> {/* This one will change later */}
        </div>
        <div className="stat-card">
          <h3>Pending Orders</h3>
          <p>0</p> {/* This one will change later also */}
        </div>
      </div>

      <div className="products-table-section">
        <h2>My Inventory</h2>
        {loading ? (
          <p>Loading inventory...</p>
        ) : myProducts.length > 0 ? (
          <table className="inventory-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Product Name</th>
                <th>Price</th>
                <th>Category</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {myProducts.map((product) => {
                const img =
                  product.images && product.images.length > 0
                    ? product.images[0]
                    : "";
                return (
                  <tr key={product.id}>
                    <td>
                      <img src={img} alt="thumb" className="table-thumb" />
                    </td>
                    <td>{product.name}</td>
                    <td>RM {Number(product.price).toFixed(2)}</td>
                    <td>{product.category}</td>
                    <td>
                      <button className="action-button edit">Edit</button>
                      <button className="action-button delete">Delete</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div className="empty-state">
            <p>You haven't listed any products yet.</p>
            <button onClick={() => navigate("/add-product")}>
              Create Your First Listing
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SupplierDashboard;
