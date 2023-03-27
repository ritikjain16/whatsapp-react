import styled, { keyframes } from "styled-components";

const mybottomanim = keyframes`
0%{
opacity: 0;
transform: translateY(100px);
}
100%{
opacity: 1;
transform: translateY(0px);
}
`;

const BottomDialog = styled.div`
  width: ${window.innerWidth > 400 ? "380px" : "100vw"};
  background: ${({ theme }) => theme.textcolor};
  z-index: 5;
  position: fixed;
  bottom: ${window.innerWidth > 400 ? "34px" : "0px"};
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
  padding: 10px;
  animation: ${mybottomanim} 0.4s ease-in-out;
`;

export default BottomDialog;
