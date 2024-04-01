import React from "react";
import Esewa from "./Components/Esewa";
import PaymentButton from "./Components/PaymentButton";
import PaymentButtonWithCallback from "./Components/PaymentButtonWithCallback";
import PaymentButtonV1 from "./Components/PaymentButtonv1";

const App = () => {
  return (
    <>
      <div>
        {/* <Esewa /> */}
      </div>
    
      {/* <div>
        <PaymentButton />
      </div> */}
      <div>
        <PaymentButtonWithCallback />
      </div>
    </>
    // <div><PaymentButtonV1/></div>
  );
};

export default App;
