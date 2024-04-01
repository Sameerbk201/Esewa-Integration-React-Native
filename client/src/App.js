import React from "react";
import PaymentButtonWithCallback from "./Components/PaymentButtonWithCallback";
import { Routes, Route } from "react-router-dom";
import PaymentFailure from "./Components/PaymentFailure";

const App = () => {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<PaymentButtonWithCallback />} />
        <Route path="/esewapaymentfailure" element={<PaymentFailure />} />
      </Routes>
    </div>
    // <div><PaymentButtonV1/></div>
  );
};

export default App;
