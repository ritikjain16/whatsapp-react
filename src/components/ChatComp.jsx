import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { changeToBlack } from "../changemeta";
import { useUserContext } from "../context/UserContext";
const ChatC = styled.div`
  &:hover {
    /* background: ${({ theme }) => theme.graycolor}; */
    margin: 8px;
    border-radius: 15px 30px 15px 30px;
  }
  margin: 5px;
  box-shadow: 0 0 1rem rgba(0, 0, 0, 0.1);
  border-radius: 10px 25px 10px 25px;
`;

const ChatComp = ({ item, setpicdialog, setdialogimg }) => {
  const navigate = useNavigate();
  const { newtheme } = useUserContext();
  // console.log(item);
  return (
    <ChatC
      style={{
        padding: "8px 10px",
        display: "flex",
        cursor: "pointer",
        transition: "all 0.2s ease-in",
        position: "relative",
      }}
    >
      <img
        src={item.image}
        alt=""
        style={{
          width: "50px",
          height: "50px",
          borderRadius: "50%",
          objectFit: "cover",
          cursor: "pointer",
        }}
        onClick={() => {
          changeToBlack();
          setdialogimg(item.image);
          setpicdialog(true);
        }}
      />
      <div
        style={{ marginLeft: "15px", width: "80%" }}
        onClick={() => {
          navigate("/chat", {
            state: { item },
          });
        }}
      >
        <h4>{item.name}</h4>
        <span style={{ fontSize: "13px" }}>{item.email}</span>
      </div>
      {/* {item.status === "online 🟢" && (
        <div
          style={{
            position: "absolute",
            right: "15px",
            top: "10px",
            width: "10px",
            height: "10px",
            borderRadius: "50%",
            background: newtheme.mygreen,
          }}
        ></div>
      )} */}
    </ChatC>
  );
};

export default ChatComp;
