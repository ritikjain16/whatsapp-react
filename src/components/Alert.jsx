import React from "react";
import styled, { keyframes } from "styled-components";

const visible = keyframes`
0%{
opacity: 0;

}
100%{
opacity: 1;
}
`;

const AlertC = styled.div`
  position: fixed;
  top: 50px;
  width: 300px;
  padding: 5px;
  z-index: 50;
  background: ${({ theme }) => theme.textcolor};
  border-radius: 2px;
  color: ${(props) => props.acol};
  display: ${(props) => props.display};
  animation: ${visible} 0.3s linear;
`;

const Alert = ({acol,atext,display}) => {
  return <AlertC acol={acol} display={display}>{atext}</AlertC>;
};

export default Alert;
