import React, { useEffect, useState } from "react";

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
      console.log(data);
      setOrders(data.message)
    } catch (error) {
      console.log(error.message);
    }
  };

  const handlePayment = async () => {
    try {
      console.log("Product ID:", productId);
      console.log("Product Name:", productName);
      console.log("Product Price:", productPrice);
      console.log("Product Quantity:", productQuantity);

      const payload = {
        amount: 100,
        products: [
          {
            product: "apple",
            amount: 100,
            quantity: 1,
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
      console.log(data);
      // console.log(data.formData.signature);
      setResponse(data.formData.signature);
      // makePayment(data.formData)
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

  const makePayment = async (formData) => {
    const url = "https://rc-epay.esewa.com.np/api/epay/main/v2/form";

    // Convert formData object into FormData format
    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      formDataToSend.append(key, formData[key]);
    });

    // Make the POST request
    fetch(url, {
      method: "POST",
      body: formDataToSend,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Payment successful:", data);
        // Handle success - maybe redirect user to success_url
        window.location.href = data.success_url;
      })
      .catch((error) => {
        console.error("Error making payment:", error);
        // Handle error - maybe redirect user to failure_url
        // window.location.href = formData.failure_url;
      });
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

  return (
    <div>
      <div>
        <label htmlFor="productId">Product ID:</label>
        <input
          type="text"
          id="productId"
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="productName">Product Name:</label>
        <input
          type="text"
          id="productName"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="productPrice">Product Price:</label>
        <input
          type="number"
          id="productPrice"
          value={productPrice}
          onChange={(e) => setProductPrice(parseFloat(e.target.value))}
        />
      </div>
      <div>
        <label htmlFor="productQuantity">Product Quantity:</label>
        <input
          type="number"
          id="productQuantity"
          value={productQuantity}
          onChange={(e) => setProductQuantity(parseInt(e.target.value))}
        />
      </div>
      <button onClick={handleAddProduct}>Refresh</button>
      <button onClick={handlePayment}>Make Payments</button>
      <table>
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
      <div>{response && <p>{response}</p>}</div>
    </div>
  );
};

export default Esewa;
