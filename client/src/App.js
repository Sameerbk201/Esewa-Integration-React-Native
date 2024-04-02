import React from "react";
// import PaymentButtonWithCallback from "./Components/PaymentButtonWithCallback";
import { Routes, Route } from "react-router-dom";
import PaymentFailure from "./Components/PaymentFailure";
import Esewav1 from "./Components/Esewav1";
import PaymentButtonWithCallbackv1 from "./Components/PaymentButtonWithCallbackv1";

const App = () => {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<PaymentButtonWithCallbackv1 />} />
        <Route path="/esewapaymentfailure" element={<PaymentFailure />} />
        <Route path="/esewa" element={<Esewav1 />} />
      </Routes>
    </div>
    // <div><PaymentButtonV1/></div>
  );
};

export default App;
