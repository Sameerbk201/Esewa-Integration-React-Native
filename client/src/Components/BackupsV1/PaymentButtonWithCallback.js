import React, { useEffect } from "react";
import CryptoJS from "crypto-js";
import { v4 as uuidv4 } from "uuid";

const PaymentButtonWithCallback = () => {
  const handleClick = () => {
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

    // Creating the form dynamically and submitting it
    const form = document.createElement("form");
    form.method = "POST";
    form.action = "https://rc-epay.esewa.com.np/api/epay/main/v2/form";

    // Appending input fields
    const inputFields = [
      { name: "amount", value: "100" },
      { name: "tax_amount", value: "0" },
      { name: "total_amount", value: "100" },
      { name: "transaction_uuid", value: transactionUUID },
      { name: "product_code", value: productCode },
      { name: "product_service_charge", value: "0" },
      { name: "product_delivery_charge", value: "0" },
      { name: "success_url", value: "http://localhost:3000" },
      { name: "failure_url", value: "https://google.com" },
      {
        name: "signed_field_names",
        value: "total_amount,transaction_uuid,product_code",
      },
      { name: "signature", value: signature },
    ];

    inputFields.forEach((field) => {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = field.name;
      input.value = field.value;
      form.appendChild(input);
    });

    document.body.appendChild(form);
    form.submit();
  };

  useEffect(() => {
    const handlePaymentCallback = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const dataParam = urlParams.get("data");

      if (dataParam) {
        try {
          // Decode the Base64 encoded data using the secret
          console.log(dataParam);
          // Decode the String
          var decodedStringAtoB = atob(dataParam);
        //   const decodedData = CryptoJS.AES.decrypt(
        //     dataParam,
        //     "8gBm/:&EnhH.1/q"
        //   ).toString(CryptoJS.enc.Utf8);
          console.log(JSON.parse(decodedStringAtoB));
        } catch (error) {
          console.error("Error decoding data:", error);
        }
      } else {
        console.log("No data found in the query parameter.");
      }
    };

    // Call handlePaymentCallback when component mounts
    handlePaymentCallback();
  }, []);

  return <button onClick={handleClick}>Pay Now</button>;
};

export default PaymentButtonWithCallback;
