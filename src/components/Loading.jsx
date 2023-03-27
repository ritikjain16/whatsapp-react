import styled, { keyframes } from "styled-components";

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`;

const Loading = styled.div`
  border: 4px solid ${({ theme }) => theme.graycolor};
  border-top: 4px solid ${({ theme }) => theme.mygreen};
  width: ${(props) => (props.size ? props.size : "50px")};
  height: ${(props) => (props.size ? props.size : "50px")};
  border-radius: 50%;
  margin: 10px 0px;
  animation: ${rotate} 1.5s linear infinite;
`;

export default Loading;
