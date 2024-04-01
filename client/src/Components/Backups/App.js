import React, { useEffect, useState } from "react";
import "./Esewa.css"; // Import your CSS file for styling

const Esewa = () => {
  const [orders, setOrders] = useState([]);
  const [productId, setProductId] = useState("");
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState(0);
  const [productQuantity, setProductQuantity] = useState(0);
  const [response, setResponse] = useState("");

  const getOrders = async () => {
    try {
      const response = await fetch(
        "http://192.168.50.251:9000/api/esewa/getorders"
      );
      const data = await response.json();
      setOrders(data.message);
    } catch (error) {
      console.log(error.message);
    }
  };

  const handlePayment = async () => {
    try {
      const payload = {
        amount: productPrice * productQuantity,
        products: [
          {
            product: productName,
            amount: productPrice,
            quantity: productQuantity,
          },
        ],
      };

      const response = await fetch(
        "http://192.168.50.251:9000/api/esewa/createorder",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();
      setResponse(data.formData.signature);
      esewaCall(data.formData);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    getOrders();
  }, []);

  const handleAddProduct = () => {
    getOrders();
  };

  const esewaCall = (formData) => {
    try {
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

  return (
    <div className="container">
      <div className="input-container">
        <label htmlFor="productId">Product ID:</label>
        <input
          type="text"
          id="productId"
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
        />
      </div>
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
      <button className="btn" onClick={handleAddProduct}>
        Refresh
      </button>
      <button className="btn" onClick={handlePayment}>
        Make Payment
      </button>
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
      <div className="response">{response && <p>{response}</p>}</div>
    </div>
  );
};

export default Esewa;
