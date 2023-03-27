import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { theme } from "../App";

import Loading from "./Loading";
import StatusComp from "./StatusComp";
// import imageCompression from "browser-image-compression";
import StoryDeleteDialog from "./StoryDeleteDialog";
import { CompressImage } from "../imagecomp";
import StoryPostDialog from "./StoryPostDialog";
import { changeToBlack } from "../changemeta";
import { useUserContext } from "../context/UserContext";
const ChatC = styled.div`
  &:hover {
    background: ${({ theme }) => theme.graycolor};
  }
`;

const StatusPage = () => {
  const { otherstories, getallstories, uploadStatusImage, cuser } =
    useUserContext();

  const [loading, setloading] = useState(false);

  const imageref1 = useRef(null);
  const [progressVisible, setprogressVisible] = useState(false);
  const [storydeletemodal, setstorydeletemodal] = useState(false);

  const [picdialog, setpicdialog] = useState(false);
  const [dialogimg, setdialogimg] = useState("");
  const [textmsg, settextmsg] = useState("");
  const [tempimg, settempimg] = useState(null);
  // useEffect(() => {
  //   getallstories(setloading);
  //   const interval = setInterval(() => {
  //     getallstories(setloading);
  //   }, 6000);
  //   return () => {
  //     clearInterval(interval);
  //   };
  // }, []);

  const addstory = async () => {
    try {
      const compressedFile = await CompressImage(tempimg);
      uploadStatusImage(
        compressedFile,
        compressedFile.name,
        setprogressVisible,
        cuser,
        getallstories,
        setloading,
        textmsg,
        settextmsg
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div style={{ position: "relative" }}>
        <br />
        <br />
        <br />
        <br />
        <br />
        <input
          style={{ display: "none" }}
          ref={imageref1}
          type="file"
          accept="image/*"
          onChange={async (e) => {
            if (e.target.files[0] !== undefined) {
              // setprogressVisible(true);
              const imageFile = e.target.files[0];
              settempimg(imageFile);
              // console.log(window.URL.createObjectURL(e.target.files[0]));
              setdialogimg(window.URL.createObjectURL(e.target.files[0]));
              changeToBlack();
              setpicdialog(true);
              // try {
              //   const compressedFile = await CompressImage(imageFile);
              //   uploadStatusImage(
              //     compressedFile,
              //     compressedFile.name,
              //     setprogressVisible,
              //     cuser,
              //     getallstories,
              //     setloading
              //   );
              // } catch (error) {
              //   console.log(error);
              // }
            }
          }}
        />
        {(loading || progressVisible) && (
          <div
            className="flex"
            style={{
              height: "200px",
              position: "absolute",
              top: 50,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width:window.innerWidth>400?"400px":window.innerWidth
            }}
          >
            <Loading />
          </div>
        )}
        <>
          <ChatC
            style={{
              padding: "8px 10px",
              display: "flex",
              transition: "all 0.3s ease-in",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                cursor: "pointer",
              }}
              onClick={() => {
                imageref1.current?.click();
              }}
            >
              <div style={{ position: "relative" }}>
                <img
                  src={cuser.image}
                  alt=""
                  style={{
                    width: "50px",
                    height: "50px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    cursor: "pointer",
                    // border: `2px solid ${theme.mygreen}`,
                    padding: "2px",
                  }}
                />
                <ion-icon
                  name="add-circle"
                  style={{
                    color: theme.mygreen,
                    fontSize: "20px",
                    position: "absolute",
                    bottom: "10px",
                    right: "0px",
                    background: theme.textcolor,
                    borderRadius: "50%",
                  }}
                ></ion-icon>
              </div>
              <div style={{ marginLeft: "15px" }}>
                <h4>My Status</h4>
                <span style={{ fontSize: "13px" }}>
                  Tap to add status update
                </span>
              </div>
            </div>
            <ion-icon
              name="ellipsis-vertical"
              style={{
                color: theme.mygreen,
                fontSize: "20px",
                cursor: "pointer",
              }}
              onClick={() => {
                setstorydeletemodal(true);
              }}
            ></ion-icon>
          </ChatC>
          <span style={{ color: "gray", marginLeft: "15px" }}>
            Recent Updates
          </span>
          {otherstories.map((item, index) => (
            <StatusComp item={item} key={index} />
          ))}
        </>
      </div>
      {storydeletemodal && (
        <StoryDeleteDialog
          setstorydeletemodal={setstorydeletemodal}
          setloading={setloading}
        />
      )}

      {picdialog && (
        <StoryPostDialog
          dialogimg={dialogimg}
          setpicdialog={setpicdialog}
          setdialogimg={setdialogimg}
          textmsg={textmsg}
          settextmsg={settextmsg}
          addstory={addstory}
          setprogressVisible={setprogressVisible}
          settempimg={settempimg}
        />
      )}
    </>
  );
};

export default StatusPage;
