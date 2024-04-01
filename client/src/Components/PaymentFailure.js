import React, { useEffect } from "react";
import "./Esewa.css";
import { useNavigate } from "react-router-dom";
const PaymentFailure = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        boxSizing: "border-box",
        height: "100vh",
        padding: "10px",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div style={{ padding: "10px" }}>Payment Failed</div>
      <div>
        <button className="btn" onClick={(e) => navigate("/")}>
          Home
        </button>
      </div>
    </div>
  );
};

export default PaymentFailure;
