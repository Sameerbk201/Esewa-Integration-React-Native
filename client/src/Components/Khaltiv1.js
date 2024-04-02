import React, { useEffect, useState } from "react";
import "./Esewa.css";

const Khaltiv1 = () => {
  const [orders, setOrders] = useState([]);
  const [productId, setProductId] = useState("");
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState(0);
  const [productQuantity, setProductQuantity] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState(null);
  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  const getOrders = async () => {
    try {
      const response = await fetch(
        process.env.REACT_APP_BACKEND_URL + "/api/khaltiv1/getordersv1"
      );
      const data = await response.json();
      console.log(data);
      setOrders(data.message);
    } catch (error) {
      console.log(error.message);
    }
  };

  const handlePayment = async (e) => {
    const payload = {
      payment_method:'khalti',
      amount: 100,
      products: [
        {
          product: productName || "banana",
          amount: 100,
          quantity: productQuantity || 1,
        },
      ],
    };
    console.log(payload);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/khaltiv1/createorderv1`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );
      const data = await response.json();
      console.log(data.message);
      khaltiCall(data.message.data);
    } catch (error) {}
  };

  const khaltiCall = (data) => {
    try {
      console.log(data.payment_url);
      window.location.href = data.payment_url;
    } catch (error) {
      console.log(`[+] Esewa Failed : `, error.message);
    }
  };

  useEffect(() => {
    getOrders();
  }, []);

  return (
    <div className="container">
      {/* <div className="input-container">
        <label htmlFor="productId">Product ID:</label>
        <input
          type="text"
          id="productId"
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
        />
      </div> */}
      <div className="input-container">
        <label htmlFor="productName">Product Name:</label>
        <input
          type="text"
          id="productName"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
        />
      </div>
      <div className="input-container">
        <label htmlFor="productPrice">Product Price:</label>
        <input
          type="number"
          id="productPrice"
          value={productPrice}
          onChange={(e) => setProductPrice(parseFloat(e.target.value))}
        />
      </div>
      <div className="input-container">
        <label htmlFor="productQuantity">Product Quantity:</label>
        <input
          type="number"
          id="productQuantity"
          value={productQuantity}
          onChange={(e) => setProductQuantity(parseInt(e.target.value))}
        />
      </div>
      <button className="btnkhalti" onClick={(e) => getOrders}>
        Refresh
      </button>
      <button className="btnkhalti" onClick={handlePayment}>
        Khalti
      </button>
      <div style={{ height: "400px", overflow: "auto", cursor: "pointer" }}>
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Payment Method</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Transaction Code</th>
              <th>View Details</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <tr key={index}>
                <td>{order._id}</td>
                <td>{order.payment_method}</td>
                <td>{order.amount}</td>
                <td>{order.status}</td>
                <td>{order.transaction_code}</td>
                <td>
                  <button
                    className="btn"
                    onClick={(e) => {
                      setIsOpen(true);
                      setMessage(JSON.stringify(order));
                    }}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="modal-container">
          {/* <button className="open-button" onClick={toggleModal}>
          Open Modal
        </button> */}
          {isOpen && (
            <div className="modal-overlay">
              <div className="modal">
                <div className="modal-header">
                  <h2>Transaction details</h2>
                  <button className="close-button" onClick={toggleModal}>
                    &times;
                  </button>
                </div>
                <div className="modal-content">
                  <p style={{ overflow: "auto" }}>{message}</p>
                </div>
                <div className="modal-footer">
                  <button className="close-button" onClick={toggleModal}>
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Khaltiv1;
