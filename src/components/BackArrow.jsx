import React from "react";
import { theme } from "../App";
import { useNavigate } from "react-router-dom";
const BackArrow = ({n}) => {
  const navigate = useNavigate();
  return (
    <ion-icon
      name="arrow-back-outline"
      style={{
        color: theme.textcolor,
        position: "absolute",
        top: "15px",
        left: "15px",
        fontSize: "25px",
        cursor: "pointer",
      }}
      onClick={() => {
        navigate(n);
      }}
    ></ion-icon>
  );
};

export default BackArrow;
