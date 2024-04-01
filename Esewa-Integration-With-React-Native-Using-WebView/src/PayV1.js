import React from "react";
import { WebView } from "react-native-webview";
import { Alert } from "react-native";
import base64 from "react-native-base64";

const PayV1 = () => {
  const testurl = `https://uat.esewa.com.np/api/epay/transaction/status/?product_code=EPAYTEST&total_amount=100&transaction_uuid=`;

  const handleNavigationStateChange = async (newNavState) => {
    try {
      const { url } = newNavState;
      // Check if the URL contains the callback parameter
      if (url.includes("data=")) {
        // Extract the data parameter from the URL
        const dataParam = url.split("?data=")[1];
        console.log(dataParam);
        const decodedData = base64.decode(dataParam);

        // // Decode the Base64 encoded data using Buffer
        // const decodedData = Buffer.from(dataParam, "base64").toString("utf-8");
        // Parse the decoded data
        const parsedData = JSON.parse(decodedData);
        const { transaction_uuid } = parsedData;
        console.log({ parsedData });

        // Display the parsed data or perform any necessary actions
        Alert.alert("Payment Callback", JSON.stringify(parsedData));

        const response = await fetch(testurl + transaction_uuid);
        const confirmationdata = await response.json();
        console.log({confirmationdata});
        // Prevent further navigation
        return false;
      }
      // Allow navigation to continue
      return true;
    } catch (error) {
      console.log(error);
      return true;
    }
  };

  return (
    <WebView
      source={{ uri: "http://192.168.50.251:3000" }}
      onNavigationStateChange={handleNavigationStateChange}
      style={{ flex: 1, marginTop: 40 }}
    />
  );
};

export default PayV1;
