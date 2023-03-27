import styled, { keyframes } from "styled-components";

const mypageanim = keyframes`
  0%{
    /* transform: scale(1.3); */
  }100%{
    /* transform: scale(1); */
  }
`;

const Pagecon = styled.div`
  overflow-y: scroll;
  height: 90vh;
  border-radius: 20px;
  animation-name: ${(props) => (props.isanim ? "" : mypageanim)};
  animation-duration: 0.3s;
  animation-delay: 0s;
  animation-iteration-count: 1;
  animation-timing-function: ease-in-out;

  @media only screen and (max-width: 400px) {
    height: 100vh;
    border-radius: 0px;
  }
`;

export default Pagecon;
