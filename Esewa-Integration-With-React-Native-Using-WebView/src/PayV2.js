import React from "react";
import { WebView } from "react-native-webview";
import "react-native-get-random-values";

const PayV2 = () => {
  return (
    <WebView
      source={{ uri: "http://192.168.50.251:3000" }}
      shouldOverrideUrlLoadingSynchronousMethodEnabled={false}
      style={{ flex: 1, marginTop: 40 }}
    />
  );
};

export default PayV2;
