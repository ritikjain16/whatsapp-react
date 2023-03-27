import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import { theme } from "../App";
import { useUserContext } from "../context/UserContext";
import Loading from "./Loading";
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
  background: ${({ theme }) => theme.textcolor};
  border-radius: ${window.innerWidth > 400 ? "20px" : "0px"};
  z-index: 50;
  animation: ${mybottomanim} 0.4s ease-in-out;
`;

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

const StoryDeleteDialog = ({ setstorydeletemodal, setloading }) => {

  const { mystories, getallstories, deletestorybyuser } = useUserContext();
  //   console.log(mystories);
  const [isdelete, setisdelete] = useState(false);

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

  const gettime = (dat) => {
    let unixtimestamp = dat;
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
      "Posted at " +
      hourandmin +
      " on " +
      myday(date.getDay()) +
      ", " +
      date.getDate() +
      " " +
      mymonth(date.getMonth());

    return finaltime;
  };

  return (
    <div style={{ position: "relative" }}>
      <MyDialog>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            padding: "10px",
            background: theme.mygreen,
            borderRadius: window.innerWidth > 400 ? "20px 20px 0px 0px" : "",
            height: "50px",
          }}
        >
          <ion-icon
            name="arrow-back"
            style={{
              color: theme.textcolor,
              fontSize: "25px",
              cursor: "pointer",
            }}
            onClick={() => {
              setstorydeletemodal(false);
            }}
          ></ion-icon>
        </div>
        <div>
          {mystories.length === 0 ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "200px",
              }}
            >
              <h1
                style={{
                  color: theme.mygreen,
                }}
              >
                No Stories
              </h1>
            </div>
          ) : (
            <>
              {mystories[0].story_data.map((item, index) => (
                <ChatC
                  style={{
                    padding: "8px 10px",
                    display: "flex",
                    transition: "all 0.3s ease-in",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                  key={index}
                  onClick={() => {}}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <img
                      src={item.data.story_img}
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
                      <h5>{item.data.story_details.length} views</h5>
                      <span style={{ fontSize: "13px" }}>
                        {gettime(item.data.date)}
                      </span>
                    </div>
                  </div>
                  <ion-icon
                    name="trash"
                    style={{
                      cursor: "pointer",
                      color: theme.mygreen,
                      fontSize: "25px",
                    }}
                    onClick={() => {
                      setisdelete(true);
                      deletestorybyuser(
                        item.data.date,
                        item.data.storageRef,
                        setisdelete,
                        setstorydeletemodal,
                        getallstories,
                        setloading
                      );
                    }}
                  ></ion-icon>
                </ChatC>
              ))}
            </>
          )}
        </div>
        {isdelete && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              position: "absolute",
              top: "220px",
              width: window.innerWidth > 400 ? "400px" : "100vw",
            }}
          >
            <Loading />
          </div>
        )}
      </MyDialog>
    </div>
  );
};

export default StoryDeleteDialog;
