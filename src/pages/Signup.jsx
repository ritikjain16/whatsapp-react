import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Pagecon from "../components/PageCon";
import wimg from "../assets/w3.png";
import { theme } from "../App";
import Button from "../components/Button";
import Input from "../components/Input";
import Alert from "../components/Alert";
import Loading from "../components/Loading";
import { useUserContext } from "../context/UserContext";
const Signup = () => {
    const {createuser} = useUserContext();

    const navigate = useNavigate();

    const [email, setemail] = useState("");
    const [password, setpassword] = useState("");
    const [name, setname] = useState("");
    const [cpassword, setcpassword] = useState("");

    const [acol, setacol] = useState("");
    const [atext, setatext] = useState("");
    const [display, setdisplay] = useState("none");
    const [loading, setloading] = useState(false);
    const [userimg, setuserimg] = useState(wimg);
    const [originalimg, setoriginalimg] = useState(null);
    const imageref1 = useRef(null);

    const createnewuser = async () => {
        if (
            email !== "" &&
            password !== "" &&
            name !== "" &&
            originalimg !== null
        ) {
            if (password === cpassword) {
                await createuser(
                    email,
                    password,
                    name,
                    originalimg,
                    navigate,
                    setacol,
                    setatext,
                    setdisplay,
                    setloading
                );
            } else {
                setacol("red");
                setatext("Password must be equal to confirm password.");
                setdisplay("block");
                setTimeout(() => {
                    setdisplay("none");
                    setacol("");
                    setatext("");
                }, 2000);
            }
        } else {
            setacol("red");
            setatext("Please Fill all the fields");
            setdisplay("block");
            setTimeout(() => {
                setdisplay("none");
                setacol("");
                setatext("");
            }, 2000);
        }
    };

    return (
        <Pagecon>
            <div
                style={{
                    background: theme.mygreen,
                    color: theme.textcolor,
                }}
                className="flexc maincon"
            >
                <div className="flexc" style={{ gap: "15px" }}>
                    <Alert acol={acol} atext={atext} display={display} />
                    <div style={{ position: "relative" }}>

                        <img
                            src={userimg}
                            alt=""
                            style={{
                                width: "100px",
                                height: "100px",
                                borderRadius: "50%",
                                objectFit: "cover",
                            }}
                        />
                        <ion-icon
                            name="add-circle"
                            style={{
                                color: theme.mygreen,
                                fontSize: "20px",
                                position: "absolute",
                                bottom: "10px",
                                right: "0px",
                                background: theme.textcolor,
                                borderRadius: "50%", cursor: "pointer"
                            }}
                            onClick={() => {
                                imageref1.current?.click()
                            }}
                        ></ion-icon>
                    </div>
                    <input
                        style={{ display: "none" }}
                        ref={imageref1}
                        type="file"
                        accept="image/*"
                        onChange={async (e) => {
                            if (e.target.files[0] !== undefined) {
                                setoriginalimg(e.target.files[0]);
                                setuserimg(window.URL.createObjectURL(e.target.files[0]));
                            }
                        }}
                    />
                    <Input
                        type="text"
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setname(e.target.value)}
                    />
                    <Input
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
                    <Input
                        type="password"
                        placeholder="Confirm Password"
                        value={cpassword}
                        onChange={(e) => setcpassword(e.target.value)}
                    />
                    <Button
                        onClick={async () => {
                            await createnewuser();
                        }}
                        width="230px"
                    >
                        Sign up
                        <ion-icon name="arrow-forward-outline"></ion-icon>
                        {loading && <Loading size="10px" />}
                    </Button>
                    <p
                        style={{ fontSize: "20px", cursor: "pointer" }}
                        onClick={() => {
                            navigate("/login");
                        }}
                    >
                        Already have an account?
                    </p>
                </div>
            </div>
        </Pagecon>
    );
};

export default Signup;
