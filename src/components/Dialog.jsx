import React from "react";
import styled, { keyframes } from "styled-components";
import { theme } from "../App";
import { changeToTheme } from "../changemeta";
const mybottomanim = keyframes`
0%{
opacity: 0;
transform: translateY(100vh);
}
100%{
opacity: 1;
transform: translateY(0px);
}
`;
const MyDialog = styled.div`
  width: ${window.innerWidth > 400 ? "400px" : "100vw"};
  height: ${window.innerWidth > 400 ? "91vh" : "100vh"};
  position: fixed;
  top: ${window.innerWidth > 400 ? "33px" : "0px"};
  /* left: 0;
  right: 0; */
  /* bottom: 0; */
  background: black;
  border-radius: ${window.innerWidth > 400 ? "20px" : "0px"};
  z-index: 50;
  animation: ${mybottomanim} 0.4s ease-in-out;
`;

const Dialog = ({ setpicdialog, dialogimg, setdialogimg }) => {
  return (
    <div style={{ position: "relative" }}>
      <MyDialog>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            padding: "10px",
          }}
        >
          <ion-icon
            name="close-outline"
            style={{
              color: theme.textcolor,
              fontSize: "25px",
              cursor: "pointer",
            }}
            onClick={() => {
              changeToTheme();
              setpicdialog(false);
              setdialogimg("");
            }}
          ></ion-icon>
        </div>
        <div>
          <img
            src={dialogimg}
            alt=""
            style={{
              width: window.innerWidth > 400 ? "400px" : "100vw",
              height: window.innerWidth > 400 ? "80vh" : "90vh",
              objectFit: "contain",
            }}
          />
        </div>
      </MyDialog>
    </div>
  );
};

export default Dialog;
