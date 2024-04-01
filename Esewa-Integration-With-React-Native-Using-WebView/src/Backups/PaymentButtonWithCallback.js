import React, { useEffect } from "react";
import { View, Button } from "react-native";
import { WebView } from "react-native-webview";
import CryptoJS from "crypto-js";
import { v4 as uuidv4 } from "uuid";

const PaymentButtonWithCallback = () => {
  const handlePaymentCallback = (event) => {
    const { url } = event.nativeEvent;

    if (url.includes("your-callback-url")) {
      const urlParams = url.split("?")[1];
      const dataParam = decodeURIComponent(urlParams)
        .split("&")[0]
        .split("=")[1];

      if (dataParam) {
        try {
          const decodedData = CryptoJS.AES.decrypt(
            dataParam,
            "8gBm/:&EnhH.1/q"
          ).toString(CryptoJS.enc.Utf8);
          console.log(JSON.parse(decodedData));
        } catch (error) {
          console.error("Error decoding data:", error);
        }
      } else {
        console.log("No data found in the query parameter.");
      }
    }
  };
  useEffect(() => {
    return () => {
      // cleanup
    };
  }, []);

  const handlePayment = () => {
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

    const paymentUrl = `https://rc-epay.esewa.com.np/api/epay/main/v2/form?amount=${totalAmount}&transaction_uuid=${transactionUUID}&product_code=${productCode}&signature=${signature}&success_url=http://localhost:3000&failure_url=https://google.com`;

    // Load the payment page in WebView
    // You can customize WebView styles and behavior as per your requirement
    return (
      <WebView
        source={{ uri: paymentUrl }}
        onNavigationStateChange={handlePaymentCallback}
      />
    );
  };

  return (
    <View>
      <Button title="Pay Now" onPress={handlePayment} />
    </View>
  );
};

export default PaymentButtonWithCallback;
