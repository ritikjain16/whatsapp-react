import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Pagecon from "../components/PageCon";
import wimg from "../assets/w1.png";
import { theme } from "../App";
import s1 from "../assets/s1.jpg";
import Button from "../components/Button";
import Input from "../components/Input";
import Alert from "../components/Alert";
import Loading from "../components/Loading";
import { useUserContext } from "../context/UserContext";

const Login = () => {
  const { loginuser, forgotpass, googlelogin } = useUserContext();

  const navigate = useNavigate();

  // const [islogin, setislogin] = useState(false);
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");

  const [acol, setacol] = useState("");
  const [atext, setatext] = useState("");
  const [display, setdisplay] = useState("none");
  const [loading, setloading] = useState(false);

  return (
    <Pagecon>
      <div
        style={{
          // background: theme.mygreen,
          color: theme.textcolor,
        }}
        className="flexc maincon"
      >
        {/* {!islogin ? ( */}
        <div className="flexc">
          <p style={{ fontSize: "25px", color: "black" }}>Create Account / Login</p>
          <br />
          {/* <h2 style={{ fontSize: "35px" }}></h2> */}
          {/* <br />
          <img
            src={s1}
            alt=""
            style={{ width: "250px", height: "300px", borderRadius: "10px" }}
            className="addanim"
          />
          <br /> */}
          {/* <div>
            <Button
              onClick={() => {
                setislogin(true);
              }}
            >
              Let's Get Started
              <ion-icon name="arrow-forward-outline"></ion-icon>
            </Button>
          </div> */}
        </div>
        {/* ) : ( */}
        <div className="flexc" style={{ gap: "15px" }}>
          <Alert acol={acol} atext={atext} display={display} />
          <img src={wimg} alt="" style={{ width: "100px" }} />
          <h2>Login or Signup</h2>
          {/* <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setemail(e.target.value)}
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setpassword(e.target.value)}
            />
            <Button
              onClick={() => {
                loginuser(
                  email,
                  password,
                  navigate,
                  setacol,
                  setatext,
                  setdisplay,
                  setloading
                );
              }}
              width="230px"
            >
              Log in
              <ion-icon name="arrow-forward-outline"></ion-icon>
              {loading && <Loading size="10px" />}
            </Button> */}
          {/* <p
              style={{ fontSize: "20px", cursor: "pointer" }}
              onClick={() => {
                navigate("/signup");
              }}
            >
              Don't have an account?
            </p>
            <p
              style={{ fontSize: "16px", cursor: "pointer" }}
              onClick={() => {
                forgotpass(email, setloading, setacol, setatext, setdisplay);
              }}
            >
              Forgot Password?
            </p>
            OR */}
          <Button
            onClick={() => {
              googlelogin(navigate);
            }}
            width="230px"
            style={{
              boxShadow: "0 0 1rem rgba(0,0,0,0.2)",
            }}
          >
            {/* <ion-icon name="logo-google"></ion-icon>
              Google */}
            {/* {loading && <Loading size="10px" />} */}
            {/* <p>Sign Up With</p>  */}
            <img
              src="https://play-lh.googleusercontent.com/1-hPxafOxdYpYZEOKzNIkSP43HXCNftVJVttoo4ucl7rsMASXW3Xr6GlXURCubE1tA=w3840-h2160-rw"
              alt=""
              style={{
                width: "100px",
                height: "40px",
                objectFit: "contain",
                transform: "scale(1.4)",
              }}
            />
          </Button>
        </div>
        {/* )} */}
      </div>
    </Pagecon>
  );
};

export default Login;
