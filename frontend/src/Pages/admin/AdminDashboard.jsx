import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ENDPOINTS } from "../../config/api";
import "./AdminDashboard.css";
import Popup from "../../components/Popup/Popup";

const AdminDashboard = ({ user }) => {
  const [myProducts, setMyProducts] = useState([]);
  const [myTutorials, setMyTutorials] = useState([]);
  const [salesData, setSalesData] = useState({ totalRevenue: 0, sales: [] });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Edit price modal state
  const [editPriceModal, setEditPriceModal] = useState({
    isOpen: false,
    productId: null,
    productName: "",
    currentPrice: 0,
    newPrice: ""
  });

  // Delivery details modal state
  const [deliveryModal, setDeliveryModal] = useState({
    isOpen: false,
    order: null
  });

  // Status options
  const statusOptions = ["Pending", "Processing", "Shipped", "Completed"];

  // Tab navigation state
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, tutorialsRes, salesRes] = await Promise.all([
          fetch(ENDPOINTS.PRODUCTS),
          fetch(ENDPOINTS.TUTORIALS),
          fetch(ENDPOINTS.SALES)
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


      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Derive stats from Sales
  const tutorialNames = new Set(myTutorials.map(t => t.name));
  const liveClassNames = new Set(myTutorials.filter(t => t.isLiveClass).map(t => t.name));

  // Count total bookings (ONLY Live Classes)
  const totalBookings = salesData.sales.reduce((count, sale) => {
    return count + sale.productNames.filter(name => {
      // Check if name matches a live class.
      // Sales data appends dates to live class names: "Name (Date)".
      // We extract the base name to check against our list of known Live Classes.
      const baseName = name.split(" (")[0]; // remove appended date if any
      return liveClassNames.has(baseName) || liveClassNames.has(name);
    }).length;
  }, 0);

  // Count total physical orders (Sales that contain Physical Products OR Recorded Videos)
  // "Total Orders" should include anything that is NOT a Live Class booking.
  const physicalOrdersCount = salesData.sales.filter(sale => {
    // Check for physical products or recorded videos (excludes live class bookings)
    const hasNonBookingItem = sale.productNames.some(name => {
      const baseName = name.split(" (")[0];
      return !liveClassNames.has(baseName) && !liveClassNames.has(name);
    });
    return hasNonBookingItem;
  }).length;

  const totalRevenue = salesData.totalRevenue;

  // Popup state
  const [popup, setPopup] = useState({
    isOpen: false,
    message: "",
    type: "",
    onConfirm: null
  });

  const closePopup = () => {
    setPopup({ ...popup, isOpen: false });
  };

  const confirmDeleteProduct = async (productId) => {
    try {
      const response = await fetch(`${ENDPOINTS.PRODUCTS}?id=${productId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (response.ok) {
        setMyProducts(prev => prev.filter(p => p.id !== productId));
        setPopup({
          isOpen: true,
          message: 'Product deleted successfully!',
          type: 'success',
          onConfirm: null
        });
      } else {
        const result = await response.json();
        setPopup({
          isOpen: true,
          message: 'Failed to delete: ' + (result.error || 'Unknown error'),
          type: 'error',
          onConfirm: null
        });
      }
    } catch (error) {
      console.error('Delete error:', error);
      setPopup({
        isOpen: true,
        message: 'Failed to delete product',
        type: 'error',
        onConfirm: null
      });
    }
  }

  const confirmDeleteTutorial = async (tutorialId) => {
    try {
      const response = await fetch(`${ENDPOINTS.TUTORIALS}?id=${tutorialId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (response.ok) {
        setMyTutorials(prev => prev.filter(t => t.id !== tutorialId));
        setPopup({
          isOpen: true,
          message: 'Tutorial deleted successfully!',
          type: 'success',
          onConfirm: null
        });
      } else {
        const result = await response.json();
        setPopup({
          isOpen: true,
          message: 'Failed to delete: ' + (result.error || 'Unknown error'),
          type: 'error',
          onConfirm: null
        });
      }
    } catch (error) {
      console.error('Delete error:', error);
      setPopup({
        isOpen: true,
        message: 'Failed to delete tutorial',
        type: 'error',
        onConfirm: null
      });
    }
  }


  // Delete product handler
  const handleDeleteProduct = (productId) => {
    setPopup({
      isOpen: true,
      message: 'Are you sure you want to delete this product?',
      type: 'warning',
      onConfirm: () => confirmDeleteProduct(productId)
    });
  };

  // Delete tutorial handler
  const handleDeleteTutorial = (tutorialId) => {
    setPopup({
      isOpen: true,
      message: 'Are you sure you want to delete this tutorial?',
      type: 'warning',
      onConfirm: () => confirmDeleteTutorial(tutorialId)
    });
  };

  // Edit price handlers
  const handleEditPrice = (product) => {
    setEditPriceModal({
      isOpen: true,
      productId: product.id,
      productName: product.name,
      currentPrice: product.price,
      newPrice: product.price.toString()
    });
  };

  const closeEditPriceModal = () => {
    setEditPriceModal({
      isOpen: false,
      productId: null,
      productName: "",
      currentPrice: 0,
      newPrice: ""
    });
  };

  const handlePriceUpdate = async () => {
    const newPrice = parseFloat(editPriceModal.newPrice);
    if (isNaN(newPrice) || newPrice <= 0) {
      setPopup({
        isOpen: true,
        message: 'Please enter a valid price greater than 0',
        type: 'error',
        onConfirm: null
      });
      return;
    }

    try {
      const response = await fetch(ENDPOINTS.PRODUCTS, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          id: editPriceModal.productId,
          price: newPrice
        })
      });

      if (response.ok) {
        setMyProducts(prev => prev.map(p =>
          p.id === editPriceModal.productId ? { ...p, price: newPrice } : p
        ));
        closeEditPriceModal();
        setPopup({
          isOpen: true,
          message: 'Price updated successfully!',
          type: 'success',
          onConfirm: null
        });
      } else {
        const result = await response.json();
        setPopup({
          isOpen: true,
          message: 'Failed to update price: ' + (result.error || 'Unknown error'),
          type: 'error',
          onConfirm: null
        });
      }
    } catch (error) {
      console.error('Update price error:', error);
      setPopup({
        isOpen: true,
        message: 'Failed to update price',
        type: 'error',
        onConfirm: null
      });
    }
  };

  // Order status update handler
  const handleStatusUpdate = async (saleId, newStatus) => {
    try {
      const response = await fetch(ENDPOINTS.SALES, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ id: saleId, status: newStatus })
      });

      if (response.ok) {
        setSalesData(prev => ({
          ...prev,
          sales: prev.sales.map(sale =>
            getSaleId(sale) === saleId ? { ...sale, status: newStatus } : sale
          )
        }));
        setPopup({
          isOpen: true,
          message: 'Order status updated successfully!',
          type: 'success',
          onConfirm: null
        });
      } else {
        const result = await response.json();
        setPopup({
          isOpen: true,
          message: 'Failed to update status: ' + (result.error || 'Unknown error'),
          type: 'error',
          onConfirm: null
        });
      }
    } catch (error) {
      console.error('Status update error:', error);
      setPopup({
        isOpen: true,
        message: 'Failed to update status',
        type: 'error',
        onConfirm: null
      });
    }
  };

  const openDeliveryModal = (order) => {
    setDeliveryModal({ isOpen: true, order });
  };

  const closeDeliveryModal = () => {
    setDeliveryModal({ isOpen: false, order: null });
  };

  const parseDeliveryAddress = (addressJson) => {
    if (!addressJson) return null;
    try {
      return JSON.parse(addressJson);
    } catch {
      return null;
    }
  };

  // Helper to get sale ID as string (uses idString from backend)
  const getSaleId = (sale) => {
    // Debug: log the sale object structure
    console.log('Sale object:', JSON.stringify(sale, null, 2));

    // Use idString which is the hex string representation
    if (sale.idString) {
      return sale.idString;
    }
    // Fallback for id as object with $oid property
    if (sale.id && typeof sale.id === 'object' && sale.id.$oid) {
      return sale.id.$oid;
    }
    // If id is already a string
    if (sale.id && typeof sale.id === 'string') {
      return sale.id;
    }
    console.log('Could not get sale ID');
    return null;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-MY', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Welcome, {user?.user_fname || "Admin"}!</h1>
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
          <p>{physicalOrdersCount}</p>
        </div>
        <div className="stat-card">
          <h3>Total Bookings</h3>
          <p>{totalBookings}</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="dashboard-tabs">
        <button
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className={`tab-btn ${activeTab === 'products' ? 'active' : ''}`}
          onClick={() => setActiveTab('products')}
        >
          Products
        </button>
        <button
          className={`tab-btn ${activeTab === 'tutorials' ? 'active' : ''}`}
          onClick={() => setActiveTab('tutorials')}
        >
          Tutorials
        </button>
        <button
          className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          Orders
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">

        {/* Overview Tab - Recent Sales */}
        {activeTab === 'overview' && (
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
                  {salesData.sales.slice(0, 10).map((sale, index) => (
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
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
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
                            className="action-button edit"
                            onClick={() => handleEditPrice(product)}
                          >
                            Edit Price
                          </button>
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
        )}

        {/* Tutorials Tab */}
        {activeTab === 'tutorials' && (
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
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="products-table-section">
            <h2>Order Management</h2>
            {loading ? (
              <p>Loading orders...</p>
            ) : salesData.sales && salesData.sales.length > 0 ? (
              <table className="inventory-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Date</th>
                    <th>Customer</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {salesData.sales.map((sale, index) => (
                    <tr key={sale.id || index}>
                      <td>#{index + 1}</td>
                      <td>{formatDate(sale.saleDate)}</td>
                      <td>{sale.customerEmail}</td>
                      <td>{sale.productNames?.join(", ") || "N/A"}</td>
                      <td>RM {Number(sale.totalAmount).toFixed(2)}</td>
                      <td>
                        <select
                          className={`status-select ${(sale.status || 'Pending').toLowerCase()}`}
                          value={sale.status || 'Pending'}
                          onChange={(e) => handleStatusUpdate(getSaleId(sale), e.target.value)}
                        >
                          {statusOptions.map(status => (
                            <option key={status} value={status}>{status}</option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <button
                          className="action-button view"
                          onClick={() => openDeliveryModal(sale)}
                        >
                          View Delivery
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No orders yet.</p>
            )}
          </div>
        )}

      </div>

      <Popup
        isOpen={popup.isOpen}
        message={popup.message}
        type={popup.type}
        onClose={closePopup}
        onConfirm={popup.onConfirm}
        confirmText="Yes, Delete"
      />

      {/* Edit Price Modal */}
      {editPriceModal.isOpen && (
        <div className="edit-price-overlay" onClick={closeEditPriceModal}>
          <div className="edit-price-modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal-btn" onClick={closeEditPriceModal}>×</button>
            <h3>Edit Price</h3>
            <p className="modal-product-name">{editPriceModal.productName}</p>
            <div className="modal-form-group">
              <label>Current Price: RM {Number(editPriceModal.currentPrice).toFixed(2)}</label>
            </div>
            <div className="modal-form-group">
              <label>New Price (RM)</label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={editPriceModal.newPrice}
                onChange={(e) => setEditPriceModal(prev => ({ ...prev, newPrice: e.target.value }))}
                placeholder="Enter new price"
              />
            </div>
            <div className="modal-actions">
              <button className="cancel-btn" onClick={closeEditPriceModal}>Cancel</button>
              <button className="save-btn" onClick={handlePriceUpdate}>Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Delivery Details Modal */}
      {deliveryModal.isOpen && deliveryModal.order && (
        <div className="edit-price-overlay" onClick={closeDeliveryModal}>
          <div className="edit-price-modal delivery-modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal-btn" onClick={closeDeliveryModal}>×</button>
            <h3>Delivery Details</h3>
            <p className="modal-product-name">Order #{salesData.sales.indexOf(deliveryModal.order) + 1}</p>

            {(() => {
              const address = parseDeliveryAddress(deliveryModal.order.deliveryAddress);
              if (address) {
                return (
                  <div className="delivery-details">
                    <div className="detail-row">
                      <span className="detail-label">Full Name:</span>
                      <span className="detail-value">{address.fullName || 'N/A'}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Phone:</span>
                      <span className="detail-value">{address.phone || 'N/A'}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Address:</span>
                      <span className="detail-value">{address.address || 'N/A'}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">City:</span>
                      <span className="detail-value">{address.city || 'N/A'}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">State:</span>
                      <span className="detail-value">{address.state || 'N/A'}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Postal Code:</span>
                      <span className="detail-value">{address.postalCode || 'N/A'}</span>
                    </div>
                  </div>
                );
              } else {
                return <p className="no-address">No delivery address available for this order.</p>;
              }
            })()}

            <div className="modal-actions">
              <button className="save-btn" onClick={closeDeliveryModal}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
