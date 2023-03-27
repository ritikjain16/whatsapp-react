import styled from "styled-components";

const Button = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;
  background: ${(props) => (props.bg ? props.bg : props.theme.buttonbg)};
  color: ${(props) => (props.bg ? props.textbg : props.theme.mygreen)};
  padding: 8px 20px;
  font-size: 20px;
  border-radius: 5px 20px 5px 20px;
  /* box-shadow: 5px 5px 5px ${({ theme }) => theme.accent}; */
  transition: all 0.3s ease-in-out;
  width: ${(props) => (props.width ? props.width : "")};
  cursor: pointer;
  box-shadow: 0 0 1rem rgba(0, 0, 0, 0.2);
  &:hover {
    transform: scale(1.1);
  }
`;

export default Button;
