import React, { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import { theme } from "../App";
import BottomDialog from "./BottomDialog";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import * as timeago from "timeago.js";
import Loading from "./Loading";
import { changeToTheme } from "../changemeta";
import { useSwipeable } from "react-swipeable";
import { useUserContext } from "../context/UserContext";
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
const ChatC = styled.div`
  &:hover {
    background: ${({ theme }) => theme.graycolor};
  }
`;

const MyDialog = styled.div`
  width: ${window.innerWidth > 400 ? "400px" : "100vw"};
  height: ${window.innerWidth > 400 ? "91vh" : "100vh"};
  position: fixed;
  top: ${window.innerWidth > 400 ? "33px" : "0px"};
  background: black;
  border-radius: ${window.innerWidth > 400 ? "20px" : "0px"};
  z-index: 50;
  animation: ${mybottomanim} 0.4s ease-in-out;
`;

const StoryDialog = ({ setdialogimg, item }) => {
  const { cuser, addViewer, getallviewers, newviewers } = useUserContext();
  const [bottomdisplay, setbottomdisplay] = useState(false);
  const [isload, setisload] = useState(false);
  useEffect(() => {
    getallviewers(
      item.story_data[0].data.date.toString(),
      cuser,
      setisload,
      item.user_id
    );
  }, []);

  const handlers = useSwipeable({
    onSwipedUp: (eventData) => {
      // console.log("Up Swiped!", eventData);
      setbottomdisplay(true);
    },
    onSwipedDown: (eventData) => {
      // console.log("Down Swiped!", eventData);
      setbottomdisplay(false);
    },
  });

  // console.log(newviewers);
  // console.log(item);

  return (
    <div style={{ position: "relative", zIndex: 10 }} {...handlers}>
      <MyDialog>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            padding: "10px",
            // position:"absolute",
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
              setdialogimg(false);
            }}
          ></ion-icon>
        </div>
        <div style={{ marginTop: "25px", marginBottom: "5px" }}>
          <Carousel
            showArrows={false}
            useKeyboardArrows
            showStatus={false}
            showThumbs={false}
            // showIndicators={false}
            // dynamicHeight
            // animationHandler="fade"
            onChange={(newindex, newitem) => {
              // console.log(newitem.props.children[0].props.alt);
              getallviewers(
                newitem.props.children[0].props.alt.toString(),
                cuser,
                setisload,
                item.user_id
              );
              addViewer(
                newitem.props.children[0].props.alt.toString(),
                item,
                cuser
              );
            }}
          >
            {item.story_data.map((item1, index1) => (
              <div
                key={index1}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                  position: "relative",
                }}
              >
                <img
                  src={item1.data.story_img}
                  alt={item1.data.date}
                  style={{
                    width: window.innerWidth > 400 ? "400px" : "100vw",
                    height:
                      window.innerWidth > 400
                        ? window.innerHeight - 190
                        : window.innerHeight - 140,
                    objectFit: "contain",
                  }}
                />

                {item1.data.textmsg && item1.data.textmsg !== "" && (
                  <div
                    style={{
                      color: theme.textcolor,
                      fontSize: "15px",
                      padding: "0px 10px",
                      wordWrap: "break-word",
                      background: "rgba(0,0,0,0.5)",
                      position: "absolute",
                      bottom: "38px",
                      textAlign: "center",
                      width: window.innerWidth > 400 ? "400px" : "100vw",
                    }}
                  >
                    {item1.data.textmsg}
                  </div>
                )}
              </div>
            ))}
          </Carousel>
        </div>
        {item.user_id === cuser.uid ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              color: theme.textcolor,
              marginBottom: "",
              position: "absolute",
              bottom: "10px",
              width: "100%",
            }}
          >
            <span>Seen By</span>
            <ion-icon
              name="chevron-up-outline"
              style={{ fontSize: "25px", cursor: "pointer" }}
              onClick={() => {
                setbottomdisplay(true);
              }}
            ></ion-icon>

            {bottomdisplay && (
              <BottomDialog
                style={{
                  borderRadius: "50px 50px 0px 0px",
                  padding:"0px",
                  width:window.innerWidth > 400 ? "380px" : "100vw",
                  // overflow:"scroll"
                }}
              >
                <div
                  style={{
                    background: theme.mygreen,
                    padding: "20px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    position: "relative",
                    borderRadius: "15px 15px 0px 0px",
                    marginTop: "-10px",
                    // width:
                    //   window.innerWidth > 400 ? "400px" : window.innerWidth,
                  }}
                >
                  <p>Viewed By</p>
                  <ion-icon
                    name="close-outline"
                    style={{
                      color: theme.textcolor,
                      fontSize: "25px",
                      cursor: "pointer",
                      position: "absolute",
                      right: "10px",
                    }}
                    onClick={() => {
                      setbottomdisplay(false);
                    }}
                  ></ion-icon>
                </div>

                {isload ? (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Loading />
                  </div>
                ) : newviewers.length !== 0 ? (
                  <div
                    style={{
                      color: "black",
                      maxHeight: "300px",
                      overflow: "scroll",
                    }}
                  >
                    {newviewers.map((viewitem, viewindex) => (
                      <ChatC
                        style={{
                          padding: "8px 10px",
                          display: "flex",
                          cursor: "pointer",
                          transition: "all 0.3s ease-in",
                        }}
                        key={viewindex}
                      >
                        <img
                          src={viewitem.image}
                          alt=""
                          style={{
                            width: "50px",
                            height: "50px",
                            borderRadius: "50%",
                            objectFit: "cover",
                            cursor: "pointer",
                            border: `2px solid ${theme.mygreen}`,
                            padding: "2px",
                          }}
                        />
                        <div style={{ marginLeft: "15px" }}>
                          <h4>{viewitem.name}</h4>
                          <span style={{ fontSize: "13px" }}>
                            {timeago.format(viewitem.viewer_time * 1000)}
                          </span>
                        </div>
                      </ChatC>
                    ))}
                  </div>
                ) : (
                  <h4 style={{ color: "black", textAlign: "center" }}>
                    No Views
                  </h4>
                )}
              </BottomDialog>
            )}
          </div>
        ) : (
          <></>
        )}
      </MyDialog>
    </div>
  );
};

export default StoryDialog;
