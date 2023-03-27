import React, { useEffect, useState } from "react";

import Loading from "./Loading";
import ChatComp from "./ChatComp";
import Dialog from "./Dialog";
import { useUserContext } from "../context/UserContext";
const ChatsPage = () => {
  const { allchats, getusers } = useUserContext();

  const [loading, setloading] = useState(true);
  const [picdialog, setpicdialog] = useState(false);
  const [dialogimg, setdialogimg] = useState("");
  // useEffect(() => {
  //   getusers(setloading);
  // }, []);

  return (
    <div>
      <br />
      <br />
      <br />
      <br />
      <br />
      {/* {loading ? (
        <div className="flex" style={{ height: "200px" }}>
          <Loading />
        </div>
      ) : ( */}
      <>
        {picdialog && (
          <Dialog
            setpicdialog={setpicdialog}
            dialogimg={dialogimg}
            setdialogimg={setdialogimg}
          />
        )}
        {allchats.map((item, index) => (
          <ChatComp
            key={index}
            item={item}
            setpicdialog={setpicdialog}
            setdialogimg={setdialogimg}
          />
        ))}
      </>
      {/* )} */}
    </div>
  );
};

export default ChatsPage;
