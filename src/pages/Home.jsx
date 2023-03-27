import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Pagecon from "../components/PageCon";
import { theme } from "../App";
import ChatsPage from "../components/ChatsPage";
import StatusPage from "../components/StatusPage";
import { useUserContext } from "../context/UserContext";
// import { useSwipeable } from "react-swipeable";
const Home = () => {
  const [ischat, setischat] = useState(true);

  const { cuser, addtokeninfirebase } = useUserContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (Object.keys(cuser).length !== 0) {
      addtokeninfirebase(cuser);
    } else {
      navigate("/");
    }
  }, []);

  // const handlers = useSwipeable({
  //   onSwipedLeft: (eventData) => {
  //     // console.log("Up Swiped!", eventData);
  //     // setischat(false);
  //   },
  //   onSwipedRight: (eventData) => {
  //     // console.log("Down Swiped!", eventData);
  //     // setischat(true);
  //   },
  // });

  return (
    <Pagecon>
      <div
        style={{
          background: theme.textcolor,
          position: "relative",
        }}
        className="maincon"
      >
        <div
          // style={{
          //   height: "100px",
          //   background: theme.mygreen,
          //   padding: "8px",
          //   position: "relative",
          // }}
          // className="widthcon"
          style={{
            height: "100px",
            background: theme.mygreen,
            padding: "8px",
            position: "fixed",
            // display: "flex",
            // alignItems: "center",
            top: window.innerWidth > 400 ? "32px" : "",
            borderRadius: window.innerWidth > 400 ? "20px" : "",
            borderBottomLeftRadius: window.innerWidth > 400 ? "0px" : "",
            borderBottomRightRadius: window.innerWidth > 400 ? "0px" : "",
            zIndex: 10,
          }}
          className="widthcon"
        >
          <div
            className="flex"
            style={{ justifyContent: "space-between", padding: "0px 10px" }}
          >
            <h2 style={{ color: theme.textcolor }}>
              WhatsApp
              </h2>
            <ion-icon
              name="person-circle-outline"
              style={{
                fontSize: "30px",
                color: theme.textcolor,
                cursor: "pointer",
                marginRight: "10px",
              }}
              onClick={() => {
                navigate("/account");
              }}
            ></ion-icon>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              position: "absolute",
              bottom: 0,
            }}
            className="widthcon"
          >
            <h4
              style={{
                width: "50%",
                textAlign: "center",
                color: ischat ? theme.textcolor : theme.graycolor,
                cursor: "pointer",
                borderBottom: ischat ? `3px solid ${theme.textcolor}` : "",
                fontWeight: ischat ? "600" : "400",
                transition: "all 0.3s linear",
              }}
              onClick={() => {
                setischat(true);
              }}
            >
              CHATS
            </h4>
            <h4
              style={{
                width: "50%",
                textAlign: "center",
                color: !ischat ? theme.textcolor : theme.graycolor,
                cursor: "pointer",
                borderBottom: !ischat ? `3px solid ${theme.textcolor}` : "",
                fontWeight: !ischat ? "600" : "400",
                transition: "all 0.3s linear",
              }}
              onClick={() => {
                setischat(false);
              }}
            >
              STATUS
            </h4>
          </div>
        </div>
        {ischat ? <ChatsPage /> : <StatusPage />}
      </div>
    </Pagecon>
  );
};

export default Home;
