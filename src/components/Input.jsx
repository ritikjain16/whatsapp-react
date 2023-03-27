import styled from "styled-components";

const Input = styled.input`
  background: ${(props) => (props.bg ? props.bg : props.theme.mygreen)};
  color: ${(props) => (props.textbg ? props.textbg : props.theme.textcolor)};
  width: 250px;
  border: 0;
  outline: 0;
  border: 1px solid
    ${(props) => (props.textbg ? props.textbg : props.theme.textcolor)};
  padding: 5px;
  font-size: 20px;
  border-radius: 2px;
  /* transition: all 0.3s linear; */
  caret-color: ${(props) =>
    props.textbg ? props.textbg : props.theme.textcolor};

  &::placeholder {
    color: ${(props) =>
      props.textbg ? props.theme.graycolor : props.theme.textcolor};
  }
  &:focus {
    border: 2px solid
      ${(props) => (props.textbg ? props.textbg : props.theme.textcolor)};
  }
`;
export default Input;
