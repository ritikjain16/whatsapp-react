import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { theme } from "../App";
import Pagecon from "../components/PageCon";
import Button from "../components/Button";
import BackArrow from "../components/BackArrow";
import Loading from "../components/Loading";
import imageCompression from "browser-image-compression";
import BottomDialog from "../components/BottomDialog";
import Input from "../components/Input";
import Dialog from "../components/Dialog";
import { CompressImage } from "../imagecomp";
import { changeToBlack } from "../changemeta";
import { useUserContext } from "../context/UserContext";
const Account = () => {
  const {
    cuser,
    isuser,
    logoutuser,
    getuser,
    updateuserimg,
    updatename,
    updatetheme,
    removetheme,
  } = useUserContext();
  const navigate = useNavigate();


  const [loading, setloading] = useState(true);
  const [progressVisible, setprogressVisible] = useState(false);
  const [bottomdisplay, setbottomdisplay] = useState(false);
  const [updatedname, setupdatedname] = useState(cuser.name);
  const [picdialog, setpicdialog] = useState(false);
  const [dialogimg, setdialogimg] = useState(cuser.image);
  const [colorvalue, setcolorvalue] = useState(
    cuser.themecolor ? cuser.themecolor : theme.mygreen
  );
  const imageref1 = useRef(null);
  const colorref = useRef(null);

  useEffect(() => {
    getuser(navigate, true, setloading);
  }, []);

  return (
    <Pagecon>
      <input
        style={{ display: "none" }}
        ref={imageref1}
        type="file"
        accept="image/*"
        onChange={async (e) => {
          if (e.target.files[0] !== undefined) {
            setprogressVisible(true);
            const imageFile = e.target.files[0];
            try {
              const compressedFile = await CompressImage(imageFile);
              updateuserimg(
                compressedFile,
                compressedFile.name,
                setprogressVisible,
                cuser
              );
            } catch (error) {
              console.log(error);
            }
          }
        }}
      />
      {picdialog && (
        <Dialog
          setpicdialog={setpicdialog}
          dialogimg={dialogimg}
          setdialogimg={setdialogimg}
        />
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
                setupdatedname();
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
              marginBottom: "50px",
            }}
          >
            <Input
              type="text"
              placeholder="Name"
              bg={theme.textcolor}
              textbg={theme.mygreen}
              value={updatedname}
              onChange={(e) => {
                setupdatedname(e.target.value);
              }}
            />
            <Button
              width="150px"
              bg={theme.mygreen}
              textbg={theme.textcolor}
              onClick={() => {
                if (updatedname.length !== 0) {
                  setbottomdisplay(false);
                  setprogressVisible(true);
                  updatename(updatedname, cuser, setprogressVisible);
                }
              }}
            >
              Update
            </Button>
          </div>
        </BottomDialog>
      )}
      {loading || progressVisible ? (
        <div
          style={{
            background: theme.mygreen,
            padding: "8px",
            position: "relative",
            gap: "15px",
            color: theme.textcolor,
          }}
          className="maincon flexc"
        >
          <div
            style={{
              background: theme.textcolor,
              padding: "10px",
              borderRadius: "10px",
              width: "100px",
              height: "100px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Loading />
          </div>
        </div>
      ) : (
        <>
          {isuser ? (
            <div
              style={{
                background: theme.mygreen,
                padding: "8px",
                position: "relative",
                gap: "15px",
                color: theme.textcolor,
              }}
              className="maincon flexc"
            >
              <BackArrow n={-1} />
              <div style={{ position: "relative" }}>
                <img
                  src={cuser.image}
                  alt=""
                  style={{
                    width: "200px",
                    height: "200px",
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
                <ion-icon
                  name="add-circle"
                  style={{
                    color: theme.textcolor,
                    fontSize: "45px",
                    position: "absolute",
                    bottom: "10px",
                    right: "20px",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    imageref1.current?.click();
                  }}
                ></ion-icon>
              </div>
              <span
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "5px",
                  fontSize: "20px",
                  fontWeight: "600",
                }}
              >
                {cuser.name}{" "}
                <ion-icon
                  name="pencil-outline"
                  style={{
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    setupdatedname(cuser.name);
                    setbottomdisplay(true);
                  }}
                ></ion-icon>
              </span>
              <span>{cuser.email}</span>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <input
                  type="color"
                  onChange={(e) => {
                    setcolorvalue(e.target.value);
                  }}
                  style={{ cursor: "pointer" }}
                />
                <Button
                  width="80px"
                  onClick={() => {
                    setprogressVisible(true);
                    updatetheme(colorvalue, setprogressVisible, navigate);
                  }}
                  style={{
                    fontSize: "12px",
                  }}
                >
                  Change Theme
                </Button>
                <Button
                  width="80px"
                  onClick={() => {
                    setprogressVisible(true);
                    removetheme(setprogressVisible, navigate);
                  }}
                  style={{
                    fontSize: "12px",
                  }}
                >
                  Remove Theme
                </Button>
              </div>
              <Button
                width="250px"
                onClick={() => {
                  logoutuser(navigate);
                }}
              >
                Logout
              </Button>
            </div>
          ) : (
            <></>
          )}
        </>
      )}
    </Pagecon>
  );
};

export default Account;
