import React from "react";
import CryptoJS from "crypto-js";
import { v4 as uuidv4 } from "uuid";

const PaymentButtonV1 = () => {
  const handleClick = async () => {
    const totalAmount = 100;
    const transactionUUID = uuidv4();
    const productCode = "EPAYTEST";
    const secret = "8gBm/:&EnhH.1/q";

    // Constructing the data string for signature
    const dataString = `total_amount=${totalAmount},transaction_uuid=${transactionUUID},product_code=${productCode}`;

    // Generating the signature using CryptoJS
    const signature = CryptoJS.HmacSHA256(dataString, secret).toString(
      CryptoJS.enc.Base64
    );

    // Constructing the payload
    const payload = new URLSearchParams();
    payload.append("amount", "100");
    payload.append("tax_amount", "0");
    payload.append("total_amount", "100");
    payload.append("transaction_uuid", transactionUUID);
    payload.append("product_code", productCode);
    payload.append("product_service_charge", "0");
    payload.append("product_delivery_charge", "0");
    payload.append("success_url", "http://localhost:3000");
    payload.append("failure_url", "https://google.com");
    payload.append(
      "signed_field_names",
      "total_amount,transaction_uuid,product_code"
    );
    payload.append("signature", signature);

    try {
      const response = await fetch(
        "https://rc-epay.esewa.com.np/api/epay/main/v2/form",
        {
          method: "POST",
          body: payload,
        }
      );
      // Handle response here
      console.log("Response:", response);
    } catch (error) {
      // Handle error here
      console.error("Error:", error);
    }
  };

  return <button onClick={handleClick}>Pay Now</button>;
};

export default PaymentButtonV1;
