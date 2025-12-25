import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../CSS/SupplierDashboard.css";

const SupplierDashboard = ({ user }) => {
  const [myProducts, setMyProducts] = useState([]);
  const [myTutorials, setMyTutorials] = useState([]);
  const [salesData, setSalesData] = useState({ totalRevenue: 0, sales: [] });
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, tutorialsRes, salesRes, bookingsRes] = await Promise.all([
          fetch("http://localhost:8082/MappingServlets-1.0-SNAPSHOT/api/products"),
          fetch("http://localhost:8082/MappingServlets-1.0-SNAPSHOT/api/tutorials"),
          fetch("http://localhost:8082/MappingServlets-1.0-SNAPSHOT/api/sales"),
          fetch("http://localhost:8082/MappingServlets-1.0-SNAPSHOT/api/bookings", { credentials: "include" })
        ]);

        if (productsRes.ok) {
          const products = await productsRes.json();
          setMyProducts(products);
        }

        if (tutorialsRes.ok) {
          const tutorials = await tutorialsRes.json();
          setMyTutorials(tutorials);
        }

        if (salesRes.ok) {
          const sales = await salesRes.json();
          setSalesData(sales);
        }

        if (bookingsRes.ok) {
          const bookingsData = await bookingsRes.json();
          setBookings(bookingsData.bookings || []);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Calculate tutorial revenue from bookings
  const getTutorialRevenue = () => {
    return bookings.reduce((total, booking) => total + (booking.price || 0), 0);
  };

  const totalRevenue = salesData.totalRevenue + getTutorialRevenue();

  // Delete product handler
  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    
    try {
      const response = await fetch(`http://localhost:8082/MappingServlets-1.0-SNAPSHOT/api/products?id=${productId}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      
      if (response.ok) {
        setMyProducts(prev => prev.filter(p => p.id !== productId));
        alert('Product deleted successfully!');
      } else {
        const result = await response.json();
        alert('Failed to delete: ' + (result.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete product');
    }
  };

  // Delete tutorial handler
  const handleDeleteTutorial = async (tutorialId) => {
    if (!window.confirm('Are you sure you want to delete this tutorial?')) return;
    
    try {
      const response = await fetch(`http://localhost:8082/MappingServlets-1.0-SNAPSHOT/api/tutorials?id=${tutorialId}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      
      if (response.ok) {
        setMyTutorials(prev => prev.filter(t => t.id !== tutorialId));
        alert('Tutorial deleted successfully!');
      } else {
        const result = await response.json();
        alert('Failed to delete: ' + (result.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete tutorial');
    }
  };

  return (
    <div className="supplier-dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Welcome, {user?.username || "Admin"}!</h1>
          <p>Manage your products, tutorials, and view your sales.</p>
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
          <h3>Total Tutorials</h3>
          <p>{myTutorials.length}</p>
        </div>
        <div className="stat-card">
          <h3>Total Revenue</h3>
          <p>RM {totalRevenue.toFixed(2)}</p>
        </div>
        <div className="stat-card">
          <h3>Total Orders</h3>
          <p>{salesData.sales.length}</p>
        </div>
        <div className="stat-card">
          <h3>Total Bookings</h3>
          <p>{bookings.length}</p>
        </div>
      </div>

      <div className="products-table-section">
        <h2>Recent Sales</h2>
        {loading ? (
          <p>Loading sales...</p>
        ) : salesData.sales.length > 0 ? (
          <table className="inventory-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Customer</th>
                <th>Products</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {salesData.sales.map((sale, index) => (
                <tr key={sale.id || index}>
                  <td>{new Date(sale.saleDate).toLocaleDateString()}</td>
                  <td>{sale.customerEmail}</td>
                  <td>{sale.productNames.join(", ")}</td>
                  <td>RM {sale.totalAmount.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No sales recorded yet.</p>
        )}
      </div>

      

      <div className="products-table-section">
        <h2>Listed Products</h2>
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
                      <button 
                        className="action-button delete" 
                        onClick={() => handleDeleteProduct(product.id)}
                      >
                        Delete
                      </button>
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

      <div className="products-table-section">
        <h2>Listed Tutorials</h2>
        {loading ? (
          <p>Loading tutorials...</p>
        ) : myTutorials.length > 0 ? (
          <table className="inventory-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Tutorial Name</th>
                <th>Instructor</th>
                <th>Price</th>
                <th>Type</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {myTutorials.map((tutorial) => {
                const img =
                  tutorial.images && tutorial.images.length > 0
                    ? tutorial.images[0]
                    : "";
                return (
                  <tr key={tutorial.id}>
                    <td>
                      <img src={img} alt="thumb" className="table-thumb" />
                    </td>
                    <td>{tutorial.name}</td>
                    <td>{tutorial.instructor}</td>
                    <td>RM {Number(tutorial.price).toFixed(2)}</td>
                    <td>{tutorial.isLiveClass ? "Live Class" : "Recorded"}</td>
                    <td>
                      <button 
                        className="action-button delete" 
                        onClick={() => handleDeleteTutorial(tutorial.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <p>No tutorials available.</p>
        )}
      </div>
    </div>
  );
};

export default SupplierDashboard;
