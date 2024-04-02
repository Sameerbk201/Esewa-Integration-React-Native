import React, { useEffect, useState } from "react";
import "./Esewa.css";

const Esewav1 = () => {
  const [orders, setOrders] = useState([]);
  const [productId, setProductId] = useState("");
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState(0);
  const [productQuantity, setProductQuantity] = useState(0);

  const getOrders = async () => {
    try {
      const response = await fetch(
        process.env.REACT_APP_BACKEND_URL + "/api/esewa/getorders"
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
        `${process.env.REACT_APP_BACKEND_URL}/api/esewav1/createorderv1`,
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
      esewaCall(data.message)
    } catch (error) {}
  };

  const esewaCall = (formData) => {
    try {
      console.log(formData);
      var path = "https://rc-epay.esewa.com.np/api/epay/main/v2/form";

      var form = document.createElement("form");
      form.setAttribute("method", "POST");
      form.setAttribute("action", path);

      for (var key in formData) {
        var hiddenField = document.createElement("input");
        hiddenField.setAttribute("type", "hidden");
        hiddenField.setAttribute("name", key);
        hiddenField.setAttribute("value", formData[key]);
        form.appendChild(hiddenField);
      }
      document.body.appendChild(form);
      form.submit();
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
      <button className="btn" onClick={(e) => getOrders}>
        Refresh
      </button>
      <button className="btn" onClick={handlePayment}>
        Make Payment
      </button>
      <div style={{ height: "400px", overflow: "auto" }}>
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Payment Method</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Transaction Code</th>
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Esewav1;
