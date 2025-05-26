import React from "react";

const LoginButton = ({ onLogin }) => {
  return (
    <button className="login-button" onClick={onLogin}>
      Ingresar a la tienda
    </button>
  );
};

export default LoginButton;
