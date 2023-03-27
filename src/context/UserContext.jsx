import { useReducer, useContext, createContext, useEffect } from "react";
import userReducer from "./UserReducer";
import firebase from "../firebase";
import CryptoES from "crypto-es";
import { changeToTheme } from "../changemeta";
import axios from "axios";
import maxios, {
  BACKEND_URL,
  MYSECRETPASSPHRASE,
  FIREBASE_NOTIFICATION_KEY,
} from "../myaxios";
import io from "socket.io-client";
import wchatimg from "../assets/wchat.jpg";
import { CompressImage } from "../imagecomp";
import so4 from "../assets/music/so4.mp3";
const UserContext = createContext();
const socket = io(BACKEND_URL);
const song4 = new Audio(so4);
const initialState = {
  newtheme: {
    mygreen: "#f25022",
    graycolor: "rgb(212, 210, 210)",
    textcolor: "white",
    buttonbg: "white",
    black: "#000000",
  },
  cuser: {},
  isuser: false,
  allchats: [],
  messages: [],
  otheruser: {},
  isOnline: "",
  otherstories: [],
  mystories: [],
  newviewers: [],
};

const UserState = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, initialState);

  useEffect(() => {
    let interval;
    firebase.auth().onAuthStateChanged(async (user) => {
      if (user) {
        getusers();
        getallstories();
        interval = setInterval(() => {
          getallstories();
        }, 6000);
      }
    });
    return () => {
      clearInterval(interval);
    };
  }, []);

  const sendPushNotification = async (expoPushToken, title, body) => {
    const message = {
      to: expoPushToken,
      sound: "default",
      title,
      body,
      data: { someData: "goes here" },
    };
    try {
      await maxios.post(`/send/notification`, message);
    } catch (e) {
      console.log(e);
    }
  };

  const sendnoti = (token, title, body, image) => {
    axios
      .post(
        "https://fcm.googleapis.com/fcm/send",
        {
          registration_ids: [token],
          priority: "high",
          notification: {
            title,
            body,
            image,
            click_action: "https://mymernwhatsapp.web.app/",
          },
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: FIREBASE_NOTIFICATION_KEY,
          },
        }
      )
      .then((res) => {
        // console.log(res.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const setnewtheme = () => {
    firebase.auth().onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const res = await maxios.post("/user/get", {
            uid: user.uid,
          });

          if (res.data.themecolor && res.data.themecolor !== "") {
            dispatch({ type: "SET_THEME_COLOR", payload: res.data.themecolor });
            // set({
            //   newtheme: { ...get().newtheme, mygreen: res.data.themecolor },
            // });
          } else {
            dispatch({ type: "SET_THEME_COLOR", payload: "#f25022" });
            // set({
            //   newtheme: { ...get().newtheme, mygreen: "#f25022" },
            // });
          }
          // console.log(get().newtheme)
          setTimeout(() => {
            changeToTheme();
          }, 1000);
        } catch (e) {
          console.log(e);
        }
      }
    });
  };

  const updatetheme = (themecolor, setprogressVisible, navigate) => {
    firebase.auth().onAuthStateChanged(async (user) => {
      if (user) {
        try {
          await maxios.post("/user/update/theme", {
            uid: user.uid,
            themecolor,
          });
          setprogressVisible(false);
          // get().setnewtheme();
          setnewtheme();
          setTimeout(() => {
            changeToTheme();
          }, 1000);
        } catch (e) {
          console.log(e);
        }
      }
    });
  };

  const removetheme = (setprogressVisible, navigate) => {
    firebase.auth().onAuthStateChanged(async (user) => {
      if (user) {
        try {
          await maxios.post("/user/update/theme", {
            uid: user.uid,
            themecolor: "",
          });
          setprogressVisible(false);
          // get().setnewtheme();
          setnewtheme();
          setTimeout(() => {
            changeToTheme();
          }, 1000);
        } catch (e) {
          console.log(e);
        }
      }
    });
  };

  const createuser = async (
    email,
    password,
    name,
    userimg,
    navigate,
    setacol,
    setatext,
    setdisplay,
    setloading
  ) => {
    setloading(true);
    try {
      const res = await firebase
        .auth()
        .createUserWithEmailAndPassword(email, password);

      const compressedFile = await CompressImage(userimg);
      const filename = compressedFile.name;
      const uri = compressedFile;
      var storageRef = firebase.storage().ref();
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      // var metadata = {
      //   contentType: "image/jpeg",
      // };
      var uploadTask = storageRef
        .child(
          "userimages/" + uniqueSuffix + "__" + filename.replace(/["]/g, "")
        )
        .put(uri);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          var progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        },
        (error) => {
          // Handle unsuccessful uploads
          console.log(error);
          // setprogressVisible(false);
        },
        () => {
          uploadTask.snapshot.ref.getDownloadURL().then(async (downloadURL) => {
            try {
              const res1 = await maxios.post("/user/create", {
                email,
                name,
                image: downloadURL,
                imageRef:
                  "userimages/" +
                  uniqueSuffix +
                  "__" +
                  filename.replace(/["]/g, ""),
                uid: res.user.uid,
                status: "offline 🔴",
                expoPushToken: "",
                stories: [],
                themecolor: "",
                firebaseToken: "",
              });
              setloading(false);
              setacol("green");
              setatext(`Dear ${email}, Registration Success! Please Login.`);
              setdisplay("block");
              setTimeout(() => {
                setdisplay("none");
                setacol("");
                setatext("");
                navigate("/login");
              }, 2000);
            } catch (e) {
              setloading(false);
              console.log(e);
            }
          });
        }
      );
    } catch (e) {
      setloading(false);
      setacol("red");
      setatext(e.message);
      setdisplay("block");
      setTimeout(() => {
        setdisplay("none");
        setacol("");
        setatext("");
      }, 2000);
    }
  };

  const googlelogin = async (navigate) => {
    var provider = new firebase.auth.GoogleAuthProvider();

    firebase
      .auth()
      .signInWithPopup(provider)
      .then(async (result) => {
        var credential = result.credential;
        var token = credential.accessToken;
        var user = result.user;
        // ...
        // console.log(user);

        try {
          const res1 = await maxios.post("/user/create", {
            email: user.email,
            name: user.displayName,
            image: user.photoURL,
            imageRef: "",
            uid: user.uid,
            status: "offline 🔴",
            expoPushToken: "",
            stories: [],
            themecolor: "",
            firebaseToken: "",
          });
          // setloading(false);
          // setacol("green");
          // setatext(`Dear ${email}, Registration Success! Please Login.`);
          // setdisplay("block");
          // setTimeout(() => {
          // setdisplay("none");
          // setacol("");
          // setatext("");
          navigate("/home");
          // }, 2000);
        } catch (e) {
          // setloading(false);
          console.log(e);
        }
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        var email = error.email;
      });

    // setloading(true);
    // try {
    //   const res1 = await maxios.post("/user/create", {
    //     email,
    //     name,
    //     image: downloadURL,
    //     imageRef:
    //       "userimages/" + uniqueSuffix + "__" + filename.replace(/["]/g, ""),
    //     uid: res.user.uid,
    //     status: "offline 🔴",
    //     expoPushToken: "",
    //     stories: [],
    //     themecolor: "",
    //     firebaseToken: "",
    //   });
    //   setloading(false);
    //   setacol("green");
    //   setatext(`Dear ${email}, Registration Success! Please Login.`);
    //   setdisplay("block");
    //   setTimeout(() => {
    //     setdisplay("none");
    //     setacol("");
    //     setatext("");
    //     navigate("/login");
    //   }, 2000);
    // } catch (e) {
    //   setloading(false);
    //   console.log(e);
    // }

    // catch (e) {
    //   setloading(false);
    //   setacol("red");
    //   setatext(e.message);
    //   setdisplay("block");
    //   setTimeout(() => {
    //     setdisplay("none");
    //     setacol("");
    //     setatext("");
    //   }, 2000);
    // }
  };

  const forgotpass = (email, setloading, setacol, setatext, setdisplay) => {
    if (email !== "") {
      setloading(true);
      firebase
        .auth()
        .sendPasswordResetEmail(email)
        .then(() => {
          setloading(false);
          setacol("green");
          setatext(`Password reset link has been sent to ${email}`);
          setdisplay("block");
          setTimeout(() => {
            setdisplay("none");
            setacol("");
            setatext("");
          }, 2000);
        })
        .catch((error) => {
          setloading(false);
          setacol("red");
          setatext(error.message);
          setdisplay("block");
          setTimeout(() => {
            setdisplay("none");
            setacol("");
            setatext("");
          }, 2000);
        });
    } else {
      setacol("red");
      setatext("Please enter the email in above field.");
      setdisplay("block");
      setTimeout(() => {
        setdisplay("none");
        setacol("");
        setatext("");
      }, 2000);
    }
  };

  const loginuser = (
    email,
    password,
    navigate,
    setacol,
    setatext,
    setdisplay,
    setloading
  ) => {
    setloading(true);
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(async (userCredential) => {
        var user = userCredential.user;
        try {
          const res = await maxios.post("/user/get", {
            uid: user.uid,
          });
          dispatch({
            type: "SET_USER",
            payload: { cuser: res.data, isuser: true },
          });
          // set({ cuser: res.data, isuser: true });
          setloading(false);
          navigate("/home");
        } catch (e) {
          console.log(e);
        }
      })
      .catch((e) => {
        setloading(false);
        setacol("red");
        setatext(e.message);
        setdisplay("block");
        setTimeout(() => {
          setdisplay("none");
          setacol("");
          setatext("");
        }, 2000);
      });
  };

  const getuser = (navigate, isacc, setloading) => {
    firebase.auth().onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const res = await maxios.post("/user/get", {
            uid: user.uid,
          });
          // set({ cuser: res.data, isuser: true });
          dispatch({
            type: "SET_USER",
            payload: { cuser: res.data, isuser: true },
          });
          if (navigate && isacc) {
            setloading(false);
          } else if (navigate) {
            navigate("/home");
            // navigate("/login");
          }
        } catch (e) {
          console.log(e);
        }
      } else {
        if (navigate) {
          navigate("/login");
        }
      }
    });
  };

  const logoutuser = (navigate) => {
    firebase.auth().onAuthStateChanged(async (user) => {
      if (user) {
        try {
          await maxios.post("/user/update/status", {
            uid: user.uid,
            status: "offline 🔴",
          });

          firebase
            .auth()
            .signOut()
            .then(async () => {
              dispatch({
                type: "SET_USER",
                payload: { cuser: {}, isuser: true },
              });
              // set({ cuser: {}, isuser: false });
              // navigate("/");
              window.location = "/";
            })
            .catch((error) => {
              // alert(error);
              console.log(error);
            });
        } catch (e) {
          console.log(e);
        }
      }
    });
  };

  const getusers = (setloading) => {
    // setloading(true);
    var allc = [];
    firebase.auth().onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const res = await maxios.post("/user/get/allusers");
          res.data.forEach((doc) => {
            if (doc.uid !== user.uid) {
              allc.push(doc);
            } else {
              // set({ cuser: doc });
              dispatch({
                type: "SET_USER",
                payload: { cuser: doc, isuser: true },
              });
            }
          });
          // set({ allchats: allc });
          dispatch({ type: "SET_ALL_CHATS", payload: allc });
          // setloading(false);
        } catch (e) {
          console.log(e);
        }
      }
    });
  };

  const loadmessages = async (uid, user, setloading, isl) => {
    if (isl) {
      // set({ messages: [] });
      dispatch({ type: "SET_MESSAGES", payload: [] });
    }
    setloading(true);

    const docid = uid > user.uid ? user.uid + "-" + uid : uid + "-" + user.uid;
    try {
      const res = await maxios.post("/chat/get", {
        docid,
      });
      if (res.data.messages) {
        var allm = [];
        for (let i of res.data.messages) {
          const decrypted = CryptoES.AES.decrypt(
            i.text.toString(),
            MYSECRETPASSPHRASE
          );
          let originaltext = decrypted.toString(CryptoES.enc.Utf8);
          var obj = {
            ...i,
            text: originaltext,
            docid: i._id,
          };
          allm.push(obj);
        }
        // set({ messages: allm });
        dispatch({ type: "SET_MESSAGES", payload: allm });
      } else {
        // set({ messages: [] });
        dispatch({ type: "SET_MESSAGES", payload: [] });
      }
      setloading(false);
    } catch (e) {
      console.log(e);
    }
  };

  const setchatbg = async (uid, user, setchatbgrnd) => {
    // setchatbgrnd(
    //   "https://qph.cf2.quoracdn.net/main-qimg-8b585fb4a5c9fedbb899cfb0cf0331a7-lq"
    // );
    setchatbgrnd(wchatimg);
    const docid = uid > user.uid ? user.uid + "-" + uid : uid + "-" + user.uid;
    try {
      const res = await maxios.post("/chat/get", {
        docid,
      });

      if (res.data.chatbg && res.data.chatbg !== "") {
        setchatbgrnd(res.data.chatbg);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const setotheruser = async (uid) => {
    // set({ otheruser: {} });
    dispatch({ type: "SET_OTHER_USER", payload: {} });
    try {
      const res = await maxios.post("/user/get", {
        uid,
      });
      // set({ otheruser: res.data });
      dispatch({ type: "SET_OTHER_USER", payload: res.data });
    } catch (e) {
      console.log(e);
    }
  };

  const sendmess = async (
    uid,
    user,
    msg,
    sendImage,
    setsendImage,
    settextmsg,
    isp,
    pdf,
    imgref
  ) => {
    settextmsg("");
    const encrypted = CryptoES.AES.encrypt(msg, MYSECRETPASSPHRASE);
    const docid = uid > user.uid ? user.uid + "-" + uid : uid + "-" + user.uid;
    try {
      await maxios.post("/chat/update/uids", { docid, uid1: "", uid2: "" });
    } catch (e) {
      console.log(e);
    }

    let mymsg;
    let a = Math.floor(Math.random() * 99999) + 999999;
    let b = Math.floor(Math.random() * 99999) + 999999;
    let messid = "Mess_" + a + b;
    if (sendImage !== null) {
      if (isp) {
        mymsg = {
          _id: messid,
          text: CryptoES.AES.encrypt(
            pdf.name + " " + pdf.url,
            MYSECRETPASSPHRASE
          ).toString(),
          sentBy: user.uid,
          sentTo: uid,
          createdAt: new Date(),
          pdf,
          user: {
            _id: user.uid,
            avatar: user.image,
            name: user.name,
          },
        };
      } else {
        mymsg = {
          _id: messid,
          text: encrypted.toString(),
          sentBy: user.uid,
          sentTo: uid,
          createdAt: new Date(),
          image: sendImage,
          imgref,
          user: {
            _id: user.uid,
            avatar: user.image,
            name: user.name,
          },
        };
      }
    } else {
      mymsg = {
        _id: messid,
        text: encrypted.toString(),
        sentBy: user.uid,
        sentTo: uid,
        createdAt: new Date(),
        user: {
          _id: user.uid,
          avatar: user.image,
          name: user.name,
        },
      };
    }

    const decrypted = CryptoES.AES.decrypt(
      mymsg.text.toString(),
      MYSECRETPASSPHRASE
    );
    let originaltext = decrypted.toString(CryptoES.enc.Utf8);

    // set({ messages: [...get().messages, { ...mymsg, text: originaltext }] });
    dispatch({
      type: "SET_MESSAGES",
      payload: [...state.messages, { ...mymsg, text: originaltext }],
    });
    // console.log(get().messages);
    // console.log([...get().messages, { ...mymsg, text: originaltext }]);
    // set({ messages: [{...mymsg,text:originaltext}] });

    if (docid.startsWith(uid)) {
      try {
        await maxios.post("/chat/update/uid1", { docid, uid1: "" });
      } catch (e) {
        console.log(e);
      }
    } else {
      try {
        await maxios.post("/chat/update/uid2", { docid, uid2: "" });
      } catch (e) {
        console.log(e);
      }
    }

    try {
      await maxios.post("/chat/add/message", {
        docid,
        obj: mymsg,
      });
      song4.play();
      socket.emit("smi", {
        sentBy: user.uid,
        sentTo: uid,
      });
      socket.emit("typi", "hnde");
    } catch (e) {
      console.log(e);
    }

    // settextmsg("");
    setsendImage(null);

    try {
      const res = await maxios.post("/user/get", {
        uid,
      });
      if (res.data.firebaseToken) {
        if (sendImage !== null) {
          if (isp) {
            sendnoti(
              res.data.firebaseToken,
              user.name + " sent a document",
              "New Documnet"
            );
          } else {
            sendnoti(
              res.data.firebaseToken,
              user.name + " sent an image",
              "New Image",
              sendImage
            );
          }
        } else {
          sendnoti(res.data.firebaseToken, user.name + " sent a message", msg);
        }
      }
      if (res.data.status === "offline 🔴") {
        if (res.data.expoPushToken) {
          if (sendImage !== null) {
            if (isp) {
              await sendPushNotification(
                res.data.expoPushToken,
                user.name + " sent a document",
                "New Documnet"
              );
            } else {
              await sendPushNotification(
                res.data.expoPushToken,
                user.name + " sent an image",
                "New Image"
              );
            }
          } else {
            await sendPushNotification(
              res.data.expoPushToken,
              user.name + " sent a message",
              msg
            );
          }
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  const settyping = async (uid, user, setTypingstatus) => {
    const docid = uid > user.uid ? user.uid + "-" + uid : uid + "-" + user.uid;
    try {
      const res = await maxios.post("/chat/get", {
        docid,
      });
      if (docid.startsWith(uid)) {
        setTypingstatus(res.data.uid2 ? res.data.uid2 : "");
      } else {
        setTypingstatus(res.data.uid1 ? res.data.uid1 : "");
      }
    } catch (e) {
      console.log(e);
    }
  };

  const changeTypingStatus = async (uid, user, text) => {
    const docid = uid > user.uid ? user.uid + "-" + uid : uid + "-" + user.uid;
    if (docid.startsWith(uid)) {
      if (text.length === 0) {
        try {
          await maxios.post("/chat/update/uid1", { docid, uid1: "" });
          socket.emit("typi", "hnde");
        } catch (e) {
          console.log(e);
        }
      } else {
        try {
          await maxios.post("/chat/update/uid1", { docid, uid1: "typing..." });
          socket.emit("typi", "hnde");
        } catch (e) {
          console.log(e);
        }
      }
    } else {
      if (text.length === 0) {
        try {
          await maxios.post("/chat/update/uid2", { docid, uid2: "" });
          socket.emit("typi", "hnde");
        } catch (e) {
          console.log(e);
        }
      } else {
        try {
          await maxios.post("/chat/update/uid2", { docid, uid2: "typing..." });
          socket.emit("typi", "hnde");
        } catch (e) {
          console.log(e);
        }
      }
    }
  };

  const removebackground = async (
    uid,
    user,
    setprogressVisible,
    setchatbgrnd
  ) => {
    setprogressVisible(true);
    const docid = uid > user.uid ? user.uid + "-" + uid : uid + "-" + user.uid;
    try {
      const res = await maxios.post("/chat/get", {
        docid,
      });

      if (res.data.chatbg && res.data.chatbg !== "" && res.data.chatbgref) {
        var desertRef = firebase.storage().ref().child(res.data.chatbgref);

        desertRef.delete().then(async () => {
          try {
            await maxios.post("/chat/remove/bg", {
              chatbg: "",
              chatbgref: "",
              docid,
            });
            // setchatbgrnd(
            //   "https://qph.cf2.quoracdn.net/main-qimg-8b585fb4a5c9fedbb899cfb0cf0331a7-lq"
            // );
            setchatbgrnd(wchatimg);
            setprogressVisible(false);
            socket.emit("bgrndi", "jk");
          } catch (e) {
            console.log(e);
          }
        });
      } else {
        setprogressVisible(false);
      }
    } catch (e) {
      console.log(e);
    }
  };
  const setisonline = async (uid) => {
    try {
      const res = await maxios.post("/user/get", {
        uid,
      });
      // set({
      //   isOnline: res.data.status === "online 🟢" ? "online 🟢" : "offline 🔴",
      // });
      dispatch({
        type: "SET_ONLINE",
        payload: res.data.status === "online 🟢" ? "online 🟢" : "offline 🔴",
      });
    } catch (e) {
      console.log(e);
    }
  };

  const updateonlineindb = (status) => {
    firebase.auth().onAuthStateChanged(async (user) => {
      if (user) {
        try {
          await maxios.post("/user/update/status", {
            uid: user.uid,
            status,
          });
          socket.emit("onli", "hjd");
        } catch (e) {
          console.log(e);
        }
      }
    });
  };

  const deletemsg = async (
    uid,
    user,
    messid,
    setprogressVisible,
    ispdf,
    refpdf
  ) => {
    setprogressVisible(true);
    const docid = uid > user.uid ? user.uid + "-" + uid : uid + "-" + user.uid;
    if (ispdf) {
      var desertRef = firebase.storage().ref().child(refpdf);
      desertRef.delete().then(async () => {
        try {
          await maxios.post("/chat/delete/message", {
            docid,
            messid,
          });
          setprogressVisible(false);
          socket.emit("sm", "jk");
        } catch (e) {
          console.log(e);
        }
      });
    } else {
      try {
        await maxios.post("/chat/delete/message", {
          docid,
          messid,
        });
        setprogressVisible(false);
        socket.emit("sm", "jk");
      } catch (e) {
        console.log(e);
      }
    }
  };

  const updateuserimg = (uri, filename, setprogressVisible, cuser1) => {
    var storageRef = firebase.storage().ref();
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    var metadata = {
      contentType: "image/jpeg",
    };
    var uploadTask = storageRef
      .child("userimages/" + uniqueSuffix + "__" + filename.replace(/["]/g, ""))
      .put(uri, metadata);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      },
      (error) => {
        console.log(error);
        setprogressVisible(false);
      },
      () => {
        uploadTask.snapshot.ref.getDownloadURL().then(async (downloadURL) => {
          if (cuser1.imageRef !== "") {
            var desertRef = firebase.storage().ref().child(cuser1.imageRef);
            desertRef.delete().then(async () => {
              try {
                const res1 = await maxios.post("/user/update/img", {
                  uid: cuser1.uid,
                  imageRef:
                    "userimages/" +
                    uniqueSuffix +
                    "__" +
                    filename.replace(/["]/g, ""),
                  image: downloadURL,
                });

                try {
                  const res2 = await maxios.post("/user/get", {
                    uid: cuser1.uid,
                  });
                  // set({ cuser: res2.data });
                  dispatch({
                    type: "SET_USER",
                    payload: { cuser: res2.data, isuser: true },
                  });
                  setprogressVisible(false);
                } catch (e) {
                  console.log(e);
                }
              } catch (e) {
                console.log(e);
              }
            });
          } else {
            try {
              const res1 = await maxios.post("/user/update/img", {
                uid: cuser1.uid,
                imageRef:
                  "userimages/" +
                  uniqueSuffix +
                  "__" +
                  filename.replace(/["]/g, ""),
                image: downloadURL,
              });

              try {
                const res2 = await maxios.post("/user/get", {
                  uid: cuser1.uid,
                });
                // set({ cuser: res2.data });
                dispatch({
                  type: "SET_USER",
                  payload: { cuser: res2.data, isuser: true },
                });
                setprogressVisible(false);
              } catch (e) {
                console.log(e);
              }
            } catch (e) {
              console.log(e);
            }
          }
        });
      }
    );
  };

  const updatename = async (name, user, setprogressVisible) => {
    try {
      const res = await maxios.post("/user/update/name", {
        uid: user.uid,
        name,
      });
      try {
        const res2 = await maxios.post("/user/get", {
          uid: user.uid,
        });
        // set({ cuser: res2.data });
        dispatch({
          type: "SET_USER",
          payload: { cuser: res2.data, isuser: true },
        });
        setprogressVisible(false);
      } catch (e) {
        console.log(e);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const addtokeninfirebase = (user) => {
    try {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          firebase
            .messaging()
            .getToken({
              vapidKey:
                "BLq3GV9KQ_YOHKhyljAg6wEhdHDv0rCx-keuYUxebmMWUSf4S3UPMl4t7CrrNgyaoIPf2gj3PfJeDH2k12AYtWU",
            })
            .then(async (currentToken) => {
              if (currentToken) {
                // console.log("current token for client: ", currentToken);
                try {
                  const res = await maxios.post("/user/update/firebaseToken", {
                    uid: user.uid,
                    firebaseToken: currentToken,
                  });
                  try {
                    const res2 = await maxios.post("/user/get", {
                      uid: user.uid,
                    });
                    // set({ cuser: res2.data });
                    dispatch({
                      type: "SET_USER",
                      payload: { cuser: res2.data, isuser: true },
                    });
                  } catch (e) {
                    console.log(e);
                  }
                } catch (e) {
                  console.log(e);
                }
              } else {
              }
              return currentToken;
            })
            .catch((err) => {});
        }
      });
    } catch (e) {}
  };

  const uploadChatImage = (
    uri,
    filename,
    isp,
    setprogressVisible,
    setsendImage,
    sendmess,
    item,
    cuser,
    textmsg,
    settextmsg
  ) => {
    var storageRef = firebase.storage().ref();
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    // var metadata = {
    //   contentType: "image/jpeg",
    // };
    var uploadTask = storageRef
      .child("chatimages/" + uniqueSuffix + "__" + filename.replace(/["]/g, ""))
      .put(uri);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      },
      (error) => {
        console.log(error);
        setprogressVisible(false);
      },
      () => {
        uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
          setprogressVisible(false);
          setsendImage(downloadURL);
          if (isp) {
            sendmess(
              item.uid,
              cuser,
              textmsg,
              downloadURL,
              setsendImage,
              settextmsg,
              isp,
              {
                name: filename,
                ref:
                  "chatimages/" +
                  uniqueSuffix +
                  "__" +
                  filename.replace(/["]/g, ""),
                url: downloadURL,
              }
            );
          } else {
            sendmess(
              item.uid,
              cuser,
              textmsg,
              downloadURL,
              setsendImage,
              settextmsg,
              false,
              {},
              "chatimages/" + uniqueSuffix + "__" + filename.replace(/["]/g, "")
            );
          }
        });
      }
    );
  };

  const uploadBackground = (
    uid,
    user,
    uri,
    filename,
    setprogressVisible,
    item,
    cuser,
    setchatbgrnd,
    setchatbg,
    setbottomdisplay
  ) => {
    setbottomdisplay(false);
    var storageRef = firebase.storage().ref();
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    // var metadata = {
    //   contentType: "image/jpeg",
    // };
    var uploadTask = storageRef
      .child("chatimages/" + uniqueSuffix + "__" + filename.replace(/["]/g, ""))
      .put(uri);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      },
      (error) => {
        // Handle unsuccessful uploads
        console.log(error);
        setprogressVisible(false);
      },
      () => {
        uploadTask.snapshot.ref.getDownloadURL().then(async (downloadURL) => {
          const docid =
            uid > user.uid ? user.uid + "-" + uid : uid + "-" + user.uid;

          try {
            const res = await maxios.post("/chat/get", { docid });

            // if (doc.exists) {
            if (
              res.data.chatbg &&
              res.data.chatbg !== "" &&
              res.data.chatbgref
            ) {
              var desertRef = firebase
                .storage()
                .ref()
                .child(res.data.chatbgref);
              desertRef.delete().then(async () => {
                try {
                  const res2 = await maxios.post("/chat/update/chatbg", {
                    docid,
                    chatbg: downloadURL,
                    chatbgref:
                      "chatimages/" +
                      uniqueSuffix +
                      "__" +
                      filename.replace(/["]/g, ""),
                  });
                  setchatbg(item.uid, cuser, setchatbgrnd);
                  setprogressVisible(false);
                  socket.emit("bgrndi", "jk");
                } catch (e) {
                  console.log(e);
                }
              });
            } else {
              try {
                const res2 = await maxios.post("/chat/update/chatbg", {
                  docid,
                  chatbg: downloadURL,
                  chatbgref:
                    "chatimages/" +
                    uniqueSuffix +
                    "__" +
                    filename.replace(/["]/g, ""),
                });
                setchatbg(item.uid, cuser, setchatbgrnd);
                setprogressVisible(false);
                socket.emit("bgrndi", "jk");
              } catch (e) {
                console.log(e);
              }
            }
          } catch (e) {
            console.log(e);
          }
        });
      }
    );
  };

  const getallstories = async (setloading) => {
    firebase.auth().onAuthStateChanged(async (user) => {
      if (user) {
        let all = [];
        let my = [];
        try {
          const res = await maxios.post("/user/get/allusers");

          for (let doc1 of res.data) {
            let one = [];
            var newdocs = doc1.stories;
            let i = 0;
            for (let newdoc of newdocs) {
              var obj = {
                data: newdoc,
              };
              one.push(obj);
              i++;
            }
            if (i !== 0) {
              var obj = {
                story_data: one,
                user_id: doc1.uid,
                name: doc1.name,
                image: doc1.image,
              };
              all.push(obj);
              if (user.uid === doc1.uid) {
                my.push(obj);
              }
            }
          }
          // set({ otherstories: all, mystories: my });
          dispatch({
            type: "SET_STORIES",
            payload: { otherstories: all, mystories: my },
          });
          // setloading(false);
        } catch (e) {
          console.log(e);
        }
      }
    });
  };

  const deletestory = () => {
    firebase.auth().onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const res = await maxios.post("/user/get", { uid: user.uid });
          for await (let doc of res.data.stories) {
            var date = new Date();
            var unixdate = Math.floor(date.getTime() / 1000);
            // console.log(doc.date);
            // if (unixdate - doc.date >= 86400) {
            if (unixdate - doc.date >= 86400) {
              var desertRef = firebase.storage().ref().child(doc.storageRef);

              desertRef
                .delete()
                .then(async () => {
                  try {
                    const res2 = await maxios.post("/user/delete/story", {
                      uid: user.uid,
                      sid: doc.sid,
                    });
                  } catch (e) {
                    console.log(e);
                  }
                })
                .catch((error) => {
                  console.log(error);
                });
            }
          }
        } catch (e) {
          console.log(e);
        }
      }
    });
  };

  const deletestorybyuser = (
    deleteid,
    ref,
    setisdelete,
    setstorydeletemodal,
    getallstories,
    setloading
  ) => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        var desertRef = firebase.storage().ref().child(ref);
        desertRef.delete().then(async () => {
          try {
            const res2 = await maxios.post("/user/delete/story", {
              uid: user.uid,
              sid: deleteid.toString(),
            });
            setisdelete(false);
            setstorydeletemodal(false);
            getallstories(setloading);
          } catch (e) {
            console.log(e);
          }
        });
      }
    });
  };

  const addViewer = async (dateid, item, cuser) => {
    try {
      const res = await maxios.post("/user/get", {
        uid: item.user_id,
      });
      const cstory = res.data.stories.find((f) => f.date === parseInt(dateid));
      // console.log(cstory, typeof cstory)
      if (
        !cstory.story_details.includes(cuser.uid) &&
        cuser.uid !== item.user_id
      ) {
        var date = new Date();
        var unixdate = Math.floor(date.getTime() / 1000);

        try {
          var obj = {
            ...cstory,
            story_details: [...cstory.story_details, cuser.uid],
            withdates: [
              ...cstory.withdates,
              {
                viewer_id: cuser.uid,
                viewer_time: unixdate,
              },
            ],
          };

          const res3 = await maxios.post("/user/add/view", {
            obj,
            uid: item.user_id,
            date: dateid,
          });
        } catch (e) {
          console.log(e);
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  const getallviewers = async (dateid, cuser, setisload, oid) => {
    // set({ newviewers: [] });
    dispatch({ type: "SET_NEW_VIEWERS", payload: [] });
    if (cuser.uid === oid) {
      setisload(true);

      try {
        const res = await maxios.post("/user/get", {
          uid: cuser.uid,
        });
        // console.log(res.data);
        const cstory = res.data.stories.find(
          (f) => f.date === parseInt(dateid)
        );
        // console.log(cstory, typeof cstory)
        var allnewviewers = [];
        for await (let item of cstory.withdates) {
          try {
            const res2 = await maxios.post("/user/get", {
              uid: item.viewer_id,
            });
            var obj = {
              viewer_time: item.viewer_time,
              viewer_id: item.viewer_id,
              name: res2.data.name,
              image: res2.data.image,
            };
            allnewviewers.push(obj);
          } catch (e) {
            console.log(e);
          }
        }
        // set({ newviewers: allnewviewers });
        dispatch({ type: "SET_NEW_VIEWERS", payload: allnewviewers });
        setTimeout(() => {
          setisload(false);
        }, 2000);
      } catch (e) {
        console.log(e);
      }
    }
  };

  const uploadStatusImage = (
    uri,
    filename,
    setprogressVisible,
    cuser,
    getallstories,
    setloading,
    textmsg,
    settextmsg
  ) => {
    var storageRef = firebase.storage().ref();
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    var metadata = {
      contentType: "image/jpeg",
    };
    var uploadTask = storageRef
      .child("stories/" + uniqueSuffix + "__" + filename.replace(/["]/g, ""))
      .put(uri, metadata);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      },
      (error) => {
        console.log(error);
        setprogressVisible(false);
      },
      () => {
        uploadTask.snapshot.ref.getDownloadURL().then(async (downloadURL) => {
          var date = new Date();
          var unixdate = Math.floor(date.getTime() / 1000);
          try {
            var obj = {
              story_details: [],
              story_img: downloadURL,
              date: unixdate,
              storageRef:
                "stories/" + uniqueSuffix + "__" + filename.replace(/["]/g, ""),
              withdates: [],
              sid: unixdate,
              textmsg,
            };
            const res = await maxios.post("/user/add/story", {
              uid: cuser.uid,
              sid: unixdate.toString(),
              obj,
            });
            setprogressVisible(false);
            settextmsg("");
            getallstories(setloading);
          } catch (e) {
            console.log(e);
          }
        });
      }
    );
  };

  const getfiledata = async (ref) => {
    var storageRef = firebase.storage().ref();
    var forestRef = storageRef.child(ref);

    // Get metadata properties
    forestRef
      .getMetadata()
      .then((metadata) => {
        // Metadata now contains the metadata for 'images/forest.jpg'
        // console.log(met̥adata)
        console.log(
          "🚀 ~ file: zustandStore.jsx ~ line 1255 ~ .then ~ met̥adata",
          metadata.contentType
        );
      })
      .catch((error) => {
        // Uh-oh, an error occurred!
      });
  };

  return (
    <UserContext.Provider
      value={{
        ...state,
        sendPushNotification,
        sendnoti,
        setnewtheme,
        updatetheme,
        removetheme,
        createuser,
        googlelogin,
        forgotpass,
        loginuser,
        getuser,
        logoutuser,
        getusers,
        loadmessages,
        setchatbg,
        setotheruser,
        sendmess,
        settyping,
        changeTypingStatus,
        removebackground,
        setisonline,
        updateonlineindb,
        deletemsg,
        updateuserimg,
        updatename,
        addtokeninfirebase,
        uploadChatImage,
        uploadBackground,
        getallstories,
        deletestory,
        deletestorybyuser,
        addViewer,
        getallviewers,
        uploadStatusImage,
        getfiledata,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  return useContext(UserContext);
};

export default UserState;
