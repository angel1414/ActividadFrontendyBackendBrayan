import React from "react";

const HomeButton = ({ label, onClick }) => (
  <button className="home-button" onClick={onClick}>
    {label}
  </button>
);

export default HomeButton;
