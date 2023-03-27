import React, { useState } from "react";
import styled from "styled-components";
import { theme } from "../App";
import StoryDialog from "./StoryDialog";

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

const StatusComp = ({ item }) => {
  const { cuser, addViewer } = useUserContext();

  const [dialogimg, setdialogimg] = useState(false);

  const myday = (day) => {
    switch (day) {
      case 0:
        return "Sun";

      case 1:
        return "Mon";

      case 2:
        return "Tue";

      case 3:
        return "Wed";

      case 4:
        return "Thu";

      case 5:
        return "Fri";

      case 6:
        return "Sat";
    }
  };

  const mymonth = (month) => {
    switch (month) {
      case 0:
        return "January";
      case 1:
        return "February";
      case 2:
        return "March";
      case 3:
        return "April";
      case 4:
        return "May";
      case 5:
        return "June";
      case 6:
        return "July";
      case 7:
        return "August";
      case 8:
        return "September";
      case 9:
        return "October";
      case 10:
        return "November";
      case 11:
        return "December";
    }
  };

  const gettime = () => {
    let unixtimestamp = item.story_data[item.story_data.length - 1].data.date;
    var date = new Date(unixtimestamp * 1000);
    var hours = date.getHours();
    var minute = date.getMinutes();
    var suffix = hours >= 12 ? "pm" : "am";
    var hour = ((hours + 11) % 12) + 1 + " " + suffix;
    hours = hours % 12 || 12;
    let hourandmin = "",
      onlyhour = hour;
    if (minute < 10) {
      hourandmin = hours + ":0" + minute + " " + suffix;
    } else {
      hourandmin = hours + ":" + minute + " " + suffix;
    }
    // console.log();
    let finaltime =
      "Updated at " +
      hourandmin +
      " on " +
      myday(date.getDay()) +
      ", " +
      date.getDate() +
      " " +
      mymonth(date.getMonth());

    return finaltime;
  };

  const getGradient = () => {
    let len = item.story_data.length;
    // let len = 1;
    let myWhiteDeg = 5;
    let whiteDeg = len * myWhiteDeg;
    let deg = -myWhiteDeg,
      totalDeg = 360 - whiteDeg;
    let gradient = "";
    if (len === 1) {
      gradient += `conic-gradient(${theme.mygreen} 0deg,${theme.mygreen} 360deg`;
    } else {
      gradient += `conic-gradient(`;
      for (let i = 1; i <= len; i++) {
        gradient += `${theme.mygreen} ${deg + myWhiteDeg}deg, `;
        deg = totalDeg / len + (i - 1) * myWhiteDeg;
        gradient += `${theme.mygreen} ${deg}deg, `;
        if (i === len) {
          gradient += `white ${deg}deg, white ${deg + myWhiteDeg}deg `;
        } else {
          gradient += `white ${deg}deg, white ${deg + myWhiteDeg}deg, `;
        }
        totalDeg += 360 - whiteDeg;
      }
    }
    gradient += ")";
    // console.log(gradient);
    return gradient;
  };
  // getGradient();

  return (
    <>
      <ChatC
        style={{
          padding: "8px 10px",
          display: "flex",
          cursor: "pointer",
          transition: "all 0.2s ease-in",
          position: "relative",
        }}
        onClick={() => {
          changeToBlack();
          setdialogimg(true);
          addViewer(item.story_data[0].data.date.toString(), item, cuser);
        }}
      >
        <div
          style={{
            width: "65px",
            height: "65px",
            borderRadius: "50%",
            cursor: "pointer",
            backgroundImage: getGradient(),
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
          }}
        >
          <img
            src={item.story_data[item.story_data.length - 1].data.story_img}
            alt=""
            style={{
              width: "50px",
              height: "50px",
              borderRadius: "50%",
              objectFit: "cover",
              cursor: "pointer",
              padding: "4px",
              background: "white",
              position: "absolute",
              top: "3.7px",
              left: "3.7px",
            }}
          />
        </div>
        <div style={{ marginLeft: "15px" }}>
          <h4>{item.user_id === cuser.uid ? "You" : item.name}</h4>
          <span style={{ fontSize: "13px" }}>{gettime()}</span>
        </div>
      </ChatC>
      {dialogimg ? (
        <StoryDialog setdialogimg={setdialogimg} item={item} />
      ) : (
        <></>
      )}
    </>
  );
};

export default StatusComp;
