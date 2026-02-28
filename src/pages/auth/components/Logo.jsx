// src/components/AnotaloLogo.jsx
import React from "react";
import logo from "/images/Logo.png"; // Import directo desde public/images

const AnotaloLogo = ({ width }) => (
  <div className="anotalo-logo-container">
    <div>
      <img src={logo} alt="Anotalo Logo" style={{ width, height: "auto" }} />
    </div>
  </div>
);

export default AnotaloLogo;
