import React, { useState } from "react";
import { View, Button } from "react-native";
import { WebView } from "react-native-webview";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";

import CryptoJS from "crypto-js";


const PaymentButtonWithCallback = () => {
  const [showWebView, setShowWebView] = useState(false);
  const [url, setUrl] = useState(null);

  const handlePaymentCallback = (event) => {
    const { url } = event;
    const callbackUrl = "http://192.168.50.251:3000"; // Update with your actual callback URL

    if (url.startsWith(callbackUrl)) {
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

  const handlePayment = () => {
    try {
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

      const paymentUrl = `https://rc-epay.esewa.com.np/api/epay/main/v2/form`;
      const postData = `amount=${totalAmount}&tax_amount=10&total_amount=110&transaction_uuid=${transactionUUID}&product_code=${productCode}&product_service_charge=0&product_delivery_charge=0&success_url=${encodeURIComponent(
        "http://192.168.50.251:3000"
      )}&failure_url=${encodeURIComponent(
        "https://google.com"
      )}&signed_field_names=total_amount,transaction_uuid,product_code&signature=${signature}`;
      console.log(signature);
      setUrl({ uri: paymentUrl, method: "POST", body: postData });
      setShowWebView(true); // Set showWebView to true when button is pressed
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {showWebView && url ? (
        <WebView
          originWhitelist={["*"]}
          source={url}
          onNavigationStateChange={handlePaymentCallback}
          onError={(error) => console.error("WebView error:", error)}
          style={{ marginTop: 40, flex: 1 }} // Set WebView's style to fill available space
        />
      ) : (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Button title="Pay Now" onPress={handlePayment} />
        </View>
      )}
    </View>
  );
};

export default PaymentButtonWithCallback;
