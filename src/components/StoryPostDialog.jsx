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

const StoryPostDialog = ({
  setpicdialog,
  dialogimg,
  setdialogimg,
  textmsg,
  settextmsg,
  addstory,
  setprogressVisible,
  settempimg,
}) => {
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
              settempimg(null);
            }}
          ></ion-icon>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <img
            src={dialogimg}
            alt=""
            style={{
              width: window.innerWidth > 400 ? "400px" : "100vw",
              height: window.innerWidth > 400 ? "70vh" : "78vh",
              objectFit: "contain",
            }}
          />
          // -------------------------------------------------
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div
              style={{
                background: theme.textcolor,
                width: window.innerWidth > 400 ? "380px" : "90vw",
                height: "50px",
                // borderRadius: "30px",
                borderRadius: "10px 25px 10px 25px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 10,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 10,
                  marginLeft: "10px",
                }}
              >
                <input
                  type="text"
                  placeholder="Type a message..."
                  style={{
                    caretColor: theme.mygreen,
                    border: "none",
                    outline: 0,
                    fontWeight: "500",
                    width: window.innerWidth > 400 ? "300px" : "65vw",
                  }}
                  maxLength={50}
                  value={textmsg}
                  onChange={(e) => {
                    settextmsg(e.target.value);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      changeToTheme();
                      setpicdialog(false);
                      setdialogimg("");
                      setprogressVisible(true);
                      addstory();
                    }
                  }}
                />
              </div>
              <button
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "40px",
                  height: "40px",
                  background: theme.mygreen,
                  borderRadius: "5px 15px 5px 15px",
                  border: "none",
                  outline: 0,
                  marginRight: "4px",
                  cursor: "pointer",
                }}
                onClick={() => {
                  changeToTheme();
                  setpicdialog(false);
                  setdialogimg("");
                  setprogressVisible(true);
                  addstory();
                }}
              >
                <ion-icon
                  name="send"
                  style={{ color: theme.textcolor, cursor: "pointer" }}
                ></ion-icon>
              </button>
            </div>
          </div>
          // -------------------------------------------------
        </div>
      </MyDialog>
    </div>
  );
};

export default StoryPostDialog;
