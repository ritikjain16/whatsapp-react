import React, { useEffect } from "react";
import wimg from "../assets/w3.png";
import Pagecon from "../components/PageCon";
import Whatsappname from "../components/Whatsappname";
import Loading from "../components/Loading";
import { useUserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { BsWhatsapp } from "react-icons/bs";
import styled from "styled-components";

const MyDiv = styled.div``;

const Start = () => {
  const {getuser} = useUserContext();
  const navigate = useNavigate();
  useEffect(() => {
    setTimeout(() => {
      getuser(navigate);
    }, 2000);
  }, []);
  const [startcards, setstartcards] = useState([]);


  useEffect(() => {
    const interval = setInterval(() => {
      setstartcards((prev) => [...prev, 1]);
    }, 150);
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <Pagecon style={{ position: "relative" }}>
      {/* <div className="flexc" style={{ height: "80vh" }}>
        <img src={wimg} alt="" style={{ width: "200px" }} />
        <Whatsappname>WhatsApp</Whatsappname>
        <Loading />
      </div> */}
      {/* <div style={{ position: "absolute", top: "50%", left: "20%" }}>
        <h1>Choose the color</h1>
      </div> */}

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexWrap: "wrap",
          padding: "8px",
          gap: "10px",
        }}
      >
        {startcards.map((i, index) => (
          <div
            key={index}
            style={{
              width: "100px",
              height: "100px",
              background: `rgb(${Math.floor(Math.random() * 256)},${Math.floor(
                Math.random() * 256
              )},${Math.floor(Math.random() * 256)})`,
              borderRadius: "10px 25px 10px 25px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <MyDiv>
              <BsWhatsapp style={{ color: "white" }} className="blink" />
            </MyDiv>
          </div>
        ))}
      </div>
    </Pagecon>
  );
};

export default Start;
