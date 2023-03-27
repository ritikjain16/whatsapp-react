import React, { useEffect, useRef, useState } from "react";
import { theme } from "../App";
import BackArrow from "../components/BackArrow";
import Pagecon from "../components/PageCon";
import { useLocation } from "react-router-dom";
import Message from "../components/Message";
import Loading from "../components/Loading";
import BottomDialog from "../components/BottomDialog";
import Dialog from "../components/Dialog";
import imageCompression from "browser-image-compression";
import { changeToBlack } from "../changemeta";
import io from "socket.io-client";
import { BACKEND_URL } from "../myaxios";
import wimg from "../assets/wchat.jpg";
import { CompressImage } from "../imagecomp";
import so3 from "../assets/music/so3.mp3";
import { useUserContext } from "../context/UserContext";
import styled from "styled-components";

const CopyMessage = styled.div`
  color: ${({ theme }) => theme.mygreen};
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  width: 95%;
  transition: all 0.3s linear;
  padding: 5px;
  border-radius: inherit;

  &:hover {
    background: rgba(0, 0, 0, 0.3);
  }
`;

const socket = io(BACKEND_URL);
const Chat = () => {
  const location = useLocation();
  const { item } = location.state;

  const [chatbgrnd, setchatbgrnd] = useState(wimg);
  // const [chatbgrnd, setchatbgrnd] = useState(
  //   "https://qph.cf2.quoracdn.net/main-qimg-8b585fb4a5c9fedbb899cfb0cf0331a7-lq"
  // );

  const {
    cuser,
    messages,
    loadmessages,
    setchatbg,
    setotheruser,
    sendmess,
    settyping,
    changeTypingStatus,
    removebackground,
    isOnline,
    setisonline,
    uploadChatImage,
    uploadBackground,
    otheruser,
    deletemsg,
  } = useUserContext();

  const [typingstatus, settypingstatus] = useState("");
  const [textmsg, settextmsg] = useState("");
  const [sendImage, setsendImage] = useState(null);
  const [loading, setloading] = useState(true);
  const messagesEndRef = useRef(null);
  const [progressVisible, setprogressVisible] = useState(false);
  const imageref = useRef(null);
  const imageref1 = useRef(null);
  const imageref2 = useRef(null);
  const inputref = useRef(null);

  const [bottomdisplay, setbottomdisplay] = useState(false);
  const [bottomdisplay1, setbottomdisplay1] = useState(false);
  const [picdialog, setpicdialog] = useState(false);
  const [dialogimg, setdialogimg] = useState("");

  const [copydialog, setcopydialog] = useState(false);
  const [newitem, setnewitem] = useState({});

  let song3 = new Audio(so3);

  useEffect(() => {
    setotheruser(item.uid);
    loadmessages(item.uid, cuser, setloading, true);
    setchatbg(item.uid, cuser, setchatbgrnd);
    settyping(item.uid, cuser, settypingstatus);
    setisonline(item.uid);
  }, []);

  useEffect(() => {
    socket.on("getm", (j) => {
      loadmessages(item.uid, cuser, setloading, false);
    });
    socket.on("smi1", (j) => {
      loadmessages(item.uid, cuser, setloading, false);
      if (j.sentTo === cuser.uid && j.sentBy === item.uid) {
        // console.log(j);
        song3.play();
      }
    });
    socket.on("typ", () => {
      settyping(item.uid, cuser, settypingstatus);
    });
    socket.on("onl", () => {
      setisonline(item.uid);
    });
    socket.on("bgrnd", () => {
      setchatbg(item.uid, cuser, setchatbgrnd);
    });
    return () => {
      socket.off("smi1");
      socket.off("getm");
      socket.off("typ");
      socket.off("onl");
      socket.off("bgrnd");
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView();
  }, [messages, typingstatus]);

  const deletethemessage = (item) => {
    setcopydialog(false);
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
      deletemsg(otheruser.uid, cuser, item.docid, setprogressVisible);
    }
    setnewitem({});
  };

  return (
    <Pagecon isanim={true}>
      <div
        style={{
          // background: theme.textcolor,
          position: "relative",
        }}
        className="maincon"
      >
        {copydialog && (
          <div
            style={{
              width: window.innerWidth > 400 ? "400px" : window.innerWidth,
              height: window.innerWidth > 400 ? "90vh" : "100vh",
              position: "fixed",
              top: "40px",
              zIndex: 1,
              background: "rgba(0,0,0,0.5)",
              borderRadius: "20px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            onClick={() => {
              setcopydialog(false);
              setnewitem({});
            }}
          >
            <div
              style={{
                width: "200px",
                // height: "100px",
                background: "white",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                fontSize: "20px",
                borderRadius: "10px",
              }}
            >
              {!newitem.pdf && !newitem.image && (
                <CopyMessage
                  onClick={() => {
                    navigator.clipboard.writeText(newitem.text);
                    setnewitem({});
                  }}
                >
                  <ion-icon
                    name="copy"
                    style={{ color: theme.mygreen }}
                    onClick={() => {}}
                  ></ion-icon>{" "}
                  <span>Copy</span>
                </CopyMessage>
              )}
              {newitem.sentBy === cuser.uid && (
                <CopyMessage
                  onClick={() => {
                    deletethemessage(newitem);
                  }}
                >
                  <ion-icon
                    name="trash"
                    style={{ color: theme.mygreen }}
                    onClick={() => {}}
                  ></ion-icon>{" "}
                  <span>Delete</span>
                </CopyMessage>
              )}
            </div>
          </div>
        )}
        {picdialog && (
          <Dialog
            setpicdialog={setpicdialog}
            dialogimg={dialogimg}
            setdialogimg={setdialogimg}
          />
        )}
        <div
          style={{
            height: "50px",
            background: theme.mygreen,
            padding: "8px",
            position: "fixed",
            display: "flex",
            alignItems: "center",
            top: window.innerWidth > 400 ? "32px" : "",
            borderRadius: window.innerWidth > 400 ? "20px" : "",
            borderBottomLeftRadius: window.innerWidth > 400 ? "0px" : "",
            borderBottomRightRadius: window.innerWidth > 400 ? "0px" : "",
            zIndex: 10,
          }}
          className="widthcon"
        >
          <BackArrow n={-1} />
          <div
            style={{
              marginLeft: "40px",
              display: "flex",
              justifyContent: "center",
              color: theme.textcolor,
              alignItems: "center",
              gap: "10px",
            }}
          >
            <img
              src={item.image}
              alt=""
              style={{
                width: "30px",
                height: "30px",
                borderRadius: "50%",
                cursor: "pointer",
                objectFit: "cover",
              }}
              onClick={() => {
                changeToBlack();
                setdialogimg(item.image);
                setpicdialog(true);
              }}
            />
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                // alignItems: "center",
                flexDirection: "column",
              }}
            >
              <span
                style={{
                  fontWeight: "500",
                }}
              >
                {item.name}
              </span>
              <span
                style={{
                  fontWeight: "400",
                  fontSize: "12px",
                  height: "15px",
                }}
              >
                {isOnline === "online 🟢" ? "online" : "offline"}
              </span>
            </div>
          </div>
        </div>
        <div style={{ position: "relative" }}>
          <div style={{ marginTop: window.innerWidth > 400 ? "61px" : "" }}>
            {loading && (
              <div className="flex" style={{ height: "400px" }}>
                <Loading />
              </div>
            )}

            <div
              style={{
                // backgroundImage: `url(${chatbgrnd})`,
                // backgroundAttachment: "fixed",
                // backgroundRepeat: "no-repeat",
                // backgroundPosition: "center",
                // backgroundSize: "cover",
                // // backgroundSize:"contain",
                // // backgroundSize:window.innerWidth>400?"400px 90vh":"100vw 100vh",
                paddingBottom: "60px",
                // minHeight: "100vh",
                display: "flex",
                justifyContent: "flex-end",
                flexDirection: "column",
                background: "transparent",
              }}
            >
              <br />
              <br />
              <br />

              {messages.map((item, index) => (
                <Message
                  key={index}
                  item={item}
                  ind={index}
                  setpicdialog={setpicdialog}
                  setdialogimg={setdialogimg}
                  setprogressVisible={setprogressVisible}
                  setcopydialog={setcopydialog}
                  setnewitem={setnewitem}
                />
              ))}
              {typingstatus === "typing..." && (
                <div
                  style={{
                    color: "black",
                    background: theme.textcolor,
                    margin: "5px",
                    padding: "5px",
                    borderRadius: "10px",
                    position: "relative",
                    display: "flex",
                    width: "100px",
                    height: "25px",
                  }}
                  className="dots"
                >
                  <div className="dot1"></div>
                  <div className="dot2"></div>
                  <div className="dot3"></div>
                </div>
              )}
              <div ref={messagesEndRef}></div>
              {progressVisible && (
                <div
                  className="flex"
                  style={{
                    height: "600px",
                    position: "fixed",
                    bottom: 0,
                    width: window.innerWidth > 400 ? "400px" : "100vw",
                  }}
                >
                  <Loading />
                </div>
              )}
              <div
                style={{
                  background: theme.textcolor,
                  width: window.innerWidth > 400 ? "380px" : "90vw",
                  height: "50px",
                  alignSelf: "center",
                  position: "fixed",
                  bottom: window.innerWidth > 400 ? 40 : 10,
                  borderRadius: "10px 25px 10px 25px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 10,
                  // padding:"0px 10px"
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
                  <ion-icon
                    name="attach-outline"
                    style={{
                      color: theme.mygreen,
                      fontSize: "25px",
                      transform: "rotate(45deg)",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      // imageref.current?.click();
                      setbottomdisplay1(true);
                    }}
                  ></ion-icon>
                  <input
                    style={{ display: "none" }}
                    ref={imageref}
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      if (e.target.files[0] !== undefined) {
                        setsendImage(null);
                        setprogressVisible(true);
                        const imageFile = e.target.files[0];

                        try {
                          const compressedFile = await CompressImage(imageFile);
                          uploadChatImage(
                            compressedFile,
                            compressedFile.name,
                            false,
                            setprogressVisible,
                            setsendImage,
                            sendmess,
                            item,
                            cuser,
                            textmsg,
                            settextmsg
                          );
                        } catch (error) {
                          console.log(error);
                        }
                      }
                    }}
                  />
                  <input
                    style={{ display: "none" }}
                    ref={imageref2}
                    type="file"
                    accept="/*"
                    onChange={(e) => {
                      if (e.target.files[0] !== undefined) {
                        setsendImage(null);
                        setprogressVisible(true);
                        // uploadImage(

                        // );
                        uploadChatImage(
                          e.target.files[0],
                          e.target.files[0].name,
                          true,
                          setprogressVisible,
                          setsendImage,
                          sendmess,
                          item,
                          cuser,
                          textmsg,
                          settextmsg
                        );
                      }
                    }}
                  />
                  <input
                    style={{ display: "none" }}
                    ref={imageref1}
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      if (e.target.files[0] !== undefined) {
                        setsendImage(null);
                        setprogressVisible(true);
                        const imageFile = e.target.files[0];
                        try {
                          const compressedFile = await CompressImage(imageFile);
                          uploadBackground(
                            item.uid,
                            cuser,
                            compressedFile,
                            compressedFile.name,
                            setprogressVisible,
                            item,
                            cuser,
                            setchatbgrnd,
                            setchatbg,
                            setbottomdisplay
                          );
                        } catch (error) {
                          console.log(error);
                        }
                      }
                    }}
                  />
                  <ion-icon
                    name="moon-outline"
                    style={{
                      color: theme.mygreen,
                      fontSize: "20px",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      setbottomdisplay(true);
                    }}
                  ></ion-icon>
                  <input
                    type="text"
                    placeholder="Type a message..."
                    style={{
                      caretColor: theme.mygreen,
                      border: "none",
                      outline: 0,
                      fontWeight: "500",
                    }}
                    ref={inputref}
                    value={textmsg}
                    onChange={(e) => {
                      settextmsg(e.target.value);
                      changeTypingStatus(item.uid, cuser, e.target.value);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        if (textmsg.length !== 0) {
                          sendmess(
                            item.uid,
                            cuser,
                            textmsg,
                            sendImage,
                            setsendImage,
                            settextmsg
                          );
                        }
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
                    if (textmsg.length !== 0) {
                      inputref.current?.focus();
                      sendmess(
                        item.uid,
                        cuser,
                        textmsg,
                        sendImage,
                        setsendImage,
                        settextmsg
                      );
                    }
                  }}
                >
                  <ion-icon
                    name="send"
                    style={{ color: theme.textcolor, cursor: "pointer" }}
                  ></ion-icon>
                </button>
              </div>
              {bottomdisplay1 && (
                <BottomDialog>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      alignItems: "center",
                      paddingRight: "20px",
                    }}
                  >
                    <ion-icon
                      name="close-outline"
                      style={{
                        color: theme.mygreen,
                        fontSize: "25px",
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        setbottomdisplay1(false);
                      }}
                    ></ion-icon>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      // flexDirection: "column",
                      gap: "10px",
                    }}
                  >
                    <div
                      style={{
                        width: window.innerWidth > 400 ? "150px" : "35vw",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        flexDirection: "column",
                        marginBottom: "10px",
                      }}
                      onClick={() => {
                        setbottomdisplay1(false);
                        imageref.current?.click();
                      }}
                    >
                      <ion-icon
                        name="image-outline"
                        style={{
                          color: theme.mygreen,
                          fontSize: "30px",
                        }}
                      ></ion-icon>
                      <p
                        style={{
                          color: theme.mygreen,
                          fontWeight: "550",
                          cursor: "pointer",
                        }}
                      >
                        Image
                      </p>
                    </div>
                    <div
                      style={{
                        width: window.innerWidth > 400 ? "150px" : "35vw",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        flexDirection: "column",
                        marginBottom: "10px",
                      }}
                      onClick={() => {
                        setbottomdisplay1(false);
                        imageref2.current?.click();
                      }}
                    >
                      <ion-icon
                        name="document-text-outline"
                        style={{
                          color: theme.mygreen,
                          fontSize: "30px",
                        }}
                      ></ion-icon>
                      <p
                        style={{
                          color: theme.mygreen,
                          fontWeight: "550",
                          cursor: "pointer",
                        }}
                      >
                        Document
                      </p>
                    </div>
                  </div>
                </BottomDialog>
              )}
              {bottomdisplay && (
                <BottomDialog>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      alignItems: "center",
                      paddingRight: "20px",
                    }}
                  >
                    <ion-icon
                      name="close-outline"
                      style={{
                        color: theme.mygreen,
                        fontSize: "25px",
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        setbottomdisplay(false);
                      }}
                    ></ion-icon>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      flexDirection: "column",
                      gap: "10px",
                    }}
                  >
                    <p
                      style={{
                        color: theme.mygreen,
                        fontWeight: "550",
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        setbottomdisplay(false);
                        imageref1.current?.click();
                      }}
                    >
                      Change Background
                    </p>
                    <p
                      style={{
                        color: theme.mygreen,
                        fontWeight: "550",
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        setbottomdisplay(false);
                        removebackground(
                          item.uid,
                          cuser,
                          setprogressVisible,
                          setchatbgrnd
                        );
                      }}
                    >
                      Remove Background
                    </p>
                  </div>
                </BottomDialog>
              )}
            </div>
          </div>

          <div
            style={{
              marginTop: window.innerWidth > 400 ? "61px" : "",
              // background: "red",
              position: "fixed",
              top: 0,
              // left: 0,
              // right: 0,
              bottom: 0,
              zIndex: -1,
              // backgroundImage: `url(${chatbgrnd})`,
              // backgroundAttachment: "fixed",
              // backgroundRepeat: "no-repeat",
              // backgroundPosition: "center",
              // backgroundSize: "cover",
            }}
          >
            <img
              src={chatbgrnd}
              alt=""
              style={{
                width: window.innerWidth > 400 ? "400px" : window.innerWidth,
                height: window.innerWidth > 400 ? "87vh" : window.innerHeight,
                borderRadius: window.innerWidth > 400 ? "20px" : "0px",
                objectFit: "cover",
              }}
            />
          </div>
        </div>
      </div>
    </Pagecon>
  );
};

export default Chat;
