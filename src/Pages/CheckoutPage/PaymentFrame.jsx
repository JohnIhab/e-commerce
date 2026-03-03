import React from "react";

const PaymentFrame = ({ html }) => {
  return (
    <iframe
      srcDoc={html}
      title="Payment Gateway"
      style={{
        width: "100%",
        height: "600px",
        border: "none",
        borderRadius: "12px",
        boxShadow: "0 0 10px rgba(0,0,0,0.1)",
      }}
    />
  );
};

export default PaymentFrame;
