import React, { useEffect, useState } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import Account from "./pages/Account";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Start from "./pages/Start";
import Chat from "./pages/Chat";
import Signup from "./pages/Signup";
import { useRef } from "react";
// import BIRDS from "vanta/dist/vanta.birds.min";
// import BIRDS from "vanta/dist/vanta.fog.min";
// import BIRDS from "vanta/dist/vanta.waves.min";
// import BIRDS from "vanta/dist/vanta.clouds.min";
// import BIRDS from "vanta/dist/vanta.clouds2.min";
// import BIRDS from "vanta/dist/vanta.globe.min";
// import BIRDS from "vanta/dist/vanta.net.min";
// import BIRDS from "vanta/dist/vanta.cells.min";
// import BIRDS from "vanta/dist/vanta.trunk.min";
// import BIRDS from "vanta/dist/vanta.topology.min";
// import BIRDS from "vanta/dist/vanta.dots.min";
// import BIRDS from "vanta/dist/vanta.rings.min";
import BIRDS from "vanta/dist/vanta.halo.min";
import { useUserContext } from "./context/UserContext";
export let theme;

const App = () => {
  const { newtheme, setnewtheme, updateonlineindb, deletestory } =
    useUserContext();
  const animref = useRef(null);
  const [vantaEffect, setVantaEffect] = useState(0);
  theme = newtheme;
  let interval = null;
  useEffect(() => {
    setnewtheme();
  }, []);

  useEffect(() => {
    if (!vantaEffect) {
      setVantaEffect(
        BIRDS({
          el: animref.current,
          // color: newtheme.mygreen,
          // waveHeight: 20,
          // shininess: 50,
          // waveSpeed: 2.5,
          // zoom: 0.75,
        })
      );
    }
    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, [vantaEffect]);

  const InternetErrMessagenger = () => {
    if (navigator.onLine === true) {
      updateonlineindb("online 🟢");
    } else {
      updateonlineindb("offline 🔴");
    }
  };

  useEffect(() => {
    window.addEventListener("unload", () => {
      updateonlineindb("offline 🔴");
    });
    interval = setInterval(InternetErrMessagenger, 6000);
    return () => {
      clearInterval(interval);
      window.removeEventListener("unload", () => {});
    };
  }, []);

  useEffect(() => {
    deletestory();
    const interval = setInterval(() => {
      deletestory();
    }, 5000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="cont" ref={animref}>
      <div className="innercon">
        <ThemeProvider theme={theme}>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Start />}></Route>
              <Route path="/login" element={<Login />}></Route>
              <Route path="/signup" element={<Signup />}></Route>
              <Route path="/home" element={<Home />}></Route>
              <Route path="/account" element={<Account />}></Route>
              <Route path="/chat" element={<Chat />}></Route>
            </Routes>
          </BrowserRouter>
        </ThemeProvider>
      </div>
    </div>
  );
};

export default App;

// import React from 'react'
// import { useState } from 'react'
// import firebase from "./firebase"
// const App = () => {
//   const [allusers, setallusers] = useState([])
//   const getallusers = () => {
//     firebase.firestore().collection("users").get().then((docs) => {
//       var allu = []
//       docs.forEach(doc => {
//         allu.push(doc.data())
//       })
//       console.log(allu);
//       setallusers(allu)
//     })
//   }

//   return (
//     <div>
//       <button onClick={() => {
//         getallusers()
//       }}>Get</button>
//       {allusers.map((i, ind) => (
//         <div key={ind}>
//           {"{"}
//           <span>email:"{i.email}",</span>
//           <span>expoPushToken:"{i.expoPushToken}",</span>
//           <span>firebaseToken:"{i.firebaseToken}",</span>
//           <span>image:"{i.image}",</span>
//           <span>imageRef:"{i.imageRef}",</span>
//           <span>name:"{i.name}",</span>
//           <span>status:"{i.status}",</span>
//           <span>themecolor:"{i.themecolor}",</span>
//           <span>stories:[],</span>
//           <span>uid:"{i.uid}"</span>{"}"},
//         </div>
//       ))}
//     </div>
//   )
// }

// export default App

// import React from "react";
// import { BsWhatsapp } from "react-icons/bs";
// const App = () => {
//   return (
//     <div
//       style={{
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "center",
//       }}
//     >
//       <div
//         style={{
//           width: "360px",
//           height: "360px",
//           display: "flex",
//           position: "relative",
//           justifyContent: "center",
//           alignItems: "center",
//           flexWrap: "wrap",
//           gap: "5px",
//           // background: "blue",
//         }}
//       >
//         <BsWhatsapp
//           style={{
//             position: "absolute",
//             top: "120px",
//             left: "120px",
//             color: "white",
//             fontSize: "120px",
//           }}
//         />
//         <div
//           style={{
//             width: "170px",
//             height: "170px",
//             background: "#f25022",
//             // borderRadius: "10px 0px 0px 0px",
//           }}
//         ></div>
//         <div
//           style={{
//             width: "170px",
//             height: "170px",
//             background: "#7fba00",
//             // borderRadius: "0px 50px 0px 0px",
//           }}
//         ></div>
//         <div
//           style={{
//             width: "170px",
//             height: "170px",
//             background: "#00a4ef",
//             // borderRadius: "0px 0px 0px 50px",
//             marginBottom: "10px",
//           }}
//         ></div>
//         <div
//           style={{
//             width: "170px",
//             height: "170px",
//             background: "#ffb900",
//             // borderRadius: "0px 0px 10px 0px",
//             marginBottom: "10px",
//           }}
//         ></div>
//       </div>
//     </div>
//   );
// };

// export default App;
