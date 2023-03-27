import React, { useEffect } from "react";
import styled from "styled-components";
import { theme } from "../App";
import { useLongPress } from "use-long-press";
import parse from "html-react-parser";
import { changeToBlack } from "../changemeta";
import { useUserContext } from "../context/UserContext";
const Mymessage = styled.div`
  color: ${({ theme }) => theme.textcolor};
  background: ${({ theme }) => theme.mygreen};
  max-width: 280px;
  margin: 5px;
  min-width: 30px;
  word-wrap: break-word;
  padding: 5px;
  border-radius: 10px;
  border-top-right-radius: 0px;
  position: relative;
  display: flex;
  flex-direction: column;
`;

const Othermessage = styled.div`
  color: black;
  background: ${({ theme }) => theme.textcolor};
  max-width: 280px;
  margin: 5px;
  min-width: 30px;
  word-wrap: break-word;
  padding: 5px;
  border-radius: 10px;
  border-top-left-radius: 0px;
  position: relative;
  display: flex;
  flex-direction: column;
`;

const Message = ({
  item,
  ind,
  setpicdialog,
  setdialogimg,
  setprogressVisible,
  setcopydialog,
  setnewitem,
}) => {
  const { cuser, messages, otheruser, deletemsg } = useUserContext();

  const MessageDate = ({ currentDate, previousDate }) => {
    var d = new Date(currentDate);
    var d1 = new Date(previousDate);
    // const monthNames = [
    //   "Jan",
    //   "Feb",
    //   "Mar",
    //   "Apr",
    //   "May",
    //   "Jun",
    //   "Jul",
    //   "Aug",
    //   "Sep",
    //   "Oct",
    //   "Nov",
    //   "Dec",
    // ];
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    let curr =
      d.getDate() + " " + monthNames[d.getMonth()] + " " + d.getFullYear();
    let prev =
      d1.getDate() + " " + monthNames[d1.getMonth()] + " " + d1.getFullYear();
    if (curr !== prev) {
      return (
        <div className="flex">
          <span
            style={{
              background: theme.graycolor,
              padding: "3px 10px",
              fontSize: "13px",
              fontWeight: "500",
              borderRadius: "5px",
            }}
          >
            {curr}
          </span>
        </div>
      );
    }
  };

  const gettime = (newdate) => {
    var date = new Date(newdate);
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
    return hourandmin;
  };

  const ReplaceURLs = ({ message }) => {
    if (!message) return;

    var urlRegex = /(((https?:\/\/)|(www\.))[^\s]+)/g;
    let finalmess = message.replace(urlRegex, function (url) {
      var hyperlink = url;
      if (!hyperlink.match("^https?://")) {
        hyperlink = "http://" + hyperlink;
      }
      return `<a href=${hyperlink} target="_blank" rel="noopener noreferrer" 
      className="mytextlink"
      >
          ${url}
        </a>`;
    });

    return parse("<span>" + finalmess + "</span>");
  };

  // const getdata = () => {
  //   if (item.pdf) {
  //     // console.log(item.pdf.ref);
  //     getfiledata(item.pdf.ref)
  //   }
  //   else if (item.image && item.imgref !== undefined) {
  //     // console.log(item.imgref)
  //     getfiledata(item.imgref)
  //   }
  // }

  // useEffect(() => {
  //   getdata()
  // }, [])

  const deletemymsg = useLongPress(() => {
    // console.log("Long pressed!");
    navigator.vibrate(100);
    setnewitem(item);
    setcopydialog(true);
    // if (item.pdf) {
    //   deletemsg(
    //     otheruser.uid,
    //     cuser,
    //     item.docid,
    //     setprogressVisible,
    //     true,
    //     item.pdf.ref
    //   );
    // } else if (item.image && item.imgref !== undefined) {
    //   deletemsg(
    //     otheruser.uid,
    //     cuser,
    //     item.docid,
    //     setprogressVisible,
    //     true,
    //     item.imgref
    //   );
    // } else {
    //   deletemsg(otheruser.uid, cuser, item.docid, setprogressVisible);
    // }
  });

  const copyothermsg = useLongPress(() => {
    // console.log("Long pressed!");
    navigator.vibrate(100);
    setnewitem(item);
    setcopydialog(true);
    // navigator.clipboard.writeText(item.text);
    // alert("copied");
  });

  return (
    <>
      <MessageDate
        currentDate={item.createdAt}
        previousDate={ind > 0 && messages[ind - 1].createdAt}
      />
      {cuser.uid === item.sentBy ? (
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginRight: "10px",
          }}
        >
          <div style={{ position: "relative", maxWidth: "280px" }}>
            {ind > 0 && messages[ind - 1].sentBy !== cuser.uid && (
              <div
                style={{
                  background: theme.mygreen,
                  width: "10px",
                  height: "10px",
                  position: "absolute",
                  top: 5,
                  right: 31,
                  transform: "skewX(-40deg)",
                  borderTopRightRadius: "2px",
                }}
              ></div>
            )}
            {ind === 0 && (
              <div
                style={{
                  background: theme.mygreen,
                  width: "10px",
                  height: "10px",
                  position: "absolute",
                  top: 5,
                  right: 31,
                  transform: "skewX(-40deg)",
                  borderTopRightRadius: "2px",
                }}
              ></div>
            )}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {/* <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "10px",
                  flexWrap: "wrap",
                }}
              >
                {!item.pdf && !item.image && (
                  <div className="message-sele">
                    <ion-icon
                      name="copy"
                      onClick={() => {
                        navigator.clipboard.writeText(item.text);
                      }}
                    ></ion-icon>
                  </div>
                )}
                <div className="message-sele">
                  <ion-icon
                    name="trash"
                    onClick={() => {
                      if (item.pdf) {
                        deletemsg(
                          otheruser.uid,
                          cuser,
                          item.docid,
                          setprogressVisible,
                          true,
                          item.pdf.ref
                        );
                      } else if (item.image && item.imgref !== undefined) {
                        deletemsg(
                          otheruser.uid,
                          cuser,
                          item.docid,
                          setprogressVisible,
                          true,
                          item.imgref
                        );
                      } else {
                        deletemsg(
                          otheruser.uid,
                          cuser,
                          item.docid,
                          setprogressVisible
                        );
                      }
                    }}
                  ></ion-icon>
                </div>
              </div> */}
              <Mymessage {...deletemymsg()}>
                {item.image ? (
                  <>
                    <img
                      src={item.image}
                      alt=""
                      style={{
                        width: "210px",
                        borderRadius: "5px",
                        objectFit: "cover",
                        maxHeight: "240px",
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        changeToBlack();
                        setdialogimg(item.image);
                        setpicdialog(true);
                      }}
                    />
                  </>
                ) : (
                  <></>
                )}
                {item.pdf ? (
                  <>
                    <div
                      style={{
                        width: "210px",
                        objectFit: "cover",
                        maxHeight: "240px",
                        cursor: "pointer",
                        marginBottom: "15px",
                        position: "relative",
                      }}
                    >
                      {/* <iframe
                        src={item.pdf.url}
                        frameBorder="0"
                        style={{
                          width: "210px",
                          overflow: "hidden",
                          borderRadius: "5px",
                        }}
                        autoPlay="0"
                      ></iframe> */}
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          margin: "0px 0px",
                          wordBreak: "break-word",
                          background: "rgb(255,255,255,0.2)",
                          padding: "5px",
                          borderRadius: "5px 0px 5px 5px",
                          border: `1px inset ${theme.mygreen}`,
                        }}
                      >
                        <span style={{ maxWidth: "130px" }}>
                          {item.pdf.name}
                        </span>
                        <a
                          href={item.pdf.url}
                          target="_blank"
                          style={{ textDecoration: "none" }}
                        >
                          <ion-icon
                            name="arrow-down-circle-outline"
                            style={{
                              color: theme.textcolor,
                              cursor: "pointer",
                              fontSize: "25px",
                            }}
                          ></ion-icon>
                        </a>
                      </div>
                    </div>
                  </>
                ) : (
                  <></>
                )}
                {!item.pdf && <ReplaceURLs message={item.text} />}
                <span style={{ fontSize: "10px", textAlign: "end" }}>
                  {gettime(item.createdAt)}
                </span>
              </Mymessage>
              {ind > 0 && messages[ind - 1].sentBy !== cuser.uid && (
                <img
                  src={cuser.image}
                  alt=""
                  style={{
                    width: "30px",
                    height: "30px",
                    objectFit: "cover",
                    borderRadius: "50%",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    changeToBlack();
                    setdialogimg(cuser.image);
                    setpicdialog(true);
                  }}
                />
              )}
              {ind === 0 && (
                <img
                  src={cuser.image}
                  alt=""
                  style={{
                    width: "30px",
                    height: "30px",
                    objectFit: "cover",
                    borderRadius: "50%",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    changeToBlack();
                    setdialogimg(cuser.image);
                    setpicdialog(true);
                  }}
                />
              )}
            </div>
          </div>
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            justifyContent: "flex-start",
            marginLeft: "10px",
          }}
        >
          <div style={{ position: "relative", maxWidth: "280px" }}>
            {ind > 0 && messages[ind - 1].sentTo !== item.sentTo && (
              <div
                style={{
                  background: theme.textcolor,
                  width: "10px",
                  height: "10px",
                  position: "absolute",
                  top: 5,
                  left: 31,
                  transform: "skewX(40deg)",
                  borderTopLeftRadius: "2px",
                }}
              ></div>
            )}
            {ind === 0 && (
              <div
                style={{
                  background: theme.textcolor,
                  width: "10px",
                  height: "10px",
                  position: "absolute",
                  top: 5,
                  left: 31,
                  transform: "skewX(40deg)",
                  borderTopLeftRadius: "2px",
                }}
              ></div>
            )}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {ind > 0 && messages[ind - 1].sentTo !== item.sentTo && (
                <img
                  src={otheruser.image}
                  alt=""
                  style={{
                    width: "30px",
                    height: "30px",
                    objectFit: "cover",
                    borderRadius: "50%",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    changeToBlack();
                    setdialogimg(otheruser.image);
                    setpicdialog(true);
                  }}
                />
              )}
              {ind === 0 && (
                <img
                  src={otheruser.image}
                  alt=""
                  style={{
                    width: "30px",
                    height: "30px",
                    objectFit: "cover",
                    borderRadius: "50%",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    changeToBlack();
                    setdialogimg(otheruser.image);
                    setpicdialog(true);
                  }}
                />
              )}
              <Othermessage {...copyothermsg()}>
                {item.image ? (
                  <>
                    <img
                      src={item.image}
                      alt=""
                      style={{
                        width: "220px",
                        borderRadius: "5px",
                        objectFit: "cover",
                        maxHeight: "240px",
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        changeToBlack();
                        setdialogimg(item.image);
                        setpicdialog(true);
                      }}
                    />
                  </>
                ) : (
                  <></>
                )}
                {item.pdf ? (
                  <>
                    <div
                      style={{
                        width: "210px",
                        objectFit: "cover",
                        maxHeight: "240px",
                        cursor: "pointer",
                        marginBottom: "15px",
                      }}
                    >
                      {/* <iframe
                        src={item.pdf.url}
                        frameBorder="0"
                        style={{
                          width: "210px",
                          overflow: "hidden",
                          borderRadius: "5px",
                        }}
                        autoPlay="0"
                      ></iframe> */}
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          margin: "0px 0px",
                          wordBreak: "break-word",
                          background: "rgb(98 98 98 / 10%)",
                          padding: "5px",
                          borderRadius: "0px 5px 5px 5px",
                          border: `1px inset ${theme.black}`,
                        }}
                      >
                        <span style={{ maxWidth: "130px" }}>
                          {item.pdf.name}
                        </span>
                        <a
                          href={item.pdf.url}
                          target="_blank"
                          style={{ textDecoration: "none" }}
                        >
                          <ion-icon
                            name="arrow-down-circle-outline"
                            style={{
                              color: "black",
                              cursor: "pointer",
                              fontSize: "25px",
                            }}
                          ></ion-icon>
                        </a>
                      </div>
                    </div>
                  </>
                ) : (
                  <></>
                )}
                {!item.pdf && <ReplaceURLs message={item.text} />}
                <span style={{ fontSize: "10px", textAlign: "end" }}>
                  {gettime(item.createdAt)}
                </span>
              </Othermessage>
              {/* <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "10px",
                  flexWrap: "wrap",
                }}
              >
                {!item.pdf && !item.image && (
                  <div className="message-sele">
                    <ion-icon
                      name="copy"
                      onClick={() => {
                        navigator.clipboard.writeText(item.text);
                      }}
                    ></ion-icon>
                  </div>
                )}
              </div> */}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Message;
