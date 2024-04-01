import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import PaymentButtonWithCallback from "./src/PaymentButtonWithCallback";
// import PayV1 from "./src/PayV1";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import PayV1 from "./src/PayV1";
export default function App() {
  return (
      <PayV1 />
    // <GestureHandlerRootView>
    // </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({});
